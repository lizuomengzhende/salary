<script>
import { component as VueCodeHighlight } from 'vue-code-highlight'
import { computeTableData, resolveDependencies } from '@/views/officialPlacement/formulaData'
import UmButton from '@/components/UmButton/index.vue'
import message from 'element-ui/packages/message'
import { openFileDialogAndReadExcel, exportExcel } from '@/utils/fileUtils'
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
    },
    formulaMap: {
      type: Object,
      default: () => {
        return {}
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
        formulaDefault: ``,
        formula: ``
      },
      // 模拟 excel 导入数据
      tableData: [],
      // 默认数据表头
      columns: [],
      // 表头对应的公式
      formulaMapInfo: null,
      showTable: false
    }
  },

  watch: {
    formulaMap: {
      handler: function (val) {
        this.formulaMapInfo = val
      },
      immediate: true
    }
  },

  methods: {
    getColumns(tableData = this.tableData[0]) {
      if (this.tableData.length === 0) return
      this.columns = Object.keys(tableData).map(key => {
        return {
          prop: key,
          label: key
        }
      })
    },

    //计算table数据
    parseAndTable() {
      const loading = this.$loading({
        lock: true,
        text: '薪资计算中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.5)',
        target: '.salary-box',
        duration: 1000
      });
      if(!this.formulaMap) return message.error('请先计算规则或方案')
      const sortedFormulas = resolveDependencies(this.formulaMapInfo)
      this.tableData = computeTableData(this.tableData, sortedFormulas)
     setTimeout(() => {
        loading.close()
      }, 1000)
      console.log('sortedFormulas',sortedFormulas)
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

    // 导出表格
    exportExcelTableData() {
      exportExcel(this.tableData,'薪酬表')
    },

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
          <UmButton text="导出" :src="require('../assets/images/export.svg')" @click="exportExcelTableData"></UmButton>
          <UmButton text="计算" :src="require('../assets/images/jsq.svg')" @click="parseAndTable"></UmButton>
        </div>
      </div>
      <el-table :data="tableData" style="width: 100%" height="500px">
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
      <div>计算改薪酬方案公式：</div>
      <VueCodeHighlight language="javascript">
        {{ formulaMapInfo }}
      </VueCodeHighlight>
    </div>

    <div class="scheme-style ">
      <div>tableData：
        <el-button type="text" @click="showTable = !showTable" v-if="!showTable">显示</el-button>
        <el-button type="text"  @click="showTable = !showTable" v-if="showTable">隐藏</el-button>
      </div>
      <div class="tableData-box">
        <VueCodeHighlight language="javascript" v-if="showTable">
          {{ tableData }}
        </VueCodeHighlight>
      </div>

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
  padding: 0 24px 24px 24px;
  overflow-y: auto;
  height: calc(100vh - 77px);
  scrollbar-width: none;
  border-top: 1px #e5e5e5 solid;
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
.tableData-box{
  max-height: 600px;
  overflow: auto;
}
</style>
