import { round, floor, ceil, sum, mean, min, max, count, evaluate, randomInt } from 'mathjs'
import message from 'element-ui/packages/message'
/*
 * 自定义IF函数
 * @param {cond} 条件
 * @param {valTrue} 条件为真时的值
 * @param {valFalse} 条件为假时的值
 * @description 目前只支持数字
 * */
const IF = (cond, valTrue, valFalse) => {
  return cond ? valTrue : valFalse
}

/*
 * 求最大值
 * @param {Array} theArgs 剩余参数 自定义求最大值，支持数组 [[1,3,4],3,4]
 * 获取所有参数，将包含数组的参数扁平化
 * */
const MAX = (...theArgs) => {
  let result = []
  theArgs.map(item => {
    if (item._data && item._data.length) {
      result.push(...item._data)
    } else {
      result.push(item)
    }
  })
  return max(...result)
}

/*
 * 求最小值
 * @param {Array} theArgs 剩余参数 自定义求最大值，支持数组 [[1,3,4],3,4]
 * 获取所有参数，将包含数组的参数扁平化
 * */
const MIN = (...theArgs) => {
  let result = []
  theArgs.map(item => {
    if (item._data && item._data.length) {
      result.push(...item._data)
    } else {
      result.push(item)
    }
  })
  return min(...result)
}

const formulaData = [
  // round, floor, ceil, sum, mean, min, max
  {
    title: 'IF判断',
    func: IF,
    alias: 'IF', //函数别名
    formulaText: 'IF(4>5,4,5)',
    formulaTextTag: `IF( , , )`,
    descript: `
        IF(参数1,参数2,参数3)
        参数1：条件
        参数2：条件为真时的值
        参数3：条件为假时的值
        示例：
        IF(4>5,4,5)
        结果： 2
          `
  },
  {
    title: 'ROUND四舍五入',
    alias: 'ROUND',
    formulaText: 'ROUND(1.2345,2)',
    formulaTextTag: `ROUND( , )`,
    func: round,
    descript: `
        ROUND(参数1,参数2)
        参数1：要四舍五入的数字
        参数2：保留的小数位数
        示例：
        ROUND(1.2345, 2)
        结果：1.23
          `
  },
  {
    title: 'FLOOR向下取整',
    func: floor,
    alias: 'FLOOR',
    formulaText: 'FLOOR(1.2345)',
    formulaTextTag: `FLOOR( )`,
    descript: `
       FLOOR(参数1)
       参数1要向下取整的数字，
       示例：
       FLOOR(1.2345)
       结果：1
          `
  },
  {
    title: 'CEIL向上取整',
    func: ceil,
    alias: 'CEIL',
    formulaText: 'CEIL(1.2345)',
    formulaTextTag: `CEIL( )`,
    descript: `
       CEIL(参数1)
       参数1要向上取整的数字
       示例：
       CEIL(1.2345)
       结果：2
          `
  },
  {
    title: 'SUM求和',
    func: sum,
    formulaText: 'SUM(1,2,3)',
    formulaTextTag: `SUM( , , )`,
    alias: 'SUM',
    descript: `
       SUM(参数1,参数2,...)
       参数要求和的数字
       示例：
       SUM(1,2,3)
       结果：6
          `
  },
  {
    title: 'MEAN求平均值',
    func: mean,
    alias: 'MEAN',
    formulaText: 'MEAN(1,2,3)',
    formulaTextTag: `MEAN( , , )`,
    descript: `
        MEAN(参数1,参数2,...)
        参数要求平均值的数字
        示例：
        MEAN(1,2,3)
        结果：2
          `
  },
  {
    title: 'MIN求最小值',
    func: MIN,
    alias: 'MIN',
    formulaText: 'MIN(1,2,[3,4])',
    formulaTextTag: `MIN( , )`,
    descript: `
       MIN(参数1,参数2,...)
       参数要比较的数字
       示例：
       MIN(1,2,[3,4])
       结果：1
       `
  },
  {
    title: 'MAX求最大值',
    alias: 'MAX',
    formulaText: 'MAX(1,2,[3,4])',
    formulaTextTag: `MAX( , )`,
    func: MAX,
    descript: `
       MAX(参数1,参数2,...)
       参数要比较的数字
       示例：
       MAX(1,2,[3,4])
       结果：3
          `
  },
  {
    //   COUNT
    title: 'COUNT计数',
    alias: 'COUNT',
    formulaText: 'COUNT([1,2,3])',
    formulaTextTag: `COUNT([, ,])`,
    func: count,
    descript: `
       COUNT([参数1,参数2,...])
       参数要计数的数字
       示例：
       COUNT([1,2,3])
       结果：3`
  },
]
/*  解析公式，计算结果，传入公式内容和字段对应的值
 * @param {String} formulaContentText 公式内容
 * @param {Object} mapData 公式中的字段对应的值
 * @param {String} title 计算结果的标题
 * @return {Object} {res: 计算结果, error: 错误信息}
 */
const parseSalary = (formulaContentText, keyMap, title = '计算结果') => {
  try {
    // 替换自定义函数, 如果有连续空格 将其替换为一个空格
    const formula = formulaContentText.replace(/\s+/g, ' ').replace(/#(.*?)#/g, (match, p1) => {
      return keyMap[p1]
    })

    // 公式匹配规则
    const scope = formulaData.reduce((acc, cur) => {
      acc[cur.alias] = cur.func
      return acc
    }, {})

    let result = evaluate(formula, scope)

    // 处理小数位数 (例如保留两位小数)
    return {
      title,
      code: 200,
      res: round(result, 2)
    }
  } catch (e) {
    return {
      title: '公式错误',
      code: 500,
      error: e.message
    }
  }
}

/*
 * 创建一个递归函数来计算 tableData 中每一行的值，确保所有依赖值在计算最终值之前都已计算。
 * @param {Array} tableData 表格数据
 * @param {Object} formulaMap 公式map
 * @return {Array} 计算后的表格数据
 */
const computeTableData = (tableData, sortedFormulas) => {
  const computeRow = (row, formulas) => {
    const computedRow = { ...row }
    for (const [key, formula] of Object.entries(formulas)) {
      if (computedRow[key] === '') {
        const result = parseSalary(formula, computedRow)
        computedRow[key] = result.code === 200 ? result.res : ''
      }
    }
    return computedRow
  }

  return tableData.map(row => computeRow(row, sortedFormulas))
}

/*
   使用 resolveDependencies 函数根据依赖关系对公式进行排序。
    @param {Object} formulaMap 公式map
    @return {Object} 排序后的公式map
 */
const resolveDependencies = formulaMap => {
  // 依赖关系排序
  const dependencies = {}
  // 用于存储已解析的公式
  const resolved = new Set()
  // 用于存储未解析的公式
  const unresolved = new Set()

  const resolve = key => {
    if (resolved.has(key)) return
    if (unresolved.has(key)) {
      message.error(`检测到循环依赖: ${key}`)
      throw new Error(`检测到循环依赖: ${key}`)
    }

    unresolved.add(key)
    const formula = formulaMap[key]
    const matches = formula.match(/#(.*?)#/g) || []
    console.log('matches:', matches)
    matches.forEach(match => {
      const depKey = match.replace(/#/g, '')
      if (formulaMap[depKey]) resolve(depKey)
    })

    unresolved.delete(key)
    resolved.add(key)
    dependencies[key] = formula
  }

  Object.keys(formulaMap).forEach(resolve)
  return dependencies
}

// 批量导出
export { formulaData, parseSalary, computeTableData, resolveDependencies }
