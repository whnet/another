<?php

use yii\helpers\Html;
use yii\grid\GridView;

$this->params['breadcrumbs'][] = $this->title;
?>
<link type="text/css" rel="stylesheet" href="../bdt/css/qanda.css">
<!--<link type="text/css" rel="stylesheet" href="../bdt/css/square.css">-->
<script type="text/javascript" src="../bdt/js/searchCommon.js"></script>
<script type="text/javascript" src="../bdt/js/qanda.js"></script>
<script type="text/javascript" src="../bdt/js/commonQaList.js"></script>

<body>
<div class="new_q_and_a" id="container">
    <div id="page">
        <!--页面导航栏-->
        <div class="page__hd page__hd-search bg-white fc-balck b-b-grey scrollhd" id="topBigDiv">
            <div class="search-head b-b-grey">
                <div class="search-module noleftbtn" id="searchID">
                    <p class="fs28 fc-greyabc">搜索问答</p>
                </div>
                <a class="right-icon" id="searchID1">
                    <img src="../bdt/images/search80.png">
                    <span class="fs28 fc-white"></span>
                </a>
            </div>
            <div id="smallNav" style="height: 6rem; top: 2.55rem;">
                <div style="height:6rem">
                <p>
                    <span class="fs28 fc-grey666 active" onclick="judgeIndex1(0,0,'推荐',1)">推荐</span>
                    <?php foreach($type as $k=>$v):?>
                        <span class="fs28 fc-grey666 <?php if($k==0):?><?php endif;?>" onclick="judgeIndex1(<?=$v['id'];?>,<?=$k+1;?>,'<?=$v['name']?>',1)">
                            <?=$v['name']?></span>
                    <?php endforeach;?>
                </p>
                <img id="showMoreBtn" src="../bdt/images/nav_more.png" >
                </div>
            </div>
        </div>
        <div class="page__bd scrollbd" style="padding-top:6rem;">
            <div id="hasCouponSpace" class="top-space1 notop" style="display:block;"></div>
            <div id="professList" class="professList" style="height:2.5rem;"></div>
            <div class="qa_recommend" id="questions">
                <a id="downloadMoreData" class="appui_loadmore fs32 fc-greyabc">拼命加载中<i class="loadmore"></i></a>
            </div>


                <!--&lt;!&ndash;测试文字回答列表样式&ndash;&gt;-->
                <!--<div class="appui-qanda-module mb10">-->
                    <!--<div class="appui-qanda-question" onclick="questionDetail('+result.data[i].id+')">提问的问题</div>-->
                    <!--原文-->
                    <!--<div class="appui-qanda-expertinfo">-->
                        <!--<div class="time-statistic fs22" id="bottom_1_'+result.data[i].id+'">-->
                            <!--<span class="fc-greyabc mr10 "><i>我的简介</i></span>-->
                            <!--<span class="fc-greyabc"><i>10</i>阅读</span>-->
                            <!--<span class="fc-red"></span><div class="statistic">-->
                            <!--<a class="like fc-greyabc '+onFcRed+'" onclick="dianzanClick('+result.data[i].id+',1,'+result.mid+')" id="dianzan'+result.data[i].id+'">点赞</a>-->
                            <!--<a class="comment ml10 fc-greyabc" id="pinglun_'+result.data[i].id+'">'+comment+'</a>-->
                        <!--</div></div></div></div>-->

            <div class="page__fd bg-white fs22 bc-grey scrollfdt" id="footer_tabbar">
                <div class="tab-con">
                    <?=$this->render('/_footer')?>
                </div>
            </div>
            <audio id="audio-mc" style="display:none;" preload="preload" src=""></audio>
        </div>
</body>
