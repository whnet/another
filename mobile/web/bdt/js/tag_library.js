//标签库tag_library.js
var _page_g_isIos =  null;
$(document).ready(function() {
	var u = navigator.userAgent;
    isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

     //取消
    $('#cancelEditLabel').click(function(e) {
        $('#custonTagEditDialog').hide();
    });
    //确定
    $('#sureTagEditLabel').click(function(e) {
        var taglableText=$("#tagcustomText").val();
          alert(taglableText);
        //自定义标签中有，则不允许创建
        var checkVal=false;
        $("#myTagLabel #tagContent").find("a").each(function(index,e){
            if($(this).html()==taglableText){
                checkVal=true;
            }
        });
        //圈子标签中有也不允许再创建
        $("#circleLabel #tagContent").find("a").each(function(index,e){
            if($(this).html()==taglableText){
                checkVal=true;
            }
        });
        if(checkVal){
            dataLoadedError("标签已经存在，不允许重复");
        }
        else if(taglableText==""){
            dataLoadedError("自定义标签不允许为空");
        }
        else{
            $('#custonTagEditDialog').hide();
            $("#myTagLabel #tagContent").append('<div class="fs26 fc-grey999"><a class="bg-white">'+taglableText+'</a></div>');
            $("#tagcustomText").val("");
            LoadTagList.OptionTagLabel();
        }
    });
    BundAClick('circleLabel');


});

//得到楼盘的文章内容类型
function LoadLouPanContentType(contentId){
		var tagTopHtml=CreateTagTopHTML();
		$("#"+contentId).prepend(tagTopHtml);
		$('#tagShowOrHideLabel').click(function(e) {
			$('#tagLabelList').toggle();
			$('#fixedLabel').show();
			$('#tagShowOrHideLabel').toggleClass('on');
			if(!isiOS){
				$("#edit-mark").focus();
			}
		});
	LoadTagData("loupan_page","loupan_fabu",contentId,'选择标签','louPanLabel');//(可不选)
	}

//加载圈子标签
function LoadQzTagLable(contentId,qzId,hostId,userId){
		var tagTopHtml=CreateTagTopHTML();
		$("#"+contentId).prepend(tagTopHtml);
		$('#tagShowOrHideLabel').click(function(e) {
			$('#tagLabelList').toggle();
			$('#fixedLabel').show();
			$('#tagShowOrHideLabel').toggleClass('on');
			if(!isiOS){
				$("#edit-mark").focus();
			}
		});
//	alert(userId+"--------"+hostId);
	if(userId==hostId){
		LoadTagData("circle","qz_"+qzId+"_user_"+userId,contentId,'我的标签','myTagLabel');
	}
	else{
		LoadTagData("circle","qz_"+qzId+"_user_"+userId,contentId,'我的标签','myTagLabel');
		LoadTagData("circle","qz_"+qzId+"_user_"+hostId,contentId,'圈子标签','circleLabel');
}

//	$("#myTagLabel .fc-black").append('<a class="custom-tag-btn fc-blue" id="customTagBtn">自定义添加</a>');
	$("body").append(CreateTagCustomHTML());



	$('#sureTagEditLabel').click(function(e) {
		var taglableText=$("#tagcustomText").val();

		//自定义标签中有，则不允许创建
		var checkVal=false;
		$("#myTagLabel #tagContent").find("a").each(function(index,e){
			if($(this).html()==taglableText){
				checkVal=true;
			}
		});
		//圈子标签中有也不允许再创建
		$("#circleLabel #tagContent").find("a").each(function(index,e){
			if($(this).html()==taglableText){
				checkVal=true;
			}
		});
		if(checkVal){
			dataLoadedError("标签已经存在，不允许重复");
		}
		else if(taglableText==""){
			dataLoadedError("自定义标签不允许为空");
		}
		else{
			$('#custonTagEditDialog').hide();
			$("#myTagLabel #tagContent").append('<a class="bg-white">'+taglableText+'</a>');
			$("#tagcustomText").val("");
			BundAClick("myTagLabel");

			$('#myTagLabel #tagContent').css('width',$('#myTagLabel #tagContent').find('a').length*90-10);
//如果自定义标签中没有内容默认是隐藏，增加后显示
			if($("#circleLabel #customTagBtn")!=null && $("#circleLabel #customTagBtn").length>0){
				$("#myTagLabel").show();
				$("#circleLabel #customTagBtn").remove();
			}
		}
	});
//	LoadTagData(type,"QZ_2",contentId,'我的标签','myTagLabel');//alert(7);

}

//创建标签库的结构
function CreateTagTopHTML(){
	var tagTopHtml='<div class="edit-label-bar bg-white">'+
						'<span class="fs28">'+
					'<img src="../../themes/img/edit_label_icon.png" />'+
					'标签分类'+
				'</span>'+
				'<a class="show-hide-labellist" id="tagShowOrHideLabel"></a>';
	tagTopHtml+='<i class="arrow bg-greyf1" style="display:none;"></i>'+
				'</div>';
	tagTopHtml+='<div class="label-list-con top-label bg-greyf1" style="display:none;" id="tagLabelList"></div>';
	return tagTopHtml;
}

//创建标签内容部分
function CreateTagCententHtml(groups,title,cusId){
	var tagCenterHtml = "";
	//圈主标签，没有就不显示 by wangzhen
	if(cusId == "circleLabel" && (groups==null || groups.length==0)){

	}else{
		tagCenterHtml=	'<!--楼盘用标签-->'+
						'<div class="label-list fixed-label" id="'+cusId+'">'+
							'<p class="fs28 fc-black">'+title+'</p>'+
							'<div>'+
								'<div class="fs26 fc-grey999" id="tagContent">';

		if(groups!=null && groups.length>0){
			for (var i = 0; i < groups.length; i++) {
				var curselect="";//i==0?"on ":""; 默认不会选中任何一个
				tagCenterHtml+='<a class="'+curselect+'bg-white">'+groups[i].name+'</a>';
			}
		}

		tagCenterHtml+=			'</div>'+
							'</div>'+
						'</div>';
	}

	return tagCenterHtml;
}

//创建标签内容部分
function CreateTagCententHtmlFileRelease(groups,title,cusId){
	var tagCenterHtml = "";
	//圈主标签，没有就不显示 by wangzhen
	if(cusId == "circleLabel" && (groups==null || groups.length==0)){

	}else{
		tagCenterHtml=	'<!--楼盘用标签-->'+
						'<div class="label-list fixed-label" id="'+cusId+'">'+
							'<p class="fs28 fc-black">'+title+'</p>'+
							'<div class="fs26 fc-grey999" id="tagContent">';

	if(groups!=null && groups.length>0){
		for (var i = 0; i < groups.length; i++) {
			tagCenterHtml+='<div class="fs26 fc-grey999"><a class="bg-white">'+groups[i].name+'</a></div>';
		}
	}
		tagCenterHtml+=	'</div>'+
						'</div>';
	}

	return tagCenterHtml;
}

function LoadTagData(type,sourceName,contentId,title,cusId){
	$.ajax({
		type: "post",
		url: "getTagLibraryList.html",
		dataType: "json",
		async: true,
		data:{"page":1,"name":sourceName},
		success: function(result){
			if (result.result == "success"){
				var cententHtmle=CreateTagCententHtml(result.data.list,title,cusId);
				if(type=="circle" && cusId == "myTagLabel"){
					$("#tagLabelList").prepend(cententHtmle);
					$("#myTagLabel .fc-black").append('<a class="custom-tag-btn fc-blue" id="customTagBtn">自定义添加</a>');

					//判断是否存在，不存在，则要吧自定义添加放到圈子标签上面去
					var arrayA=$("#myTagLabel #tagContent").find("a");
					//自己的标签应该始终显示，包括自己是圈主，不显示，就变成无法创建标签了 by wangzhen
					/**if(arrayA.length<=0){
						$("#myTagLabel").hide();
					}
					else{
						$("#circleLabel #customTagBtn").remove();
					}*/

					$('#customTagBtn').click(function(e) {
						$('#custonTagEditDialog').show();
					});

				}else{
					$("#tagLabelList").append(cententHtmle);

					/**if(type=="circle"){
						//判断是否存在，不存在，则要吧自定义添加放到圈子标签上面去
						var arrayA=$("#myTagLabel #tagContent").find("a");
						if(arrayA.length<=0){
							$("#myTagLabel").hide();
							$("#circleLabel .fc-black").append('<a class="custom-tag-btn fc-blue" id="customTagBtn">自定义添加</a>');

							$('#circleLabel #customTagBtn').click(function(e) {
								$('#custonTagEditDialog').show();
							});
						}
						else{
							$("#circleLabel #customTagBtn").remove();
						}
					}*/
				}

				$('#'+cusId+' #tagContent').css('width',$('#'+cusId+' #tagContent').find('a').length*90-10);
				tagOption(type,cusId);

			}else{
				dataLoadedError(result.message);
			}
		}
	});
}


//重新封装的加载标签的方法
var LoadTagList = {
		containerId:"",
		publishLocId:0,
		publishLocType:0,
		callBack : "",
		LoadTagData : function(locId,locType,fn){
			LoadTagList.publishLocId=locId;
			LoadTagList.publishLocType=locType;
			LoadTagList.callBack=fn;
			if(locType==1){//楼盘中来的
				LoadTagList.LoadTagDataToFileRelease("loupan_fabu",'选择标签','louPanLabel');//(可不选)
			}
			else if(locType==2){
				LoadTagList.GetQzInfo(locId);
			}
		},
		LoadTagDataToFileRelease : function(sourceName,title,cusId){
			$.ajax({
				type: "post",
				url: "getTagLibraryList.html",
				dataType: "json",
				async: true,
				data:{"page":1,"name":sourceName},
				success: function(result){
					if (result.result == "success"){
						var cententHtmle=CreateTagCententHtmlFileRelease(result.data.list,title,cusId);
						if(cusId == "myTagLabel"){
							$("#"+LoadTagList.containerId).prepend(cententHtmle);
							$("#"+cusId+" .fc-black").append('<a class="custom-tag-btn fc-blue" id="customTagBtn">自定义添加</a>');
							LoadTagList.loadTagEditDialog();
				}else{
							$("#"+LoadTagList.containerId).append(cententHtmle);
						}
						LoadTagList.OptionTagLabel();
					}
				}
			});
		},
		GetQzInfo : function(qzId){
			$.ajax({
				type: "post",
				url: getQz,
				dataType: "json",
				async: true,
				data:{"id":qzId},
				success: function(result) {
					if (result.result == "success") {
						var hostId = result.data.qzShow.host.id;

						var tempUser = getSessionUserNoRedirectEx();
						if(tempUser==null){
							tempUser=getSessionUser();
						}
						//如果当前登录人是圈主，则可以发表到圈外
						if(tempUser!=null && tempUser!="" && result.data.qzShow.host.id==tempUser.id){
							LoadTagList.LoadTagDataToFileRelease("qz_"+qzId+"_user_"+tempUser.id,'我的标签','myTagLabel');
						}
						else{
							LoadTagList.LoadTagDataToFileRelease("qz_"+qzId+"_user_"+tempUser.id,'我的标签','myTagLabel');
							LoadTagList.LoadTagDataToFileRelease("qz_"+qzId+"_user_"+hostId,'圈子标签','circleLabel');
						}
						}
				}
			});
		},
		OptionTagLabel : function(){
			$("#"+LoadTagList.containerId+" #tagContent").find("a").each(function(index,e){
				//先解绑，不然点击一下会执行多次
				$(this).unbind("click");
				//再次重现绑定
				$(this).click(function(){
					LoadTagList.callBack($(this));
				});
			});

			$("#customTagBtn").click(function(){
				$("#custonTagEditDialog").show();
			});
		},
		loadTagEditDialog:function(){//自定义标签弹出框
			var tagCustomHtml='<div class="custom-tag-edit" id="custonTagEditDialog" style="display:none;">'+
				'<div class="appui-mask"></div>'+
				'<div class="custom-tag-edit-con bg-white">'+
					'<h3 class="fs32 fc-black">添加标签</h3>'+
					'<input type="text" class="fs32 fc-black bg-greyfa" placeholder="输入新标签" id="tagcustomText"/>'+
					'<p class="fs28">'+
						'<a class="fc-grey666" id="cancelEditLabel">取消</a>'+
						'<a class="fc-black" id="sureTagEditLabel">确定</a>'+
					'</p>'+
				'</div>'+
			'</div>';
			$("body").append(tagCustomHtml);

			$('#sureTagEditLabel').click(function(e) {
				var taglableText=$("#tagcustomText").val();

				//自定义标签中有，则不允许创建
				var checkVal=false;
				$("#myTagLabel #tagContent").find("a").each(function(index,e){
					if($(this).html()==taglableText){
						checkVal=true;
					}
				});
				//圈子标签中有也不允许再创建
				$("#circleLabel #tagContent").find("a").each(function(index,e){
					if($(this).html()==taglableText){
						checkVal=true;
					}
				});
				if(checkVal){
					dataLoadedError("标签已经存在，不允许重复");
				}
				else if(taglableText==""){
					dataLoadedError("自定义标签不允许为空");
			}
				else{
					$('#custonTagEditDialog').hide();
					$("#myTagLabel #tagContent").append('<div class="fs26 fc-grey999"><a class="bg-white">'+taglableText+'</a></div>');
					$("#tagcustomText").val("");
					LoadTagList.OptionTagLabel();
		}
	});
		},
		hide : function(){
			$("#"+LoadTagList.containerId).hide();
}
};

var tag_cur_name="";
//点击操作的逻辑处理
function tagOption(type,cusId){
	if(type=="loupan_page"){//alert(cusId);
//		$("#"+cusId).find("p").hide();
//		$("#"+cusId).find("div").css("margin-top","0.5rem");
		$("#editLabel").find("span").append("<i class='fc-grey666'>(可不选)</i>");
		$("#tagShowOrHideLabel").after('<div class="label-selected fs24"><span class=""></span></div>');
//		//增加箭头旁边的显示
//		$("#tagShowOrHideLabel").after('<div class="label-selected fs24"><span class="label-dianping">点评</span></div>');
		$("#"+cusId).find("a").each(function(index,e){
			$(this).click(function(){
				$("#"+cusId).find("a").removeClass("on");
				$(this).addClass("on");
				var className="dianping";
				var curname=$(this).html();
				if(curname=="点评"){
					className="dianping";
				}
				else if(curname=="评测"){
					className="pingce";
				}
				else if(curname=="看房日记"){
					className="kangfangriji";
				}
				else if(curname=="图解看盘"){
					className="tujiekanpan";
				}
				var curname=$(this).html();

				tag_cur_name=curname;
				$(".label-selected").html('<span class="label-'+className+'">'+curname+'</span>');
				$('.edit-label-bar>span>i').text('(已选)');
				$('#tagLabelList').hide();
				if(!isiOS){
					$("#edit-mark").focus();
				}
			});
		});
	}
	else if(type=="circle"){
		BundAClick(cusId);
	}
}

//绑定单击的事件
function BundAClick(cusId){
	$("#"+cusId+" #tagContent").find("a").each(function(index,e){
		//先解绑，不然点击一下会执行多次
		$(this).unbind("click");
		//再次重现绑定
		$(this).click(function(){
			$("#"+cusId+" #tagContent").find("a").removeClass("on");
			$(this).addClass("on");
			var curname=$(this).html();

			if(tag_cur_name.indexOf(curname)<0){

				if(tag_cur_name!=""){
					tag_cur_name+=",";
				}
				tag_cur_name+=curname;

			}

			if($("#edit-mark")[0].tagName=="DIV"){

//				var editmarkHmtl=$("#edit-mark").html();
//				alert(selectStart);
				if($("#edit-mark").html()=="请输入正文"){
					$("#edit-mark").html("");
					set_focus();
				}

				insertAIntoCurrSection(curname);
//				$("#edit-mark").html(editmarkHmtl.substring(0,selectStart)+"#"+curname+"#"+editmarkHmtl.substring(selectStart));
			}
			else{
				$("#edit-mark").insertContent("#"+curname+"#");
                $(".nav-label").show();
                $(".content-box .voice-box").hide();
                $(".content-box").show();
                $("#tagLabelList").show();
                showVoiceIcon(2);
			}
			// $('#tagLabelList').toggle();

		});
	});
}

//自定义框加载进入页面
function CreateTagCustomHTML(){
	var tagCustomHtml='<!--自定义标签弹框-->'+
						'<div class="custom-tag-edit" id="custonTagEditDialog" style="display:none;">'+
					'<div class="appui-mask"></div>'+
					'<div class="custom-tag-edit-con bg-white">'+
						'<h3 class="fs32 fc-black">添加标签</h3>'+
						'<input type="text" class="fs32 fc-black bg-greyfa" placeholder="输入新标签" id="tagcustomText"/>'+
						'<p class="fs28">'+
							'<a class="fc-grey666" id="cancelEditLabel">取消</a>'+
							'<a class="fc-black" id="sureTagEditLabel">确定</a>'+
						'</p>'+
					'</div>'+
				'</div>';
	return tagCustomHtml;
}

//得到圈子信息
function requestQzShow(qzId){
	$.ajax({
		type: "post",
		url: getQz,
		dataType: "json",
		async: true,
		data:{"id":qzId},
		success: function(result) {
			if (result.result == "success") {
				var hostId = result.data.qzShow.host.id;

				var tempUser = getSessionUserNoRedirectEx();
				if(tempUser==null){
					tempUser=getSessionUser();
				}
				LoadQzTagLable("editLabel",qzId,hostId,tempUser.id);

				//如果当前登录人是圈主，则可以发表到圈外
				if(userTest!=null && userTest!="" && result.data.qzShow.host.id==userTest.id){
					$('#appuiOpenPublish').show();
					$('#messagePicsId').addClass('b-b-greyf1');

					$('#appuiOpenPublish').click(function(e) {
						$(this).toggleClass('on');
					});

					appuiOpenPublish = 	'<div onclick="AnTest(this);" class="appui-open-publish mb20" style="padding:0 1.5rem;" id="appuiOpenPublish">'+
						'<span class="mr5">'+
							'<i class="bg-white"></i>'+
						'</span>'+
						'<p class="fs28 fc-grey666">公开发布（允许转发到圈外）</p>'+
					'</div>';
				}
			} else {
				dataLoadedError(result.message);
			}
		}
	});
}
