<?php

use yii\helpers\Html;
use yii\grid\GridView;

$this->params['breadcrumbs'][] = $this->title;

?>
<body class="bg-greyfa">
<div id="container" class="container red_packets_container" style="background:white">

    <div id="page">

        <!--页面导航栏-->
        <div class="page__hd bg-white scrollhd" style="border-bottom:.05rem solid #ececec">
            <div class="statebar">
                <!--a class="nav-act left-act" href="myset.html" id="back"><img src="../bdt/images/nav_icon_back1.png" /></a-->
                <a class="nav-act left-act" onclick="goBack();"><img src="../bdt/images/nav_icon_back1.png?v=20170209160748"></a>
                <h2 class=" fs36 fc-black" style="font-weight:600">关于我们</h2>
            </div>
        </div>
        <div class="page__bd scrollbd">

            <!--占位空间-->
            <div class="top-space1"></div>
            <img src="../bdt/images/about_us.jpg" alt="关于我们"/>
            <!--&lt;!&ndash;主体意内容&ndash;&gt;-->
            <!--<div class="" style="margin:1.5rem auto 0;">-->
                <!--<img src="http://data.prcmc.cn/attachment/image/20180821/1534847628619654.png" style="width:4rem;height:4rem;margin:0 auto;"/>-->
                <!--<p style="font-size:12px;text-align:center;margin-top:.5rem">关于律乎</p>-->
            <!--</div>-->
            <!--<div class="aboutus_details" >-->
                <!--<?=$this->params['site']['aboutus'];?>-->
            <!--</div>-->

            <!--&lt;!&ndash;占位空间&ndash;&gt;-->
            <!--<div class="bottom-space4"></div>-->

        </div>
        <!--结束-->
    </div>
</div>



</body>
