var request=require('request')
var http=require('http')

var fs=require('fs')
var Promise=require('bluebird')
var $=require('cheerio')
var iconv=require('iconv-lite')
var baseurl='http://jandan.net/ooxx/page-'
var filepath='D:\\煎蛋\\'
var download_url=[]
var to_anylise_url=[]
var headers={
    'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Encoding':'gzip, deflate, sdch',
    'Accept-Language':'zh-CN,zh;q=0.8',
    'Connection':'keep-alive',
    'Cookie':'2347265839=4465NdTWrtS%2Ba9977%2FnKLCZWwzK9VI0ydWdhjkG5Pw; 2347265839=6e057FH0k%2Bz5Cdk7Jhhm9ePAMYAKC4ORa%2BOYPWNq6A; jdna=596e6fb28c1bb47f949e65e1ae03f7f5#1472783994522; Hm_lvt_fd93b7fb546adcfbcf80c4fc2b54da2c=1472780132; Hm_lpvt_fd93b7fb546adcfbcf80c4fc2b54da2c=1472783995; _ga=GA1.2.1153334709.1472780131; _gat=1; PHPSESSID=5givi4cgcma09ir5jbbrnegdq2',
    'Host':'jandan.net',
    'Upgrade-Insecure-Requests':'1',
    'User-Agent':'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.80 Safari/537.36 Core/1.47.640.400 QQBrowser/9.4.8309.400'
}

for (var i=1111;i<2116;i++){	
	to_anylise_url.push(baseurl+i)
}
var currentN=0
var countN=3
var allN=to_anylise_url.length

handle_many_url(to_anylise_url,currentN,countN,allN)
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
        var  url=array[i]
        arr.push(promise_get(url,filepath))
    }
    Promise.all(arr).then(function () {
        currentN=countN
        countN+=3
        console.log('现在是'+currentN)
        handle_many_url(array,currentN,countN,allN)
    }, function (e) {
        if(e){
            console.log(e.message)
        }
        currentN=countN
        countN+=countN
        console.log('error in promise')
        handle_many_url(array,currentN,countN,allN)
    })

}
function promise_get(url,filepath){
	return new Promise(function(resolve,reject){
        request({
            url: url,
            followAllRedirects: true,
            gzip:true,
            headers:headers
        }, function (err,res,body) {
            download_img(body,filepath,resolve,reject)

        }).on('response', function (res) {
            var htm=''
            res.on('data', function (data) {
                htm+=iconv.decode(data,'utf-8')
                //htm+=data
            })

        })
	})	
}
function download_img(htm,filepath,resolve,reject){
	var html=$.load(htm)
    var lent=html('.commentlist').find('li').length

	html('.commentlist').find('li').each(function(){

        var url=$(this).find('.text p a').attr('href')
        if(url){
            try{
		        request(url).pipe(fs.createWriteStream(filepath+url.split('/')[url.split('/').length-1]))
                    .on('finish', function () {
                            lent--;
                            if(lent<2){
                                console.log('done')
                                resolve()
                                     }
                                                })}
        catch (e){console.log('error');reject()}}
        else{resolve()}
		//request.on('finish',resolve)
	})
	
}

