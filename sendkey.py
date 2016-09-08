__author__ = 'wang'
import selenium
from selenium import webdriver
#from selenium.webdriver.common.action_chains import ActionChains
import time
#import selenium.webdriver.support.ui as ui
#import pymysql
brower=webdriver.Firefox()
brower.get('http://www.sse.com.cn/disclosure/diclosure/public/')
brower.execute_script('document.getElementById("start_date2").readonly=false;')
wait=ui.WebDriverWait(brower,10)
# conn=pymysql.connect(
#                         host='192.168.31.181',
#                         port=3306,
#                         user='developer01',
#                         password='developer01',
#                         database='rates'
#                     )
# conn.set_charset('utf8')
# cur=conn.cursor()
# cur.execute('SET NAMES utf8;')
# cur.execute('SET CHARACTER SET utf8;')
for month in ['05','06','07']:
    for days in [str(i) for i in range(1,31)]:
        if int(days)<10:
            days= '0'+days
        date_time='2016-'+month+'-'+days
        input_tag=brower.find_element_by_xpath('//*[@id="start_date2"]')
        ser_tag=brower.find_element_by_xpath('//*[@id="btnQuery"]')
        brower.execute_script('document.getElementById("start_date2").value="'+date_time+'";')
        ser_tag.click()
        wait.until(lambda d:d.find_element_by_xpath('/html/body/div[7]/div[2]/div[2]/div[2]/div/div/div/div/div[2]/div[2]/pre'))
        prv_tag=brower.find_element_by_xpath('/html/body/div[7]/div[2]/div[2]/div[2]/div/div/div/div/div[2]/div[2]/pre')
        htm_string=prv_tag.get_attribute('innerHTML')
        local_time=time.strftime('%Y-%m-%d ',time.localtime(time.time()))
        sql_params=[local_time,htm_string]

        # cur.execute('INSERT INTO lhb_html_sh(date,content) VALUES(%s,%s);',sql_params)

       # conn.commit()
    print(days+'天完成')
print(month+'月完成')
# cur.close()
# conn.close()
brower.close()



