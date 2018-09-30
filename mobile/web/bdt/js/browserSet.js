$(document).ready(function($) {
	isPrivate();
});
function isPrivate(){
	var isPrivate= readClientSession("isPrivate");
	if (isPrivate == null) {
		var browserBool = 0 ;
		try{
			writeClientSession("isPrivate","suppout");
		}catch(err){
			browserBool = 1 ;
			showBrowserSetTips(browserBool);
		}

		function showBrowserSetTips(bool){
			var notSupport = '<div id="isPrivate1" class="js_dialog" style="display:none;">'+
									'<div class="appui-mask"></div>'+
									'<div class="appui-helptext bg-white" id="helptext" style="display:block;">'+
										'<h2 class="appui-helptext-hd fs32 fc-black b-b-grey">如何关闭浏览器无痕浏览模式</h2>'+
										'<div class="appui-helptext-bd fc-black456 b-b-grey">'+
											'<div class="appui-helptext-bd-con">'+
												'<p class="fs30">为保证页面完整性以便给您提供更好的使用体验，建议您关闭浏览器的无痕浏览模式。下面给出以UC浏览器、QQ浏览器、Safari浏览器为典型作为说明：</p>'+
												'<p class="fs30 mb10 mt20 fc-orange fwb">如何关闭UC浏览器无痕浏览模式？</p>'+
												'<p class="fs30">1.点击浏览器工具栏右侧第二个鬼脸图标（如下图：出现鬼脸图标表示已开启无痕浏览模式）：</p>'+
												'<p><img src="images/browser_set/browser_uc1.png"></p>'+
												'<p class="fs30">2.完成步骤一后，底部工具栏如下图，点击“无痕浏览”按钮：</p>'+
												'<p><img src="images/browser_set/browser_uc2.png"></p>'+
												'<p class="fs30">3.点击无痕浏览按钮后即关闭浏览器的无痕模式，关闭后工具栏状态如下图，表示已关闭无痕浏览。</p>'+
												'<p><img src="images/browser_set/browser_uc3.png"></p>'+
												
												'<p class="fs30 mb10 mt20 fc-orange fwb">如何关闭QQ浏览器无痕浏览模式？</p>'+
												'<p class="fs30 mb10">1.点击浏览器工具栏右侧第一个按钮（新建页面按钮，注意这个按钮左侧有一个脚印的阴影图标就表示已开启无痕模式）：</p>'+
												'<p><img src="images/browser_set/browser_qq1.png"></p>'+
												'<p class="fs30">2.完成步骤一后，出现下图弹出操作，点击第一排最后一个按钮，关闭无痕浏览模式：</p>'+
												'<p><img src="images/browser_set/browser_qq2.png"></p>'+
												'<p class="fs30">3.关闭无痕浏览模式后，弹出如下图提示，无痕浏览已关闭。</p>'+
												'<p><img src="images/browser_set/browser_qq3.png"></p>'+
												
												'<p class="fs30 mb10 mt20 fc-orange fwb">如何关Safari浏览器无痕浏览模式？</p>'+
												'<p class="fs30 mb10">1.点击浏览器工具栏右侧第一个按钮（新建页面按钮，注意底部工具栏背景为深灰色就表示已开启无痕模式）：</p>'+
												'<p><img src="images/browser_set/browser_safari1.png"></p>'+
												'<p class="fs30">2.完成步骤一后，底部工具栏如下图，点击“无痕浏览”按钮关闭无痕浏览模式：</p>'+
												'<p><img src="images/browser_set/browser_safari2.png"></p>'+
												'<p class="fs30">3.完成步骤二后如下图所示，已成功关闭无痕浏览模式，点击完成：</p>'+
												'<p><img src="images/browser_set/browser_safari3.png"></p>'+
												'<p class="fs30">4.关闭无痕浏览模式后，浏览器地步工具栏入下图所示，底色为白色。</p>'+
												'&lt;<p><img src="images/browser_set/browser_safari4.png"></p>'+
											'</div>'+
										'</div>'+
										'<h2 class="appui-helptext-fd fs32 fc-orange">知道了</h2>'+
									'</div>'+
								'</div>';
			$('body').append(notSupport);
			//alert('ok');
			if(bool == 1){
				$('#isPrivate1').show().height($(window).height());
				$('#helptext').show().css('margin-top',-$('#helptext').height()/2);
				if($('#helptext').height()>= Math.floor($('body').height()*0.70))
				{
					$('#helptext').find('.appui-helptext-bd').height($('#helptext').height() - $('.appui-helptext-hd').height() - $('.appui-helptext-fd').height());
				}
				$('.appui-helptext-fd').click(function(e) {
					$('.js_dialog').hide();
					$('#helptext').hide();
					$('#helptext').css({'margin-top':'0','height':'auto'});
				});	
			}	
		}
	}
}