<?php
use yii\helpers\Html;
use yii\widgets\ActiveForm;

?>
<script type="text/javascript" src="../bdt/js/user_photo_edit.js"></script>
<link type="text/css" rel="stylesheet" href="../bdt/css/cropper.css">

<link type="text/css" rel="stylesheet" href="../bdt/css/user_photo_edit.css">
<link type="text/css" rel="stylesheet" href="../bdt/css/user.min.css" />
<script type="text/javascript" src="../bdt/js/jquery.cookie.js"></script>
<body>
<div id="container" class="container photo-edit-container">
    <div id="page">
        <!--页面导航栏-->
        <div class="page__hd bg-white fc-black b-b-grey scrollhd">
            <div class="statebar">
                <a class="nav-act left-act cancel-btn" onclick="goBack();">
                    <img src="../bdt/images/nav_icon_back1.png"></a>
                <a class="nav-act left-act cancel-btn" id="closeBtn" style="display:none;">
                    <img src="../bdt/images/nav_icon_close1.png"></a>
                <h2 class="fs34">头像</h2>
                <a class="but_save fs28 fc-black" id="changeImg">修改
                    <input id="picSelectBtn" class="filehidden" accept="image/*" type="file" name="picSelectBtn" onchange="cardChange('picSelectBtn');">
                </a>
                <a class="but_save fs28 fc-black sure-btn" id="sure-btn" style="display:none;">保存</a>
            </div>
        </div>
        <!--页面主体-->
        <div class="page__bd scrollbd">
            <!--编辑区域-->
            <div class="photo-edit-box bg-greyfa">
                <i class="photo-preview" style="height: 360px; margin-top: -180px;">
                    <?php if($user['photo']):?>
                    <img id="editPic" src="<?=$user['photo']?>"></i>
                <?php else:?>
                    <img id="editPic" src="../bdt/images/default_avatar.png"></i>
                <?php endif;?>
            </div>
            <!--占位空间-->
            <div class="bottom-space1"></div>
        </div>
    </div>
</div>
<div class="waitLoad" style="display:none;">
    <img src="../bdt/images/uploading1.gif">
</div>
<div class="waitUpload" style="display:none;">
    <img src="../bdt/images/uploading.gif">
</div>
<div class="upload-container bg-greyfa">
    <div class="row" style="height: 360px; margin-top: -180px;">
        <div class="col-md-9">
            <div class="img-container" id="img-container">
                <img src="../bdt/images/picture.jpg" alt="Picture" id="image" class="cropper-hidden">
            </div>
        </div>
    </div>
</div>




</body>