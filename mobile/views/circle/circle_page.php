<?php

use yii\helpers\Html;
use yii\grid\GridView;

$this->params['breadcrumbs'][] = $this->title;
?>
<body>
<link type="text/css" rel="stylesheet" href="../bdt/css/circle.css">
<link type="text/css" rel="stylesheet" href="../bdt/css/edit.min.css">
<script type="text/javascript" src="../bdt/js/circle_page.js"></script>
<script type="text/javascript" src="../bdt/js/commonArticList.js"></script>
<script type="text/javascript" src="../bdt/js/commentListInPostlist.js"></script>
<div id="container" class="container userpage-container bg-greyf1">
    <div id="page">
        <div class="page__hd fc-white scrollhd">
            <div class="statebar">
                <a class="nav-act left-act" onclick="goBack();"><img src="../bdt/images/nav_icon_back.png"></a>
                <h2 id="circleName" class="fs34"><?=$info['name']?></h2>
            </div>
        </div>
        <div class="page__bd scrollbd" id="page__bd">
            <div class="circle-pagehead">
                <img class="circle-pagehead-bg filter" id="circleBackPic" src="<?=Yii::$app->params['public'].'/attachment'.$info['logo']?>" style="margin-top: -240px; top: 50%;">
                <div class="circle-pagehead-body fc-white">
                    <span class="circle-pagehead-headpic">
                        <img id="circleHeadPic" src="<?=$info['user']['photo']?>"></span>
                    <div class="circle-name-info">
                        <span class="circle-qunzhu fs28"><?=$info['expert']['realname']?></span>
                        <p class="circle-abstract fs22"><?=$info['des']?></p>
                    </div>

                </div>
            </div>

            <div class="circle-actbtn-bar bg-white" id="circleActbtnBar">
                <?php if($info['member_id'] != $mid):?>
                <a class="circle-ask-btn bc-blue fc-blue fs24" style="margin: 0px 2.5%;" href="/circle/circle_qanda_questions.html?mid=<?=$info['member_id']?>&from=circle&publishtype=ask&circle_id=<?=$_GET['id']?>">
                    <img src="../bdt/images/circle_ask_btn.png">提问</a>
                <?php endif;?>
                <a class="circle-pub-btn bc-blue fc-blue fs24" id="circlePubBtn" style="margin: 0px 2.5%;">
                    <img src="../bdt/images/circle_pub_btn.png">发布</a>
                <a class="circle-member-btn bc-blue fc-blue fs24" style="margin: 0px 2.5%;">
                    <img src="../bdt/images/circle_member_btn.png"><?=$nums?></a>
            </div>

            <div class="expert-pages bg-white">
                <!--行家专栏-->
                <div class="expert-column bg-greyf1" id="expert-pages0">
                    <a id="downloadMoreData" class="appui_loadmore fs32 fc-greyabc">拼命加载中<i class="loadmore"></i></a>
                </div>
            </div>

        </div>
    </div>
</div>

<!--语音播放器-->
<audio id="audio-mc" style="display:none;" preload="preload" src=""></audio>

<!--//发布弹出框-->
<div class="publish-type" style="display:none">
    <div class="publish-type-list fs32 fc-black type4" style="top:60%;">
        <a style="display:none" href="/circle/circle_file_release.html?from=circle&publishtype=fatie&circle_id=<?=$_GET['id']?>"><i>
                <img src="../bdt/images/message_pic.jpg"></i>
            <span class="fc-black">发帖</span></a>
        <a href="/articles/article_edit.html?from=circle&publishtype=article&circle_id=<?=$_GET['id']?>" style="margin-left:15%;margin-right:10%;">
            <i><img src="../bdt/images/message_article.jpg"></i>
            <span class="fc-black">文章</span></a>
        <a href="/pockets/red_packets.html?from=circle&publishtype=redpack&circle_id=<?=$_GET['id']?>" style="margin-left:10%;margin-right:10%;">
            <i><img src="../bdt/images/message_packet.jpg"></i>
            <span class="fc-black">红包</span></a>
        <a style="display:none" href="/circle/circle_qanda_questions.html?mid=<?=$info['member_id']?>&from=circle&publishtype=ask&circle_id=<?=$_GET['id']?>" >
            <i><img src="../bdt/images/message_qanda.jpg"></i>
            <span class="fc-black">提问</span></a>
    </div>
    <a class="close-publish-btn bg-white" id="closePubBtn" style="bottom:5rem">
        <img src="../bdt/images/publish_red.png"></a>
</div>


</body>
