<body class="bg-greyfa">
<script type="text/javascript" src="../bdt/js/red_packets.js"></script>
<script type="text/javascript" src="../bdt/js/jquery.cookie.js"></script>
<div id="container" class="container">
    <div id="page">
        <!--页面导航栏-->
        <div class="page__hd scrollhd">
            <div class="statebar">
                <a class="nav-act left-act" onclick="goBack()">
                    <img src="../bdt/images/nav_icon_back.png">
                </a>
                <h2 class="fs34 fc-white" style="font-weight:600">红包</h2>
                <a class="nav-act right-act fs24 fc-white" id="redPacketRule" style="display:none">规则</a>
            </div>
        </div>
        <div class="page__bd redpacketbg">
            <div class="red_packets">
                <div class="rp_button" style="margin-top: 320px;">
                    <a onclick="gotoRed_packets_fightluckHtml(1)" class="fs36">在社区发红包</a>
                    <a onclick="" class="fs36"></a>
                </div>
                <div class="rp_introduce">
                    <p class="fs28">给你的粉丝，发一些红包互动吧</p>
                    <p class="check-packet fs24"></p>
                </div>
            </div>



        </div>

    </div>
</div>
<!--弹出的解释说明-->
<div class="js_dialog" style="display:none;">
    <div class="appui-mask"></div>
    <div class="appui-helptext bg-white" id="helptext" style="display:none;">
        <h2 class="appui-helptext-hd fs32 fc-black b-b-grey">发红包规则</h2>
        <div class="appui-helptext-bd fc-black456 b-b-grey">
            <div class="appui-helptext-bd-con fc-black">
                <p class="fs30 mb10 fwb">1、如何领取红包？</p>
            </div>
        </div>
        <h2 class="appui-helptext-fd fs32 fc-orange">知道了</h2>
    </div>
</div>
<script>
    $('#redPacketRule').click(function(e) {
        setTimeout(function() {
            $('.js_dialog').show();
            $('#helptext').show();
            //alert(Math.floor($('body').height()*0.70));
            $('#helptext').css('margin-top', -$('#helptext').height() / 2);
            if ($('#helptext').height() >= Math.floor($('body').height() * 0.70)) {
                $('#helptext').find('.appui-helptext-bd').height($('#helptext').height() - $('.appui-helptext-hd').height() - $('.appui-helptext-fd').height());
            }
        }, 1000);
    });

    $('.appui-helptext-fd').click(function(e) {
        $('.js_dialog').hide();
        $('#helptext').hide();
        $('#helptext').css({
            'margin-top': '0',
            'height': 'auto'
        });
    });

    $('.rp_button').css('margin-top',$('#container').width()*0.8);
</script>


</body>