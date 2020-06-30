import requests

r = requests.get(url="https://od.cdc.gov.tw/eic/Day_Confirmation_Age_County_Gender_19CoV.json")
confirm_data = r.json()
#confirm_data = confirm_data[:5]
#print(data)

r2 = requests.get("https://covid19dashboard.cdc.gov.tw/dash3")
tw_data = r2.json()['0']