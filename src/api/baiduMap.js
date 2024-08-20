import request from '@/utils/request'

//获取pdf操作信息
export function getBaiduMapInfo() {
  return request({
    url: '/api/baidu-map-info',
    method: 'get'
  })
}
//保存pdf操作信息
export function saveBaiduMapInfo(data) {
  return request({
    url: '/api/baidu-map-info',
    method: 'put',
    data: data
  })
}