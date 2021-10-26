import sys
import pandas as pd                        
from pytrends.request import TrendReq
pytrend = TrendReq()

arr = sys.argv[1]

pytrend.build_payload(kw_list=arr)

related_queries = pytrend.related_queries()

results = " "
ans_m = []
for j in arr:
    for tag in related_queries[j]['top']['query']:
        ans_m.append(tag+"%")

for y in ans_m:
    print(y)      

