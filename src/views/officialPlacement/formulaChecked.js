export const formulaChecked = formulaContentText => {
  switch (true) {
    // 公式不能为空
    case formulaContentText === '':
      return '公式不能为空'

    case /^[+\-*\/><=]/.test(formulaContentText):
      return '不能以符号开头'

    case /[+\-*\/><=]$/.test(formulaContentText):
      return '不能以符号结尾'

    // # 符号必须成对出现
    case (formulaContentText.match(/#/g) || []).length % 2 !== 0:
      return '# 符号必须成对出现'

    // '' 符号必须成对出现
    case (formulaContentText.match(/'/g) || []).length % 2 !== 0:
      return "' ' 符号必须成对出现"

    // 函数IF 语句校验
    case /IF\(/.test(formulaContentText) && !/IF\((.*?),(.*?),(.*?)\)/.test(formulaContentText):
      return 'IF 语句格式错误'

    // 函数MAX 语句校验
    case /MAX\(/.test(formulaContentText) && !/MAX\((.*?)\)/.test(formulaContentText):
      return 'MAX 语句格式错误'

    // 函数MIN 语句校验
    case /MIN\(/.test(formulaContentText) && !/MIN\((.*?)\)/.test(formulaContentText):
      return 'MIN 语句格式错误'

    // ROUND 语句校验
    case /ROUND\(/.test(formulaContentText) && !/ROUND\((.*?),(.*?),(.*?)\)/.test(formulaContentText):
      return 'ROUND 语句格式错误'

    // FLOOR 语句校验
    case /FLOOR\(/.test(formulaContentText) && !/FLOOR\((.*?)\)/.test(formulaContentText):
      return 'FLOOR 语句格式错误'

    // CEIL 语句校验
    case /CEIL\(/.test(formulaContentText) && !/CEIL\((.*?)\)/.test(formulaContentText):
      return 'CEIL 语句格式错误'

    //SUM 语句校验
    case /SUM\(/.test(formulaContentText) && !/SUM\((.*?)\)/.test(formulaContentText):
      return 'SUM 语句格式错误'

    //AVERAGE 语句校验
    case /AVERAGE\(/.test(formulaContentText) && !/AVERAGE\((.*?)\)/.test(formulaContentText):
      return 'AVERAGE 语句格式错误'

    //COUNT 语句校验
    case /COUNT\(/.test(formulaContentText) && !/COUNT\((.*?)\)/.test(formulaContentText):
      return 'COUNT 语句格式错误'

    default:
      return true
  }
}
