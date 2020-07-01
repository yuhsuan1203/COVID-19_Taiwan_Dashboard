import $ from 'jquery';

async function sideBarRender() {
  $('#sideBar').load('sidebar.html');
  // $("#TW-case-map").load('img/tw-2.svg');
  $(".st1").on('mousemove', function(e) {
    // console.log(offsetX, offsetY);
    e.preventDefault();
    const offsetX = e.offsetX;
    const offsetY = e.offsetY;
    $(".tooltip-box").css({
      "left": offsetX - 10 + "px",
      "top": offsetY + 20 + "px"
    });
  });
  $(".st1").hover(function() {
    const cityID = $(this).attr("id").replace("tw-map-", "");
    const cName = $("#TW_" + cityID + " > th").text();
    const cNum = $("#TW_" + cityID + " > td").text();
    // $("#tw-map-" + cityID).css({
    //   "stroke": "#000",
    // });
    $(".tooltip-box").css({
      "display": "initial",
    }).html('<span id="city-name">' + cName + '</span>：<span id="city-case-num">' + cNum + '</span>例');
  }, function() {
    // $("#tw-map-" + cityID).css({
    //   "stroke": "#5F9EA0",
    // });
    $(".tooltip-box").css({
      display: "none",
    });
  });
}

export default sideBarRender;