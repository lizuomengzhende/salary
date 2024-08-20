<script>
import FormulaList from '@/views/officialPlacement/FormulaList/index.vue'
import ArithmeticSymbols from '@/views/officialPlacement/ArithmeticSymbols/index.vue'
import FormulaHeaderItem from '@/views/officialPlacement/FormulaHeaderItem/index.vue'
import { insertDot, saveSelection, restoreSelection } from '@/utils/insertTextAtTheCursor'
import { parseSalary } from '@/views/officialPlacement/formulaData'
import { formulaChecked } from '@/views/officialPlacement/formulaChecked'
import message from 'element-ui/packages/message'
import { insertFormula } from '@/api/formula'

export default {
  name: 'FormulaConfig',
  components: { ArithmeticSymbols, FormulaList, FormulaHeaderItem },
  props: {
    formulaText: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      error: null,
      result: null,
      resultKey: '结果',
      // 公式
      formula: '',
      savedRange: null, // 用于保存光标位置
      filedMap: {
        薪资: 10000,
        年终奖: 100,
        绩效奖金: 3000,
        姓名: '张三'
      },
      // excelOptions
      excelOptions: []
    }
  },
  methods: {
    // 插入算数符号
    choseArithmetic(item) {
      insertDot({ dom: this.$refs.formula, text: item.title, savedRange: this.savedRange })
    },

    choseCalculate(item) {
      insertDot({ dom: this.$refs.formula, text: item.title, savedRange: this.savedRange })
    },

    parseAndCalculate() {
      const formulaContentText = document.getElementById('formulaContent').innerText
      const res = parseSalary(formulaContentText, this.filedMap)
      this.result = null
      this.error = null
      if (res.error) {
        this.error = res.error
      } else {
        this.result = res.res
      }
    },

    // 公式校验
    checkFormula() {
      const formulaContentText = document.getElementById('formulaContent').innerText
      this.error = formulaChecked(formulaContentText)
    },

    // 插入函数
    selectFormulaItem(item) {
      insertDot({ dom: this.$refs.formula, text: item.formulaTextTag, savedRange: this.savedRange })
    },

    // 记录光标位置
    saveSelectionAction() {
      this.savedRange = saveSelection()
      console.log('光标位置', this.savedRange)
    },

    // 键盘按下  ∧ ∨ < > 记录鼠标位置
    formulateKeydown(e) {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        console.log('ArrowLeft ArrowRight')
        setTimeout(() => {
          this.saveSelectionAction()
        }, 0)
      }
    },
    // 重置公式
    resetFormula() {
      this.formula = ''
      this.$refs.formula.innerText = ''
      this.$refs.formula.focus()
      this.saveSelectionAction()
    },
    getLastFormula(e) {
      this.$emit('blur', e.target.innerText)
    },

    // 设置字段公式
    settingFieldFormula(item, options) {
      this.excelOptions = options
      this.resultKey = item.key
      console.log('settingFieldFormula', item, this.excelOptions)
    },

    saveFormula() {
      const index = this.excelOptions.findIndex(item => item.key === this.resultKey)
      if (index !== -1) {
        this.$set(this.excelOptions, index, { ...this.excelOptions[index], formula: this.$refs.formula.innerText })
      }

      this.$refs.formulaHeaderRef.options = this.excelOptions

      console.log('this.$refs.formulaHeaderRef.options', this.$refs.formulaHeaderRef.options)

      console.log('excelOptions', this.excelOptions)
    },
    saveTheScenario(scenarioName) {
      if (!scenarioName) {
        message.warning('请输入保存的方案名称')
        return
      }
      if (this.excelOptions.length === 0) {
        message.warning('请先导入excel获取表头')
        return
      }

      insertFormula({data:{ title:scenarioName, formula : JSON.stringify(this.excelOptions) }}).then(res => {
        message.success('保存成功')
      })

      console.log('scenarioName', scenarioName)
      console.log('excelOptions', this.excelOptions)
    }
  },

  watch: {
    formulaText: {
      handler(val) {
        this.formula = val
      },
      immediate: true
    }
  },

  mounted() {
    this.$refs.formula.focus()
    this.saveSelectionAction()
  }
}
</script>

<template>
  <div class="formula-config-content formula-border-1-padding-24">
    <div class="formula-config-box">
      <h3>{{ resultKey }} <span style="margin-left: 8px">=</span></h3>

      <div contenteditable id="formulaContent" ref="formula" @mouseup="saveSelectionAction" @keydown="formulateKeydown" @blur="getLastFormula" v-html="formula" autofocus></div>

      <!-- 算数符号 -->
      <ArithmeticSymbols @choseArithmetic="choseArithmetic" />
      <div v-if="error && error !== true" style="color: red; margin-top: 12px">error:{{ error }}</div>
      <div v-else-if="error === true" style="color: #57e727; margin-top: 12px">公式校验通过</div>
      <div v-if="result !== null" style="color: green; margin-top: 12px">计算结果：{{ result }}</div>
      <div class="active-footer">
        <el-button @click="saveFormula" type="primary" round>保存公式至{{ resultKey }}</el-button>
        <el-button @click="parseAndCalculate" type="primary" round>解析并计算</el-button>
        <el-button @click="checkFormula" type="primary" round>公式校验</el-button>
        <el-button @click="resetFormula" icon="reset" round>reset</el-button>
      </div>

      <!--excel 导入配置方案 -->
      <FormulaHeaderItem ref="formulaHeaderRef" @choseCalculate="choseCalculate" @settingFieldFormula="settingFieldFormula" @saveTheScenario="saveTheScenario" />
    </div>

    <!--函数选择列表-->
    <FormulaList @selectFormulaItem="selectFormulaItem" />
  </div>
</template>

<style scoped lang="scss">
#formulaContent {
  padding: 12px;
  background: #f5f5f5;
  border-radius: 8px;
  margin-bottom: 12px;
  min-height: 32px;
  max-height: 100px;
  overflow-y: auto;
  scrollbar-width: none;
  line-height: 22px;
  //适配更多浏览器
  &::-webkit-scrollbar {
    display: none;
  }
}
.active-footer {
  display: flex;
  gap: 8px;
  margin: 12px 0;
  border-bottom: 1px #e5e5e5 solid;
  padding: 12px 0;
}
.formula-config-content {
  display: flex;
  gap: 24px;
  .formula-config-box {
    flex: 1;
  }
}
</style>
