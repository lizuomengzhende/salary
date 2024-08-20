import request from '@/utils/request'

//获取pdf操作信息
export function getPdfInfo() {
  return request({
    url: '/api/pdf-info',
    method: 'get'
  })
}
//保存pdf操作信息
export function savePdfInfo(data) {
  return request({
    url: '/api/pdf-info',
    method: 'put',
    data: data
  })
}