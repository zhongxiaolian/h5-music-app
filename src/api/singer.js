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

export function getSingerDetail(singermid){
    let url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg';
    let data = {
        g_tk: 5381,
        loginUin: 0,
        hostUin: 0,
        format: jsonp,
        inCharset: 'utf8',
        outCharset: 'utf-8',
        notice: 0,
        platform: 'yqq',
        needNewCode: 0,
        singermid: singermid,
        order: 'listen',
        begin: 0,
        num: 20,
        songstatus: 1
    }
    let option = {
        param: 'jsonpCallback'
    }
    return jsonp(url,data,option);
}

// 获取歌曲的vKey
export function getSongKey(songmid){
    let url = 'https://u.y.qq.com/cgi-bin/musicu.fcg';
    let data = {
        g_tk: 5381,
        jsonpCallback: 'getplaysongvkey33164038135904583',
        loginUin: 0,
        hostUin: 0,
        format: 'jsonp',
        inCharset: 'utf8',
        outCharset: 'utf-8',
        notice: 0,
        platform: 'yqq',
        needNewCode: 0,
        data: `{"req":{"module":"CDN.SrfCdnDispatchServer","method":"GetCdnDispatch","param":{"guid":"223742060","calltype":0,"userip":""}},"req_0":{"module":"vkey.GetVkeyServer","method":"CgiGetVkey","param":{"guid":"223742060","songmid":["${songmid}"],"songtype":[0],"uin":"0","loginflag":1,"platform":"20"}},"comm":{"uin":0,"format":"json","ct":20,"cv":0}}`
    }
    let option = {
        param: 'callback'
    }
    return jsonp(url,data,option);
}
