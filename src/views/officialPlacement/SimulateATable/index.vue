<script>
import { component as VueCodeHighlight } from 'vue-code-highlight'
import { parseSalary } from '@/views/officialPlacement/formulaData'
import UmButton from '@/components/UmButton/index.vue'
import message from 'element-ui/packages/message'
import { openFileDialogAndReadExcel } from '@/utils/fileUtils'
export default {
  name: 'SimulateATable',
  components: {
    UmButton,
    VueCodeHighlight
  },
  props: {
    formulaText: {
      type: String,
      default: () => {
        return ''
      }
    }
  },
  data() {
    return {
      // 简单计算薪资方案
      scheme: {
        excelName: '计算公式\n',
        name: '计算薪资方案\n',
        title: '公式:\n',
        resultKey: '应发工资',
        // formula: `#薪资# + #绩效奖金# + #年终奖# + ROUND(MAX((25364.34-20000)*[0.03, 0.1, 0.2, 0.25, 0.3, 0.35, 0.45] - [0, 2520, 16920, 31920, 52920, 85920, 181920], 0,1,[1,2,3]), 2) - 158.9`
        formulaDefault: `#日薪# * #出勤天数# + #绩效奖金# + #年终奖# + 200 + 300 + MAX(300,200) + MIN(100,200)`,
        formula: ``
      },
      // 模拟 excel 导入数据
      tableData: [
        {
          姓名: '张三',
          年龄: 20,
          地区: '北京市朝阳区',
          日薪: 5000,
          出勤天数: 20,
          年终奖: 100,
          绩效奖金: 3000,
          应发工资: ''
        },
        {
          姓名: '李四',
          年龄: 20,
          地区: '北京市朝阳区',
          日薪: 5000,
          出勤天数: 20,
          年终奖: 500,
          绩效奖金: 4200 + 'a //会报错',
          应发工资: ''
        }
      ],
      // 默认数据表头
      columns: [],

      workbook: null,
      fileInput: null // 用于创建文件输入元素的引用
    }
  },

  methods: {
    updateFormulaText(event) {
      console.log('event', event.target.value)
      this.$emit('update:formulaText', event.target.value)
    },
    getColumns(tableData = this.tableData[0]) {
      this.columns = Object.keys(tableData).map(key => {
        return {
          prop: key,
          label: key
        }
      })
    },

    //计算table数据
    parseAndTable() {
      let res = this.tableData.map(item => ({
        ...item,
        result: parseSalary(this.scheme.formula, item)
      }))

      // 判断最后一项是否为result
      const index = this.columns.findIndex(item => item.label === this.columns.at(-1).label)
      if (index !== -1) {
        this.columns[index] = {
          prop: 'result',
          // 最后一项
          label: this.columns.at(-1).label
        }
      } else {
        this.columns.push({
          prop: 'result',
          label: this.columns.at(-1).label || '计算结果'
        })
      }
      this.tableData = res
    },

    // 获取文件数据
    async openFileDialog() {
      try {
        const { header, data } = await openFileDialogAndReadExcel()
        this.columns = header.map(item => ({
          prop: item,
          label: item
        }))
        this.tableData = data
      } catch (error) {
        console.error('Error reading Excel file:', error)
        message.error('读取文件失败')
      }
    },
    simulateATableBlur() {
      this.$emit('blur', this.scheme.formula)
    }
  },

  watch: {
    formulaText: {
      handler(val) {
        if (val && val !== '') {
          this.scheme.formula = val
        } else {
          this.scheme.formula = this.scheme.formulaDefault
        }
      },
      immediate: true
    }
  },
  created() {
    //根据数据获取表头
    this.getColumns()
  }
}
</script>

<template>
  <div class="salary-box">
    <div class="scheme-style">
      <div class="simulation-title">方案名称：{{ scheme.name }}</div>
      <div class="simulation-excelName"></div>
      <div class="resultKey">{{ scheme.resultKey }} =</div>

      <textarea v-model="scheme.formula" @blur="simulateATableBlur" class="formula-textarea" @input="updateFormulaText"></textarea>
      （{{ scheme.excelName }}可以手动修改）
    </div>

    <div class="salary-content">
      <div class="trialCalculation">
        <div class="trial-header">
          <span class="trial-title">读取表数据</span>
          <a download="薪酬表模板" href="/yt-webSite/excel/salarymuban.xlsx">模板下载</a>
          <a download="工资表计算方案模板" href="/yt-webSite/excel/xinzijisuan.xlsx" style="margin-left: 12px">工资表计算方案模板</a>
        </div>
        <div class="action-list">
          <UmButton text="导入" :src="require('../assets/images/EXCEL.svg')" @click="openFileDialog"></UmButton>
          <UmButton text="计算" :src="require('../assets/images/jsq.svg')" @click="parseAndTable"></UmButton>
        </div>
      </div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column v-for="column in columns" :key="column.prop" :prop="column.prop" :label="column.label">
          <template v-slot="scope">
            <span v-if="column.prop === 'result'">
              <span v-if="scope.row.result.code === 200">{{ scope.row.result.res }}</span>
              <span v-else class="error">{{ scope.row.result.error }}</span>
            </span>
            <span v-else>{{ scope.row[column.prop] }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="scheme-style">
      <code>tableData：</code>
      <VueCodeHighlight language="javascript">
        {{ tableData }}
      </VueCodeHighlight>
    </div>
  </div>
</template>

<style lang="scss">
.descript-formula .language-javascript {
  white-space: normal !important;
}
</style>

<style scoped lang="scss">
.salary-box {
  padding: 24px;
  overflow-y: auto;
  height: calc(100vh - 77px);
  scrollbar-width: none;
}
.trialCalculation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  .trial-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .trial-title {
      font-size: 20px;
      font-weight: bold;
    }
    a {
      color: #3c5fea;
      text-decoration: none;
      margin-left: 12px;
      &:hover {
        border-bottom: #3c5fea 1px solid;
      }
    }
  }
}
.success {
  color: rgba(55, 213, 62, 0.9);
}
.error {
  color: rgba(255, 0, 0, 0.9);
}
.salary-content {
  padding: 20px;
  background: #f5f5f5;
  border-radius: 16px;
  margin: 12px;

  .scheme-title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  .scheme-style {
    font-size: 16px;
    margin: 20px;
  }
}
.action-list {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}
.simulation-title {
  font-size: 24px;
  font-weight: bold;
  color: #3c5fea;
  border-bottom: #3c5fea 1px solid;
  padding-bottom: 12px;
  margin: 12px;
}
.simulation-excelName {
  font-size: 16px;
  color: #3c5fea;
  margin: 12px;
}
.resultKey {
  font-size: 16px;
  color: #2d2d2d;
  margin: 12px;
  font-weight: 550;
}
.formula-textarea {
  width: 100%;
  height: 100px;
  background: #2d2d2d;
  margin-bottom: 10px;
  color: #ccc;
  padding: 24px;
  resize: none;
  scrollbar-width: none;
}
</style>
