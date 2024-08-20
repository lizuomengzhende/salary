/*
 * 在光标处插入文本 使用方法：
 * @param {Object} options
 * @param {HTMLElement} options.dom contenteditable 元素
 * @param {String} options.text 要插入的文本
 * @param {Range} options.savedRange 保存的光标位置
 *
 */
export const insertDot = ({ dom, text, savedRange }) => {
  dom.focus() // 使 contenteditable 元素重新获取焦点
  restoreSelection(savedRange,dom)
  const sel = window.getSelection()
  if (sel.rangeCount > 0) {
    const range = sel.getRangeAt(0)

    // Check if the selection is within the dom element
    if (dom.contains(range.commonAncestorContainer)) {
      range.deleteContents() // 删除选区内容

      const textNode = document.createTextNode(text) // 创建文本节点
      // text 前后插入空格
      const textNodeBefore = document.createTextNode(' ')
      const textNodeAfter = document.createTextNode(' ')
      dom.appendChild(textNodeBefore)
      dom.appendChild(textNode)
      dom.appendChild(textNodeAfter)
      range.insertNode(textNode) // 插入文本

      // 移动光标到插入文本的后面
      range.setStartAfter(textNode)
      range.setEndAfter(textNode)

      sel.removeAllRanges()
      sel.addRange(range) // 更新选区范围
    }
  }
}

// 记录光标位置
export const saveSelection = () => {
  const sel = window.getSelection()
  if (sel.rangeCount > 0) {
    return sel.getRangeAt(0) // 保存当前光标位置
  }
}

export const restoreSelection = (savedRange,dom) => {
  const sel = window.getSelection();
  if (savedRange) {
    sel.removeAllRanges();
    sel.addRange(savedRange); // 恢复之前保存的光标位置
  } else {
    // 如果savedRange为0，将鼠标位置放在文本末尾
    const range = document.createRange();
    range.selectNodeContents(dom);
    range.collapse(false); // 将光标移动到内容的末尾
    sel.removeAllRanges();
    sel.addRange(range);
  }
}
