<template>
  <div>
    <!-- 公式配置 -->
    <FormulaConfig :formulaText.sync="formulaText" ref="formulaConfigRef" @blur="formulaConfigBlur" />
    <!-- 模拟操作 -->
    <div class="routine-operations formula-border-1-padding-24">
      <div class="routineOperations">常规计算操作</div>
      <div class="um-button-box">
        <UmButton @click="trialDrawerClick" :src="require('./assets/images/jisuanqi.svg')" text="excel 导入试算"></UmButton>

        <UmButton @click="complexCalculations" :src="require('./assets/images/jisuanqi.svg')" text="表头依赖复杂计算"></UmButton>
      </div>
    </div>

    <!-- 方案列表 -->
    <ExampleFormula @choseFormula="choseFormula" />
    <!-- 公式介绍 -->
    <IntroductionFormula @calculation="calculation" />
    <!--模拟 excel 导入 试算-->
    <el-drawer size="60%" title="模拟excel导入试算" :visible.sync="trialDrawer" :width="500">
      <!-- 模拟table数据  -->
      <SimulateATable :formulaText="formulaTextRes" @blur="simulateATableBlur" />
    </el-drawer>

    <el-drawer size="60%" title="表头依赖循环计算" :visible.sync="complexDrawer" :width="500">
      <!-- 薪酬依赖计算,复杂计算  -->
      <SalaryDependencyCalculations :formulaMap="formulaMap" />
    </el-drawer>
  </div>
</template>

<script>
import 'vue-code-highlight/themes/prism-tomorrow.css'
import 'vue-code-highlight/themes/window.css'

import { formulaData } from './formulaData'
import IntroductionFormula from './IntroductionFormula'
import SimulateATable from '@/views/officialPlacement/SimulateATable/index.vue'
import ExampleFormula from '@/views/officialPlacement/exampleFormula/index.vue'
import UmButton from '@/components/UmButton'
import FormulaConfig from '@/views/officialPlacement/FormulaConfig'
import SalaryDependencyCalculations from '@/views/officialPlacement/SalaryDependencyCalculations'
export default {
  name: 'officialPlacement',
  components: {
    SimulateATable,
    IntroductionFormula,
    ExampleFormula,
    UmButton,
    FormulaConfig,
    SalaryDependencyCalculations
  },
  data() {
    return {
      trialDrawer: false,
      error: null,
      result: null,
      formulaText: '',
      savedRange: null, //用于保存光标位置
      formulaTextRes: '',
      // 函数配置介绍
      formulaData,
      complexDrawer: false,
      // 方案详情
      formulaMap: {}
    }
  },
  methods: {
    // 选择公式
    calculation(item) {
      console.log('item', item)
      this.formulaText = item.formulaText
      // this.parseAndCalculate()
    },

    // 模拟导入
    trialDrawerClick() {
      this.trialDrawer = true
    },

    formulaConfigBlur(formulaText) {
      console.log('formulaText', formulaText)
      this.formulaTextRes = formulaText
    },

    // 导入excel，失去焦点回显数据
    simulateATableBlur(formulaText) {
      this.formulaText = formulaText
    },

    // 选择公式
    choseFormula(text) {
      console.log('text', text)
      this.formulaMap = text
    },

    // 复杂计算
    complexCalculations() {
      this.complexDrawer = true
    }
  }
}
</script>

<style scoped lang="scss">
textarea {
  width: 100%;
  height: 100px;
  margin-bottom: 10px;
}
.routine-operations {
  margin-top: 12px;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 16px;
}
</style>

<style lang="scss">
.formula-border-1-padding-24 {
  border: 1px #e5e5e5 solid;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.routineOperations {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
}
.um-button-box {
  display: flex;
  gap: 12px;
}
</style>
