<?php

use yii\helpers\Html;
use yii\grid\GridView;

$this->params['breadcrumbs'][] = $this->title;
?>
<script type="text/javascript" src="../bdt/js/personal_data.js"></script>
<script type="text/javascript" src="../bdt/js/LCalendar.js"></script>
<link type="text/css" rel="stylesheet" href="../bdt/css/LCalendar.css">
<script type="text/javascript" src="../bdt/js/LArea.js"></script>
<script type="text/javascript" src="../bdt/js/slideSelect.min.js"></script>
<script type="text/javascript" src="../bdt/js/jquery.cookie.js"></script>
<body>
<div id="container" class="container personaldata-container">
    <div id="page">
        <!--页面导航栏-->
        <div class="page__hd bg-white fc-black b-b-grey scrollhd">
            <div class="statebar">
                <a class="nav-act left-act" onclick="saveFunction()"><img src="../bdt/images/nav_icon_back1.png"></a>
                <h2 class="fs34">个人资料</h2>
            </div>
        </div>
        <!--页面主体-->
        <div class="page__bd scrollbd">
            <!--占位空间-->
            <div class="top-space1"></div>
            <!--个人资料完善程度提醒-->
            <!--<a class="appui_tips bg-white fs30 fc-grey678 mt10 bc-grey" onclick="$('#moredata').slideDown();" style="display:none;">
                <span>个人资料完成度60%</span>
                <i><img src="../bdt/images/go_orange.png"></i>
                <em>完善更多</em>
            </a>-->
            <!--个人资料-->
            <div class="personal-data bg-white b-b-grey ">
                <div class="appui_cells">
                    <div class="appui_cell fs28" onclick="location='user_photo_edit.html'">
                    <!--<div class="appui_cell fs28">-->
                        <div class="appui_cell__bd">
                            <p class="fc-black">头像</p>
                        </div>
                        <div class="appui_cell__ft mr20">
                            <p class="fc-grey678" id="headPic">
                                <img class="portrait-img" src="<?=$user['photo']?>">
                            </p>
                        </div>
                        <i class="appui_cell__go"><img src="../bdt/images/icon06.png"></i>
                    </div>
                    <hr class="appui-navline-x bg-greyf1">
                    <div class="appui_cell fs28" onclick="gotoPersonalDataEdit(0)">
                        <div class="appui_cell__bd">
                            <p class="fc-black">昵称</p>
                        </div>
                        <div class="appui_cell__ft mr20">
                            <p class="fc-grey678" id="nickname"><?=$user['nickname']?></p>
                            <!--<input type="text" class="fc-grey678 fs28 bc-white" value="滑翔机的羽翼" readonly onChange="$(this).removeAttr('readonly').addClass('bc-grey').removeClass('bc-white');" onBlur="$(this).attr('readonly','true').addClass('bc-white').removeClass('bc-grey');" onFocus="$(this).removeAttr('readonly').addClass('bc-grey').removeClass('bc-white');;" />-->
                        </div>
                        <i class="appui_cell__go"><img src="../bdt/images/icon06.png"></i>
                    </div>
<!--                    <hr class="appui-navline-x bg-greyf1">-->
<!--                    <div class="appui_cell fs28">-->
<!--                        <div class="appui_cell__bd">-->
<!--                            <p class="fc-black">账号<span class="fc-greyabc">(不可修改)</span></p>-->
<!--                        </div>-->
<!--                        <div class="appui_cell__ft mr20">-->
<!--                            <p class="fc-grey678" id="username">--><?//=$user['account']?><!--</p>-->
<!--                        </div>-->
<!--                    </div>-->
                    <hr class="appui-navline-x bg-greyf1">
                    <div class="appui_cell fs28" onclick="location='personal_data_area_edit.html'" style="display: none;">
                        <div class="appui_cell__bd">
                            <p class="fc-black">地区</p>
                        </div>
                        <div class="appui_cell__ft mr20">
                            <p class="fc-grey678"><span id="province"></span><span class="ml5" id="city"></span></p>
                        </div>
                        <i class="appui_cell__go"><img src="../bdt/images/icon06.png"></i>
                    </div>
                </div>
            </div>
            <!--个人资料-->
            <div class="personal-data bg-white fs30 mt10 b-tb-grey ">
                <div class="appui_cells">
                    <div class="appui_cell fs28">
                        <div class="appui_cell__bd">
                            <p class="fc-black">性别</p>
                        </div>
                        <div class="appui_cell__ft mr20">
                            <label class="fc-grey678">
                                <input id="radioMan" type="radio" class="sex-btn mr5"  name="radiosex" value="1" >男</label>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <label class="fc-grey678">
                                <input id="radioWoman" type="radio" class="mr5" name="radiosex" value="0">女</label>
                        </div>
                    </div>
                    <input type="hidden" name="csrf" value="<?= Yii::$app->request->csrfToken ?>" >
                    <hr class="appui-navline-x bg-greyf1">
                    <div class="appui_cell fs28" onclick="gotoPersonalDataEdit(1)">
                        <div class="appui_cell__bd">
                            <p class="fc-black">个性签名</p>
                        </div>
                        <div class="appui_cell__ft mr20">
                            <p class="fc-grey678" id="motto"><?=$user['slogan']?></p>
                            <!--<input type="text" class="fc-grey678 fs28 bc-white" value="日行诸事，无咎，吉！" readonly onChange="$(this).removeAttr('readonly').addClass('bc-grey').removeClass('bc-white');" onBlur="$(this).attr('readonly','true').addClass('bc-white').removeClass('bc-grey');" onFocus="$(this).removeAttr('readonly').addClass('bc-grey').removeClass('bc-white');" />-->
                        </div>
                        <i class="appui_cell__go"><img src="../bdt/images/icon06.png"></i>
                    </div>
                    <hr class="appui-navline-x bg-greyf1">
<!--                    <div class="appui_cell fs28" onclick="location='personal_data_industry_edit.html'">-->
<!--                        <div class="appui_cell__bd">-->
<!--                            <p class="fc-black">行业</p>-->
<!--                        </div>-->
<!--                        <div class="appui_cell__ft mr20">-->
<!--                            <p class="fc-grey678" id="industry"></p>-->
<!--                        </div>-->
<!--                        <i class="appui_cell__go"><img src="../bdt/images/icon06.png"></i>-->
<!--                    </div>-->

<!--                    <div class="appui_cell fs28" id="areaSelect">-->
<!--                        <div class="appui_cell__bd">-->
<!--                            <p class="fc-black">所属地区</p>-->
<!--                        </div>-->
<!--                        <div class="appui_cell__ft mr20">-->
<!--                            <p class="fc-grey678" ></p>-->
<!--                        </div>-->
<!--                        <i class="appui_cell__go"><img src="../bdt/images/icon06.png"></i>-->
<!--                    </div>-->
<!---->
<!--                    <hr class="appui-navline-x bg-greyf1">-->
<!--                    <div class="appui_cell fs28"  style="display: none;">-->
<!--                        <div class="appui_cell__bd">-->
<!--                            <p class="fc-black">标签</p>-->
<!--                        </div>-->
<!--                        <div class="appui_cell__ft mr20">-->
<!--                            <p class="fc-grey678" id="label">投资 户型 验房 </p>-->
<!--                        </div>-->
<!--                        <i class="appui_cell__go"><img src="../bdt/images/icon06.png"></i>-->
<!--                    </div>-->
                </div>
            </div>
        </div>
    </div>
</div>

<script>
    var sexBool = <?=$user['sex']?>;
    var radioMan = $('#radioMan').val();
    var radioWoman = $('#radioWoman').val();
    var csrf = $('input[name="csrf"]').val();
    if (sexBool==1) {
        $("#radioMan").attr("checked",true);

    }else if (sexBool==0){
        $("#radioWoman").attr("checked",true);
    }else{
        $("#radioMan").attr("checked",false);
        $("#radioWoman").attr("checked",false);
    }
    $('#radioMan').click(function(){
        $.ajax({
            type: "POST",
            url: "personal_data.html",
            data: {sex:1,_csrf:csrf},
            dataType: "json",
            success: function(data){}
        });
    })
    $('#radioWoman').click(function(){
        $.ajax({
            type: "POST",
            url: "personal_data.html",
            data: {sex:0,_csrf:csrf},
            dataType: "json",
            success: function(data){}
        });
    })


</script>

</body>
