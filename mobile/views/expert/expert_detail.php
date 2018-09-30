<link type="text/css" rel="stylesheet" href="../layout/css/layout.css" />
<link type="text/css" rel="stylesheet" href="../bdt/css/qanda.css" />
<body>
<div id="container" class="container userpage-container bg-grey">
    <div id="page">
        <div class="page__hd fc-white allowScrollBox" style="white;padding-bottom:0;">
            <div class="statebar" style="background:rgba(249,249,249,0.99);">
                <a class="nav-act left-act" href="/site/index.html" style="opacity:0.7;width:5rem;line-height:2.2rem;">
                    <img src="../../bdt/images/nav_icon_back1.png" style="width:2rem;height:2rem;margin-left:-1.3rem;display:inline-block;vertical-align:middle"/>
                    <span style="color:#4C4C4C;font-size:13px;margin-left:-.3rem;height:2rem;line-height:2rem;font-weight:500;">去首页</span>
                </a>
                <a class="nav-act right-act" id="shareBtn" href="javascript:void(0)" style="width:1.5rem;opacity:0.7;color:white">
                    <img src="../../bdt/images/nav_icon_more1.png" style="margin-top:.25rem;"/>
                </a>
            </div>
        </div>
        <div class="page__bd allowScrollBox" id="page__bd" style="padding-top:2.2rem;">
            <div class="vip-head" style="" id="vipHead">
                <div class="vip-headbg bg-blue" >
                    <!--背景图-->
                    <img src="../bdt/images/headbg.jpg" id="vipHeadbg" />
                    <i class="vip-headpic" id="vipUserHeadpicLevel" style="">
                        <img id="vipUserHeadpic" src="<?=$info['user']['photo']?>" />
                        <i><img src="../bdt/images/v2.png" /></i>
                    </i>
                    <div class="vip-user-name-voice bg-black7030">
                        <span class="fc-white fs48"><?=$info['realname']?></span>
                    </div>
                    <h2 class="vip-user-title fs28 fc-back fwb"> <span class="fwn" style="color:white;"><?=$info['honor']?></span></h2>
                </div>
                <div class="vip-info bg-white">

                    <h3 class="fs28 fc-black mt10 fwb">[擅长] <span class="fwn"><?=$names?></span></h3>
                    <p class="fs28 fc-black mt10 fwb">[简介] <span class="fwn"><?=$info['des']?></span></p>
                    <a class="fs28 fc-blue" id="vipUserShowMore" style="display: none;">查看全部</a>
                </div>
            </div>
            <?php if($circle):?>
            <div class="expert-circle bg-white mt10" onclick="window.location.href='/circle/circle_page.html?id=<?=$circle['id']?>'">
                <h4 class="fs32 fwb fc-black">他的圈子</h4>
                <div class="expert-circle-adv">
                    <a class="expert-circle-headpic">
                        <img id="expertCircleHeadpic" src="<?=Yii::$app->params['public'].'/attachment'.$circle['logo']?>" /></a>
                    <h3 class="expert-circle-name fs32 fc-black fwb" style="padding-top:.2rem"><?=$circle['name']?></h3>
                    <p class="expert-circle-describe fs28 fc-black"><?=$circle['des']?></p>
                    <div class="expert-circle-hoster" style="height:.5rem">
                        <!--<a><img id="expertCircleHosterPic" src="<?=$info['user']['photo']?>" /></a>-->
                        <p class="fs24 fc-greyaaa" style="display:none">
                            <span class="fwb fc-black"><?=$info['realname']?></span>
                            <span id="expertCircleHosterTitle"><?=$info['honor']?></span></p>
                    </div>
                </div>
                <p class="epxert-circle-statistic-go">
                    <a class="fs20 fc-red bc-red" onclick="window.location.href='/circle/circle_page.html?id=<?=$circle['id']?>'">进圈子</a> </p>
            </div>
            <?php endif;?>
        </div>
        <div class="page__fd bg-white vip_foot has-meet" id="vipFootDiv">
            <div class="bg-white">
                <a class="vip-addfocus fc-grey666 fs24">¥<?=$info['price']?></a>
            </div>
            <div class="bg-white">
                <a class="expert-askbtn bg-red fc-grey666 fs24" id="askVipBtn" onclick="getAskUser()">向他提问</a>
            </div>
        </div>
        <div class="circle-share-dialog" id="shareView" style="display: none;">
            <div class="appui-mask black"></div>
            <div class="circle-share-con">
                <a id="closeShare" class="circle-share-close"></a>
            </div>
        </div>
    </div>
    <!--分享遮罩层-->
    <div class="share-prompt-box" id="share_this" style="display: none;">
        <div class="prompt-mask">
            <div class="circle_share_box">
                <img src="../bdt/images/share1.png" alt="华麦律师">
            </div>
            <a href="javascript:void(0)" class="close-btn">
                <img src="../bdt/images/share-btn.png" alt="华麦律师">
            </a>
        </div>
    </div>
</div>
<script>
    function getAskUser(){
        window.location.href="/questions/wen_questions.html?id="+request('id')+"&from=found&publishtype=ask";
    };
    $("#shareBtn").click(function(){
         $("#share_this").show();
    })
    $(".close-btn").click(function(){
        $("#share_this").hide();
    })

    $(function(){
        // //  问答消息进度调显示隐藏
        // if($.cookie("is_cookie")!='yes'){
        //     $(".downloadBar").show();
        //     $(".downloadBar .closebtn").click(function(){
        //         $(".downloadBar").hide();
        //         alert("2")
        //         $.cookie("is_cookie","yes",{expires:1});
        //         alert("3")
        //     })
        // }else if($.cookie("is_cookie")=='yes'){
        //     $(".downloadBar").hide();
        // }
    //    如果收费为0 免费提问
       var price=$(".vip-addfocus").html();

        if(price.slice(1)=="0.00"){
          $(".expert-askbtn").html("免费提问")
        }
    })
</script>
</body>
</html>