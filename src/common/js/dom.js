/*
 * @Author: kj
 * @Date: 2018-11-08 13:30:53
 * @LastEditors: kj
 * @LastEditTime: 2018-11-12 18:00:26
 * @Description: 
 */

 /**
  * 给某个DOM对象添加class
  * @param {*} el 
  * @param {*} className 
  */
export function addClass(el,className){
    if(hasClass(el,className)){
        return
    }
    let newClass = el.className.split(' ');
    newClass.push(className);
    el.className = newClass.join(' ');
}
/**
 * 判断一个DOM对象是否包含某个class
 * @param {*} el 
 * @param {*} className 
 */
export function hasClass(el,className){
    let reg = new RegExp('(^|\\s)'+className+'(\\s|$)');
    return reg.test(el.className);
}

/**
 * 获取dom上绑定的data-属性值
 * @param {*} el 
 * @param {*} name 
 * @param {*} val 
 */
export function getData(el,name,val){
    if(val){
        return el.setAttribute(name,val)
    }else{
        return el.getAttribute(name)
    }
}

// 通过一个立即执行函数进行浏览器能力检测
let elementStyle = document.createElement('div').style;
let gender = (function(){
    let transformNames = {
        webkit : 'webkitTransform',
        Moz: 'MozTransform',
        O: 'OTransform',
        ms: 'msTransform',
        standard: 'transform' 
    }
    for(let key in transformNames){
        if(elementStyle[transformNames[key]] !== undefined){
            return key
        }
    }
})()

/**
 * 传入样式，自动添加浏览器前缀。
 * @param {*} style 
 */
export function prefixStyle(style){
    if(gender === 'standard'){
        return style
    }else{
        return gender + style.charAt(0).toUpperCase() + style.substr(1);
    }
}