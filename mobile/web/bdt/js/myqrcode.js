$(document).ready(function() {
	$('body').height($(window).height());

	targetId = request("id");
  if(targetId == ""){
    dataLoadedError("对象已失效。");
  }else{
    getMyqrcodeData(targetId);
  }
  /** by wangzhen 20170513 调整back程序
    $("#back").click(function() {
        if (isNormalBackBool==1) {
        //document.referrer是获取上一页的url
        var url = document.referrer;
        if (url!=null&&url.length!=0) {
           window.location.href = "javascript:history.back(-1)";
        }else{
           window.location.href = "index.html";
        }
        }else{
            historyUtils.back();  
        }
    });
	*/
    wxShare("","","","","","");
});


//进行热门问答列表的网络请求
function getMyqrcodeData(targetId) {
    dataLoading("数据加载中...");
     //dataLoadedError("数据错误");
    $.ajax({
        type: "post",
        url: getMyqrcodeDataUrl,
        dataType: "json",
        data:{"id":targetId},
        success: function(result) {
             clearToastDialog();
            if (result.result == "success") {  
              var record = result.data.master;
               configUserDataUI(record);
            } else {
                dataLoadedError(result.message);
            }
        }
    });
}

function configUserDataUI(record){
  if(record != null){
    $("#headPic").attr("src",insertImgType(record.headPic,3));
    $("#nickname").text(record.nickname);
    if(record.sex == 1){
      $("#sexDisplay").attr("src","images/sex_m.png");
    }else{
      $("#sexDisplay").attr("src","images/sex_w.png");
    }
    $("#masterInfo").text(record.masterInfo);
    var masterLableHtml = "";
    var lables = record.lable.split(",");
    for (var lable in lables){
      masterLableHtml = "<span class=\"label fs24\">"+lable+"</span>";
    }
    $("#qrCodePic").attr("src",record.qrCodePic);
    $("#answerCnt").text(record.totAnswers);
    if(record.masterLvl>1){
      $("#headPicVip").show();
    }
  }else{
    dataLoadedError("对象已失效。");
  }
}





