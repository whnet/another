<?php

use yii\helpers\Html;
use yii\grid\GridView;

$this->params['breadcrumbs'][] = $this->title;
?>
<link type="text/css" rel="stylesheet" href="../bdt/css/bindphone.css" />

<script type="text/javascript" src="../bdt/js/myset_bind_phone.js"></script>
<body class=" bg-greyf5" >
<div id="container" class="container bind-phone-container">
    <div id="page">
        <!--页面导航栏-->
        <div class="page__hd bg-white b-b-grey fc-black scrollhd">
            <div class="statebar">
                <a class="nav-act left-act" onclick="goBack();"><img src="../bdt/images/top_nav_back.png"></a>
                <h2 class="fs40">绑定手机</h2>
            </div>
        </div>
        <div class="page__bd scrollbd">
            <!---------------占位空间---------------->
            <div class="top-space1"></div>
            <!-------------绑定手机号----------------------->
            <div class="bind-phone">
                <!--图标状态-->
                <div class="bind-state mt30" id="bindPhoneView">
                    <i class="mt30"><img id="bind-state-icon" src="../bdt/images/phone.png"></i>
                    <h2 class="fs32 fc-black mt10">绑定的手机号:<span></span></h2>
                </div>
                <!--更换手机号按钮-->
                <a class="bind-phone-btn fs32 bg-greye5 fc-white" id="bind-phone-btn1" onclick="changePhone()" style="display: none;">解绑手机号</a>
                <!--绑定手机号表单-->
                <?php if($mobile):?>
               <!--验证旧的手机号码-->
                <div class="bind-phone-input mt10"  style="display: block;">


                    <div class="bp_verification  bg-white mt10">
                        <input id="bind-phone" type="text" class="fs32 fc-grey666 bc-grey" name="bind_code" placeholder="手机号" onfocus="$(this).removeClass('bc-grey').addClass('bc-blue');" onblur="$(this).removeClass('bc-blue').addClass('bc-grey');" >
                        <span class="bc-grey">
								<i><img src="../bdt/images/phonenum.png"></i>
							</span>
                    </div>

                    <div class="bp_verification  bg-white mt10">
                        <input id="bind-code" type="text" class="fs32 fc-grey666 bc-grey" name="bind_code" placeholder="验证码" onfocus="$(this).removeClass('bc-grey').addClass('bc-blue');" onblur="$(this).removeClass('bc-blue').addClass('bc-grey');">
                        <span class="bc-grey">
								<i><img src="../bdt/images/verification.png"></i>
							</span>
                        <input class="fs32 fc-blue bc-blue" type="button" value="发送验证码" id="btnSendCode">
                    </div>


                </div>
                <!--旧的手机号码-->
                <?php endif;?>

                <a class="bind-phone-btn fs32 bg-blue fc-white"  onclick="bindCurrent()" style="display: block;">确认</a>
            </div>
        </div>
    </div>
</div>



</body>