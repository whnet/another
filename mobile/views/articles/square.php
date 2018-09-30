<?php

use yii\helpers\Html;
use yii\grid\GridView;

$this->params['breadcrumbs'][] = $this->title;
?>
<link type="text/css" rel="stylesheet" href="../bdt/css/edit.min.css">
    <link type="text/css" rel="stylesheet" href="../bdt/css/square.css">
<link type="text/css" rel="stylesheet" href="../bdt/css/swiper-3.4.0.min.css">
<script type="text/javascript" src="../bdt/js/square.js"></script>
<script type="text/javascript" src="../bdt/js/commonArticList.js"></script>
<script type="text/javascript" src="../bdt/js/commentListInPostlist.js"></script>

<body>
<div id="container" class="container bg-grey">
    <div id="page">
        <!--页面导航栏-->
        <div class="page__hd bg-white fc-black b-b-grey scrollhd">
            <div class="statebar">
                <a class="nav-act left-act" onclick="goBack();">
                    <img src="../bdt/images/nav_icon_back1.png"></a>
                <h2 class="fs34">领域</h2>
            </div>
        </div>
        <div id="smallNav" class="expert" style="top: 2.2rem; height: 10.5rem;">
            <div style="height:10.5rem;">
                <p>
                    <span class="fs28 fc-grey666 luntantype active" data-type="0">综合</span>
                    <?php foreach($type as $k=>$v):?>
                        <span class="fs28 fc-grey666 luntantype" data-type="<?=$v['id'];?>" style="padding:0 10px;"><?=$v['name']?></span>
                    <?php endforeach;?>
                </p>
                 <img id="showMoreBtn" src="../bdt/images/nav_more.png">
            </div>
        </div>

        <!--页面主体-->
        <div class="page__bd scrollbd">
            <div class="top-space1"></div>

            <!--发现列表-->
            <div class="found-friends-con" id="squareList">
                <a id="downloadMoreData" class="appui_loadmore fs24 fc-greyabc">拼命加载中<i class="loadmore"></i></a></div>
            <div class="bottom-space4"></div>
        </div>
        <div class="page__fd bg-white fs22 bc-grey scrollfdt" id="footer_tabbar">
            <?=$this->render('/_footer')?>
        </div>
    </div>
</div>
<div class="video_dialog" style="display:none;">
    <div class="appui-mask"></div>
    <div class="appui-video-con">
        <video class="appui-video" id="myVideo" style="display:none" controls="">
            <source src="" type="video/mp4">
        </video>
    </div>
</div>
<audio id="audio-mc" preload="preload" src=""></audio>
<script>
    //顶部标签展开更多
    $("#showMoreBtn").on('click',function(event) {
        event.preventDefault();
        var Height=$("#smallNav").height();
        console.log(Height)
        if (Height=="210") {
            $("#smallNav").css("height","auto");
            $("#smallNav>div:nth-of-type(1)").css("height","auto");
            $("#smallNav>div:nth-of-type(1)").css("height","auto");
        }else{
            $("#smallNav").css("height","10.5rem");
            $("#smallNav>div:nth-of-type(1)").css("height","10.5rem");
        }
    });
</script>
</body>