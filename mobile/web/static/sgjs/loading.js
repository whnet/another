
var loadPageImg = ['load_lun1.png',
'load_lun2.png','chilun1.png',
'chilun2.png','chilun3.png','chilun4.png','chilun5.png',
'click_tips.png','cover.png','fxp.png','gunzhou1.png',
'gunzhou2.png','kuang_txt.png',
'logo.png','longPic.png','longPic_txt1.png',
'longPic_txt2.png','longPic_txt3.png','longPic_txt4.png',
'longPic_zhe.png','longPic_zhe2.png',
'model1.png','model2.png',
'model3.png','model4.png','muban.jpg','open_btn.png',
'open_btn_on.png','point.png','result_bg.jpg','result_btn1.png',
'result_btn2.png','result_btn3.png','share_txt.png','shigj.png',
'shouye_bg.jpg','shouye_txt.png','small_model.png','title.png','title_lun.png',
'uoload_btn.png','upload_bg.png','upload_txt.png','xuanpan.png','yaogan.png','yaogan2.png',
'click_tips0.png','click_tips1.png','click_tips2.png','click_tips3.png',
'click_tips4.png'];
loadImages(loadPageImg,loadPageok,1);



//图片预加载方法
function loadImages(sources, callback,state){  
    var count = 0,  
        images ={}; 
	var imgNum = sources.length;
    for(src in sources){
        images[src] = new Image();  
        images[src].onload = function(){
            count++;
			var aa=parseInt(count/imgNum*100);
			if(state)percent(aa);		
            if(count >= imgNum){  
              callback();  
            } 
        }  
        images[src].src = '../static/sgimg/'+sources[src];
    }
} 

function percent(baifen){
	$('.load_per').text(baifen+'%');
	
	//console.log(baifen);
}

function loadPageok(){
	$(".loading").hide();
	indexPlay();
	//document.getElementById('iPhone').play();
	//document.addEventListener("WeixinJSBridgeReady", function () {
	//  document.getElementById('iPhone').play();
	//}, false);

	var iheight = window.screen.height;
	var iwidth = window.screen.width;
	if(iheight == 667||iheight==736){
		//i6尺寸

	}else if(iheight == 480){
		//i4尺寸

	}else{
		if(iheight/iwidth>1.575){
			//屏幕长的机器
		}
	}
	
}






