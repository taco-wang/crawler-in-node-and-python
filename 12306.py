#coding:utf-8
__author__ = 'wang'
'''create in 2016-08-17'''
import json
import requests
#import urllib

headers={
    "CoontentType":"application/x-www-form-urlencoded",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64; rv:47.0) Gecko/20100101 Firefox/47.0",
    "Host":"kyfw.12306.cn"
}
data={
    "leftTicketDTO.train_date":"2016-08-17",
    "leftTicketDTO.from_station":"BJP",
    "leftTicketDTO.to_station":"SHH",
    "purpose_codes":"ADULT",

}
#transed_data=urllib.parse.urlencode(data)

url='https://kyfw.12306.cn/otn/leftTicket/queryT?leftTicketDTO.train_date=2016-08-17&leftTicketDTO.from_station=BJP&leftTicketDTO.to_station=SHH&purpose_codes=ADULT'
reply=requests.get(url,headers=headers,verify=False)

info_dict=json.loads(reply.content.decode('utf-8'))['data']
for i in info_dict:
    print(i['queryLeftNewDTO'])