<!-- 算数符号选择 -->
<script>
export default {
  name: 'ArithmeticSymbols',
  data() {
    return {
      // + ﹣ * / () > < = >= <= ≠ ''
      symbolicData: [
        {
          title: ' + ',
          alias: '加法',
          descript: '加法运算'
        },
        {
          title: ' - ',
          alias: '减法'
        },
        {
          title: ' * ',
          alias: '乘法'
        },
        {
          title: ' / ',
          alias: '除法'
        },
        {
          title: ' ( )',
          alias: '左括号'
        },
        {
          title: ' > ',
          alias: '大于'
        },
        {
          title: ' < ',
          alias: '小于'
        },
        {
          title: ' = ',
          alias: '等于'
        },
        {
          title: ' >= ',
          alias: '大于等于'
        },
        {
          title: ' <= ',
          alias: '小于等于'
        },
        {
          title: ' ≠ ',
          alias: '不等于'
        },
        {
          title: ' \' \'',
          alias: '空格'
        }
      ]
    }
  },
  methods: {
    choseArithmetic(item) {
      this.$emit('choseArithmetic', item)
    }
  }
}
</script>

<template>
  <div>
    <div class="formula-select-box">
      <div class="formula-select-item" v-for="item in symbolicData" :key="item.title" @click="choseArithmetic(item)">
        <div class="formula-select-item-alias">{{ item.title }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.formula-select-title {
  font-size: 20px;
  font-weight: bold;
  margin: 12px 0;
}
.formula-select-box {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  .formula-select-item {
    position: relative;
    //渐变色
    border-radius: 4px;
   border: 1px solid #dcdfe6;
    cursor: pointer;
    padding: 6px 12px;
    color: #727d8a;
    transition: ease all 0.3s;
    font-weight: 550;
    &:hover {
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    }
  }
}
</style>
