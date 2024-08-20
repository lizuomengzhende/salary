<script>
import { selectFormula } from '@/api/formula'
import { component as VueCodeHighlight } from 'vue-code-highlight'
import UmButton from '@/components/UmButton/index.vue'
import { Loading } from 'element-ui';
export default {
  name: 'exampleFormula',
  components: {
    UmButton,
    VueCodeHighlight
  },
  data() {
    return {
      formulaArray: [],
      formulaMap: null
    }
  },
  created() {
    this.selectFormula()
  },
  methods: {
    // 获取方案
    selectFormula(options) {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
        target: '.formula-list-example',
        duration: 1000
      });
      selectFormula().then(async res => {
        setTimeout(() => {
          loading.close()
        }, 1000)

        const result = res.data.map(item => {
          return {
            title: item.attributes.title,
            formulaMap: this.formulaFormat(item.attributes.formula)
          }
        })
        this.formulaArray = result
        console.log('result', result)
      }).finally(() => {
        loading.close()
      })
    },

    choseFormula(formulaMap) {
      this.formulaMap = formulaMap
      console.log('formulaMap', formulaMap)
      this.$emit('choseFormula', formulaMap)
    },
    formulaFormat(formula) {
      if (!formula) return ''
      const formulaArray = JSON.parse(formula)
      const formulaMap = {}
      for (const item of formulaArray) {
        if (item['formula']) {
          formulaMap[item['key']] = item['formula']
        }
      }
      return formulaMap
    }
  }
}
</script>

<template>
  <!--  公式选择 -->
  <div class="formula-border-1-padding-24 formula-list-example">
    <div>
      公式方案列表
      <el-tooltip content="加载最新方案" placement="top">
        <i class="el-icon-refresh refresh-fang" @click="selectFormula"></i>
      </el-tooltip>
    </div>

    <ul class="ul-formulaText" v-if="formulaArray.length">
      <li class="li-formulaText" v-for="item,index in formulaArray" :key="index" @click="choseFormula(item.formulaMap)">
        {{ item.title }}
      </li>
    </ul>

    <div v-else>暂无方案</div>
    <div class="formula-border-1-padding-24">
      <div class="selected-fang">已选方案</div>
      <VueCodeHighlight language="javascript" v-if="formulaMap">
        {{ formulaMap }}
      </VueCodeHighlight>
    </div>
  </div>
</template>

<style scoped lang="scss">
.ul-formulaText {
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  gap: 12px;
}

.li-formulaText {
  cursor: pointer;
  background: rgba(60, 95, 234, 0.18);
  padding: 6px 12px;
  border-radius: 8px;
  color: #636c79;

  &:hover {
    background: #3c5fea;
    color: #fff;
  }
}
.formula-list-example {
  margin: 12px 0;
}
.selected-fang {
  font-size: 20px;
  font-weight: bold;
  padding: 12px 0;
}
.refresh-fang {
  cursor: pointer;
  color: #20a0ff;
  font-size: 20px;
  &:hover {
    color: #3c5fea;
  }
}
</style>
