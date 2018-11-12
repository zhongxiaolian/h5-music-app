export default class Song{
    constructor({id,mid,singer,name,album,duration,image,url}){
        this.id = id;
        this.mid = mid;
        this.singer = singer;
        this.name = name;
        this.album = album;
        this.duration = duration;
        this.image = image;
        this.url = url;
    }
}
export function createSong(musicData,vkey){
    return new Song({
        id: musicData.songid,
        mid: musicData.songmid,
        singer: singerHandler(musicData.singer),
        name: musicData.songname,
        album: musicData.albumname,
        duration: musicData.interval,
        image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
        url: `http://111.202.98.148/amobile.music.tc.qq.com/C400${musicData.songmid}.m4a?guid=223742060&vkey=${vkey}&uin=0&fromtag=66`
    })
}

function singerHandler(singers){
    let ret = [];
    if(!singers){
        return '';
    }
    singers.forEach((singer) => {
        ret.push(singer.name);
    });
    return ret.join('/');
}
