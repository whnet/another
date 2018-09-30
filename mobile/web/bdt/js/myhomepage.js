var nicknameStr ="";
var userID = "";
var hotActicleStr = "";
var arrayCategory = new Array();
var heightScroll ="";
var userTest = "";
var isFocusOn = "";
var datetime = new Date();
var topListArr = new Array();
// read 0 1
var indexID = 0;
// var arrayCategory = new Array();　
var hashIndex = "";
var totalPageArr = new Array(0,0,0);
var clickItemTimesArr = new Array(0,0,0);

var flagArr = new Array(0,0,0);
var pageArr = new Array(1,1,1);
var prePage = -1;
var backBool = 0;
var isAnswerQuestionBool = false;
var isUnanswerQuestionBool = false;
var fromIndex = null;

var moreDataflag = 0;
var pernum=6;
var page = 1;
var currentPage = 1;
var totalPage = 1;

// 判断是我读还是我问
var read=request("read");
if(read==0){
    indexID = 0;
}else if(read==1) {
    indexID = 1;
}

$(document).ready(function() {
  fromIndex = readClientSession("fromIndex");
  hashIndex = window.location.hash;
  if (hashIndex.length>0) {
      indexID = hashIndex.substring(hashIndex.indexOf('#') + 1);
  }

  
  doUpdateListItem(topListArr);

  pageArr[0] = readClientSession('homepage0-page');
  pageArr[1] = readClientSession('homepage1-page');
  pageArr[2] = readClientSession('homepage2-page');
  // page = readClientSession('homepage'+indexID+'-page');
  pageScroll(0);
  pageScroll(1);
  pageScroll(2);

});

//异步请求我的回答和我的提问
function getQuestions(){
    var csrf = $('input[name="csrf"]').val();
    var start = pernum * (currentPage -1);
    var expert = $('input[name="expert"]').val();
    $.ajax({
        type: "post",
        url: '/questions/notice.html',
        dataType: "json",
        async: true,
        data: {
            "currentPage": currentPage,
            "start":start,
            "pernum":pernum,
            "expert":expert,
            "_csrf":csrf,
        },
        success: function(result) {
            if (result.result == "success") {
                currentPage = result.data.page.currentPage;
                totalPage = result.data.page.pages;
                questionList(result,2);
            } else {
                dataLoadedError(result.message);
            }
        }
    });
}
function questionList(result,index){
    var list = "";
    for(var i = 0; i < result.data.list.length; i++){
        if(result.data.list[i].haveread == 0){
            status = "../bdt/images/unread.png";
        }else{
            status = "../bdt/images/read.png";
        }
        //判断是否使用的微信头像
        var isWeixin = result.data.list[i].user.photo.indexOf('ttp');
        if(isWeixin == 1){
            photo = result.data.list[i].user.photo;
        }else{
            photo = result.file+result.data.list[i].user.photo;
        }

        list +='<div class="notice-item bg-white b-tb-grey hasNotRead" onclick="updateNoticeReadStatus('+result.data.list[i].id+')">' +
            '<div class="notice_head">' +
            '<i><img src="'+photo+'"><i><img src="../bdt/images/v2.png"></i></i>' +
            '<p class="fs28">您收到'+result.data.list[i].user.nickname+'的提问</p><i>' +
            '<img id="isHasRead" src="'+status+'"></i></div>' +
            '<p class="fs30">'+result.data.list[i].question+'</p><div class="notice_bottom">' +
            '<p class="fs22">06-06 09:07</p><p class="fs22">查看详情</p>' +
            '</div></div>';
    }
    $('#noticeListCon0').append(list);
    showMessage(result);
}
function showMessage(result){
    if (result.data.page.pages > result.data.page.currentPage) {
        if (moreDataflag=-1) {
            moreDataflag = 0;
        };
        $('#downloadMoreData').remove();
        $('#noticeListCon0').append('<a id="downloadMoreData" class="appui_loadmore fs32 fc-greyabc">拼命加载中<i class="loadmore"></i></a>');
    }else if (result.data.page.pages == result.data.page.currentPage && result.data.page.pages >= 1) {
        $('#downloadMoreData').remove();
        $('#noticeListCon0').append('<a class="appui_loadmore fs32 fc-greyabc">已经没有了</a>');
    }else if(result.data.list.length == 0){
        $('#noticeListCon0').html(commonNoMoreContent("暂无问答"));
    }
}
//加载更多
function downloadMoreData() {
    currentPage++;

    getQuestions();
}
//异步请求我的回答和我的提问END


function pageScroll(index){
    $('.page__bd').scroll(function(){
        if (flagArr[index]==0) {
            var a = "";
            if ($('#downloadMoreData'+index).length>0) {
                a = document.getElementById("downloadMoreData"+index).offsetTop;
                if (a >= $(this).scrollTop() && a < ($(this).scrollTop()+$(window).height())) {
                    // alert("div在可视范围");
                    flagArr[index] = -1;
                    downloadMoreData(index);
                } 
            };
        };
    });
}
//页面导航选项；
function doUpdateListItem(groups) {
    var domStr = "";
    if(groups.length==2){
    	$("#myhomepageTab").attr("class","tab-btn fs30 tab-btn-two");
    	if(indexID==0){
    		indexID=1;
    	}
    	$('#myhomepageTab').append('<a style="display:none;"></a>');
    }
    
    for (var i = 0; i < groups.length; i++) {
        if (indexID == i+1) {
            classfc = "fc-white bg-blue";
        } else {
            classfc = "fc-blue";
        }
        domStr += '<a class="' + classfc + '" onClick="categoryListFunction('+(groups.length==2?i+1:i)+');">' + groups[i] + '</a>';
    }
    $('#myhomepageTab').append(domStr);
    categoryListFunction(indexID);
    tabTextColor();
}
//四个大类别所对应的方法；
// var times = 0;
function categoryListFunction(index) {
    $('.homepagelist').hide();
    $('#homepage' + index).show();
    prePage = index;
	$('#myhomepageTab a').attr('class','fc-blue');
	$('#myhomepageTab a:eq('+ index +')').attr('class','fc-white bg-blue');
}

function gotoQanda_detailHtmlOfListen(listId,typeId,obj){
    if($(obj).parents(".my-listen-item").length == 0){
        setElementClickStyle(obj);
    }else{
        setElementClickStyle($(obj).parents(".my-listen-item")[0]);
    }
      window.location.href = "/questions/qanda_detail.html?id="+listId+"&typeId="+typeId;
}


function gotoQanda_recordHtml(listId,status,isFrom,reAnswer){
   if (status==1||status==5) {
      if (isFrom!=0) {
          window.location.href = "/questions/qanda_record.html?id="+listId+"&reAnswer="+reAnswer+"&typeId=10";
      }else{
          window.location.href = "/questions/qanda_record.html?id="+listId+"&reAnswer="+reAnswer+"&typeId=11";
      }
    }else if (status==-1) {
      dataLoadedError("该问题暂未支付");
    }else{
        window.location.href = "/questions/qanda_detail.html?id="+listId;
    }
}
function gotoQanda_detailHtml(listId,isFrom){
  //判断是从那个界面进来的 0从myhome 1myAnswer
  if (isFrom!=0) {
      window.location.href = "/questions/qanda_detail.html?id="+listId+"&typeId=1";
  }else{
      window.location.href = "/questions/qanda_detail.html?id="+listId+"&typeId=11";
  }
    
}

function commonJS(index){
    var autoLoad = flagArr[index];
    if (clickItemTimesArr[index]==1) {
        // page!=null
        if (currentPageArr[index]<pageArr[index]&&pageArr[index]!=null) {
            downloadMoreData(index);
        }else if (autoLoad==0){
            pageArr[index] = -1;
            var position = readClientSession('homepage'+index+'-position');
            $('#homepage'+index+'').scrollTop(position);    
        }
    }
}



