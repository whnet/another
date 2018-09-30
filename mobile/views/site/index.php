<?php

use yii\helpers\Html;
use yii\bootstrap\ActiveForm;
use yii\helpers\Url;
use yii\widgets\LinkPager;
use common\tools\htmls;

?>
<script type="text/javascript" src="../bdt/js/commonQaList.js"></script>
<script type="text/javascript" src="../bdt/js/searchCommon.js"></script>
<script type="text/javascript" src="../bdt/js/index.js"></script>
<script type="text/javascript" src="../bdt/js/indexcomment.js"></script>
<script type="text/javascript" src="../bdt/js/commonArticList.js"></script>
<script type="text/javascript" src="../bdt/js/commentListInPostlist.js"></script>
<link type="text/css" rel="stylesheet" href="../bdt/css/index.css">
<body>
<audio id="audio-mc" style="display:none;" preload="preload" src=""></audio>
<div class="index-container bg-grey new_index" id="container">
    <div id="page">
        <div class="page__hd page__hd-search scrollhd" id="topBigDiv" style="background:rgba(229,229,230,0.7)">
            <div class="search-head">
                <div class="search-module noleftbtn bg-grey " id="searchID" style="background:white">
                    <span><img src="../bdt/images/search.png"></span>
                    <em class="bg-blue"></em>
                    <input type="text" class="fc-blue fs28" placeholder="搜索专家、圈子、问答..." disabled="disabled">
                </div>
                <a class="right-icon">
                    <img src="../bdt/images/notice1.png">
                    <?php if($counts):?>
                            <?php if($counts > 99):?>
                           <span class="fs24 fc-white nums bg-red">...</span>
                            <?php else:?>
                            <span class="fs24 fc-white nums bg-red"><?=$counts;?></span>
                            <?php endif;?>
                    <?php else:?>
                        <span class="fs24 fc-white nums"></span>
                    <?php endif;?>
                </a>
            </div>
        </div>

        <div class="page__bd scrollbd" id="page__bd">
            <div style="padding-top:2.5rem">
                <div class="swiper-container swiper-container-horizontal swiper-container-autoheight swiper-container-android">
                    <div class="swiper-wrapper" >
                        <?php foreach($banner as $k=>$v):?>
                        <div class="swiper-slide swiper-slide-prev" ><a href="<?=$v['link']?>">
                                <img src="<?=Yii::$app->params['public']?><?=$v['logo']?>"></a>
                        </div>
                        <?php endforeach;?>
                    </div>
                    <div class="swiper-pagination swiper-pagination-clickable swiper-pagination-bullets"></div>
                </div>
            </div>
            <div class="index_entrance bg-white b-tb-greyf1 fs28">
                <a href="<?=Url::toRoute(['circle/circle_my',"from"=>'index'])?>" class="fc-black">
                    <img src="../bdt/images/index_circle.jpg"><span>圈子</span>
                </a>
                <a href="<?=Url::toRoute(['questions/qanda'])?>" class="fc-black">
                    <img src="../bdt/images/index_expert.jpg"><span>问答</span>
                </a>
                <a href="/articles/square.html" class="fc-black">
                    <img src="../bdt/images/index_loupan3.png"><span>领域</span>
                </a>
                <!--<a href="<?=$this->params['site']['zhaopinurl'];?>" class="fc-black">-->
                <a href="http://www.prcmc.com/cases/list.html" class="fc-black">
                    <img src="../bdt/images/index_topic.jpg"><span>案源</span>
                </a>
            </div>
            <div class="index-module indexsquare">
                <h3 class="index-module-head b-b-greyf5 bg-white">
                    <span class="fs32 fc-black">精选</span>
                </h3>
                <div class="index-module-body fs30 fc-black indexsquare-list" id="indexSquareList">
                    <a id="downloadMoreData" class="appui_loadmore fs32 fc-greyabc">拼命加载中<i class="loadmore"></i></a>
                </div>

            </div>
            <?php if($expert):?>
                <a class="publish-btn publish-btn-square bg-white">
                    <img src="../bdt/images/publish_pen.png">
                </a>
                <div class="publish-type" style="display:none">
                    <div class="publish-type-list fs32 fc-black type4">
                        <a href="/circle/circle_file_release.html?from=index&publishtype=fatie">
                            <i><img src="../bdt/images/message_pic.jpg"></i>
                            <span class="fc-black">发帖</span></a>
                        <a href="/articles/article_edit.html?from=index&publishtype=article">
                            <i><img src="../bdt/images/message_article.jpg"></i>
                            <span class="fc-black">文章</span></a>
                        <a href="/pockets/red_packets.html?from=index&publishtype=redpack">
                            <i><img src="../bdt/images/message_packet.jpg"></i>
                            <span class="fc-black">红包</span></a>
                        <a href="/questions/start_ask.html?from=index&publishtype=ask&circle_id=0" >
                            <i><img src="../bdt/images/message_qanda.jpg"></i>
                            <span class="fc-black">提问</span></a>
                    </div>
                    <a class="close-publish-btn bg-white" id="closePubBtn" style="bottom:5rem;">
                        <img src="../bdt/images/publish_red.png">
                    </a>
                </div>
            <?php endif;?>
            <div class="bottom-space4"></div>
            <audio id="audio-mc" preload="preload" src=""></audio>
        </div>
        <div class="page__fd bg-white fs22 bc-grey scrollfdt" >
            <div class="tab-con">
                <?=$this->render('/_footer')?>
            </div>
        </div>
    </div>
</div>
<input type="hidden" name="expert" value="<?=Yii::$app->session['expert']?>" />
<script>
    $(".publish-btn").on("click",function(){
         $(".publish-type").show();
    })
</script>
</body>