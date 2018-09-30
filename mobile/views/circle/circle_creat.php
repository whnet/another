<?php

use yii\helpers\Html;
use yii\grid\GridView;

$this->params['breadcrumbs'][] = $this->title;
?>

<link type="text/css" rel="stylesheet" href="../bdt/css/circle.css" />
<link type="text/css" rel="stylesheet" href="../bdt/css/user.min.css">
<link type="text/css" rel="stylesheet" href="../bdt/css/cropper.css">
<script type="text/javascript" src="../bdt/js/cropper.js"></script>
<script type="text/javascript" src="../bdt/js/exif.js"></script>
<script type="text/javascript" src="../bdt/js/picPop.js"></script>
<script type="text/javascript" src="../bdt/js/circle_creat.js"></script>

<body style="overflow: hidden;">
<!--创建圈子类型选择-->
<div id="container" class="container bg-white">
    <div id="page">
        <!--页面导航栏-->
        <div class="page__hd words_act fc-black bg-white b-b-greyf1 scrollhd">
            <div class="statebar">
                <a class="nav-act left-act" onclick="goBack();"><img src="../bdt/images/nav_icon_back1.png"></a>
                <h2 class="fs36">选择创建圈子的属性</h2>
            </div>
        </div>

        <!--页面主体-->
        <div class="page__bd scrollbd">
            <!--占位空间-->
            <div class="top-space1"></div>
            <!--圈子用容器-->
            <div class="circle">
                <div class="circle-type-select fs30">
                    <a id="freeId"><img class="grey mb10" src="../bdt/images/free_or_not.png">免费</a>
                    <a id="payId" class="ml40"><img class="mb10" src="../bdt/images/free_or_not.png">收费</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!--创建免费圈子-->
<div id="circleContainer1" class="container bg-white creat-circle-type" style="left: 120%; display: none;">
    <div id="page">
        <!--页面导航栏-->
        <div class="page__hd words_act fc-black bg-white b-b-greyf1 scrollhd1">
            <div class="statebar">
                <a class="nav-act left-act" id="closeFreebtn"><img src="../bdt/images/nav_icon_back1.png"></a>
                <h2 class="fs36">创建圈子</h2>
                <a id="creatFinish" class="fc-black fs34">完成</a>
            </div>
        </div>

        <!--页面主体-->
        <div class="page__bd scrollbd1">
            <!--占位空间-->
            <div class="top-space1"></div>
            <!--圈子用容器-->
            <div class="circle">
                <div class="circle-base-edit bc-grey">
                    <a class="circle-photo-edit bc-grey ">
                        <!-- <input id="circleLogo" class="filehidden" accept="image/*" type="file" /> -->
                        <!--如果是编辑的情况就把img显示出来并绑定值即可-->
                        <!-- <span style="display:none;"> -->

<!--                        <img  src="../bdt/images/default.jpg">-->
                        <input type="hidden" name="pics" value="">
                         <i class="bg-black"><img  id="circleLogoImg" src="../bdt/images/add_circle_pic.jpg" /></i>
                    </a>
                    <input id="circleName" type="text" class="circle-name-edit  fs32" placeholder="圈子名称">
                </div>
                <div class="circle-introduce-edit bc-grey bg-greyfa">
                    <textarea id="textarea" class="fs34 fc-black" placeholder="圈子简介（必填）"></textarea>
                    <span class="fs28"><i id="length" class="fc-grey666">0</i>/<i class="fc-greyabc">150</i></span>
                </div>
            </div>
        </div>
    </div>
</div>

<!--创建收费圈子-->
<div id="circleContainer2" class="container bg-white creat-circle-type" style="display: block; left: 120%;">
    <div id="page">
        <!--页面导航栏-->
        <div class="page__hd words_act fc-black bg-white b-b-greyf1 scrollhd2">
            <div class="statebar">
                <a class="nav-act left-act" id="closeChargebtn"><img src="../bdt/images/nav_icon_back1.png"></a>
                <h2 class="fs36">设置付费机制</h2>
                <a class="fc-black fs34 next" id="chargeNext">下一步</a>
            </div>
        </div>

        <!--页面主体-->
        <div class="page__bd scrollbd2">
            <!--占位空间-->
            <div class="top-space1"></div>
            <!--圈子用容器-->
            <div class="circle">
                <div class="circle-type-select charge-circle-creat fs30">
                    <a><img class="mb10" src="../bdt/images/free_or_not.png">收费</a>
                </div>

                <ul class="amount-input b-b-red" id="amountInput">
                    <li class="amount-input-type fs32" style="display:block;" id="amountInput0">
                        <span class="fc-red">￥</span>
                        <input type="text" class="amount fs30" id="amount0" placeholder="设置10-2000的整数">
                        <span class="fc-black">/年</span>
                    </li>
<!--                    <li class="amount-input-type fs32" style="display:none;" id="amountInput1">-->
<!--                        <span class="fc-red">￥</span>-->
<!--                        <input type="text" class="amount fs30" id="amount1" placeholder="设置20-3000的整数">-->
<!--                        <span class="fc-black">永久</span>-->
<!--                    </li>-->
                </ul>

<!--                <div class="pay-type fs28" id="payType">-->
<!--                    <a class="on" id="yearId">按年付费</a>-->
<!--                    <a id="everId">永久有效</a>-->
<!--                </div>-->
            </div>
        </div>
    </div>
</div>
<!--选择图拼-->
<div id="editphoto" class="container bg-white creat-circle-type" style="display:none">
    <div id="page">
        <!--页面导航栏-->
        <div class="page__hd bg-white fc-black b-b-grey scrollhd toview" >
            <div class="statebar">
                <a class="nav-act left-act cancel-btn" id="upload-back"><img src="../bdt/images/nav_icon_back1.png"></a>
                <a class="nav-act left-act cancel-btn" id="closeBtn" style="display:none;"><img src="../bdt/images/nav_icon_close1.png"></a>
                <h2 class="fs34">封面</h2>
                <a class="but_save fs28 fc-black" id="changeImg">
                    修改
                    <input id="picSelectBtn" class="filehidden" accept="image/*" type="file" name="picSelectBtn" onchange="cardChange('picSelectBtn');">
                </a>
                <a class="but_save fs28 fc-black sure-btn" id="sure-btn" style="display:none;">保存</a>
            </div>
        </div>
        <!--页面主体-->
        <div class="page__bd scrollbd">
               <!-- 默认头像-->
                    <img id="editPic" src="../bdt/images/default.jpg">
            <div class="bottom-space1"></div>
        </div>

        <div class="waitUpload" style="display:none;">
            <img src="../bdt/images/uploading.gif">
        </div>
        <div class="upload-container bg-greyfa">
            <div class="row" style="height: 100px; margin-top: -50px;top:20%">
                <div class="col-md-9">
                    <div class="img-container" id="img-container">
                        <img src="../bdt/images/picture.jpg" alt="Picture" id="image" class="cropper-hidden" style="margin-right:5rem">
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>



</body>
