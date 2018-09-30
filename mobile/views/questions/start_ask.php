<link type="text/css" rel="stylesheet" href="../bdt/css/startAsk.css"
/>
<script type="text/javascript" src="../bdt/js/startAsk.js">
</script>
<body class="bg-greyf1">
<div id="container" class="startask-container">
    <div class="fixed bg-grey star_ask_head">
        <div id="top" class="b-b-grey">
            <a onclick="goBack()"><img src="../bdt/images/nav_icon_back1.png" ></a>
            <h1>提问</h1>
        </div>


        <div id="ask_content">
            <div class="qnada-q-data-limit" style="margin-bottom:0.2rem">
                <span class="appui_cell__switch appui_cell__switch-on"><i class="bg-white"></i></span>
                <p class="fs24 fc-greyabc">公开提问</p>
            </div>
                <textarea id="content" placeholder="请告知你想了解的问题，我会一一为你解答"></textarea>
            <!--短消息-插入图片示例-->
            <div class="qanda-pic">
                <a class="add-qanda-pic bc-grey" contenteditable="false">
                    <i class="bg-greyf1"></i>
                    <i class="bg-greyf1"></i>
                    <input id="filehidden" style="width: 100%;height: 100%;diplay:block;opacity: 0;" type="file" name="filehidden">
                </a>
            </div>
            <div class="askStatus"><p><span id="tempNum">0</span>/140</p></div>
        </div>

        <div id="chooseType">
<!--            <a class="ask_tips fs24 fc-orange mt5">查看问答细则及责任声明</a>-->
            <h2 class="fs30 fc-black456">请选择专家类型</h2>
            <ul id="typeCho">

                <li id="oLi0" onclick="gotoProfessList(0,'推荐')" class="active_type">推荐</li>
                <?php foreach($type as $k=>$v):?>
                    <li id="oLi<?=$v['id'];?>" onclick="gotoProfessList(<?=$v['id']?>,'<?=$v['name']?>')"><?=$v['name']?></li>
                <?php endforeach;?>
            </ul>
        </div>
    </div>
    <div id="page">
        <div class="page__bd" id="list">
            <div id="noneCouponSpace" class="top-space1 notop">
            </div>
            <div id="hasCouponSpace" class="top-space6 notop">
            </div>
            <div class="expert-list" id="profCho"></div>
            <div class="bottom-space4">
            </div>
        </div>
        <div class="page__bd" style="display:none;">
            <!--图片预览-->
            <div class="appui-gallery" id="gallery">
                <span class="appui-gallery__img">
                        <img src="../bdt/images/user_116_100.jpg">
                    </span>
            </div>
        </div>
        <div class="page__fd" id="page__fd-askBtn">
            <div class="ask_sure">
                    <span class="bg-white">
                        <!--use_coupon-->
                        <em><i id="askId" class="fs34 fc-orange"></i>
                            <i class="bg-orange"></i>
                        </em>
                        <em class="fc-black fs24">使用优惠券</em>
                    </span>
                <a id="sendQuest" class="bg-orange fs30 fc-white">向<span class="ml5 mr5">他</span>提问</a>
            </div>
        </div>
    </div>
</div>
<!--弹出的解释说明-->
<!--<div class="js_dialog" style="display:none;">-->
<!--    <div class="appui-mask">-->
<!--    </div>-->
<!--    <div class="appui-helptext bg-white" id="helptext" style="display:none;">-->
<!--        <h2 class="appui-helptext-hd fs32 fc-black b-b-grey">-->
<!--            问答细则及责任声明-->
<!--        </h2>-->
<!--        <div class="appui-helptext-bd fc-black456 b-b-grey">-->
<!--            <div class="appui-helptext-bd-con">-->
<!--                <p class="fs30 mb10 fc-black fwb">问答细则</p>-->
<!--                <p class="fs30">1、提出问题，支付赏金后，将等待答主开始回答；</p>-->
<!--                <p class="fs30">2、答主回答问题后，答主将获得赏金；</p>-->
<!--                <p class="fs30">3、若<span>48</span>小时内无应答，则全额退款。</p>-->
<!--                <p class="fs30 mb10 mt20 fc-black fwb">责任声明</p>-->
<!--                <p class="fs30 mb10">-->
<!--                    律乎”的相关回答仅为该答主在律乎等领域的个人经验、意见或观点，不能被自动视-->
<!--                    为该答主供职单位/机构的意见或观点，仅供用户参考所用，亦不能被认为是其他类似性质的文件。解答内容及-->
<!--                    答主个人观点不代表“律乎”平台观点，“律乎”平台对解答内容的正确性不予担保，对在“律乎”平台之外所进行-->
<!--                    的任何接洽行为的后果亦不予承担责任。烦请您在使用“律乎”前仔细阅读并确保完全理解以上声明的全部内容-->
<!--                    ，请知悉，谢谢。-->
<!--                </p>-->
<!--            </div>-->
<!--        </div>-->
<!--        <h2 class="appui-helptext-fd fs32 fc-orange">知道了</h2>-->
<!--    </div>-->
<!--    <div id="scanMe" class="bg-white" style="display: none;">-->
<!--        <div class="outer">-->
<!--            <h3 class="fs40 fc-blue"><span>提问</span>成功!</h3>-->
<!--            <p class="scan-title fs30">关注“律乎”官方公众号<br>第一时间收到行家的回复</p>-->
<!--            <img src="../bdt/images/wenfangba.jpg" alt="">-->
<!--            <p class="scan-cheerup fs26">关注"律乎"，可领-->
<!--                <span class="fc-red">优惠券</span>-->
<!--            </p>-->
<!--            <p class="scan-longtap fs32">长按，识别二维码，加关注</p>-->
<!--            <a class="fs26 fc-blue" href="#">不了,谢谢</a>-->
<!--        </div>-->
<!--    </div>-->
<!--</div>-->
<script>
    $('.ask_tips').click(function(e) {
        setTimeout(function() {
                $('.js_dialog').show();
                $('#helptext').show();
                $('#helptext').css('margin-top', -$('#helptext').height() / 2);
                if ($('#helptext').height() >= Math.floor($('body').height() * 0.70)) {
                    $('#helptext').find('.appui-helptext-bd').height($('#helptext').height() - $('.appui-helptext-hd').height() - $('.appui-helptext-fd').height());
                }
            },
            1000);
    });

    $('.appui-helptext-fd').click(function(e) {
        $('.js_dialog').hide();
        $('#helptext').hide();
        $('#helptext').css({
            'margin-top': '0',
            'height': 'auto'
        });
    });
</script>
</body>