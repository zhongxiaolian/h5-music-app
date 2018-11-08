import originJsonp from 'jsonp';

export default function jsonp(url,data,option){
    url += (url.charAt(url.length-1) !== '?' ? '?' : '') + obj2param(data);
    return new Promise((resolve,reject)=>{
        // 如果没有报错，err为null
        originJsonp(url,option,(err,data)=>{
            if(!err){
                resolve(data);
            }else{
                reject(err);
            }
        })
    })
}

function obj2param(data){
    let url = '';
    for(let k in data){
        let value = data[k] !== undefined ? data[k] : '';
        url += `&${k}=${encodeURIComponent(value)}`;
    }
    // 删除第一个&
    return url ? url.substring(1) : '';
}