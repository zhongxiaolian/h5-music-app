/*
 * @Author: kj
 * @Date: 2018-11-08 13:30:53
 * @LastEditors: kj
 * @LastEditTime: 2018-11-10 17:31:55
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

export function getData(el,name,val){
    if(val){
        return el.setAttribute(name,val)
    }else{
        return el.getAttribute(name)
    }
}