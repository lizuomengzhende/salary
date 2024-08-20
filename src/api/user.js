import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'api/auth/local',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/api/users/me?populate[0]=icon',
    method: 'get',
  })
}
