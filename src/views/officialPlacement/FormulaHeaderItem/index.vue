<script>
import { openFileDialogAndReadExcel } from '@/utils/fileUtils.js'
import message from 'element-ui/packages/message'
import UmButton from '@/components/UmButton'
export default {
  name: 'FormulaHeaderItem',
  components: { UmButton },
  data() {
    return {
      options: [],
      scenarioName: ''
    }
  },
  methods: {
    // 获取文件数据
    async openFileDialog() {
      try {
        const { header } = await openFileDialogAndReadExcel()
        this.options = header.map(item => ({
          title: `#${item}#`,
          key: item,
          formula: ''
        }))
      } catch (error) {
        console.error('Error reading Excel file:', error)
        message.error('读取文件失败')
      }
    },
    // 选择字段
    choseCalculate(item) {
      this.$emit('choseCalculate', item)
    },
    // 选择字段设置
    settingFieldFormula(item, options) {
      this.$emit('settingFieldFormula', item, options)
    },
    saveTheScenario() {
      this.$emit('saveTheScenario', this.scenarioName)
    }
  }
}
</script>

<template>
  <div>
    <el-alert title="导入excel，配置方案，只支持一级表头" type="warning"> </el-alert>
   <div class="formula-operation">
     <el-button icon="el-icon-upload"  type="text" round @click="openFileDialog">excel 导入获取表头</el-button>

      <div class="save-formula"  v-if="options.length" >
        <el-input placeholder="输入保存的方案名称" v-model="scenarioName" clearable></el-input>
        <el-button icon="el-icon-coffee-cup" type="primary" round @click="saveTheScenario">保存方案</el-button>
      </div>
   </div>

    <div class="calculated-items">
      <div v-for="(item, index) in options" :key="index">
        <!--<el-button size="small" round >{{ item.key }}</el-button>-->
        <!-- 设置方案  -->
        <UmButton :text="item.key" :formulaText="item.formula" beforeIcon="el-icon-postcard" affterIcon="el-icon-setting" :tooltipsContent="`设置${item.key}方案`" @settingFieldFormula="settingFieldFormula(item,options)" @click="choseCalculate(item)">
        </UmButton>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.calculated-items {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
  .calculated-item {
    padding: 5px 10px;
    border: 1px solid #e5e5e5;
    border-radius: 5px;
    cursor: pointer;
  }
}
.formula-operation {
  display: flex;
  justify-content: space-between;
  border-bottom: #e5e5e5 1px solid;
  padding: 12px 0;
}
.save-formula {
  display: flex;
  gap: 10px;
}
</style>
