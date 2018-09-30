<?php

use yii\helpers\Html;
use yii\grid\GridView;

$this->params['breadcrumbs'][] = $this->title;
?>
<link type="text/css" rel="stylesheet" href="../bdt/css/user.min.css">
<body class=" bg-greyfa">
<div id="container" class="container">
    <div id="page">
        <!--页面导航栏-->
        <div class="page__hd bg-white b-b-grey fc-black scrollhd">
            <div class="statebar">
                <!--a class="nav-act left-act" href="javascript:history.back(-1);"><img src="../bdt/images/nav_icon_back1.png" /></a-->
                <a class="nav-act left-act" onclick="goBack();"><img src="../bdt/images/nav_icon_back1.png?v=20170209160748"></a>
                <h2 class="fs34">优惠券</h2>
            </div>
        </div>
        <div class="page__bd scrollbd">
            <div class="top-space1"></div>
            <div>
                <p class="fs28 fc-black coupon_tips">您当前只有3张优惠券可用</p>
                <div id="couponField">
                    <div class="yhquan inuse bg-white">
                        <div class="bgImg">
                            <img src="../bdt/images/youhuiquan.jpg" alt=""></div>
                        <p class="quan-type fc-white fs30">提问券</p>
                        <div class="quan-detail">
                            <h2 class="fs30 fc-black">提问券</h2>
                            <div class="mt15"><p class="fs24 fc-greyabc">2017-2-9 至 2017-6-30 有效</p>
                                <p class="fs24 fc-greyabc">绑定手机赠送，该券可以免费提问一次！</p></div>
                            <img class="outDateImg" src="../bdt/images/outDate.png" alt="">
                            <img class="usedImg" src="../bdt/images/used.png" alt="">
                            <span class="fs28 fc-orange inusep">可使用</span>
                        </div></div>

                    <div class="yhquan inuse bg-white"><div class="bgImg">
                            <img src="../bdt/images/youhuiquan.jpg" alt=""></div><p class="quan-type fc-white fs30">围观券</p><div class="quan-detail">
                            <h2 class="fs30 fc-black">免费围观券</h2>
                            <div class="mt15"><p class="fs24 fc-greyabc">2017-3-20 至 2017-6-30 有效</p>
                                <p class="fs24 fc-greyabc">注册赠送，用户可免费偷听或阅读一次付费问答。</p></div>
                            <img class="outDateImg" src="../bdt/images/outDate.png" alt="">
                            <img class="usedImg" src="../bdt/images/used.png" alt="">
                            <span class="fs28 fc-orange inusep">可使用</span></div>
                    </div>
                    <div class="yhquan outDate bg-white">
                        <div class="bgImg"><img src="../bdt/images/youhuiquan.jpg" alt=""></div>
                        <p class="quan-type fc-white fs30">提问券</p>
                        <div class="quan-detail"><h2 class="fs30 fc-black">提问券</h2>
                            <div class="mt15"><p class="fs24 fc-greyabc">2017-2-10 至 2017-6-30 有效</p>
                                <p class="fs24 fc-greyabc">注册赠送，该券可以免费向金V行家提问一次！</p></div>
                            <img class="outDateImg" src="../bdt/images/outDate.png" alt="">
                            <img class="usedImg" src="../bdt/images/used.png" alt="">
                            <span class="fs28 fc-orange inusep">可使用</span>
                      </div>


                    </div>
                </div>
            </div>
            <!--没有优惠券的提示-->
            <div class="appui-nocontent" style="display:none;">
                <span><img src="../bdt/images/nocontent.png?v=20170208234732"></span>
                <p class="mt10 fs28 fc-greyabc">暂时没有优惠券</p>
            </div>
        </div>
    </div>
</div>



</body>
