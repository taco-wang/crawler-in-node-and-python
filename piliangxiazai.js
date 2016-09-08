/**
 * Created by wang on 2016/8/12.
 */
var request=require('request')
var http=require('http')
var url='disclosure.szse.cn/disclosure/fulltext/plate/szlatest_24h.js?ver=201608111551'
var fs=require('fs')
var Promise=require('bluebird')
var async=require('async')
var baseurl='http://disclosure.szse.cn/'
var headers={'Accept':'*/*',
    'Accept-Encoding':'gzip, deflate, sdch',
    'Accept-Language':'zh-CN,zh;q=0.8',
    'Cache-Control':'max-age=0',
    'Connection':'keep-alive',
    'Host':'disclosure.szse.cn',
    'If-Modified-Since':'Thu, 11 Aug 2016 07:46:19 GMT',
    'If-None-Match':"1cf8f5d-15309-539c6f61da8c0",
    'Referer':'http://disclosure.szse.cn/m/unit/drggxxpllist.html?s=%2Fdisclosure%2Ffulltext%2Fplate%2Fszlatest_24h.js',
    'User-Agent':'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36'}
fs.mkdirSync('D:\\'+get_now_time()+'\\')
var req=http.request({
    headers:headers,
    host:'disclosure.szse.cn',
    path:'/disclosure/fulltext/plate/szlatest_24h.js?ver=201608111551',
    method:'GET'
},handle_info)
function get_now_time(){
    return new Date().toLocaleString().substring(0,10).replace('/','-')
}
function handle_info(res){
    var body=''
    res.on('data',function(data){
        body+=iconv.decode(data,'GBK')
    })
    res.on('end',function(){
        eval(body)
        var allN=szzbAffiches.length
        var currentN=0
        var countN=10
        handle_many_url(szzbAffiches,currentN,countN,allN)
    })
}
req.end()
function Promise_download(url,path){
    return new Promise(function (resolve,reject) {
        console.log('正在下载'+url+'到'+path)
        var steam=request(url).on('error',function(){console.error('failure')
                                                        fs.unlink(path)
                                                        reject()})
                                .pipe(fs.createWriteStream(path))
        steam.on('finish', function () {
            console.log('done')
            resolve()
        })
            .on('error',function(){
                console.error('failure')
                reject()
            })
    })
}
function handle_many_url(array,currentN,countN,allN){
    var arr=[]
    if(currentN==countN){
        console.log('完成')
        return
    }
    if((countN+10)>allN){
        countN=allN
    }
    for(var i=currentN;i<countN;i++){
        var url=baseurl+array[i][1]
        var path='D:\\'+get_now_time()+'\\'+array[i][2].replace('\\','').replace('/','').replace('*','')+'.pdf'
        arr.push(Promise_download(url,path))
    }
    Promise.all(arr).then(function () {
        currentN=countN
        countN+=10
        handle_many_url(array,currentN,countN,allN)
    }, function (e) {
        if(e){
            console.log(e.message)
        }
    })

}
