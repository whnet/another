<?php
use yii\helpers\Html;
use yii\grid\GridView;
$this->params['breadcrumbs'][] = $this->title;
?>
<body class="bg-greyfa">
<div id="container" class="container personaldata-container">
    <div id="page">
        <!--页面导航栏-->
        <div class="page__hd bg-white fc-black b-b-grey scrollhd">
            <div class="statebar">
                <a class="nav-act left-act" onclick="goBack();"><img src="../bdt/images/nav_icon_back1.png?v=20170209160748"></a>
                <h2 class="fs34">选择行业</h2>
                <a class="but_save fs28 fc-black">保存</a>
            </div>
        </div>
        <!--页面主体-->
        <div class="page__bd scrollbd">
            <!--占位空间-->
            <div class="top-space1"></div>
            <!--已选择的地区-->
            <div class="selected-area bg-white mt10 b-tb-grey">
                <div class="appui_cells">
                    <div class="appui_cell fs28">
                        <div class="appui_cell__bd">
                            <p class="fc-grey678" id="selectArea">高新科技</p>
                        </div>
                        <div class="appui_cell__ft">
                            <p class="fc-greyabc">已选行业</p>
                        </div>
                    </div>
                </div>
            </div>
            <!--所有省份地区-->
            <div class="province-area bg-white mt10 b-tb-grey">
                    <div class="appui_cells" id="provinceList">
                        <div class="appui_cell fs28" onclick="showCityList(&quot;高新科技&quot;,1)" '="">
                        <div class="appui_cell__bd">
                            <p class="fc-grey678">高新科技</p></div></div>
                    <hr class="appui-navline-x bg-greyf1">
                    <div class="appui_cell fs28" onclick="showCityList(&quot;信息传媒&quot;,2)" '="">
                    <div class="appui_cell__bd"><p class="fc-grey678">信息传媒</p></div></div>
                <hr class="appui-navline-x bg-greyf1">
                <div class="appui_cell fs28" onclick="showCityList(&quot;金融&quot;,3)" '="">
                <div class="appui_cell__bd"><p class="fc-grey678">金融</p></div></div>
        </div>
</div>
<!--占位空间-->
<div class="bottom-space4"></div>
</div>
</div>
</div>
<div id="js-scrollbar" class="bg-white" style="right: 0px;">
    <!--选择市-->
    <div class="city-area bg-white b-tb-grey">
        <div class="appui_cells" id="cityList">
            <div class="appui_cell fs28" onclick="selectCity(&quot;互联网&quot;)">
                <div class="appui_cell__bd">
                    <p class="fc-grey678">互联网</p></div></div>
            <hr class="appui-navline-x bg-greyf1">
            <div class="appui_cell fs28" onclick="selectCity(&quot;电子商务&quot;)">
                <div class="appui_cell__bd"><p class="fc-grey678">电子商务</p></div></div>
        </div>

    </div>
</div>
<script>
    $('.province-area .appui_cell').each(function(index, element) {

        $(this).click(function(e) {
            $('.province-area .appui_cell').removeClass('bg-greyfa');
            $(this).addClass('bg-greyfa');
            $('#js-scrollbar').animate({
                'right': '0'
            }, 300);
            $('#js-bg').show();
        });
    });
    $('.city-area .appui_cell').click(function(e) {
        $('#js-scrollbar').animate({
            'right': '-60%'
        }, 300);
    });
</script>



</body>
