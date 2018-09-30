<?php

use yii\helpers\Html;
use yii\grid\GridView;

$this->params['breadcrumbs'][] = $this->title;
?>



<link type="text/css" rel="stylesheet" href="../bdt/css/edit.min.css">
<script type="text/javascript" src="../bdt/js/feedback.js"></script>
<body>
<div id="container" class="container message-edit-container bg-grey">
    <div id="page">
        <!--页面导航栏-->
        <div class="page__hd page__hd-edit fc-black bg-white bc-grey">
            <div class="statebar">
                <a class="nav-act left-act" id="cancelInput">
                    <img src="../bdt/images/nav_icon_back1.png?v=20170209160748"></a>
                <h2 class="fs34">意见反馈</h2>
                <a class="fc-navy fs30" id="submitContent">提交</a>
            </div>
        </div>
        <!--页面主体-->
        <div class="page__bd">
            <!--占位空间-->
            <div class="top-space1"></div>
            <div class="edit-module bg-white bc-grey">
                <div class="message-content fc-grey678 fs30">

                    <!--短消息正文-->
                    <textarea class="message-text fs34" contenteditable="true" id="edit-mark" placeholder="欢迎提供宝贵意见" autofocus=""></textarea>

                    <!--短消息-插入图片示例-->
                    <div class="message-pic mt10" id="messagePicsId">
                        <!--figure contenteditable="false">
                            <img id="tttt1" src="../bdt/images/topic/topic4.jpg?v=20161201134427" />
                            <span class="bg-orange"><img src="../bdt/images/img_delete.png?v=20161201134425" /></span>
                        </figure-->
                        <a class="add-message-pic bc-grey" contenteditable="false">
                            <i class="bg-greyabc"></i><i class="bg-greyabc"></i>
                            <!-- multiple="true"  -->
                            <!-- <input id="filehidden" style="width: 100%;height: 100%;diplay:block;opacity: 0;" type="file"  multiple="true" name="filehidden" /> -->
                            <!-- <p id="filehidden" style="width: 100%;height: 100%;diplay:block;opacity: 0;"></p> -->
                            <input id="filehidden" style="width: 100%;height: 100%;diplay:block;opacity: 0;" type="file" accept="image/*;capture=camera" multiple="true" name="filehidden"></a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>


<!--图片预览-->
<div class="appui-gallery" id="gallery">
    <!--   style="background-image:url(../bdt/images/photo/user_7_80.jpg);" -->
    <span class="appui-gallery__img"><img src="../bdt/images/photo/user_7_80.jpg?v=20161201134228"></span>
    <!-- <div class="appui-gallery__opr">
        <a href="javascript:" class="appui-gallery__del" onClick="$('#gallery').fadeOut();"></a>
    </div> -->
</div>



</body>
