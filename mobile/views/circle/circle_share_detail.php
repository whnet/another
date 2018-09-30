<body>
<script type="text/javascript" src="../bdt/js/picPop.js"></script>
<script type="text/javascript" src="../bdt/js/circle_share_detail.js"></script>
<script type="text/javascript" src="../bdt/js/commonArticList.js"></script>
<link type="text/css" rel="stylesheet" href="../bdt/css/circle.css">
<div id="container" class="container article-container bg-grey">
    <div id="page">
        <!-- style="width:375px;height:667px;overflow:auto" -->
        <!--页面导航栏-->
        <div class="page__hd bg-white fc-balck b-b-grey scrollhd">
            <div class="statebar">
                <a class="nav-act left-act" onclick="goBack();" href="javascript:void(0);">
                    <img src="../bdt/images/nav_icon_back1.png"></a>
                <h2 class="fs34" id="qzName"><?=$info['name']?></h2>
            </div>
        </div>

        <!--页面主体-->
        <div class="page__bd bg-grey scrollbd">
            <div class="top-space1"></div>
            <div class="circle-share-detail">
                <!-- 头部背景图显示区域 -->
                <div class="csd-head">
                    <img class="csd-head-bg filter3" id="backgroundPic" src="../bdt/images/default.jpg" style="margin-top: -240px; top: 50%;">
                    <div class="csd-head-body">
                        <i class="mt30">
                            <img  src="<?=$info['user']['photo']?>">
                        </i>
                        <h4 class="fs30 fc-black mt15"><?=$info['name']?></h4>
                        <p class="fs20 fc-black"><?=$info['expert']['realname']?></p>
                    </div>
                </div>

                <!-- 分享圈子资料 -->
                <div class="csd-brief bg-white">
                    <div class="csd-brief-info">
                        <em class="csd-brief-liststyle"><i></i></em>
                        <h4 class="fs28 fwb">圈子简介</h4>
                        <p class="fs26 fc-black mt10" id="qzBrief"><?=$info['des']?></p>
                    </div>
                    <div class="csd-brief-member" style="display:none">
                        <em class="csd-brief-liststyle"><i></i></em>
                        <h4 class="fs28 fwb" id="circleMemberH4">圈子成员(107)</h4>
                        <div class="csd-brief-member-list mt10" >
                            <?php foreach($members as $v):?>
                            <img src="<?=Yii::$app->params['public'].'/attachment'.$v['user']['photo']?>">
                            <?php endforeach;?>
                        </div>
                    </div>
                    <div class="csd-brief-join">
                        <em class="csd-brief-liststyle"><i></i></em>
                        <h4 class="fs28 fwb" id="joinPrice">加入圈子:
                            <?php if($info['feetype'] == 1):?> ￥<?=$info['joinprice']?>/年<?php elseif($info['feetype'] == 2):?>￥<?=$info['joinprice']?>/永久<?php else:?>免费<?php endif;?></h4>
                            <?php if($info['feetype'] == 1):?>
                                <p class="fs26 mt10" id="joinSummary">付款成功后，您可以在
                            <span><?=date('Y年m月d日',time());?>至<?=date('Y年m月d日',strtotime('+1 year'));?></span>
                            期间，进入 <?=$info['name']?> 的圈子，查看 <span><?=$info['name']?></span> 中的内容。</p>
                            <?php elseif($info['feetype'] == 2):?>
                                <p class="fs26 mt10" id="joinSummary">付款成功后，您可以永久查看<span> <?=$info['name']?> </span> 中的内容。</p>
                                <?php else:?>
                                <p class="fs26 mt10" id="joinSummary">免费加入圈子，您可以永久查看<span> <?=$info['name']?> </span> 中的内容。</p>
                            <?php endif;?>

                    </div>
                </div>

            </div>

            <!--占位空间-->
            <div class="bottom-space1"></div>
        </div>
            <?php if($info['feetype'] == 0):?>
            <a class="add-circle bg-red fc-white fs28" id="toPayjoinPrice" data-price="0" ><span>免费</span>加入圈子</a>
                <?php else:?>
                <a class="add-circle bg-red fc-white fs28" id="toPayjoinPrice" data-price="<?=$info['joinprice']?>"><span>¥<?=$info['joinprice']?></span>加入圈子</a>
        <?php endif;?>
        <input type="hidden" name="price" value="<?=$info['joinprice']?>" />
        <input type="hidden" name="createid" value="<?=$info['member_id']?>" />
    </div>
</div>




</body>