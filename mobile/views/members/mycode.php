<html style="font-size: 100px;">
<head lang="en">
    <meta charset="UTF-8" />
    <meta name="csrf-param" content="_csrf" />
    <meta name="csrf-token" content="xb7ckOYGzHbGHA5kSxDaYPMatN5If-m8CCdLEUj3Rtu7TC-IJ4vPA1kkN-TtB29YGd_CzL59jERdEinz47Ay6w==" />
    <script src="https://hm.baidu.com/hm.js?4aabe66e3d70e61921029934dacd9230"></script>
    <script type="text/javascript" src="http://res.wx.qq.com/open/js/jweixin-1.2.0.js"></script>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
    <link href="/static/css/bootstrap.min.css" rel="stylesheet" position="1" />
    <link href="/static/layui/css/layui.css" rel="stylesheet" position="1" />
    <link href="/static/layui/css/newlayui.css" rel="stylesheet" position="1" />
    <link href="/static/css/base.css" rel="stylesheet" />
    <link href="/static/css/common.css" rel="stylesheet" />
    <link href="/static/css/newhuiyuan.css" rel="stylesheet" 0="frontend\assets\AppAsset" />
    <link href="/assets/b1a1dcc5/css/upload.css" rel="stylesheet" 0="frontend\assets\AppAsset" />
    <link href="/static/css/edit.css" rel="stylesheet" 0="frontend\assets\AppAsset" />
    <link href="/static/css/fileinput.css" rel="stylesheet" 0="frontend\assets\AppAsset" />
    <link href="/assets/fe35e85e/css/upload.css" rel="stylesheet" />
    <link href="/static/css/nav.css" rel="stylesheet" 0="frontend\assets\AppAsset" />
    <script src="/static/js/jquery-2.1.3.min.js"></script>
    <script src="/static/js/swiper-3.4.3.min.js"></script>
    <script src="/static/layui/layui.js"></script>
    <script src="/static/js/bootstrap.min.js"></script>
    <script src="/static/js/common.js"></script>
    <script src="/static/Screenshotsjs/html2canvas.js" type="text/javascript"></script>
</head>
<body mpa-version="5.1.7" mpa-extension-id="ibefaeehajgcpooopoegkifhgecigeeg">
    <div class=" container">
        <div class="conter">
                <!--我的邀请卡-->
                <div class="prove invite" id="inviteCard" style="display: block;">

                </div>
                <!--我的邀请卡END-->
                    <div id="morebtn" style="color:red;text-align:right;margin-top:5px;cursor:pointer;">
                        加载更多
                    </div>
                </div>
                <!--我的分享结束-->
            </div>
        </div>

<script>
    <!--二维码的定位-->
    $(function() {
        var screen_width = document.documentElement.clientWidth;
        console.log(screen_width)
        //判断是否大于720，插入不同样式
        if (screen_width < 668) {
            // alert(1)
            var width = $("#inviteCard").width();
            var Ewidth=$(".ewmImg").width();
            console.log(width+"px");
            left=parseInt(width-Ewidth+6)/2+"px";
            console.log(left)
            $(".ewmImg").css("left",left);

        }
    })


</script>
<script>
    $(function(){
        var str = $('#inviteCard');
        html2canvas([str. get(0)], {
            onrendered: function(canvas) {
                var image = canvas.toDataURL("image/png");
                var pHtml = "<img src=" + image + " id='codeimg'/>";
                $('#inviteCard').html(pHtml);
            }
        });
        $("#invite").on("click",function(){
            $("#codeimg").css("display","inline-block");
        })
        //添加认证资格
        var uprule="";
        uprule+='<p style="color:#999999;line-height:22px;" class="rule">'+'律师认证请上传律师资格证正反面；公司认证请上传营业执照；用户认证请上传身份证正反面。'+'</p>';
        $(".prove .field-members-dataone .per_upload_text").append(uprule);
        window.onload = function()
        {
            var $li = $('.conter_left li');
            var $ul = $('.conter_right>div');
            $li.click(function(){
                var $this = $(this);
                var $t = $this.index();
                $this.addClass('firstli').siblings().removeClass("firstli");
                $ul.css('display','none');
                $ul.eq($t).css('display','block');
            })
        }
    });
</script>
<!--查看更多的分享-->
<script>
    $ (function ($){
        $(".share-list").css({"height":"500px","overflow":'hidden'});
        var Height=$(".share-list").height();
        var btnHeight=$("#morebtn").height();
        var shareHeight=Height+btnHeight;
        if(shareHeight>500){
            $("#morebtn").css("display","block");
            $("#morebtn").click (function () {
                $(".share-list").css({"height":"auto"});
                $ (".share-list").children().show();
            });
        }
    });
</script>
<script>
    var _hmt = _hmt || [];
    (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?4aabe66e3d70e61921029934dacd9230";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(hm, s);
    })();
</script>


<script src="/assets/fe35e85e/js/upload.js"></script>
<script src="/assets/fe35e85e/js/upload-input.js"></script>
<div class="form_temp hide">
<form id="form_upfile" action="" method="post" enctype="multipart/form-data">
    <input id="upfile" class="file_upload hide" type="file" name="upfile" filetype="img" />
</form>
</div>
<script src="/assets/e0d623be/yii.activeForm.js"></script>
<script type="text/javascript">jQuery(document).ready(function () {
    jQuery('#w0').yiiActiveForm([], []);
    jQuery('#w1').yiiActiveForm([], []);
    jQuery('#w2').yiiActiveForm([], []);
});</script>

</body>
</html>