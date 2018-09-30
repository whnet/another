<?php

use yii\helpers\Html;
use yii\grid\GridView;

$this->params['breadcrumbs'][] = $this->title;
?>
<body>
<div id="container" class="container bg-grey">
    <div id="page">
        <!--页面导航栏-->
        <div class="page__hd bg-white fc-black b-b-grey scrollhd">
            <div class="statebar">
                <a class="nav-act left-act" onclick="goBack();"><img src="../bdt/images/nav_icon_back1.png"></a>
                <h2 class="fs34">我关注的</h2>
                <!-- <a class="nav-act right-act" ><img src="../bdt/images/nav_icon_publish1.png"/></a>  -->
            </div>
        </div>

        <!--页面主体-->
        <div class="page__bd scrollbd">
            <!--占位空间-->
            <div class="top-space1"></div>
            <div class="house-circle-list" id="housecircleList">

               <div class="house-circle-item bg-white mb10" onclick="gotoActicleDetailHtml(1171)">
                        <div class="hc-personal-info-act">
                            <a class="personal-info">
                                <i><img src=""></i>
                                <span class="fs28 fc-black ml5">胡士洲</span>
                            </a>
                            <span class="personal-act fs24 fc-grey666"><i class="fs40">·</i>发文<i class="fs40">·</i></span>
                        </div>
                        <div class="hc-dynamic-style mt10">
                            <div class="hc-dynamic-message">
                                <h3 class="fs30 fc-black">还有房子卖？</h3>
                                <div class="hc-dynamic-message-pic mt10">
                                    <img src="../bdt/images/banner/banner.jpg" />
                                    <span class="fs30 fc-white">+3</span>
                                </div>
                            </div>
                        </div>
                        <div class="hc-time-statistic fs20 fc-greyabc mt10"><span class="hc-time">2天前</span>
                            <div class="hc-statistic"><span>6阅读</span><i class="fs40">·</i><span>1评论</span></div>
                        </div>
                </div>


               <a onclick="downloadMoreData();" id="downloadMoreData" class="appui_loadmore fs28 fc-greyabc">拼命加载中<i class="loadmore"></i></a></div>
        </div>
    </div>
</div>
<audio id="audio-mc" style="display:none;" preload="preload" src=""></audio>


<!-- 轮播图 -->
<div class="appui-gallery-swiper" id="js-gallery-swiper" style="display: none;">
    <!--图片预览轮播-->
    <!-- swiper-slide-visible swiper-slide-active -->
    <div class="swiper" style="cursor: -webkit-grab;">
        <div class="swiper-wrapper" id="swiper-wrapper">
            <!--<div class="swiper-slide">
                <img data-src="C:\Users\Administrator\Desktop\2.png" class="swiper-lazy">
                <div class="swiper-lazy-preloader"></div>
            </div>-->
            <!--<a class="swiper-slide" href="javascript:;"><img src="../bdt/images/gallery/gallery1.jpg" /></a>-->
        </div>
        <div class="pagination">
            <span class="swiper-pagination-switch swiper-visible-switch swiper-active-switch"></span>
            <span class="swiper-pagination-switch"></span>
            <span class="swiper-pagination-switch"></span>
            <span class="swiper-pagination-switch"></span>
        </div>
    </div>
</div>



<div class="bg-white b-t-greyf1 comment-edit-box" id="commentEdit"><div class="m-comment-edit bc-grey">	<div class="m-comment-textarea fs30" contenteditable="plaintext-only"></div></div><span class="u-issue-comment fs28 fc-white bg-red">发送</span></div></body>