<?php

use yii\helpers\Html;
use yii\grid\GridView;

$this->params['breadcrumbs'][] = $this->title;
?>
<link type="text/css" rel="stylesheet" href="../bdt/css/circle.css" />
<link type="text/css" rel="stylesheet" href="../bdt/css/circle_my.css" />
<script type="text/javascript" src="../bdt/js/circle_my.js"></script>
<script type="text/javascript" src="../bdt/js/searchCommon.js"></script>
<script type="text/javascript" src="../bdt/js/picPop.js"></script>

<body>
<div id="container" class="container bg-greyfa">
    <div id="page">
        <div class="page__hd words_act fc-black bg-white b-b-greyf1 scrollhd" id="notAddCircle" style="display:none;">
            <div class="statebar">
                <h2 class="fs36">推荐圈子</h2>
            </div>
        </div>
        <div class="page__hd bg-white fc-black b-b-grey has-tab scrollhd1" id="hasAddCircle">
            <div class="statebar">
                <a class="nav-act left-act" onclick="goBack();"><img src="../bdt/images/nav_icon_back1.png" /></a>
                <div class="tab-btn fs30 tab-btn-two" id="circleSwitchTab">
                    <a class="fc-red" id="myCircleList">我的圈子</a>
                    <a class="fc-white bg-red" id="recommendCircleList">推荐圈子</a>
                </div>
                <a class="nav-act right-act" id="switchId" style="display:block"><img src="../bdt/images/nav_icon_switch1.png"></a>
                <a class="nav-act right-act" id="switchId1" >
                    <img src="../bdt/images/nav_icon_switch1.png">
                </a>
            </div>
        </div>
        <div class="page__bd scrollbd scrollBottom" id="page__bd" >
            <div class="top-space1" style="display:none;"></div>
            <div class="top-space4"></div>
            <div class="circle">
                <!--推荐圈子-->
                <div class="tuijiancircle" id="tuijiancircle">
                    <p class="circle-search" id="circleSearchCon" style="display:block;">
                        <span></span>
                        <input type="text" class="fs30 fc-black" id="circleSearch" placeholder="搜索圈子">
                    </p>
                    <!--没有圈子-->
                    <div class="appui-nocontent" style="display:none">
                        <span><img src="../bdt/images/nocontent.png"/></span>
                        <p class="mt10 fs28 fc-greyabc">还没有给您推荐圈子</p>
                    </div>
                    <div class="circle-list" id="circleListtuijian" style="top: 0px;display:block">
	                    <?php if($recCircles):?>
                        <?php foreach($recCircles as $k=>$v):?>
                        <div class="circle-item bg-white fc-black" onclick="gotoHtml(1,<?=$v['id']?>)">
                       <span style="height: 140px;">
                           <img src="<?=Yii::$app->params['public'].'/attachment'.$v['logo']?>">
                           <em class="fs22 fc-white"><?=count($v['incircle']);?></em>
                       </span>
                            <h3 class="fs28 circle-name"><?=$v['name']?></h3>
                            <i class="bg-green"></i><h4 class="fs20 fc-grey666">
                            <img src="../bdt/images/circle_master.png"><?=$v['user']['nickname']?></h4>
                        </div>
                        <?php endforeach;?>
                        <?php endif;?>
                    </div>

                    <div class="circle-list" id="circleListtuijianlist" style="top: 0px;display:none">
                        <?php if(!empty($recCircles)):?>
                        <?php foreach($recCircles as $k=>$v):?>
                        <div class="circle-item-x bg-white fc-black mt10" onclick="gotoHtml(1,<?=$v['id']?>)">
                            <a class="circle-headpic">
                                <img src="<?=Yii::$app->params['public'].'/attachment'.$v['logo']?>">
                            </a>
                            <div class="circle-info">
                                <h3 class="circle-info-name fs30 fc-black"><?=$v['name']?></h3>
                                <p class="circle-info-canshu fs20 fc-grey999"><span>圈主:<?=$v['experts']['realname']?></span>
                                </p>
                                <p class="circle-info-introduce fs24 fc-grey666 mt5"><?=$v['des']?></p>
                            </div>
                        </div>
                        <?php endforeach;?>
                        <?php endif;?>
                    </div>

                </div>
                <div class="mycircle" id="mycircle">
                    <!--没有圈子-->
                    <div class="appui-nocontent" style="display:none">
                        <span><img src="../bdt/images/nocontent.png"/></span>
                        <p class="mt10 fs28 fc-greyabc">圈子</p>
                    </div>
               <div class="circle-list" id="circleList0" style="top: 0px;display:none">
                   <?php if($MyCreated):?>
                       <?php foreach($MyCreated as $k=>$v):?>
                           <?php if($v['status'] == 1):?>
                                   <div class="circle-item-x bg-white fc-black mt10" onclick="gotoHtml(1,<?=$v['id']?>)">
                                       <a class="circle-headpic">
                                           <img src="<?=Yii::$app->params['public'].'/attachment'.$v['logo']?>">
                                       </a>
                                       <div class="circle-info">
                                           <h3 class="circle-info-name fs30 fc-black"><?=$v['name']?></h3>
                                           <p class="circle-info-canshu fs20 fc-grey999"><span>圈主:<?=$v['expert']['realname']?></span>
<!--                                               <span class="ml10">成员:<em>--><?//=count($v['incircle']);?><!--</em>人</span>-->
                                           </p>
                                           <p class="circle-info-introduce fs24 fc-grey666 mt5"><?=$v['des']?></p>
                                       </div>
                                   </div>
                               <?php else:?>
                                   <div class="circle-item-x bg-white fc-black mt10" style="background:#f1f1f1">
                                       <a class="circle-headpic">
                                           <img src="<?=Yii::$app->params['public'].'/attachment'.$v['logo']?>">
                                       </a>
                                       <div class="circle-info">
                                           <h3 class="circle-info-name fs30 fc-black"><?=$v['name']?></h3>
                                           <p class="circle-info-canshu fs20 fc-grey999" style="margin-top:10px;color:red">需要1个工作日审核......</p>
                                       </div>
                                   </div>
                               <?php endif;?>
                       <?php endforeach;?>
                   <?php endif;?>

                     <?php foreach($myCircle as $k=>$v):?>
                         <?php if(!empty($v['circle'])):?>
                        <div class="circle-item-x bg-white fc-black mt10" onclick="gotoHtml(1,<?=$v['circle']['id']?>)">
                                <a class="circle-headpic">
                                    <img src="<?=Yii::$app->params['public'].'/attachment'.$v['circle']['logo']?>">
                                </a>
                                <div class="circle-info">
                                    <h3 class="circle-info-name fs30 fc-black"><?=$v['circle']['name']?></h3>
                                    <p class="circle-info-canshu fs20 fc-grey999"><span>圈主:<?=$v['expert']['realname']?></span>
<!--                                   <span class="ml10">成员:<em>--><?//=count($v['incircle']);?><!--</em>人</span>-->
                                    </p>
                                    <p class="circle-info-introduce fs24 fc-grey666 mt5"><?=$v['circle']['des']?></p>
                                </div>
                         </div>
                             <?php endif;?>
                       <?php endforeach;?>
                </div>
            <div class="circle-list" id="circleListwenzi" style="top: 0px;display:none">
                <?php if($MyCreated):?>
                    <?php foreach($MyCreated as $k=>$v):?>
                        <div class="circle-item bg-white fc-black" onclick="gotoHtml(1,<?=$v['id']?>)">
                       <span style="height: 140px;">
                           <img src="<?=Yii::$app->params['public'].'/attachment'.$v['logo']?>">
                           <em class="fs22 fc-white"><?=count($v['incircle']);?></em>
                       </span>
                            <h3 class="fs28"><?=$v['name']?></h3>
                            <i class="bg-green"></i><h4 class="fs20 fc-grey666">
                                <img src="../bdt/images/circle_master.png"><?=$v['user']['nickname']?></h4>
                        </div>
                    <?php endforeach;?>
                <?php endif;?>
                <?php foreach($myCircle as $k=>$v):?>
                    <?php if(!empty($v['circle'])):?>
                <div class="circle-item bg-white fc-black" onclick="gotoHtml(1,<?=$v['circle']['id']?>)">
                       <span style="height: 140px;">
                           <img src="<?=Yii::$app->params['public'].'/attachment'.$v['circle']['logo']?>">
                        <em class="fs22 fc-white"><?=count($v['incircle']);?></em>
                       </span>
                    <h3 class="fs28"><?=$v['circle']['name']?></h3>
                    <i class="bg-green"></i><h4 class="fs20 fc-grey666">
                        <img src="../bdt/images/circle_master.png"><?=$v['expert']['realname']?></h4>
                </div>
                        <?php endif;?>
                <?php endforeach;?>

            </div>
            </div>
            </div>
        </div>
            <div class="bottom-space3"></div>
            <div class="bottom-space4"></div>
        </div>
    <?php if(!$info['isguanjia']):?>
      <?php if($info['vip'] == 1 && $count < 1):?>
            <div class="page__fd scrollfd" style="display:block">
                <div class="creat-circle-act">
                    <a class="creat-circle-btn fc-white bg-blue fs30" onclick="creatCircle()">创建圈子</a>
                </div>
            </div>
            <style>
                .scrollBottom{
                    padding-bottom:5.5rem;
                }
            </style>
            <?php else:?>
            <style>
                .scrollBottom{
                    padding-bottom:3rem;
                }
            </style>
        <?php endif;?>
    <?php else:?>
        <div class="page__fd scrollfd"  style="display:block">
            <div class="creat-circle-act">
                <a class="creat-circle-btn fc-white bg-blue fs30" onclick="creatCircle()">创建圈子</a>
            </div>
        </div>
        <style>
            .scrollBottom{
                padding-bottom:5.5rem;
            }
        </style>
    <?php endif;?>

        <div class="page__fd bg-white fs22 bc-grey scrollfdt" id="footer_tabbar">
            <div class="tab-con">
                <?=$this->render('/_footer')?>
            </div>
        </div>
    </div>
</div>
 <script>
 //      我的圈子
 var content1=$("#circleList0").find(".circle-info-name").text();
 var content2=$("#circleListwenzi").find(".fs28").text();
     if ((content1!='')&&(content2!='')) {
         $("#mycircle").find(".appui-nocontent").hide();
      }else if ((content1 == "") &&(content2=="")) {
         $("#mycircle").find(".appui-nocontent").show();
      }
//      推荐圈子
 var content3=$("#circleListtuijian").find("h4").text();
 var content4=$("#circleListtuijianlist").find(".circle-info-name").text();
 if (content3!= ""&& content4!="") {
     $("#tuijiancircle").find(".appui-nocontent").hide();
 }else if (content3==""&& content4=="") {
     $("#tuijiancircle").find(".appui-nocontent").show();
 }
 if($("#mycircle").hide()){
     $("#tuijiancircle").show();
 }else{
     $("#tuijiancircle").hide();
 }
</script>
</body>
