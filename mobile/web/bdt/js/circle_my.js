// circle_my.js
//隐藏点击事件 46
var userTest ="";
var userTestId ="";
var from = "";
var totalPage = 0;
var currentPage = 1;
var totalPage = 0;
var flag = 0;
var currentIndex = 0 ;
var switchStyle = 0;//圈子默认的展示样式 0：格子展示  1：横向列表展示
var switchBool = 0;//[currentIndex]
var switchIconStyle = 0;
$(document).ready(function() {
	//切换显示-我的圈子-推荐圈子 改变30，31和50行可调整顺序
	$('#circleSwitchTab>a').each(function(index, element) {
		$(this).click(function(e) {
			currentIndex = index
			switchCricleList(currentIndex);//切换显示-我的圈子-推荐圈子
		});
	});

	//圈子列表展示样式切换switchStyle 0:格子展示  1：横向列表展示
	$('#switchId').click(function(e) {
		if(switchBool == 0){
			switchStyle = 1 ;
			switchBool = 1 ;
			switchIconStyle = 0;
			$('#switchId').find('img').attr('src','../bdt/images/nav_icon_switch0.png');
			$('#circleList0').css('display','none');
            $('#circleListwenzi').css('display','block');
		}else{
			switchStyle = 0 ;
			switchBool = 0 ;
			switchIconStyle = 1;
			$('#switchId').find('img').attr('src','../bdt/images/nav_icon_switch1.png');
            $('#circleList0').css('display','block');
            $('#circleListwenzi').css('display','none');

		}
	});
	//推荐的列表形式
	// 隐藏该点击事件
    $('#switchId1').click(function(e) {
		if(switchBool == 0){
			switchStyle = 1 ;
			switchBool = 1 ;
			switchIconStyle = 0;
			$('#switchId1').find('img').attr('src','../bdt/images/nav_icon_switch0.png');
            $('#circleListtuijian').css('display','none');
            $('#circleListtuijianlist').css('display','block');
		}else{
			switchStyle = 0 ;
			switchBool = 0 ;
			switchIconStyle = 1;
			$('#switchId1').find('img').attr('src','../bdt/images/nav_icon_switch1.png');
            $('#circleListtuijian').css('display','block');
            $('#circleListtuijianlist').css('display','none');
		}
		$("#circleList0").hide();
		currentPage = 1 ;
	});
	
	//搜索
	$('#circleSearch').click(function(e) {
        $('body').append(initSearchUI());
        $('#searchText').attr('placeholder',"搜索圈子");
        $('.search-container').show();
        searchCircle();
    });

	//页面滚动-加载更多
    $('.page__bd').scroll(function(){
        if (flag==0) {
            var a = "";
            if ($('#downloadMoreData').length>0) {
                a = document.getElementById("downloadMoreData").offsetTop;
                if (a >= $(this).scrollTop() && a < ($(this).scrollTop()+$(window).height()-40)) {
                // alert("div在可视范围");
                    flag = -1;
                } 
            }
        };
    });





});

//创建圈子跳转链接
function creatCircle(){
	window.location.href = "/circle/circle_creat.html";
}

//切换显示-我的圈子-推荐圈子
function switchCricleList(currentIndex){
	$('#circleSwitchTab>a').removeClass('fc-white bg-red').addClass('fc-red');
	$('#circleSwitchTab>a').eq(currentIndex).removeClass('fc-red').addClass('fc-white bg-red');
	$('.circle-list').hide();
	$('#circleList'+currentIndex).show();
	if(currentIndex == 0){
		//我的圈子
		console.log(currentIndex);
        $('#switchId').css('display','block');
        $('#switchId1').css('display','none');
		$('#circleSearchCon').hide();
        $("#tuijiancircle").hide();
        $("#mycircle").show();
	}else{//推荐圈子
        $('#switchId').css('display','none');
        $('#switchId1').css('display','block');
		$('#circleSearchCon').show();
		currentPage = 1;
		$('#circleListtuijian').show();
        $("#mycircle").hide();
        $("#tuijiancircle").show();
	}	
}



//配置我的圈子列表
function configMyCircleListUI(groups){
	var circleList = "";
	var joinStatus = "";
	for (var i = 0; i < groups.length; i++) {
		circleList +=creatCircleListUI(groups[i]);
	};
	$('#circleList0').append(circleList);
	$('.circle-item>span').each(function(index, element) {
		$(this).css('height',$(this).width());
	});
}

//配置推荐圈子


//拼写圈子列表展示样式
function creatCircleListUI(circleItem){
	//switchStyle判断是格子展示还是列表展示 0：格子展示 1：列表展示
	//switchBool判断在我的圈子还是在推荐圈子里面是否点击过切换展示方式的参数 0：未点击  1：已点击
	//currentIndex判断是我的圈子还是推荐的圈子 0：我的圈子  1：推荐圈子
	//console.log('switchStyle='+switchStyle+'switchBool='+switchBool+'currentIndex='+currentIndex);
	var circleItemStr = '';
		var noreadmsgflag="";//我的圈子-未读消息提醒（推荐圈子不现实未读消息提醒）
		if(currentIndex == 0 && circleItem.noReadMsgCount>0){
			noreadmsgflag='<i class="bg-red"></i>';
		}
		
	if(switchStyle == 0){//格子展示方式
		var isMyCircle = '<img src="../../themes/img/circle_master.png" />';//圈主图标-蓝色
		if(userTestId == circleItem.host.id){//如果当前访问者是圈主则显示圈主图标-红色
			isMyCircle = '<img src="../../themes/img/circle_master_me.png" />';
		}
		var isChageHtml = ""//推荐圈子-是否收费标志（我的圈子不显示收费标志）
		if(currentIndex == 1 && circleItem.joinPrice==0){
			isChageHtml = '<img src="'+circleItem.bgPic+'" />';
		}else if(currentIndex == 1 && circleItem.joinPrice>0){
			isChageHtml = '<img class=filter3 src="'+circleItem.bgPic+'" /><i><img src="../../themes/img/charge.png" /></i>';
			
		}else if(currentIndex == 0){
			isChageHtml = '<img src="'+circleItem.bgPic+'" />';
		}
		circleItemStr =	'<div class="circle-item bg-white fc-black" onclick="gotoHtml('+circleItem.joinStatus+','+circleItem.id+')">'+
							'<span>'+
								isChageHtml+
								'<em class="fs22 fc-white">'+ noreadmsgflag + circleItem.totMembers+'</em>'+
							'</span>'+
							'<h3 class="fs28">'+circleItem.name+'</h3>'+
							'<i class="bg-green"></i>'+
							'<h4 class="fs20 fc-grey666">'+isMyCircle+circleItem.host.nickname+'</ih4>'+
						'</div>';
	}else{//横向列表中展示方式
		circleItemStr =	'<div class="circle-item-x bg-white fc-black mt10" onclick="gotoHtml('+circleItem.joinStatus+','+circleItem.id+')">'+
							'<a class="circle-headpic"><img src="'+circleItem.bgPic+'" /></a>'+
							'<div class="circle-info">'+
								//'<a class="goto-circle fs24 bc-blue fc-blue" style="display:block" onclick="gotoHtml('+circleItem.joinStatus+','+circleItem.id+')">去逛逛</a>'+
								'<h3 class="circle-info-name fs30 fc-black">'+
									circleItem.name+
									noreadmsgflag+
								'</h3>'+
								'<p class="circle-info-canshu fs20 fc-grey999">'+
									'<span>圈主:'+circleItem.host.nickname+'</span>'+
									'<span class="ml10">成员:<em>'+circleItem.totMembers+'</em>人</span>'+
								'</p>'+
								'<p class="circle-info-introduce fs24 fc-grey666 mt5">'+circleItem.summary+'</p>'+
							'</div>'+
						'</div>';
	}
	return circleItemStr;
}


//拼命加载中...时候进行的网络请求；
function downloadMoreData() {
    currentPage++;
}

//进入圈子主页-分别进入圈子主页（免费圈子）或圈子资料页（收费圈子）
function gotoHtml(joinStatus,id, obj){
	//首先将当前页面的数据和状态保存下来，方便跳转回来保持状态

    if(typeof obj != 'undefined'){
        setElementClickStyle(obj);
    }
	if (joinStatus==1) {
		window.location.href="circle_page.html?id="+id;
	}else {
		window.location.href="circle_share_detail.html?id="+id;
	}
}






