// JavaScript Document
// 文字随屏幕大小变化
////////////////////
(function (doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function () {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            docEl.style.fontSize = 10 * (clientWidth / 320) + 'px';
        };

    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
    recalc();
})(document, window);
// //////////////////
//锁定屏幕滑动
var canTouch=0;
document.addEventListener("touchmove",function(e){
	if(canTouch==0){
	e.preventDefault();
	e.stopPropagation();
	}
},false); 

//首页动画
function indexPlay(){
	$('.shouye').show();
	$('.shouye').addClass('fadeIn');
	setTimeout(function(){
		$('.shouye_txt').show();
		$('.click_tips').show();
		$('.shouye_txt').addClass('fadeIn');
		$('.click_tips').addClass('arrowTips');
		$('.shouye').removeClass('fadeIn');
		setTimeout(function(){
			$('.shouye_txt,.click_tips').removeClass('fadeIn');
			$('.click_tips').addClass('tishi');
		},1000)
	},800)
}
var zhouInt;
var picNum = 0;
var txtNum = 0;
var picInt;
var imgTop = 0;
var serverId='';
var imgnameco;
var imgguid;
$(function(){
	xkStat.button(1,'首页');
	//调整图片
	var reqAnimationFrame = (function () {
        return window[Hammer.prefixed(window, 'requestAnimationFrame')] || function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
    })();
 
 	 var el = document.querySelector(".imgBox");    //上传图片的位置
    var elin = document.querySelector(".upload_img img");   //这是图片
    //var elin2 = document.querySelector(".tx_img2");
    //var elin3 = document.querySelector(".tx_img3");
    //var elin4 = document.querySelector(".tx_img4");
    //var elin5 = document.querySelector(".tx_img5");
    //var elin6 = document.querySelector(".tx_img6");


   // var START_X = Math.round((window.innerWidth - el.offsetWidth) / 2);
   // var START_Y = Math.round((window.innerHeight - el.offsetHeight) / 2); 
	var START_X = 0;
    var START_Y = 0; 
    var ticking = false;
    var transform;
    var timer;

    var mc = new Hammer.Manager(el);

    mc.add(new Hammer.Pan({ threshold: 0, pointers: 0 }));

    mc.add(new Hammer.Swipe()).recognizeWith(mc.get('pan'));
    mc.add(new Hammer.Rotate({ threshold: 0 })).recognizeWith(mc.get('pan'));
    mc.add(new Hammer.Pinch({ threshold: 0 })).recognizeWith([mc.get('pan'), mc.get('rotate')]);

	
    mc.on("panstart panmove", onPan);//移动
    mc.on("rotatestart rotatemove", onRotate);//旋转
    mc.on("pinchstart pinchmove", onPinch);//放大缩小
	mc.on("panend",onPanend);//离开屏幕
	
	
	
	function onPanend(){
	//alert("likai");
	
	START_X=transform.translate.x;
	START_Y=transform.translate.y;
	
	}


    function resetElement() {
      //  el.className = 'animate';
        transform = {
            translate: { x: START_X, y: START_Y },
            scale: 1,
            angle: 0,
            rx: 0,
            ry: 0,
            rz: 0
        };

        requestElementUpdate();

    }

    function updateElementTransform() {
    	transform.rx=0;
    	transform.ry=0;
    	transform.rz=0;
        var value = [
				'translate3d(' + transform.translate.x + 'px, ' + transform.translate.y + 'px, 0)',
				'scale(' + transform.scale + ', ' + transform.scale + ')',
				'rotate3d('+ transform.rx +','+ transform.ry +','+ transform.rz +','+  transform.angle + 'deg)'
        ];

        value = value.join(" ");
       // el.textContent = value;
        $(".upload_img img").css('position','relative');
		$(".img1 img").css('left',transform.translate.x);
		$(".img1 img").css('top',transform.translate.y);
		$(".img2 img").css('left',parseInt(transform.translate.x)*3);
		$(".img2 img").css('top',parseInt(transform.translate.y)*3);
		$(".upload_img img").css('width',transform.scale*100+'%');
        ticking = false;
		
		
    }


    function requestElementUpdate() {
        if(!ticking) {
	
            reqAnimationFrame(updateElementTransform);
			
            ticking = true;
        }else{
		
		}
    }

    function logEvent(str) {
        //log.insertBefore(document.createTextNode(str +"\n"), log.firstChild);
    }

	
	//滑动
    function onPan(ev) {



				//alert(NOW_X);
       // el.className = '';
        transform.translate = {
            x: START_X + ev.deltaX,
            y: START_Y + ev.deltaY
        };

        requestElementUpdate();
        
    }

    var initScale = 1;
	
	
	//放大缩小
    function onPinch(ev) {
        if(ev.type == 'pinchstart') {
            initScale = transform.scale || 1;
        }

       // el.className = '';
        transform.scale = initScale * ev.scale;

        requestElementUpdate();
      
    }

    var initAngle = 0;
	
	//旋转
    function onRotate(ev) {
        if(ev.type == 'rotatestart') {
            initAngle = transform.angle || 0;
        }

     //   el.className = '';
        transform.rz = 1;
        transform.angle = initAngle + ev.rotation;
        requestElementUpdate();
       
    }

    resetElement();


    //好友进来后查看分享者分享的图片
		
	$('.result_btn3').click(function(){
		$('.result_wap').hide();
		// $('.result_wap').hide();
	})	
	//首页摇杆
	$('.click_tips,.open_btn').click(function(){
		$('.open_btn,.click_tips').hide();
		$('.open_btn_on').show();
		$('.chilun1,.chilun2,.chilun3,.chilun4,.chilun5,.fxp').addClass('nizuan');
		$('.point').addClass('zuan2');
		setTimeout(function(){
			$('.shouye').addClass('fangda');
			setTimeout(function(){
				$('.shouye').hide();
				$('.photo_wap').show();
				$('.photo_wap').addClass('fadeIn');
				setTimeout(function(){
					$('.longPic_txt1').show();
					$('.longPic_txt1').addClass('fadeInLeft');	
				},1000)
			},1500)
		},3800)
	})

	//照片轮播摇杆
	$('.yaogan').click(function(){
		picNum++;
		var imgH = $('.longPic').height();
		document.getElementById('picAudio').play();
		if(picNum==4){
			document.getElementById('picAudio').pause();
			$('.longPic').fadeOut(2000);
			$('.longPic_zhe2,.longPic_zhe').hide();
			$('.upload_bg,.upload_box').show();
			$('.upload_bg').addClass('fadeIn2');
			$('.yaogan2,.yaogan,.click_tips2').hide();
			$('.upload_yaogan').show();
			setTimeout(function(){
				$('.upload_txt1').show();
				$('.upload_txt1').addClass('fadeIn3');
				setTimeout(function(){
					$('.upload_txt2').show();
					$('.upload_txt2').addClass('fadeIn3');
					setTimeout(function(){
						$('.upload_txt3').show();
						$('.upload_txt3').addClass('fadeIn3');
						setTimeout(function(){
							$('.upload_btn').show();
							$('.upload_btn').addClass('fadeIn3');
						},1500)
					},1500)
				},1500)
			},1500)
		}else{
			$('.click_tips2,.yaogan').hide();
			$('.click_tips2 img').attr('src','../static/sgimg/click_tips'+picNum+'.png');
			$('.yaogan2').show();
			$('.xuanpan').addClass('zuan');
			zhouInt = setInterval('gunZhou()',200);
			$('.longPic').animate({top:-imgH*0.215*picNum},3000,'linear',showPic2());
		}
	})
	
	//异步上传图片
    // $("#avatar").on("change", function () {
     //    var obj = document.getElementById("avatar");
     //    var length = obj.files.length;
     //    if(length != 0){
     //        var files = $('#avatar').prop('files');
     //        var data = new FormData();
     //        data.append('avatar', files[0]);
     //        console.log(files);
     //        console.log(data);
     //        $.ajax({
     //            url: '/api/upload',
     //            type: 'POST',
     //            data: data,
     //            cache: false,
     //            processData: false,
     //            contentType: false
     //        });
    //
	// 	}
    // });


	$('#upload_btn').click(function(){


		//这里处理上传图片，图片上传成功后回调通知已经上传成功图片。等待下一步合成
		// $('.click_tips2').hide();
		// $('.upload_txt').hide();
		// $('.wait').show();
		// serverId = 1;

		//上传图片以后，隐藏前面的，然后显示已经上传的图片，同时出现选择相框功能
		// setTimeout(function(){
		// 	$('.wait').hide();
		// 	$('.upload_box').hide();
		// 	$('.kuangBox,.upload_tips').show();
		// 	$('.upload_img img').attr('src','http://www.emifo.top/small.png');
		// },3000)
		
		// wx.chooseImage({
		// 	count: 1, // 默认9
		// 	sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
		// 	sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
		// 	success: function (res) {
		// 		localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
						
		// 		if(localIds.length==0){
		// 			return false;
		// 		}else if(localIds.length>1){
		// 			alert('只允许选择一张图片！')
		// 		}else{
		// 			 wx.uploadImage({
		// 				localId: localIds[0], // 需要上传的图片的本地ID，由chooseImage接口获得
		// 				isShowProgressTips: 1, // 默认为1，显示进度提示
		// 				success: function (res) {
		// 					$('.click_tips2').hide();

		// 					$('.wait').show();
		// 					$('.wait .zi').html('上传中');
		// 					serverId = 1;  // 返回图片的服务器端ID
		// 					WxDownload(serverId,openid,access_token)						
		// 				}
		// 			});
		// 		}
							
		// 	}
		// });		
		

	})

	//点击生成图片【就是选好 这个按钮】
	$('.upload_yaogan').click(function(){
		$('.result_btn3').hide();
		//获取返回成功的值：1，然后进行合成操作
        var img2 = $('.img2 img').attr("src");
		if(img2 == ''){
            $('.wait').show();
            setTimeout(function(){
                $('.wait').hide();
            },1000)
        }else{
			// 判断
            $('.wait').show();

					html2canvas(document.getElementById('makeImg'), {
						allowTaint: true,
						taintTest: false,
						onrendered: function (canvas) {
							//生成base64图片数据
							var dataUrl = canvas.toDataURL();
							var csrf = $('input[name="csrf"]').val();
							var openid = $('input[name="openid"]').val();
							// $('.shengcheng').remove();
							//处理iOS图片上传图片方向问题
							$('.wait').hide();
							$('.result_wap').show();
							$('.photo_wap').hide();

							$('.click_tips2').hide();

							$('.result_btn1').show();
							$('.result_btn2').show();
							$('.makeResult img').attr('src', dataUrl);

							//处理iOS图片上传图片方向问题
						}
					});




             //下面的if中的括号
		}
		
	})



	$('.result_btn1').click(function(){
		xkStat.button(5,'更多惊喜');
		window.location.href='https://www.baidu.com';
	})
	//分享
	$('.result_btn2').click(function(){
		$('.share_wap').show();
		
	})
	$('.share_wap').click(function(){
		$('.share_wap').hide();
	})
})


//图片滚动
function showPic2(){
	setTimeout(function(){
		document.getElementById('picAudio').pause();
		$('.xuanpan').removeClass('zuan');
		clearInterval(zhouInt);
		txtNum = parseInt(picNum+1);
		$('.longPic_txt'+txtNum).show();
		if(picNum==3){
			$('.longPic_txt'+txtNum).addClass('fadeInLeft');
		}else{
			$('.longPic_txt'+txtNum).addClass('fadeInRight');
		}
		$('.yaogan2').hide();
		$('.yaogan').show();
		setTimeout(function(){
			$('.click_tips2').show();
		},1500)
		
	},3000)	
}


//选择相框
var boxStyle = 1;
function chooseBox(a){
	boxStyle = a;
	$('.model img').attr('src','../static/sgimg/logo_model'+boxStyle+'.png');
}
//滚轴动画
var zhouNum = 1;
function gunZhou(){
	$('.gunzhou img').attr('src','../static/sgimg/gunzhou'+zhouNum+'.png');
	zhouNum++;
	if(zhouNum==3){
		zhouNum=1;
	}
}
//下载图片
function WxDownload(serverId,openid,access_token){
	// $.ajax({
	// 	type: "POST", //用POST方式传输
	// 	dataType: "JSON", //数据格式:JSON
	// 	data:{serverId:serverId},
	// 	async : false,
	// 	url: '', //目标地址
	// 	success:function(msg){
	// 		kStat.button(2,'上传图片');
	// 		$('.wait').hide();
	// 		$('.upload_box').hide();
	// 		$('.kuangBox,.upload_tips').show();		
	// 		$('.upload_img img').attr('src','http://www.emifo.top/small.png');
	// 	}
	// })
}


// var img2 = $('.img2 img').attr();
// alert(img2);

//合成中，等待图片
// $('.wait').show();
//测试使用，在三秒中之后默认合成成功，返回图片，跳转到下一个页面，生产环境中进行回调通知合成成功
// 		setTimeout(function(){
//                    $('.wait').hide();
// 					$('.result_wap').show();
// 					$('.photo_wap').hide();
//
// 					$('.click_tips2').hide();
//
// 					$('.result_btn1').show();
// 					$('.result_btn2').show();
// 					$('.makeResult img').attr('src','http://www.emifo.top/small.png');
// 			},3000)


//html2canvas 用来截屏
// html2canvas($("#makeImg"), {


// html2canvas(document.getElementById('makeImg'), {
//     allowTaint: true,
// taintTest: false,
//     onrendered: function (canvas) {
// 	//生成base64图片数据
// 	var dataUrl = canvas.toDataURL();
// 	var csrf = $('input[name="csrf"]').val();
// 	var openid = $('input[name="openid"]').val();
// 	// $('.shengcheng').remove();
// 	//处理iOS图片上传图片方向问题
//         alert('测试2');
//         $('.wait').hide();
//         $('.result_wap').show();
//         $('.photo_wap').hide();
//
//         $('.click_tips2').hide();
//
//         $('.result_btn1').show();
//         $('.result_btn2').show();
//         $('.makeResult img').attr('src', dataUrl);
// $('.makeResult img2').attr('src', dataUrl);

//处理iOS图片上传图片方向问题


//上传图片进行合成
// $.ajax({
// 	type: "POST",
// 	dataType: "JSON",
// 	async : false,
// 	data:{basedata:dataUrl,_csrf:csrf,openid:openid},
// 	url: 'getdata.html',
// 	success:function(msg){
// 		// 合成之后，提供下载显示页面
// 			$('.wait').hide();
// 			$('.result_wap').show();
// 			$('.photo_wap').hide();
//
// 			$('.click_tips2').hide();
//
// 			$('.result_btn1').show();
// 			$('.result_btn2').show();
// 			$('.makeResult img').attr('src', msg.data);
//
// 	},
// 	error: function(XMLHttpRequest, textStatus, errorThrown){
//
// 	 }
//
// })

// }