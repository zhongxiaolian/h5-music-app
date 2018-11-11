import jsonp from 'common/js/jsonp.js';

export function getSingerList(index){
    let url = 'https://u.y.qq.com/cgi-bin/musicu.fcg';
    let data = {
        g_tk: 5381,
        loginUin: 0,
        hostUin: 0,
        format: 'jsonp',
        inCharset: 'utf8',
        outCharset: 'utf-8',
        notice: 0,
        platform: 'yqq',
        needNewCode: 0,
        data: `{"comm":{"ct":24,"cv":10000},"singerList":{"module":"Music.SingerListServer","method":"get_singer_list","param":{"area":200,"sex":-100,"genre":-100,"index":-100,"sin":0,"cur_page":1}}}`
    }
    if(index){
        let temp = JSON.parse(data.data);
        temp.singerList.param.index = index;
        data.data = JSON.stringify(temp);
    }
    let option = {
        param: 'callback'
    }
    return jsonp(url,data,option)
}

export function getIndex(){
    let url = 'https://u.y.qq.com/cgi-bin/musicu.fcg';
    let data = {
        g_tk: 5381,
        loginUin: 0,
        hostUin: 0,
        format: 'jsonp',
        inCharset: 'utf8',
        outCharset: 'utf-8',
        notice: 0,
        platform: 'yqq',
        needNewCode: 0,
        data: `{"comm":{"ct":24,"cv":10000},"singerList":{"module":"Music.SingerListServer","method":"get_singer_list","param":{"area":200,"sex":-100,"genre":-100,"index":-100,"sin":0,"cur_page":1}}}`
    }
    let option = {
        param: 'callback'
    }
    return jsonp(url,data,option)
}