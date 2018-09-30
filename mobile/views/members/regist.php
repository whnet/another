<?php

use yii\helpers\Html;
use yii\grid\GridView;

$this->params['breadcrumbs'][] = $this->title;
?>
<script type="text/javascript" src="../bdt/js/regist.js"></script>
<link type="text/css" rel="stylesheet" href="../bdt/css/user.min.css">
<body class="regist-body bg-white">
<div id="container" class="container login-regist-container">
    <div id="page">
        <div class="page__bd scrollbd">
            <div class="regist-con">
                <!--注册模块-->
                <div class="regist-module">
                    <!--头像-->
                    <i class="regist-module-logo fc-black456"><!--<img src="../bdt/images/logo1.png" />-->用户注册</i>

                    <!--注册输入信息 START-->
                    <div class="regist-module-input mt40">
                        <div>
                            <input type="text" class="regist-name-input b-b-blue fc-black fs30" name="login-name" id="login-name" placeholder="请输入您的昵称" onblur="$(this).css('opacity','0.5')" onfocus="$(this).css('opacity','1')">
                            <p id="nicknameError" class="fc-orange fs24" style="display:none;"></p>
                        </div>
                        <div class="mt30">
                            <input type="password" class="regist-pass-input b-b-blue fc-black fs30" name="login-pass" id="login-pass" placeholder="请输入不少于六位数的密码" onblur="$(this).css('opacity','0.5')" onfocus="$(this).css('opacity','1')">
                            <p id="passwardError" class="fc-orange fs24" style="display:none;"></p>
                        </div>
                        <div class="mt30">
                            <input type="text" class="regist-phone-input  b-b-blue fc-black fs30" name="login-name" id="login-phone" placeholder="手机号" onblur="$(this).css('opacity','0.5')" onfocus="$(this).css('opacity','1')">
                            <p id="phoneError" class="fc-orange fs24" style="display:none;"></p>
                            <input class="verifycode-input bc-greyabc fc-greyabc fs28" id="btnSendCode" type="button" value="发送验证码">
                        </div>
                        <div class="mt30">
                            <input class="regist-code-input b-b-blue fc-black fs30" name="login-pass" id="login-code" placeholder="动态验证码" onblur="$(this).css('opacity','0.5')" onfocus="$(this).css('opacity','1')">
                            <p id="codeError" class="fc-orange fs24" style="display:none;"></p>
                        </div>
                        <p class=" mt20">
                            <label class="fs24 fc-greyabc">
                                <input id="aggre" type="checkbox" class="mr5" checked="true">我已阅读并同意
                            </label>
                            <a class="regist_tips fc-orange fs24">《用户协议》</a>
                        </p>
                        <a id="regist" class="bg-blue fs34 fc-white mt5">立即注册</a>
                    </div>
                    <script>
                        $("#regist").click(function() {
                            var nickname = $('#login-name').val();
                            var pwd = $('#login-pass').val();
                            var phone = $('#login-phone').val();
                            var btnSendCode = $('#btnSendCode').val();
                            var code = $('#login-code').val();
                            var csrf = $('input[name="csrf"]').val();
                            if(!nickname){
                                dataLoading('请输入昵称');
                                setTimeout("clearToastDialog();",300);
                                return false;
                            }
                            if(!pwd){
                                dataLoading('密码不能为空');
                                setTimeout("clearToastDialog();",300);
                                return false;
                            }
                            if(!phone){
                                dataLoading('手机号不能为空');
                                setTimeout("clearToastDialog();",300);
                                return false;
                            }
                            if(!code){
                                dataLoading('验证码不能为空');
                                setTimeout("clearToastDialog();",300);
                                return false;
                            }
                            if(nickname && pwd && phone){
                                $.ajax({
                                    type: "POST",
                                    url: "/members/dologin.html",
                                    data: {
                                        "nickname":nickname,
                                        "pwd":pwd,
                                        "phone":phone,
                                        "code":code,
                                        "_csrf":csrf
                                    },
                                    dataType: "json",
                                    success: function(data){
                                        if(data.result == 'success'){
                                            dataLoading("注册成功...");
                                            window.location.href="/members/index.html";
                                        }else{
                                            dataLoading(data.msg);
                                            location.reload();
                                        }

                                    }
                                });

                            }else{


                            }


                        })

                    </script>
                    <!--注册输入信息 END-->

                    <!--忘记密码和注册入口-->
                    <div class="regist-module-orther mt10">
                        <a class="fc-blue fs24" id="login-mark" href="login.html">已有账号，立即登录！</a>
                        <a class="fc-blue fs24" href="index.html">稍后注册</a>
                    </div>
                </div>
                <!--第三方登入-->
            </div>
        </div>
    </div>
</div>
<!--弹出的解释说明-->

<script>
    $('.regist_tips').click(function(e) {
        setTimeout(function() {
            $('.js_dialog').show();
            $('#helptext').show();
            //alert(Math.floor($('body').height()*0.70));
            $('#helptext').css('margin-top', -$('#helptext').height() / 2);
            if ($('#helptext').height() >= Math.floor($('body').height() * 0.70)) {
                $('#helptext').find('.appui-helptext-bd').height($('#helptext').height() - $('.appui-helptext-hd').height() - $('.appui-helptext-fd').height());
            }
        }, 1000);
    });

    $('.appui-helptext-fd').click(function(e) {
        $('.js_dialog').hide();
        $('#helptext').hide();
        $('#helptext').css({
            'margin-top': '0',
            'height': 'auto'
        });
    });
</script>



</body>