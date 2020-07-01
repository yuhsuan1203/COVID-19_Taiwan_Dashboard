from flask import Flask, jsonify
from get_cases import get_cdc_confim_data, get_cdc_tw_data

app = Flask(__name__, static_folder='../dist', static_url_path='/')

@app.route('/')
def hello():
    return app.send_static_file('index.html')

#@app.route('/date/<month>-<day>', methods=['GET'])
#def date_count(month, day):
#    #print(month, day)
#    confirm_date = "2020/" + str(month) + "/" + str(day)
#    data = dict()
#    data['count'] = 0
#    data['gender'] = 'X'
#    data['out'] = 'X'
#    for cases in confirm_data:
#        if cases["個案研判日"] == confirm_date:
#            data['count'] += int(cases["確定病例數"])
#            if cases["性別"] == "女":
#                data['gender'] = 'F'
#            if cases["是否為境外移入"] == "是":
#                data['out'] = 'Y'
#    return data

@app.route('/TWData')
def get_tw_data():
    data = dict()
    tw_data = get_cdc_tw_data()
    data['diagnoseNum'] = -1
    data['releaseNum'] = -1
    data['deadNum'] = -1
    data['inspectNum'] = -1
    data['excludeNum'] = -1
    data['ysdDiagnoseNum'] = -1
    data['ysdInspectionNum'] = -1
    data['ysdExcludeNum'] = -1

    data['diagnoseNum'] = tw_data['確診']
    data['releaseNum'] = tw_data['解除隔離']
    data['deadNum'] = tw_data['死亡']
    data['inspectNum'] = tw_data['送驗']
    data['excludeNum'] = tw_data['排除(新)']
    data['ysdDiagnoseNum'] = tw_data['昨日確診']
    data['ysdInspectionNum'] = tw_data['昨日送驗']
    data['ysdExcludeNum'] = tw_data['昨日排除']

    return data

@app.route('/nCovList')
def get_list():
    data = list()
    confirm_data = get_cdc_confim_data()

    for single_item in confirm_data:
        single_case = dict()
    
        if single_item['性別'] == '女':
            single_case['性別'] = "F"
        else:
            single_case['性別'] = "M"
        
        single_case['確定病名'] = single_item['確定病名']
        single_case['是否為境外移入'] = single_item['是否為境外移入']
        single_case['年齡層'] = single_item['年齡層']
        single_case['縣市'] = single_item['縣市']
        single_case['確定病例數'] = single_item['確定病例數']
        single_case['診斷月份'] = single_item['個案研判日'].split('/')[1]
    
        if single_case['診斷月份'][0] == '0':
            single_case['診斷月份'] = single_case['診斷月份'][1]
    
        data.append(single_case)

    return jsonify(data)

if __name__ == '__main__':
    app.run()
