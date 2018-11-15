/*
 * @Author: kj
 * @Date: 2018-11-14 15:37:50
 * @LastEditors: kj
 * @LastEditTime: 2018-11-14 17:05:55
 * @Description: 工具方法
 */
function getRandomInt(min,max){
    return Math.floor(Math.random() * (max - min + 1) + min);
}
export function shuffle(arr){
    // arr是引用类型，防止修改arr，引起其他地方的副作用，这里创建一个arr的副本
    let _arr = arr.slice();
    for(let i=0;i<_arr.length;i++){
        let j = getRandomInt(0,i);
        let t = _arr[i];
        _arr[i] = _arr[j];
        _arr[j] = t;
    }
    return _arr;
}