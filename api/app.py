from flask import Flask
from get_cases import confirm_data, tw_data

app = Flask(__name__, static_folder='../dist', static_url_path='/')

@app.route('/')
def hello():
    return app.send_static_file('index.html')

@app.route('/date/<month>-<day>', methods=['GET'])
def date_count(month, day):
    #print(month, day)
    confirm_date = "2020/" + str(month) + "/" + str(day)
    data = dict()
    data['count'] = 0
    data['gender'] = 'X'
    data['out'] = 'X'
    for cases in confirm_data:
        if cases["個案研判日"] == confirm_date:
            data['count'] += int(cases["確定病例數"])
            if cases["性別"] == "女":
                data['gender'] = 'F'
            if cases["是否為境外移入"] == "是":
                data['out'] = 'Y'
    return data

@app.route('/TWData')
def get_tw_data():
    data = dict()
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


if __name__ == '__main__':
    app.run()