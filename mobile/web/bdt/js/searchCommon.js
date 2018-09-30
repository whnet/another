// searchCommon.js
var searchText = "";
var sectionId = 0;
var areaId = 0;
function initSearchUI () {
	var doStr = '<div class="search-container bg-white" id="container-pop" style="display:none">'+
				    '<div id="page">'+
						'<div class="page__hd page__hd-search b-b-grey bg-white">'+
							'<a class="nav-act left-act" id="back" onclick="$(\'#container-pop\').remove();$(\'#container\').show();">' +
                            '<img src="../bdt/images/nav_icon_back1.png" /></a>'+
							'<div class="search-module search-page-use">'+
								'<span><img src="../bdt/images/search_grey.png" /></span>'+
								'<em class="bg-blue"></em>'+
								'<input type="text" class="fc-greyfd fs28" placeholder="请输入要搜索的内容" id="searchText"/>'+
							'</div>'+
							'<a class="search-btn bg-red fc-white fs28" id="searchBtn">搜索</a>'+
						'</div>'+
						'<div class="page__bd" id="page__bd">'+
							'<div class="top-space7"></div>'+
							<!--热门搜索-->
							'<div class="search-hot mt10 bg-white" style="display:none;" id="hotLabel">'+
								'</div>'+

							<!--热门楼盘搜索-->
							'<div class="search-hot mt10 bg-white" style="display:none;" id="hotLoupanLabel">'+
								'<h3 class="fs28 fc-black" id="hotLoupanLabelListTiele1">热门楼盘</h3>'+
								'<div class="search-hot-list fs28 fc-black456" id="hotLoupanLabelList1"></div>'+
								'<h3 class="fs28 fc-black mt10" id="hotLoupanLabelListTiele2">热门板块</h3>'+
								'<div class="search-hot-list fs28 fc-black456" id="hotLoupanLabelList2"></div>'+
								'<h3 class="fs28 fc-black mt10" id="hotLoupanLabelListTiele3">热门区域</h3>'+
								'<div class="search-hot-list fs28 fc-black456" id="hotLoupanLabelList3"></div>'+
							'</div>'+


						'</div>'+
					'</div>'+
				'</div>';
	return doStr;
}



//获取热词请求;
function getHotKeysFunction(){
    // dataLoading("数据加载中...");
    /**
    $.ajax({
        type: "post",
        url: getHotKey,
        dataType: "json",
        async: true,
        data:{"maxRows":10},
        success: function(result) {
            // clearToastDialog();
            if (result.result == "success") {  
                configHotKeyUI(result.data.list);
            } else {
                dataLoadedError(result.message);
            }
        }
    });
    */
    $.ajax({
        type: "post",
        url: '',
        dataType: "json",
        async: true,
        data:{"type":""},
        success: function(result) {
            // clearToastDialog();
            if (result.result == "success") {  
                configHotKeyUI(result.data.list);
            } else {
                dataLoadedError(result.message);
            }
        }
    });
}

//获取楼盘热词请求
function getHotLoupanKeysFunction(){
    // dataLoading("数据加载中...");
    $.ajax({
        type: "post",
        url: getLoupanSearchKey,
        dataType: "json",
        async: true,
        data:{"maxRows":15},
        success: function(result) {
            // clearToastDialog();
            if (result.result == "success") {  
                configHotLoupanKeyUI(result.data.list);
            } else {
                dataLoadedError(result.message);
            }
        }
    });
}


function configHotKeyUI(groups){
    $('#hotLabel').show();
    var doStr = "";
    var preType = -1;
    var fromType = 0;
    var targetUrlPathname = window.location.pathname;
    if (targetUrlPathname=="/qanda.html") {//搜索问答-来自问答列表
        fromType = 1;
    }else if (targetUrlPathname=="/found_expert.html") {//搜索行家-来自行家列表
        fromType = 2;
    }else if(targetUrlPathname=="/circle_my.html"){ //搜索圈子-来自圈子列表
        fromType = 3;
    }else if(targetUrlPathname=="/loupan_list.html"){//搜索楼盘或楼讯-来自楼盘列表
        fromType = 4;
    }else{//搜索混合-来自首页
        fromType = 0;
    }
    for (var i = 0; i <groups.length; i++) {
        // 如果不等于搜索的类型则不渲染
        if(fromType != groups[i].type && fromType != 0) continue;

        if(groups[i].type != preType){
            var typeStr = '圈子热搜';
            if(groups[i].type == 1){
                typeStr = '内容热搜';
            }else if(groups[i].type == 2){
                typeStr = '行家热搜';
            }

            if(i>0){
                doStr += '</div>';
            }
            doStr += '<h3 class="fs28 fc-black">'+typeStr+'</h3>';
            doStr += '<div class="search-hot-list fs28 fc-black456">';
            preType = groups[i].type;
        }
        doStr += '<a class="bg-greyf1 fc-black456" href="'+groups[i].url+'">'+groups[i].searchStr+'</a>';

        if(i == groups.length-1){
            doStr += '</div>';
        }
    };
    $('#hotLabel').html(doStr);
}

//生成热搜楼盘词组
function configHotLoupanKeyUI(groups){
    $('#hotLoupanLabel').show();
    var hotLoupanStr = "";
	var hotLoupanLength = 0;
    var hotSectionStr = "";
    var hotSectionLength = 0;
    var hotAreaStr = "";
    var hotAreaLength = 0;
    for (var i = 0; i <groups.length; i++) {
		if(groups[i].type == 1){//热搜楼盘
        	hotLoupanStr += '<span class="bg-greyf1" data-loupanid="'+groups[i].rootId+'">'+groups[i].searchStr+'</span>';
			hotLoupanLength = hotLoupanLength+1;
		}else if(groups[i].type == 2){//热搜板块
			hotSectionStr += '<span class="bg-greyf1" data-sectionid="'+groups[i].rootId+'">'+groups[i].searchStr+'</span>';
			hotSectionLength = hotSectionLength+1;
		}else if(groups[i].type == 3){//热搜区域
			hotAreaStr += '<span class="bg-greyf1" data-areaid="'+groups[i].rootId+'">'+groups[i].searchStr+'</span>';
			hotAreaLength = hotAreaLength+1;
		}
    };
    $('#hotLoupanLabelList1').html(hotLoupanStr);
    $('#hotLoupanLabelList2').html(hotSectionStr);
    $('#hotLoupanLabelList3').html(hotAreaStr);
	//hotLoupanLabelListTiele1
	
	if(hotLoupanLength==0){//无热搜楼盘
		$('#hotLoupanLabelListTiele1').hide();
		$('#hotLoupanLabelList1').hide();
	}else if(hotSectionLength==0){//无热搜板块
		$('#hotLoupanLabelListTiele2').hide();
		$('#hotLoupanLabelList2').hide();
	}else if(hotAreaLength==0){//无热搜区域
		$('#hotLoupanLabelListTiele3').hide();
		$('#hotLoupanLabelList3').hide();
	}
	if (groups.length==0) {//暂无热词
		$('#hotLoupanLabelListTiele1').hide();
		$('#hotLoupanLabelList1').hide();
		$('#hotLoupanLabelListTiele2').hide();
		$('#hotLoupanLabelList2').hide();
		$('#hotLoupanLabelListTiele3').hide();
		$('#hotLoupanLabelList3').hide();
        $('#hotLabel').append(commonNoMoreContent("暂无热词"));
    };
	$('#hotLoupanLabelList1>span').click(function() {//热搜楼盘直接进楼盘主页
		window.location.href = "loupan_page.html?id="+$(this).attr("data-loupanid");
    });
	$('#hotLoupanLabelList2>span').click(function() {
        $('#hotLoupanLabel').hide();
        $('#searchText').val($(this).text());
        searchText = $(this).text();
		sectionId = $(this).attr("data-sectionid")
        searchContentClick();
    });
	$('#hotLoupanLabelList3>span').click(function() {
        $('#hotLoupanLabel').hide();
        $('#searchText').val($(this).text());
        searchText = $(this).text();
		areaId = $(this).attr("data-areaid");
        searchContentClick();
    });
}



function set_focus(){
	$("#searchText")[0].focus();
	$('#searchBtn').click(function(e) {
	    searchText = $('#searchText').val();
	    searchContentClick();
	});
	$('#circleSearch').click(function(e) {
	    searchText = $('#searchText').val();
	    searchContentClick();
	});
}

function searchContentClick(){
    if (searchText==""||searchText.length==0) {
        dataLoadedError("输入内容不能为空");
        return;
    };
    window.location.href = "/site/search.html?keys="+searchText;
    // <!--没有检索到信息-->
    // var search0=$("#search-resault-expert").find(".appui-expert-name").text();
    // var search1=$("#search-resault-circle").find(".circle-info-name").text();
    // var search2=$("#search-resault-circle").find(".appui-qanda-question").text();
    // window.location.href = "/site/search.html?keys="+searchText;
    // if((search0=="")&&(search1=="")&&(search2=="")){
    //     $(".appui-nocontent").show();
    //
    //     return;
    // }else if((search0!="")||(search1!="")||(search2!="")){
    //     $(".appui-nocontent").hide();
    //     // alert("23")
    // }
}
// var index=request("keys");
//     if(index==0){
//         // alert("1")
//         $(".appui-nocontent").show();
//     }else{
//         $(".appui-nocontent").hide();
//     }
/*
搜索圈子
 */
function searchCircle(){
    $("#searchText")[0].focus();
    $('#searchBtn').click(function(e) {
        searchText = $('#searchText').val();
        searchCircleClick();
    });
}
function searchCircleClick(){
    if (searchText==""||searchText.length==0) {
        dataLoadedError("输入内容不能为空");
        return;
    };
    window.location.href = "/site/search.html?keys="+searchText+"&from=circle";
}