//新增文章类型
import request from '@/utils/request'

// 新增方案
export function insertFormula(data) {
  return request({
    url: '/api/formula-configs',
    method: 'post',
    data: data
  })
}

// 查询方案
export function selectFormula(data) {
  return request({
    url: '/api/formula-configs',
    method: 'get',
    data: data
  })
}
