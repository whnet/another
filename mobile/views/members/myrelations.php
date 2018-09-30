<?php

use yii\helpers\Html;
use yii\grid\GridView;

?>
<link type="text/css" rel="stylesheet" href="../bdt/css/user.min.css">
<link type="text/css" rel="stylesheet" href="../bdt/css/listnav.css">
<link type="text/css" rel="stylesheet" href="../bdt/css/user.min.css">
<link type="text/css" rel="stylesheet" href="../bdt/css/listnav.css">
<script type="text/javascript" src="../bdt/js/edit.min.js"></script>
<script type="text/javascript" src="../bdt/js/myrelations.js"></script>
<body>
<div id="container" class="container myrelations-container bg-greyfa">
    <div id="page">
        <div class="page__hd bg-white fc-blue b-b-grey has-tab scrollhd">
            <div class="statebar">
                <a class="nav-act left-act" onclick="goBack();"><img src="../bdt/images/nav_icon_back1.png"></a>
                <div class="tab-btn fs30 tab-btn-two">
                    <a class=" fc-white tab-on" onclick="myFocusList()" id="relationId1">关注</a>
                    <a class="fc-white bg-blue" onclick="myFansList()" id="relationId2">粉丝</a>
                </div>
            </div>
        </div>

        <!--页面主体-->
        <div class="page__bd scrollbd">
            <!--占位空间-->
            <div class="top-space4"></div>
            <!-- 好友列表 -->
            <div class="myrelationslist" id="myrelations-page0" style="display: none;">
                <div class="myrelations-list" id="page0">
                </div>
            </div>

            <!--关注列表-->
            <div class="myrelationslist" id="myrelations-page1">
                <!--暂无关注-->
                <div class="appui-nocontent">
                    <span><img src="../bdt/images/nocontent.png"></span>
                    <p class="mt10 fs28 fc-greyabc">您暂无关注</p>
                </div>
                  <div class="myrelations-list b-t-grey" id="page1">
                      <?php foreach($concern as $k=>$v):?>
                        <div class="myrelations-item b-b-grey bg-white"><a>
                                <i>
                                    <img src="<?=$v['fans']['photo']?>"></i>
                                </i>
                                <?php if($v['fans']['vip'] == 1):?>
                                <i><img src="../bdt/images/v2.png"></i>
                                <?php endif;?>
                            </a>
                            <div><h2 class="fs30 fc-navy just-name"><?=$v['fans']['nickname']?></h2></div>
                            <span style=""><img src="../bdt/images/icon06.png"></span>
                        </div>
                      <?php endforeach;?>


                </div>
            </div>

            <!--粉丝列表-->
            <div class="myrelationslist" id="myrelations-page2" style="display:none;">
                <!--暂无粉丝-->
                <div class="appui-nocontent">
                    <span><img src="../bdt/images/nocontent.png"></span>
                    <p class="mt10 fs28 fc-greyabc">您暂无粉丝</p>
                </div>
                <div class="myrelations-list b-t-grey" id="page2">
                    <?php foreach($fans as $k=>$v):?>
                        <div class="myrelations-item b-b-grey bg-white"><a>
                                <i><img src="<?=$v['concerns']['photo']?>"></i>
                                </i>
                                <?php if($v['concerns']['vip'] == 1):?>
                                    <i><img src="../bdt/images/v2.png"></i>
                                <?php endif;?>
                            </a>
                            <div><h2 class="fs30 fc-navy just-name"><?=$v['concerns']['nickname']?></h2></div>
                            <span><img src="../bdt/images/icon06.png"></span>
                        </div>
                    <?php endforeach;?>
                </div>
            </div>

            <!--占位空间-->
            <div class="bottom-space2"></div>
        </div>
    </div>
</div>

<script>
    var content0 = $("#myrelations-page1").find(".just-name").text();
    //我问
    if(content0!==""){
        $("#myrelations-page1").find(".appui-nocontent").hide();

    }else if(content0==""){
        $("#myrelations-page1").find(".appui-nocontent").show();
    };
</script>
    <script>
        var content1=$("#myrelations-page2").find(".just-name").text();
        //我问
        if (content1 !== "") {
            $("#myrelations-page2").find(".appui-nocontent").hide();

        } else if (content1 == "") {
            $("#myrelations-page2").find(".appui-nocontent").show();
        }
</script>

</body>
