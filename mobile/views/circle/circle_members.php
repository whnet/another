<?php

use yii\helpers\Html;
use yii\grid\GridView;

$this->params['breadcrumbs'][] = $this->title;
?>
<body>
<script type="text/javascript" src="../bdt/js/edit.min.js"></script>
<script type="text/javascript" src="../bdt/js/circle_member.js"></script>
<link type="text/css" rel="stylesheet" href="../bdt/css/user.min.css">
<link type="text/css" rel="stylesheet" href="../bdt/css/listnav.css">
<script type="text/javascript" src="../bdt/js/jquery.charfirst.pinyin.js"></script>
<link type="text/css" rel="stylesheet" href="../bdt/css/listnav.css" />

<div id="container" class="container myrelations-container bg-greyfa">
    <div id="page">
        <!--页面导航栏-->
        <!--页面导航栏-->
        <div class="page__hd words_act fc-black bg-white b-b-greyf1 scrollhd">
            <div class="statebar">
                <!-- <a class="fc-grey666 fs34 words_act">取消</a> -->
                <a class="nav-act left-act" onclick="goBack();"><img src="../bdt/images/nav_icon_back1.png"></a>
                <h2 class="fs36">圈子成员</h2>
                <!-- <a class="fc-black fs34">完成</a> -->
            </div>
        </div>
        <!--内容TAB导航-->
        <!--页面主体-->
        <div class="page__bd scrollbd" id="myrelations-page0" style="display:block;">
            <!--占位空间-->
            <div class="top-space1"></div>
            <!-- 好友列表 -->
            <div class="myrelations-list">
                <?php foreach($members as $k=>$v):?>
                <div onclick="setElementClickStyle(this);window.location.href='/expert/user_page.html?id=<?=$v['user']['id']?>'" class="myrelations-item b-b-grey bg-white">
                    <a>
                        <i><img src="<?=Yii::$app->params['public'].'/attachment'.$v['user']['photo']?>"></i>
<!--                        <i><img src="../bdt/images/v2.png"></i>-->
                    </a>
                    <div>
                        <h2 class="fs30 fc-navy just-name"><?=$v['user']['nickname']?></h2></div>
                    <i class="qztag"><img src="../bdt/images/go.png"></i>
<!--                    <i class="qztag"><img src="../bdt/images/red_crown.png"></i>-->
                </div>
                <?php endforeach;?>




                <!--占位空间-->
                <div class="bottom-space2"></div>
            </div>
        </div>
    </div>



</body>
