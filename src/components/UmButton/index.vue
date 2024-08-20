<script>
export default {
  name: 'UmButton',
  props: {
    text: {
      type: null,
      default: ''
    },
    src: {
      type: String,
      default: ''
    },
    affterIcon: {
      type: String,
      default: ''
    },
    tooltipsContent: {
      type: String,
      default: ''
    },
    formulaText: {
      type: String,
      default: ''
    },
    beforeIcon: {
      type: String,
      default: ''
    }
  },
  methods: {

    click() {
      this.$emit('click')
    },
    settingFieldFormula() {
      this.$emit('settingFieldFormula')
    },
  }
}
</script>

<template>
  <div>
    <button @click="click" class="operator-btn">
      <el-tooltip class="item" effect="dark" :content="formulaText" placement="top">
        <i :class="beforeIcon" style="color: #f505e9" v-show="formulaText" class="before-icon"></i>
      </el-tooltip>
      <img v-if="src" :src="src" :alt="text" class="operator-icon" />
      <span>{{ text }}</span>
      <!-- 定义插槽 -->
      <slot name="affterIcon">
        <el-tooltip class="item" effect="dark" :content="tooltipsContent" placement="top">
          <i :class="affterIcon" style="color: rgba(254,111,58,0.63)" v-if="affterIcon" class="affter-icon" @click.stop="settingFieldFormula"></i>
        </el-tooltip>
      </slot>
    </button>
  </div>
</template>

<style scoped lang="scss">
.operator-btn {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 24px;
  height: 42px;
  //background: #409eff;
  border-radius: 12px;
  cursor: pointer;
  border: 1px solid #66b1ff;
  background: #fff;
  color: #66b1ff;
  transition: 0.2s all ease;
  &:hover {
    background: #66b1ff;
    color: #fff;
  }
  &:active {
    background: rgba(102, 177, 255, 0.6);
    color: #fff;
  }
}
.operator-icon {
  width: 20px;
  margin-right: 12px;
}
.affter-icon {
  margin-left: 12px;
  font-size: 18px;
}
.before-icon {
  margin-right: 12px;
  font-size: 18px;
}
</style>
