<?php

use yii\helpers\Html;
use yii\grid\GridView;

$this->params['breadcrumbs'][] = $this->title;
?>
<script type="text/javascript" src="../bdt/js/password_edit.js"></script>
<link type="text/css" rel="stylesheet" href="../bdt/css/user.min.css">
<body class="bg-white">
<div id="container" class="container password-edit-container">
    <div id="page">
        <!--页面导航栏-->
        <div class="page__hd bg-white b-b-grey fc-black scrollhd">
            <div class="statebar">
                <a class="nav-act left-act" onclick="goBack();"><img src="../bdt/images/nav_icon_back1.png"></a>
                <h2 class="fs34">修改密码</h2>
                <a class="but_save fs28 fc-black">保存</a>
            </div>
        </div>
        <!--页面主体-->
        <div class="page__bd scrollbd">
            <!--占位空间-->
            <div class="top-space1"></div>
            <!--编辑区域-->
            <div class="pass-edit-box bg-white mt10">
                <p class="pass-edit-tips fs24 fc-greyabc mt5">请设置密码。你可以用社区绑定的账号+密码登录，比如使用手机号+密码登录社区，更快捷。</p>
                <div class="mt20">
                    <span class="fs28 fc-grey678">原密码</span>
                    <input id="oldPasswordID" type="password" class="pass-edit-input b-b-grey fc-black fs28" onblur="$(this).removeClass('b-b-blue').addClass('b-b-grey');" onfocus="$(this).removeClass('b-b-greyabc').addClass('b-b-blue');" placeholder="请输入原密码">
                    <!--  <i class="edit-tipsok"></i> -->
                </div>
                <div class="mt10">
                    <span class="fs28 fc-grey678">新密码</span>
                    <input id="newPasswordID" type="password" class="pass-edit-input b-b-grey fc-black fs28" onblur="$(this).removeClass('b-b-blue').addClass('b-b-grey');" onfocus="$(this).removeClass('b-b-greyabc').addClass('b-b-blue');" placeholder="请输入新密码">
                    <!-- <i class="edit-tipsok"></i> -->
                </div>
                <div class="mt10">
                    <span class="fs28 fc-grey678">确认密码</span>
                    <input id="confirmPasswordID" type="password" class="pass-edit-input b-b-grey fc-black fs28" onblur="$(this).removeClass('b-b-blue').addClass('b-b-grey');" onfocus="$(this).removeClass('b-b-greyabc').addClass('b-b-blue');" placeholder="请确认新密码">
                    <!-- <p class="fs28 fc-orange">错误提示</p> -->
                    <!-- <i class="edit-tipssorry"></i> -->
                </div>
            </div>
            <input type="hidden" name="csrf" value="<?= Yii::$app->request->csrfToken ?>" >

            <!--占位空间-->
            <div class="bottom-space1"></div>
        </div>
    </div>
</div>



</body>
