<!-- 插入公式 -->
<script>
import { formulaData } from '../formulaData'

export default {
  name: 'formulaList',
  data() {
    return {
      formulaData
    }
  },
  methods: {
    selectFormulaItem(item) {
      this.$emit('selectFormulaItem', item)
    }
  }
}
</script>

<template>
  <!--公式选择-->
  <div class="insert-function formula-border">
    <div class="formula-select-title">插入函数</div>
    <div class="formula-select-box">
      <div class="formula-select-item" v-for="item in formulaData" :key="item.title" @click="selectFormulaItem(item)">
        <div class="formula-select-item-alias">{{ item.alias }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.insert-function{
  height: 100%;
  width: 300px;
}
.formula-select-title {
  font-size: 20px;
  font-weight: bold;
  margin: 12px 0;
}
.formula-select-box {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 320px;
  scrollbar-width: none;
  max-height: 100%; /* Adjust this value as needed */
  overflow-y: auto;
  //适配更多浏览器
  &::-webkit-scrollbar {
    display: none;
  }
  .formula-select-item {
    position: relative;
    //渐变色
    border-radius: 4px;
    background: linear-gradient(135deg, #d6edf8, #f6c1d0);
    cursor: pointer;
    padding:6px 12px;
    color: #727d8a;
    transition: ease all 0.3s;
    &:hover {
      box-shadow:  0 0 10px rgba(0,0,0,0.2);
    }
  }
}
.formula-border{
  border: 1px #e5e5e5 solid;
  border-radius: 8px;
  padding: 12px;
}
</style>
