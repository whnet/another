<?php

use yii\helpers\Html;
use yii\grid\GridView;

$this->params['breadcrumbs'][] = $this->title;
?>
<body class="bg-greyfa">
<link type="text/css" rel="stylesheet" href="../bdt/css/wf_circle.css">
<script type="text/javascript" src="../bdt/js/circle_data_expert.js"></script>
<div id="container" class="container red_packets_container">
    <div id="page">ƒ
        <!--页面导航栏-->
        <div class="page__hd bg-white words_act b-b-greyf1 scrollhd">
            <div class="statebar">
                <a class="nav-act left-act" onclick="goBack();"><img src="../bdt/images/nav_icon_back1.png"></a>
                <h2 class="fs34 fc-grey" style="font-weight:600">圈子资料</h2>
            </div>
        </div>
        <!--主题内容-->
        <div class="page__bd scrollbd">
            <!--占位空间-->
            <div class="top-space1"></div>
            <!--圈子资料在主体-->
            <div class="circle_data_expert">
                <!--头像分类部分-->
                <div class="cde_member">
                    <h1 class="fs34" id="qztitle"><?=$info['name']?></h1>
                    <div class="cde_Picture">
                        <div class="cde_p01">
                            <?php foreach($members as $k=>$v):?>
                                <i><img id="img<?=$k?>" src="<?=Yii::$app->params['public'].'/attachment'.$v['user']['photo']?>"></i>
                            <?php endforeach;?>
                        </div>
<!--                        <div class="cde_p02">-->
<!--                            <i><img id="img6" src="../bdt/images/user_7104_80.jpg"></i>-->
<!--                            <i>-->
<!--                                <img id="img7" src="../bdt/images/user_7104_80.jpg"></i>-->
<!--                            <i class="cde_master"><img src="../bdt/images/default_avatar.png"></i>-->
<!--                            <i class="cde_master redmaster" id="imgmebber"><img src="../bdt/images/user_7104_80.jpg"></i>-->
<!--                            <i><img id="img8" src="../bdt/images/user_7104_80.jpg"></i>-->
<!--                        </div>-->
                    </div>
                    <div class="cde_information">
                        <span class="fs32" id="createname"><?=$info['user']['nickname']?></span>
                        <p id="creattime" class="fs28 fc-grey666"><?=$info['user']['nickname']?> <?=date('Y年m月d日',$info['created'])?> 创建本圈子</p>
<!--                        <p class="fs28 fc-grey666" style="display:none;">圈子排行123</p>-->
                    </div>
                    <div class="cde_share">
                        <a>
                            <i><img src="../bdt/images/article_act2_2.png"></i>
                            <span class="fs28">分享圈子</span>
                        </a>
                    </div>
                </div>
                <!--资料部分-->
                <div class="cde_modify">
                    <a class="cde_modify_list bg-white" href="circle_data_name_edit.html">
                        <div></div>
                        <span class="fs28">我在圈子昵称</span>
                        <i><img src="../bdt/images/go.png"></i>
                        <p id="mynickname" class="fs28 fc-grey666"><?=$user['nickname']?></p>
                    </a>

<!--                    <a class="cde_modify_list bg-white">-->
<!--                        <div></div>-->
<!--                        <span class="fs28">付费有效期</span>-->
<!--                        <i></i>-->
<!--                        <p id="memberstoptime" class="fs28 fc-grey666">免费</p>-->
<!--                    </a>-->
                   <?php if($user['id'] == $member_id):?>
                        <a class="cde_modify_list bg-white" href="circle_data_name_edit.html">
                            <div></div>
                            <span class="fs28">编辑圈子资料</span>
                            <i><img src="../bdt/images/go.png"></i>
                            <p id="qzname" class="fs28 fc-grey666"><?=$info['name']?></p>
                        </a>
                    <?php endif;?>

                    <a class="cde_modify_list bg-white" href="circle_members.html?id=<?=$_GET['id']?>">
                        <div></div>
                        <span class="fs28">圈子成员</span>
                        <i><img src="../bdt/images/go.png"></i>
                        <p id="qztotmember" class="fs28 fc-grey666"><?=$nums?>位</p>
                    </a>

<!--                    <a class="cde_modify_list bg-white" href="javascript:void(0);">-->
<!--                        <div></div>-->
<!--                        <span class="fs28 fc-black">成员加入方式</span>-->
<!--                        <i><img src="../bdt/images/go.png"></i>-->
<!--                        <p id="qzjoinprice" class="fs28 fc-grey666">免费</p>-->
<!--                    </a>-->
                </div>


                <a class="exit-circle bg-greyf1 fs28 fc-red" style="" id="exitCircle">退出圈子</a>
                <!--占位空间-->
                <div class="bottom-space4"></div>
            </div>
        </div>
    </div>
</div>

<!-- 分享的提示框 -->
<div class="circle-share-dialog" id="shareView" style="display:none;">
    <div class="appui-mask black"></div>
    <div class="circle-share-con">
        <img src="../bdt/images/circle_share_pic.png">
        <a id="closeShare" class="circle-share-close"><img src="../bdt/images/circle_share_btn.png"></a>
    </div>
</div>




</body>
