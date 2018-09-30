<?php

use yii\helpers\Html;
use yii\grid\GridView;

$this->params['breadcrumbs'][] = $this->title;
?>
<body class="login-body bg-white">
<link type="text/css" rel="stylesheet" href="../bdt/css/user.min.css">
<script type="text/javascript" src="../bdt/js/login.js"></script>
<div id="container" class="container login-regist-container" style="">
    <div id="page">
        <div class="page__bd scrollbd">
            <div class="login-con">
                <!--登录模块-->
                <div class="login-module">
                    <!--头像-->
                    <i class="login-module-photo"><img src="../bdt/images/default_avatar.png"></i>
                    <!--正常登录输入信息-->
                <!--  普通登录-->
                    <div class="login-module-input" style="display: block;" id="login-module1">
                        <div>
                            <input type="text" class="login-id-input b-b-blue fc-black fs30" name="login-name" id="login-phone-email" placeholder="手机号" onblur="$(this).css('opacity','0.5')" onfocus="$(this).css('opacity','1')">
                            <p id="phone-emailError" class="fc-orange fs24" style="display:none;"></p>
                        </div>
                        <div class="mt30">
                            <input type="password" class="login-pass-input b-b-blue fc-black fs30" name="login-pass" id="login-pass" placeholder="密码" onblur="$(this).css('opacity','0.5')" onfocus="$(this).css('opacity','1')">
<!--                            <a class="fs28 fc-greyabc bc-greyabc" id="forgetPassword">忘记密码</a>-->
                            <p id="passwordError" class="fc-orange fs24" style="display:none;"></p>
                        </div>
                        <a id="normalLoginBtn" class="bg-blue fs34 fc-white mt40">登录</a>
                    </div>
                    <!--  普通登录 END-->
                    <!--快速登录-->
                    <div class="login-module-input" style="display:none;" id="login-module2">
                        <div>
                            <input type="tel" class="login-phone-input b-b-blue fc-black fs30" name="login-name" id="login-phone" placeholder="手机号" onblur="$(this).css('opacity','0.5')" onfocus="$(this).css('opacity','1')">
                            <p id="phoneError" class="fc-orange fs24" style="display:none;"></p>
                            <input class="verifycode-input bc-greyabc fc-greyabc fs28" type="button" value="发送验证码" id="btnSendCode">
                        </div>
                        <div class="mt30">
                            <input class="login-code-input b-b-blue fc-black fs30" name="login-name" id="login-code" placeholder="动态验证码" onblur="$(this).css('opacity','0.5')" onfocus="$(this).css('opacity','1')">
                            <p id="codeError" class="fc-orange fs24" style="display:none;"></p>
                        </div>
                        <a class="bg-blue fs34 fc-white mt40" id="loginBtn">登录</a>
                    </div>

                    <script>
                        $("#normalLoginBtn").click(function() {
                            var phone = $('#login-phone-email').val();
                            var pwd = $('#login-pass').val();
                            var csrf = $('input[name="csrf"]').val();
                            if(phone && pwd){
                                $.ajax({
                                    type: "POST",
                                    url: "login.html",
                                    data: {phone:phone, pwd:pwd, _csrf:csrf},
                                    dataType: "json",
                                    success: function(data){
                                        if(data){
                                            if(data.result == 'success'){
                                                dataLoading("登录中...");
                                                window.location.href="/members/index.html";
                                            }
                                        }else{
                                            dataLoading("验证失败，请重新登录...");
                                            location.reload();
                                        }

                                    }
                                });

                            }

                        })
                    </script>
                    <!--忘记密码和注册入口-->
                    <div class="login-module-orther mt10">
                        <a class="fc-blue fs24" href="regist.html">立即注册</a>
                        <a class="fc-blue fs24" id="quickLogin" style="">快速登录</a>
                        <a class="fc-blue fs24" id="normalLogin" style="display: none;">普通登录</a>
                    </div>
                </div>
                <!--第三方登入-->
<!--                <div class="third-access" style="display:block;">-->
<!--                    <h3 class="fs28 fc-greyabc">-->
<!--                        <hr class="bg-greyabc">-->
<!--                        第三方登入-->
<!--                        <hr class="bg-greyabc">-->
<!--                    </h3>-->
<!--                    <div class="mt10">-->
<!--                        <a href="/weixinAuth.html"><img src="../bdt/images/weixin_green.png"></a>-->
<!--                    </div>-->
<!--                </div>-->
            </div>
    </div>
</div>

<div class="webapp-login"  style="display:block;">
    <img src="../bdt/images/login_bg2.png">
    <a class="wechat-login fs32" id="webWXLogin"><img src="../bdt/images/login_weixin2.png">微信登录</a>
    <a class="phone-login fs32" id="otherLogin"><img src="../bdt/images/login_phone2.png">手机登录</a>
</div>

<script>
    if($('body').width()<=320 && $('body').height()<=480){
        $('.webapp-login>img').css('top','-3rem');
    }

    else if($('body').width()<=320 && $('body').height()<=568 && $('body').height()>480){
        $('.webapp-login>img').css('top','0');
    }
</script>

</body>