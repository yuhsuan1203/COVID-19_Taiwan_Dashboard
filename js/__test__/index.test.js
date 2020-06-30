import { 
  nConVList, 
  findCityCode,
  getTWData,
  renderData,
  countCityCase
} from '../index';

import $ from 'jquery';
import axios from 'axios';
import dt from'datatables.net';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

describe('test `countCityCase`', () => {
  it('should render correct number case of each city', () => {
    const cityCaseArrayTest = [
      {
        caseCityCode: 1,
        caseCityName: "基隆市",
        caseCityNum: 3
      },
      {
        caseCityCode: 15,
        caseCityName: "高雄市",
        caseCityNum: 2
      },
      {
        caseCityCode: 1,
        caseCityName: "基隆市",
        caseCityNum: 1
      }
    ];
    const htmlString = 
      '<div><table><tbody>' +
      '<tr id="TW_1"><th scope="row">基隆市</th><td>1</td>' +
      '</tr><tr id="TW_15"><th scope="row">高雄市</th><td>0</td></tr>' +
      '</tbody></table></div>';
    
    document.body.innerHTML = htmlString;

    countCityCase(cityCaseArrayTest);
    expect(document.querySelector('#TW_1 > td').textContent).toBe('4');
    expect(document.querySelector('#TW_15 > td').textContent).toBe('2');

  });
});

describe('test `renderData`', () => {
  it('should render corresponding html', () =>{
    const TWObjTest = {
      diagnoseNum: 447,
      releaseNum: 435,
      deadNum: 7,
      inspectNum: "76,209",
      excludeNum: "75,264",
      ysdDiagnoseNum: 0,
      ysdInspectionNum: 147,
      ysdExcludeNum: 177
    };
    document.body.innerHTML = 
    '<div id="ysdExcludeNum"></div>' +
    '<div id="ysdInspectionNum"></div>' +
    '<div id="excludeNum"></div>' +
    '<div id="inspectNum"></div>' +
    '<div id="releaseNum"></div>' +
    '<div id="ysdDiagnoseNum"></div>' +
    '<div id="deadNum"></div>' +
    '<div id="diagnoseNum"></div>';

    //test `renderData`
    renderData(TWObjTest);
    expect(document.querySelector('#ysdExcludeNum').textContent)
      .toBe(TWObjTest.ysdExcludeNum.toString());
    expect(document.querySelector('#ysdInspectionNum').textContent)
      .toBe(TWObjTest.ysdInspectionNum.toString());
    expect(document.querySelector('#excludeNum').textContent)
      .toBe(TWObjTest.excludeNum);
    expect(document.querySelector('#inspectNum').textContent)
      .toBe(TWObjTest.inspectNum);
    expect(document.querySelector('#releaseNum').textContent)
      .toBe(TWObjTest.releaseNum.toString());
    expect(document.querySelector('#ysdDiagnoseNum').textContent)
      .toBe(TWObjTest.ysdDiagnoseNum.toString());
    expect(document.querySelector('#deadNum').textContent)
      .toBe(TWObjTest.deadNum.toString());
    expect(document.querySelector('#diagnoseNum').textContent)
      .toBe(TWObjTest.diagnoseNum.toString());

  });
});

describe('test `getTWData`', () => {
  it('should return TWObjData', async () => {
    axios.get = jest
      .fn()
      .mockResolvedValue({
        "0": {
          確診: 447,
          解除隔離: 435,
          死亡: 7,
          送驗: "76,209",
          "排除(新)": "75,264",
          昨日確診: 0,
          昨日排除: 147,
          昨日送驗: 177,
        },
      });

    const TWObjData = await getTWData();
    expect(TWObjData).toMatchObject({
      diagnoseNum: expect.any(Number),
      releaseNum: expect.any(Number),
      deadNum: expect.any(Number),
      inspectNum: expect.any(String),
      excludeNum: expect.any(String),
      ysdDiagnoseNum: expect.any(Number),
      ysdInspectionNum: expect.any(Number),
      ysdExcludeNum: expect.any(Number)
    })
  })
})

describe('test `findCityCode`', () => {
  it('should return city object', () => {
    const expectObjTaipei = {
      'cityCode': 2,
      'cityName': '台北市'
    };
    const expectObjHsinchu = {
      'cityCode': 5,
      'cityName': '新竹市'
    }

    expect(findCityCode('台北市')).toEqual(expectObjTaipei);
    expect(findCityCode('新竹市')).toEqual(expectObjHsinchu);
  });
});

describe('logic coverage in `nConVList`, include PC, CC, CACC', () => {
  beforeEach(() => {
    dt(window, $);
  });
  it('sex === "F"(T), isOutCase == "是"(T)', async () => {
    axios.get = jest.fn().mockResolvedValue([{
      "診斷月份": 3, "縣市": "高雄市", "性別": "F", 
      "是否為境外移入": "是", "年齡層": "50-54", "確定病例數": 3 
    }])
    // Set up our document body
    document.body.innerHTML = '<div id="nConVList"></div>';
    
    await nConVList();

    // check results
    expect($("#nConVList tr td:nth-child(3)").text()).toBe('女');
    expect($("#nConVList tr td:nth-child(6)").html())
      .toBe('<i class="far fa-circle text-success"></i>');
    //console.log($("#nConVList tr").html());
  });

  it('sex === "F"(F), isOutCase == "是"(F)', async () => {
    axios.get = jest.fn().mockResolvedValue([{
      "診斷月份": 4, "縣市": "新北市", "性別": "M", 
      "是否為境外移入": "否", "年齡層": "35-39", "確定病例數": 1 
    }])

    // Set up our document body
    document.body.innerHTML = '<div id="nConVList"></div>';
    
    await nConVList();
    
    // check results
    expect($("#nConVList tr td:nth-child(3)").text()).toBe('男');
    expect($("#nConVList tr td:nth-child(6)").html())
      .toBe('<i class="fas fa-times text-danger"></i>');
    //console.log($("#nConVList tr").html());
  });
});