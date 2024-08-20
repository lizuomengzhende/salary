import request from '@/utils/request'

//获取文章类型
export function getArticleType(currentPage,pageSize) {
  return request({
    url: '/api/article-types?pagination[page]='+currentPage+'&pagination[pageSize]='+pageSize,
    method: 'get'
  })
}
//新增文章类型
export function addArticleType(data) {
  return request({
    url: '/api/article-types',
    method: 'post',
    data: data
  })
}
//编辑文章类型
export function editArticleType(data,id) {
  return request({
    url: '/api/article-types/'+id,
    method: 'put',
    data: data
  })
}
//删除文章类型
export function delArticleType(id) {
  return request({
    url: '/api/article-types/'+id,
    method: 'delete',
  })
}
//获取文章列表
export function getArticle(currentPage,pageSize,article_type,title) {
  return request({
    url: '/api/articles?pagination[page]='+currentPage+'&pagination[pageSize]='+pageSize+'&populate[0]=article_type&filters[article_type][$contains]='+article_type+'&filters[title][$contains]='+title,
    method: 'get'
  })
}
//新增文章
export function addArticle(data) {
  return request({
    url: '/api/articles',
    method: 'post',
    data: data
  })
}
//编辑文章
export function editArticle(data,id) {
  return request({
    url: '/api/articles/'+id,
    method: 'put',
    data: data
  })
}
//删除文章
export function delArticle(id) {
  return request({
    url: '/api/articles/'+id,
    method: 'delete',
  })
}