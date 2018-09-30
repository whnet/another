// myanswer.js
var nicknameStr ="";
var userID = "";
var hotActicleStr = "";
var arrayCategory = new Array();　
var heightScroll ="";
var userTest = "";
var isFocusOn = "";
var datetime = new Date();
var topListArr = new Array();
var indexID = 0;
// var arrayCategory = new Array();　
var hashIndex = "";
var currentPageArr = new Array(1,1);
var totalPageArr = new Array(0,0);
var clickItemTimesArr = new Array(0,0);

var flagArr = new Array(0,0,0);
var pageArr = new Array(1,1,1);
var prePage = -1;

$(document).ready(function() {
  hashIndex = window.location.hash;
  if (hashIndex.length>0) {
      indexID = hashIndex.substring(hashIndex.indexOf('#') + 1);
  }
  topListArr = ["未回答","已回答"];
  doUpdateListItem(topListArr);

  /** by wangzhen 20170513 调整back程序
  $("#back").click(function() {
        if (isNormalBackBool==1) {
        //document.referrer是获取上一页的url
        var url = document.referrer;
        if (url!=null&&url.length!=0) {
           window.location.href = "/myhomepage.html#0";
        }else{
           window.location.href = "index.html";
        }
        }else{
            historyUtils.back();  
        }
  });
  */
  pageArr[0] = readClientSession('myanswer-page0-page');
  pageArr[1] = readClientSession('myanswer-page1-page');
  pageScroll(1);
  pageScroll(2);

});

function pageScroll(index){
    $('#myanswer-page'+index).scroll(function(){
        if (flagArr[index]==0) {
            var a = "";
            if ($('#downloadMoreData'+index).length>0) {
                a = document.getElementById("downloadMoreData"+index).offsetTop;
                if (a >= $(this).scrollTop() && a < ($(this).scrollTop()+$(window).height()-55)) {
                    // alert("div在可视范围");
                    flagArr[index] = -1;
                    downloadMoreData1(index);
                } 
            };
        };
    });
}

//页面导航选项；
function doUpdateListItem(groups) {
    var domStr = "";
    //var location = "";
    //location = indexID * 50 + "%";
    for (var i = 0; i < groups.length; i++) {
        if (indexID == i) {
            classfc = "fc-white bg-blue";
        } else {
            classfc = "fc-blue";
        }
        domStr += '<a class="' + classfc + '" onClick="categoryListFunction(' + i + ')">' + groups[i] + '</a>';
    }
    //domStr+='<span class="movebg bg-blue" style="left:' + location + ';"></span>';
    $('#myanswerTab').append(domStr);
    categoryListFunction(indexID);
    tabTextColor();
}
//四个大类别所对应的方法；
// var times = 0;
function categoryListFunction(index) {
   document.location.hash=index;
    $('.page__bd').hide();
    $('#myanswer-page' + index).show();
    if (clickItemTimesArr[index]==0) {
      if (index==0) {
         getContentListByUserRequest(index,22);
      }else{
         getContentListByUserRequest(index,21);
      }
    };
    if (prePage!=-1) {
        myClose();
    }; 
    prePage = index;
	$('#myanswerTab a').attr('class','fc-blue');
	$('#myanswerTab a:eq('+ index +')').attr('class','fc-white bg-blue');
}
//获取问答列表
function getContentListByUserRequest(index,subType) {
    userTest = getSessionUser();
    clickItemTimesArr[index]=1;
    dataLoading("数据加载中...");
     //dataLoadedError("数据错误");
    $.ajax({
        type: "post",
        url: getMyContentList,
        dataType: "json",
        async: true,
        // data:{"page":"获取页","userId":id,"contentType":"1-文章，2-问答","subType":"0-全部，1-我问，20-我答（包含21+22）,21-我已答，22-未答"}
        data:{"page":currentPageArr[index],"contentType":2,"subType":subType},
        success: function(result) {
             clearToastDialog();
            if (result.result == "success") {
              currentPageArr[index] = result.data.page.currentPage;
              totalPageArr[index] = result.data.page.pages;
              if (subType==22&&result.data.list.length>0) {
                configUnansweredQuestionList(result.data.list,index);
              }else if (subType==21&&result.data.list.length>0) {
                configAnsweredQuestionList(result.data.list,index);
              }
            } else {
                alert(result.message);
            }
        }
    });
}

function myClose(){
    // pageArr[prePage] = 
    var position = $('#myanswer-page'+prePage+'').scrollTop();
    writeClientSession('myanswer-page'+prePage+'-position',position);
    writeClientSession('myanswer-page'+prePage+'-page',currentPageArr[prePage]);
}

function commonJS(index){
    var autoLoad = flagArr[index];
    if (clickItemTimesArr[index]==1) {
        // page!=null
        if (currentPageArr[index]<pageArr[index]&&pageArr[index]!=null) {
            downloadMoreData1(index);
        }else if (autoLoad==0){
            pageArr[index] = -1;
            var position = readClientSession('myanswer-page'+index+'-position');
            $('#myanswer-page'+index+'').scrollTop(position);    
        }
    }
}