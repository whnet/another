<?php
use yii\helpers\Html;
use yii\grid\GridView;
$this->params['breadcrumbs'][] = $this->title;
?>
<script type="text/javascript" src="../bdt/js/personal_data_name_edit.js"></script>
<link type="text/css" rel="stylesheet" href="../bdt/css/user.min.css">
<body class="bg-white">
<div id="container" class="container personaldata-container">
    <div id="page">
        <!--页面导航栏-->
        <div class="page__hd bg-white fc-black b-b-grey scrollhd">
            <div class="statebar">
                <a class="nav-act left-act" onclick="goBack();"><img src="../bdt/images/nav_icon_back1.png"></a>
                <h2 id="title" class="fs34">编辑昵称</h2>
                <a class="but_save fs28 fc-black" id="saveModify">保存</a>
                <input type="hidden" name="csrf" value="<?= Yii::$app->request->csrfToken ?>" >
            </div>
        </div>
        <!--页面主体-->
        <div class="page__bd scrollbd">
            <!--占位空间-->
            <div class="top-space1"></div>
            <!--编辑区域-->
            <div class="text-edit-box bg-white mt20">
                <input id="textValue" type="text" class="text-edit-input b-b-greyabc fc-black fs28" onblur="$(this).removeClass('b-b-blue').addClass('b-b-greyabc');" maxlength="" onfocus="$(this).removeClass('b-b-greyabc').addClass('b-b-blue');" placeholder="<?=$_GET['value']?>">
                <p class="text-edit-tips fs24 fc-greyabc mt5">真实名字可以让你的朋友更加容易找到你。</p>
            </div>
        </div>
    </div>
</div>



</body>