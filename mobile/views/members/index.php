<?php

use yii\helpers\Html;
use yii\grid\GridView;

$this->params['breadcrumbs'][] = $this->title;

?>
<body>
<link type="text/css" rel="stylesheet" href="../bdt/css/user.min.css">
<script type="text/javascript" src="../bdt/js/jquery.cookie.js"></script>


<div id="container" class="container usercenter-container bg-grey">
    <div id="page">
        <div class="page__bd scrollbd">
            <div class="user-center-container">
                <div class="user-info-module bc-grey">
                    <div id="loginId" class="u-i-moudele-top bg-other" style="<?php if($user['id']):?>display:block;<?php else:?>display:none;<?php endif;?> ">
                        <div style="display:block;" class="cover-bg"></div>
                        <div class="u-i-m-t-con">
                            <div>
                                <i id="headPic"><img src="<?=$user['photo']?>"></i>
                                <?php if($user['expert']['vip'] == 1):?>
                                <span id="level" class="vip-level vip-level2"></span>
                                <?php elseif($user['expert']['vip'] == 0):?>
                                    <span id="level" class="vip-level vip-level1"></span>
                                <?php endif;?>
                            </div>
	                        <?php if($user['expert']['vip'] == 1):?>
                            <span class="mt10 fc-white fs34"><?=$user['expert']['realname']?></span>
	                        <?php elseif($user['expert']['vip'] == 0):?>
                                <span class="mt10 fc-white fs34"><?=$user['nickname']?></span>
	                        <?php endif;?>
                        </div>
                        <p class="signature fc-white fs24"></p>
                        <?php if($user['expert']['vip'] == 1):?>
                        <a class="u-i-moudele-edit" style="display:block;" href="/members/myqrcode.html">
                            <img src="../bdt/images/qrcode_icon.png">
                            <span class="fc-white fs24">名片</span>
                        </a>
                        <?php endif;?>
                    </div>

                    <div class="u-i-moudele-bottom bg-white fs30">
                        <a href="mywallet.html">
                            <i id="moneyCount" class="fc-black"><?=$total;?></i>
                            <i class="fc-grey678">收入</i></a>
                        <a class="bc-grey" href="/members/myrelations.html#1">
                            <i id="focusCount" class="fc-black"><?=$concern;?></i>
                            <i class="fc-grey678">关注</i></a>
                        <a href="/members/myrelations.html#2">
                            <i id="fansCount" class="fc-black"><?=$fans;?></i>
                            <i class="fc-grey678">粉丝</i></a>
                    </div>
                </div>
                <!--个人中心-功能按钮列表-->
                <div class="function-module">
                    <!--功能列表-->
                    <div class="function bg-white bc-grey mt10">
                        <a class="function-btn bc-grey fc-black" href="myhomepage.html?read=1">
                            <img class="btn-img" src="../bdt/images/icon6_grey.png">
                            <span class="fs30">我的问答</span>
                            <img class="btn-arrow" src="../bdt/images/icon06.png">
                            <em class="statistic">
                                <i class="fs28 fc-greyabc" id="unAnswerQa" style="display:block;"></i>
                                <i class="fs28 fc-greyabc" id="unreadQa" style="display: block;"></i>
                            </em>
                        </a>
                        <a class="function-btn bc-grey fc-black" href="mynotice.html">
                            <img class="btn-img" src="../bdt/images/icon03_grey.png">
                            <span class="fs30">我的消息</span>
                            <img class="btn-arrow" src="../bdt/images/icon06.png">
                            <i class="messagetips bg-red fs26 fc-white" style="display:none"></i>
                        </a>
                        <a class="function-btn bc-grey fc-black" href="myarticle.html">
                            <img class="btn-img" src="../bdt/images/icon10_grey.png">
                            <span class="fs30">我的发布</span>
                            <img class="btn-arrow" src="../bdt/images/icon06.png">
                        </a>
                         <?php if($user['expert']):?>
                             <?php if($user['expert']['vip'] == 0):?>
                                     <a onclick="expertMsg();" class="function-btn bc-grey fc-black">
                                         <img class="btn-img" src="../bdt/images/preson_grey.png">
                                         <span class="fs30">成为专家</span>
                                         <img class="btn-arrow" src="../bdt/images/icon06.png">
                                         <em class="fs30 fc-red mr5">等待审核</em>
                                     </a>
                             <?php else:?>
                                 <a class="function-btn bc-grey fc-black"  href="myqrcode.html">
                                     <img class="btn-img" src="../bdt/images/erweima.png">
                                     <span class="fs30">我的名片</span>
                                     <img class="btn-arrow" src="../bdt/images/icon06.png">
                                 </a>
                                 <a href="qanda_certify.html" class="function-btn bc-grey fc-black">
                                     <img class="btn-img" src="../bdt/images/preson_grey.png">
                                     <span class="fs30">修改认证信息</span>
                                     <img class="btn-arrow" src="../bdt/images/icon06.png">
                                     <em class="fs30 fc-red mr5">已认证</em>
                                 </a>
                              <?php endif;?>
                         <?php else:?>
                             <a href="qanda_certify.html" class="function-btn bc-grey fc-black">
                                 <img class="btn-img" src="../bdt/images/preson_grey.png">
                                 <span class="fs30">成为专家</span>
                                 <img class="btn-arrow" src="../bdt/images/icon06.png">
                                 <em class="fs30 fc-red mr5">去认证</em>
                             </a>
                        <?php endif;?>
                        <a id="invitate"  style="display:block" class="function-btn bc-grey fc-black">
                            <img class="btn-img" src="../bdt/images/icon09_grey.png">
                            <span class="fs30">邀请朋友成为专家</span>
                            <img class="btn-arrow" src="../bdt/images/icon06.png">
                        </a>
                    </div>
                    <div class="function bg-white bc-grey mt10">
                        <a class="function-btn bc-grey fc-black" href="myset.html">
                            <img class="btn-img" src="../bdt/images/icon05_grey.png">
                            <span class="fs30">设置</span>
                            <img class="btn-arrow" src="../bdt/images/icon06.png">
                        </a>
                    </div>
                </div>
            </div>
            <div class="bottom-space2"></div>
            <div class="clearclick" style="display:none"></div>
        </div>
        <div class="page__fd bg-white fs22 bc-grey scrollfdt" >
            <div class="tab-con">
                <?=$this->render('/_footer')?>
            </div>
        </div>
    </div>
    <!--分享遮罩层开始-->
    <div class="share-prompt-box" id="share_this" style="display:none;">
        <div class="prompt-mask" >
            <div class="circle_share_box">
                <img src="../bdt/images/share1.png" alt="华麦律师" />
            </div>
            <a href="javascript:void(0)" class="close-btn">
                <img src="../bdt/images/share-btn.png" alt="华麦律师" />
            </a>
        </div>
    </div>
    <!--分享遮罩层结束-->
</div>
<script>
    $("#invitate").on("click", function () {
        $('#share_this').css('display','block');
    })
    $(".close-btn").on("click",function(){
        $(".share-prompt-box").hide();
    })
    function expertMsg(){
        dataLoadedSuccess("请等待审核");
    };
    $(document).ready(function(){
        if($(".vip-level").hasClass("vip-level1")){
              $(".u-i-moudele-edit").hide();
             $("#mycode").hide();
        }else{
            $(".u-i-moudele-edit").show();
            $("#mycode").show();
        }
        }
    )
</script>
<script>
    //  问答消息进度调显示隐藏
    $(function(){
        if($.cookie("is_cookie")!='yes'){
            $(".downloadBar").show();
            $(".downloadBar .closebtn").click(function(){
                $(".downloadBar").hide();
                // alert("2")
                $.cookie("is_cookie","yes",{expires:1});
                // alert("3")
            })
        }else if($.cookie("is_cookie")=='yes'){
            $(".downloadBar").hide();
        }
    })
</script>
</body>