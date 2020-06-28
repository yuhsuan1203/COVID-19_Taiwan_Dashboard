import $ from 'jquery';
import twCityCode from '../json/taiwan-city-code.json';
import axios from 'axios';

let path = "php/";
let caseNumArr = [];
let cityArr = [];
let arrayCode = [];
let cityCaseArr = [];

async function getTWData() {
  const url = path + "api-TWData.php";

  //TODO: check if axios return JSON object automatically
  const data = await axios.get(url);

  const diagnoseNum = data[0].確診;
  const releaseNum = data[0].解除隔離;
  const deadNum = data[0].死亡;
  const inspectNum = data[0].送驗;
  const excludeNum = data[0]['排除(新)'];
  const ysdDiagnoseNum = data[0].昨日確診;
  const ysdInspectionNum = data[0].昨日送驗;
  const ysdExcludeNum = data[0].昨日排除;

  return {
    diagnoseNum,
    releaseNum,
    deadNum,
    inspectNum,
    excludeNum,
    ysdDiagnoseNum,
    ysdInspectionNum,
    ysdExcludeNum
  };
}

function renderData(TWObjData) {
  // $("#ysdExcludeTitle").html(returnData.Title + ' <i class="fas fa-child"></i>');
  $("#ysdExcludeNum").html(TWObjData.ysdExcludeNum);

  // $("#ysdInspectionTitle").html(returnData.Title + ' <i class="fas fa-ambulance fa-sm"></i>');
  $("#ysdInspectionNum").html(ysdInspectionNum);

  // $("#excludeTitle").html(returnData.Title + ' <i class="fas fa-child"></i>');
  $("#excludeNum").html(TWObjData.excludeNum);

  // $("#inspectTitle").html(returnData.Title + ' <i class="fas fa-ambulance fa-sm"></i>');
  $("#inspectNum").html(TWObjData.inspectNum);

  //  $("#releaseTitle").html(returnData.Title + ' <i class="fas fa-smile"></i>')
  $("#releaseNum").html(TWObjData.releaseNum);

  //  $("#ysdDiagnoseTitle").html('昨日' + returnData.Title + ' <i class="fas fa-syringe"></i>');
  $("#ysdDiagnoseNum").html(TWObjData.ysdDiagnoseNum);

  //  $("#deadTitle").html(returnData.Title + ' <i class="fas fa-skull-crossbones"></i>');
  $("#deadNum").html(TWObjData.deadNum);

  //  $("#diagnoseTitle").html('總' + returnData.Title + ' <i class="far fa-hospital"></i>');
  $("#diagnoseNum").html(TWObjData.diagnoseNum);
}

async function render() {
  const TWObjData = await getTWData();
  renderData(TWObjData);
  
  nConVList();
}

function nConVList() {
  $.ajax({
    url: path + "api-nConVList.php",
    type: "GET",
    success: function (data) {
      // console.log(data);
      const parseJSON = $.parseJSON(data);
      // console.log(parseJSON);
      parseJSON.forEach((v, i) => {
        // console.log(v);
        let caseSex = v.性別;
        let isOutCase = v.是否為境外移入;
        let isOutCaseIcon;
        const caseMonth = v.診斷月份;
        const caseCity = v.縣市;
        const caseAge = v.年齡層;
        const caseNum = v.確定病例數;
        // console.log(isOutCase);
        const caseNumInt = parseInt(caseNum, 10);
        caseNumArr.push(caseNumInt);
        cityArr.push(caseCity);
        if (caseSex === "F") {
          caseSex = "女";
        } else {
          caseSex = "男";
        };
        if (isOutCase == "是") {
          isOutCaseIcon = '<i class="far fa-circle text-success"></i>';
        } else {
          isOutCaseIcon = '<i class="fas fa-times text-danger"></i>';
        }
        const caseCityObj = findCityCode(caseCity);
        const {
          cityCode: caseCityCode,
          cityName: caseCityName
        } = caseCityObj;
        
        let cityCaseObj = {
          'caseCityCode': caseCityCode,
          'caseCityName': '' + caseCityName + '',
          'caseCityNum': caseNumInt
        };
        cityCaseArr.push(cityCaseObj);

        $("#nConVList").append(
          '<tr><td>' + caseMonth + '</td><td data-order="' + caseCityCode + '">' + caseCity +
          '</td><td>' + caseSex + '</td><td>' +
          caseAge + '</td><td>' + caseNum + '</td><td>' + isOutCaseIcon + '</td></tr>');
      });
      // parseJSON = $.parseJSON(data);
    },
    error: function (data) {
      console.log(data);
    },
    complete: function () {
      // console.log(cityCaseArr);
      caseNumTotal = caseNumArr.reduce((a, b) => a + b);
      // console.log(caseNumTotal);
      cityCaseArr.sort((a, b) => {
        return a.caseCityCode - b.caseCityCode;
      });
      countCityCase(cityCaseArr);
      nCovDataTable();
      renderSVGColor();
      $(".loading").css({
        "display": "none"
      });
    }
  });
}

function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function renderSVGColor() {
  for (let i = 1; i < 22; i++) {
    cName = $("#TW_" + i + " > th").text();
    cNum = parseInt($("#TW_" + i + " > td").text(), 10) * 5;
    let r = 255;
    let g = 255 - cNum;
    let b = g;

    if (g <= 0) {
      g = 0;
      b = g;
    }

    hexColor = rgbToHex(r, g, b);
    // console.log(hexColor);
    $("#tw-map-" + i).css({
      "fill": hexColor,
    });
    // console.log(cName, cNum);
  }
}

function countCityCase(cityCaseArr) {
  let prevCityCode = 1;
  for (const i in cityCaseArr) {

    currCityCode = cityCaseArr[i].caseCityCode;
    // console.log(currCityCode);
    if (prevCityCode != currCityCode) {
      // console.log(currCityCode, prevCityCode);
      prevCityCode = currCityCode;
      currCaseCityNum = cityCaseArr[i].caseCityNum;
      $("#TW_" + currCityCode + " > td").html("<span class='text-warning'>" + currCaseCityNum + "</span>");
    } else if (prevCityCode == currCityCode) {
      // console.log("pc:" + currCityCode, prevCityCode);
      prevCaseCityNum = parseInt($("#TW_" + prevCityCode + " > td").text(), 10);
      currCaseCityNum = parseInt(cityCaseArr[i].caseCityNum, 10);;
      NewCaseCityNum = prevCaseCityNum + currCaseCityNum;
      $("#TW_" + prevCityCode + " > td").html("<span class='text-warning'>" + NewCaseCityNum + "</span>");
    }
  }
  TW_1_Num = parseInt($("#TW_1 > td").text(), 10) - 1;
  $("#TW_1 > td").html("<span class='text-warning'>" + TW_1_Num + "</span>");
  // console.log(TW_1_Num);

}

function nCovDataTable() {
  $('#nCoVCaseTable').DataTable({
    "paging": true,
    "searching": false,
    "info": false,
    "pageLength": 5,
    "language": {
      "paginate": {
        'first': '第一頁',
        'previous': '&laquo;',
        'next': '&raquo;',
        'last': '最後一頁',

      },
      "lengthMenu": '顯示 <select>' +
        '<option value="5">5</option>' +
        '<option value="10">10</option>' +
        '<option value="25">25</option>' +
        '<option value="50">50</option>' +
        '<option value="100">100</option>' +
        '<option value="-1">All</option>' +
        '</select> 筆資料'
    }
  });
  $("#cityListTable").DataTable({
    "paging": false,
    "searching": false,
    "info": false,
    "orderFixed": [
      [1, "desc"],
      [0, "desc"]
    ],
    "columns": [{
        "orderable": false
      },
      {
        "orderable": false
      },
    ],
    "columnDefs": [{
      "orderable": false,
      "targets": 0
    }]
  });
}

function findCityCode(queryCityName) {
  for (const city of twCityCode) {
    const cityName = city.cityName;
    if (queryCityName === cityName) {
      return city;
    }
  }
  return undefined;
}


// comment for testing
render();

// for software tesing hw3
export { 
  nConVList, 
  findCityCode,
  getTWData
};
