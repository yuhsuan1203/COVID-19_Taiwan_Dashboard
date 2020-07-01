import requests

def get_cdc_confim_data():
    r = requests.get(url="https://od.cdc.gov.tw/eic/Day_Confirmation_Age_County_Gender_19CoV.json")
    confirm_data = r.json()
    return confirm_data
#confirm_data = confirm_data[:5]
#print(data)

def get_cdc_tw_data():
    r2 = requests.get("https://covid19dashboard.cdc.gov.tw/dash3")
    tw_data = r2.json()['0']
    return tw_data