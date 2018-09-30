<?php

use yii\helpers\Html;
use yii\grid\GridView;
use yii\helpers\Url;


?>
<link type="text/css" rel="stylesheet" href="../bdt/css/myqrcode.css" />
<script src="../bdt/js/html2canvas.js" type="text/javascript"></script>
<script src="https://cdn.bootcss.com/jquery.qrcode/1.0/jquery.qrcode.min.js"></script>
<body class="bg-white">
<div id="container" class="container" >
            <div class="page__hd fc-black scrollhd">
            <div class="statebar">
                <a class="nav-act left-act" onclick="goBack();">
                    <img src="../bdt/images/nav_icon_back.png"></a>
                <h2 class="fs34" style="display:none">我的二维码</h2>
            </div>
        </div>
              <div class="page__cd scrollbd" id="canvas" style="background:#00c3aa">
                    <img src="../bdt/images/mycodebg2.png" />
                <div class="myqrcode-info" id="qrcode">
                    <div class="info-left">
                        <div class="myqrcode-headpic">
                            <img id="headPic"  src="<?=$user['photo']?>"  style="width:80px;height:80px;position:absolute;top:0;left:0;"/>
                            <?php if($user['expert']['vip'] == 1):?>
                            <span><img src="../bdt/images/vip2.png"/></span>
                            <?php endif;?>
                        </div>
                        <div class="myqrcode-sharetext mt10 fs28 fc-orange">
                            <p>我已回答了<span><?=$count?></span>个问题</p>
                            <!--<p>微信扫码，来[律乎]向我提问</p>-->
                        </div>
                    </div>
                     <div class="info-right">
                         <div class="myqrcode-namesex"><span class="fs32 fc-black" ><?=$user['expert']['realname']?$user['expert']['realname']:$user['nickname']?></span></div>
                         <div class="myqrcode-title"><span class=" fc-black" ><?=$user['expert']['honor'];?></span></div>
                         <?php if($names):?>
                         <div class="myqrcode-label fc-black456" >
                             <?php foreach($names as $k=>$v):?>
                             <span class="label fs24"><?=$v?></span>
                             <?php endforeach;?>
                         </div>
                         <?php endif;?>
                         <div class="myqrcode-intro">
                             <p>个人简介</p>
                             <p><?=$user['expert']['des']?></p>
                         </div>
                         <div class="myqrode-prompt">长按图片,向我提问</div>
                   </div>
            </div>
        </div>
    <div>
    </div>
</div>
<!--<div class="bottom-space1"  onclick="base2image();">点击保存</div>-->
<img src="" id="testImg" style="position:fixed;top:0;left:0;z-index:100;"/>
<script>
        //这是网上的一张图片链接
    var url=$('#headPic').attr('src');
    getBase64(url)
        .then(function(base64){
            // base64Url = base64Url.replace(/\ +/g, "" );
            $('#headPic').attr('src',base64)
        },function(err){
            console.log(err);//打印异常信息
        });
    //传入图片路径，返回base64
    function getBase64(img){
        function getBase64Image(img,width,height) {//width、height调用时传入具体像素值，控制大小 ,不传则默认图像大小
            var canvas = document.createElement("canvas");
            canvas.width = width ? width : img.width;
            canvas.height = height ? height : img.height;

            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            var dataURL = canvas.toDataURL();
            return dataURL;
        }
        var image = new Image();
        image.crossOrigin = 'anonymous';
        image.src = img;
        var deferred=$.Deferred();
        if(img){
            image.onload =function (){
                deferred.resolve(getBase64Image(image));
            }
            return deferred.promise();
        }
    }
    // canvac2image
        dataLoading("图片正在生成中...");
    function base2image(){
        var ratio = window.devicePixelRatio * 0.5;
        html2canvas(document.querySelector("#canvas"),{
            scale:ratio,
        }).then(function(canvas) {
            dataURL =canvas.toDataURL("image/png");
            $('#testImg').attr('src',dataURL);
        });

    }
        setTimeout(base2image,1000);
    // 使用jq生成二维 http://www.jq22.com/jquery-info294
    $('#qrcode').qrcode({
        render: "canvas", //也可以替换为table
        width: 90,
        height: 90,
        text: "<?=$qrcodeurl?>"
    });
      //   function convertCanvasToImage(canvas) {
      // //新Image对象，可以理解为DOM
      //       var image = new Image();
      //       image.src = canvas.toDataURL("image/png");
      //       return image;
      //   }
      //   var mycanvas1=document.getElementsByTagName('canvas')[0];
      //
      //   var img=convertCanvasToImage(mycanvas1);
      //   $('#qrcode').append(img);
      //


    $(document).ready(function(){
        var height=$(".container").height();
        $(".myqrcode-info").css({"height":height+"px","width":"auto","margin":"0 auto"});
    });

</script>
</body>
