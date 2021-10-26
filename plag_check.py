
# print("jai shri krishna")

# pip install requests
# pip install bs4
# pip install html5lib

import sys
from difflib import SequenceMatcher 
import requests
from bs4 import BeautifulSoup
url = sys.argv[2].split(",")
x = sys.argv[1]
ans = []
for u in url:
    r = requests.get(u)
    htmlContent = r.content
    soup = BeautifulSoup(htmlContent,'html.parser')
    paras = soup.find_all('p')
    s = " "
    ma = 0
    for i in paras:
        s = s + i.get_text()
        tma = SequenceMatcher(None,i.get_text().lower(),x.lower()).ratio()
        if(tma>ma):
            ma=tma 
    
    ttma = SequenceMatcher(None,s.lower(),x.lower()).ratio()
    if(ttma>ma):
        ma=ttma 
    ans.append(u+" - "+str(ma*100) + "}")

ii = 0
for y in ans:
    print(y)
    


    

