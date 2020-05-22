import {
  get,
  post
} from "./http"

//首页旅游线路列表
export const applist = p => {
 return get('/hongda/tourist/applist', p)
}

// 首页轮播
export const banner = p => { 
    return get('/hongda/touristbanner/applist', p)
}

//线路详情
export const detail=p=>{
    return get('/hongda/tourist/detail',p)
}

//特殊节假日价格
export const special=p=>{
    return get('/hongda/touristprice/special',p)
}

//评论列表
export const comment=p=>{
    return get('/hongda/tourist/comment',p)
}

//提交订单
export const submit=p=>{
    return post('/hongda/tourist/submit',p)
}

//门店详情
export const company=p=>{
    return get('/hongda/tourist/company',p)
}