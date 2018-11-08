import jsonp from 'common/js/jsonp.js';

// 获取推荐
export function getRecommend(){
    let url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg';
    let option = {
        param: 'jsonpCallback'
    }
    return jsonp(url,{},option)
}