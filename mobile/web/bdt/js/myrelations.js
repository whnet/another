// myrelations
var nicknameStr ="";
var hotActicleStr = "";
var arrayCategory = new Array();　
var heightScroll ="";
var userTest = "";
var isFocusOn = "";
var datetime = new Date();
var hashIndex = "";
var indexID = "";
var currentPageArr = new Array(1,1,1);
var totalPageArr = new Array(0,0,0);
var clickItemTimesArr = new Array(0,0,0);
var userID = "";
var isFrom = "";

var flagArr = new Array(0,0,0);
var pageArr = new Array(1,1,1);
var prePage = -1;
var backCount = 1;
$(document).ready(function() {
    //tabbar(2);
    hashIndex = window.location.hash;
    if (hashIndex.length>0) {
        indexID = hashIndex.substring(hashIndex.indexOf('#') + 1);
        indexID=indexID.substr(0,1);
        if (hashIndex.indexOf('userID=')!=-1) {
           userID = request("userID");
         }
         // else{
         //   var userTest = getSessionUser();
         //   userID = userTest.id;
         // }
    }
    isFrom = request("isFrom");

    configListItem(indexID); 
    pageArr[0] = readClientSession('myrelations-page'+backCount+'-page');
    pageArr[1] = readClientSession('myrelations-page1-page');
    pageArr[2] = readClientSession('myrelations-page2-page');
    pageScroll(1);
    pageScroll(2);
    /*wxShare();*/

});

function pageScroll(index){
    $('.page__bd').scroll(function(){
        if (flagArr[index]==0) {
            var a = "";
            if ($('#downloadMoreData'+index).length>0) {
                a = document.getElementById("downloadMoreData"+index).offsetTop;
                if (a >= $(this).scrollTop() && a < ($(this).scrollTop()+$(window).height()-55)) {
                    // alert("div在可视范围");
                    flagArr[index] = -1;
                    downloadMoreData(index);
                } 
            };
        };
    });
}

function configListItem(index) {
    var location = "";
    location = index * 33 + "%";
    $('#relationId1').removeClass("bg-blue fc-white tab-on").addClass("fc-blue");
    $('#relationId2').removeClass("bg-blue fc-white tab-on").addClass("fc-blue");
    $('#relationId'+index).addClass("bg-blue fc-white tab-on").removeClass("fc-blue");

    // $('.movebg').css("left",location);
    // $('#relationId'+indexID+'').removeClass("fc-grey678").addClass("fc-blue");
    $('.myrelationslist').hide();
    $('#myrelations-page'+index+'').show();
    prePage = index;
}

function congifUI(groups,pageId){
  for (var i = 0; i < groups.length; i++) {

	var signStr = '<h2 class="fs30 fc-navy just-name">'+groups[i].nickname+'</h2>';
	if(groups[i].briefInfo != null && groups[i].briefInfo != '')
	{
		signStr = '<h2 class="fs30 fc-navy">'+groups[i].nickname+'</h2>'+
				  '<p class="fs24 fc-greyabc">'+groups[i].briefInfo+'</p>';

	}
	var levelStr = userLevelStr(groups[i].masterLvl,groups[i].loupanId);

    var doStr = '<div class="myrelations-item b-b-grey bg-white" onclick="gotoUser_pageHtml('+groups[i].id+')">'+
					'<a>'+
						'<i><img src="'+insertImgType(groups[i].headPic,2)+'" /></i>'+
						levelStr+
					'</a>'+

                        '<div>'+
							signStr+
                        '</div>'+
                        '<span><img src="images/icon06.png" /></span>'+
				'</div>';
    $('#page'+pageId+'').append(doStr);
  }
  // 判断加载更多按钮是否出现
  if($('#downloadMoreData'+pageId).length>0){
      $('#downloadMoreData'+pageId).remove();
  }
  if (groups.length==0) {
		//$('#page'+pageId+'').append('<a class="appui_loadmore bc-grey fs32 fc-greyabc">暂无更多信息</a>');

		if(pageId == 1){
			$('#page'+pageId).append(commonNoMoreContent("暂无关注"));
		}
		else{
			$('#page'+pageId).append(commonNoMoreContent("暂无粉丝"));
		}
	}
	else if (totalPageArr[pageId] != currentPageArr[pageId]) {
    if (flagArr[pageId]==-1) {
        flagArr[pageId] = 0;
    };
    $('#page'+pageId+'').append('<a onclick="downloadMoreData('+pageId+');" id="downloadMoreData'+pageId+'" class="appui_loadmore fs32 fc-greyabc">拼命加载中<i class="loadmore"></i></a>');
  }
  commonJS(pageId);

}

//加载更多时候进行的网络请求；
function downloadMoreData(pageId) {
    currentPageArr[pageId]++;
}
function commonJS(index){
    var autoLoad = flagArr[index];
    if (clickItemTimesArr[index]==1) {
        // page!=null
        if (currentPageArr[index]<pageArr[index]&&pageArr[index]!=null) {
            downloadMoreData(index);
        }else if (autoLoad==0){
            pageArr[index] = -1;
            var position = readClientSession('myrelations-page'+indexID+'-position');
            $('#myrelations-page'+indexID+'').scrollTop(position);
        }
    }
}
function myFriendsList(){
  window.location.hash = 0;
	$('.myrelationslist').hide();
	$('#myrelations-page0').show();
  if (clickItemTimesArr[0]==0) {
  };
  if (prePage!=-1) {
      myClose();
  };
  prePage = 0;
}
function myFocusList(){
 /* wxShare();*/
  backCount++;
  $('#relationId2').removeClass("bg-blue fc-white tab-on").addClass("fc-blue");
  $('#relationId1').addClass("bg-blue fc-white tab-on").removeClass("fc-blue");
  window.location.hash = 1;
	$('.myrelationslist').hide();
	$('#myrelations-page1').show();
  if (clickItemTimesArr[1]==0) {
  };
  if (prePage!=-1) {
      myClose();
  };
  prePage = 1;
}
function myFansList(){
  backCount++;
  /*wxShare();*/
  $('#relationId1').removeClass("bg-blue fc-white tab-on").addClass("fc-blue");
  $('#relationId2').addClass("bg-blue fc-white tab-on").removeClass("fc-blue");
  window.location.hash = 2;
	$('.myrelationslist').hide();
	$('#myrelations-page2').show();
  if (clickItemTimesArr[2]==0) {
  };
  if (prePage!=-1) {
      myClose();
  };
  prePage = 2;
}

function myClose(){
    // pageArr[prePage] =
    var position = $('#myrelations-page'+prePage+'').scrollTop();
    writeClientSession('myrelations-page'+prePage+'-position',position);
    writeClientSession('myrelations-page'+prePage+'-page',currentPageArr[prePage]);
}

























