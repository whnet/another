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
                    <i class="login-module-photo"><img src="<?=$user['headimgurl']?>"></i>
                    <!--正常登录输入信息-->
                    <!--快速登录-->
                    <div class="login-module-input" style="display:block;" id="login-module2">
                        <div>
                            <input type="tel" class="login-phone-input b-b-blue fc-black fs30" name="login-name" id="login-phone" placeholder="手机号" onblur="$(this).css('opacity','0.5')" onfocus="$(this).css('opacity','1')">
                            <p id="phoneError" class="fc-orange fs24" style="display:none;"></p>
                            <input class="verifycode-input bc-greyabc fc-greyabc fs28" type="button" value="发送验证码" id="btnSendCode">
                        </div>
                        <div class="mt30">
                            <input class="login-code-input b-b-blue fc-black fs30" name="login-code" id="login-code" placeholder="动态验证码" onblur="$(this).css('opacity','0.5')" onfocus="$(this).css('opacity','1')">
                            <p id="codeError" class="fc-orange fs24" style="display:none;"></p>
                        </div>
                        <a class="bg-blue fs34 fc-white mt40" id="bindphone">绑定手机</a>
                    </div>
                    <input type="hidden" name="openid" value="<?=$user['openid']?>"?>
                    <input type="hidden" name="photo" value="<?=$user['headimgurl']?>"?>
                    <input type="hidden" name="nickname" value="<?=$user['nickname']?>"?>
                    <script>
                        //发送验证码

                      //登录绑定
                        $("#bindphone").click(function() {
                            var phone = $('#login-phone').val();
                            var code = $('#login-code').val();
                            var nickname = $('input[name="nickname"]').val();
                            var openid = $('input[name="openid"]').val();
                            var photo = $('input[name="photo"]').val();
                            var csrf = $('input[name="csrf"]').val();
                            if(phone && openid){
                                bindphone(phone,openid,photo,code,nickname,csrf);
                            }

                        });
                        function bindphone(phone,openid,photo,code,nickname,csrf){
                            $.ajax({
                                type: "POST",
                                url: "/members/dologin.html",
                                data: {
                                    phone:phone,
                                    openid:openid,
                                    photo:photo,
                                    code:code,
                                    nickname:nickname,
                                    _csrf:csrf
                                },
                                dataType: "json",
                                success: function(data){
                                    if(data.result == 'success'){
                                            dataLoading("登录中...");
                                            window.location.href="/members/index.html";
                                    }else{
                                        dataLoading("验证失败，请重新登录...");
                                        location.reload();
                                    }

                                }
                            });
                        }
                    </script>
                </div>

            </div>
        </div>
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