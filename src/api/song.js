import axios from 'axios';


export function getLyric(songmid){
    // let url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg';
    let url = '/api/lyric';
    let data = {
        pcachetime: new Date().getTime(),
        songmid: songmid,
        g_tk: 5381,
        loginUin: 0,
        hostUin: 0,
        format: 'json',
        inCharset: 'utf8',
        outCharset: 'utf-8',
        notice: 0,
        platform: 'yqq',
        needNewCode: 0
    };
    return axios.get(url,{
        params: data
    }).then((res)=>{
        return Promise.resolve(res);
    });
}