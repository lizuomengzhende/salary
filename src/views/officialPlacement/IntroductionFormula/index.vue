<!-- 插入函数  -->
<script>
import { component as VueCodeHighlight } from 'vue-code-highlight'
import { formulaData } from '../formulaData'
export default {
  name: 'IntroductionFormula',
  components: {
    VueCodeHighlight
  },
  data() {
    return {
      formulaData
    }
  },
  methods: {
    calculation(item) {
      this.$emit('calculation', item)
    }
  }
}
</script>

<template>
  <div class="intro-con formula-border-1-padding-24">
    <div class="intro-title">公式描述</div>
    <div class="intro-box">
      <div class="intro-item" v-for="item in formulaData" :key="item.title">
        <VueCodeHighlight language="javascript" class="code-light">
          <code>{{item.title}}</code>
          {{ item.descript }}
        </VueCodeHighlight>
        <div class="calculation" @click="calculation(item)">示例计算</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
//深度修改
.code-light pre[class*='language-'] {
  height: 300px !important;
  overflow: hidden;
}
</style>

<style scoped lang="scss">
.intro-con {
  .intro-title {
    font-size: 20px;
    font-weight: bold;
    margin: 12px 0;
  }
  .intro-box {
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
    .intro-item {
      position: relative;
      width: 370px;
      transition: .3s all ease;
      &:hover{
        transform: translate(-5px, -5px);
      }
      .calculation {
        position: absolute;
        top: 24px;
        right: 24px;
        color: #fff;
        cursor: pointer;
      }
    }
  }
}
</style>
