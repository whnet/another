<?php

use yii\helpers\Html;
use yii\grid\GridView;

$this->params['breadcrumbs'][] = $this->title;
?>
<script type="text/javascript" src="../bdt/js/mywallet.js"></script>
<link type="text/css" rel="stylesheet" href="../bdt/css/user.min.css">
<body class=" bg-greyfa">
<div id="container" class="container">
    <div id="page">
        <!--页面导航栏-->
        <div class="page__hd bg-white b-b-grey fc-black">
            <div class="statebar">
                <a class="nav-act left-act" onclick="goBack();">
                    <img src="../bdt/images/nav_icon_back1.png"></a>
                <h2 class="fs34">收入</h2>
            </div>
        </div>
        <div class="page__bd">
            <div class="top-space4"></div>

            <div class="bg-white" id="my_wallet">
                <p class="fs28 fc-grey999">总金额(元)</p>
                <h2 class="fc-navy wei" data-sales="<?=$total * $bili;?>"><?=$total;?></h2>
                <a class="get-cash fs28 fc-white bg-red can">提现</a>
            </div>
            <ul class="bg-white income" id="income">
                <i></i>
                <li>
                    <h3 class="fc-black fs30">回答收入</h3>
                    <p id="myAnswer" class="fc-grey999 fs28"><?=$QuestionPrice;?></p>
                </li>
                <li>
                    <h3 class="fc-black fs30">红包收入</h3>
                    <p id="myAsk" class="fc-grey999 fs28"><?=$PocketPrice;?></p>
                </li>
                <li>
                    <h3 class="fc-black fs30">圈子收入</h3>
                    <p id="myShare" class="fc-grey999 fs28"><?=$CirclePrice;?></p>
                </li>
                <i></i>
            </ul>
            <p class="cash-tips fs28 fc-red">
                提示：
                最低提现额度为10元，每天最多能提现2000元。
                申请提现后，7个工作日内到账 ，平台将收取<?=$fencheng;?>%金额作为服务费。</p>
            <p class="cash-tips fs28 fc-red"></p>

        </div>

        <div class="page__fd" style="display:none">
            <a class="charge_tips fs28 fc-grey999">提现记录</a>
        </div>
    </div>
</div>


<!--弹出的解释说明-->
<div class="js_dialog" style="display:none;">
    <div class="appui-mask"></div>
    <div class="appui-helptext bg-white" id="helptext" style="display:none;">
        <h2 class="appui-helptext-hd fs32 fc-black b-b-grey">提现记录</h2>
        <div class="appui-helptext-bd fc-black456 b-b-grey">
            <div class="appui-helptext-bd-con fc-black">
                <?php foreach($tixianRecord as $k=>$v):?>
                    <p class="fs30 mb10">(<?=$k+1;?>) <?=date('Y/m/d',$v['created']);?>提现<?=$v['price'];?>元,状态:<?php if($v['status'] == 1):?>已到账<?php else:?>未到账<?php endif;?></p>
                <?php endforeach;?>
            </div>
        </div>
        <h2 class="appui-helptext-fd fs32 fc-orange">知道了</h2>
    </div>
</div>
<script>
    $('.charge_tips').click(function(e) {
        setTimeout(function() {
            $('.js_dialog').show();
            $('#helptext').show();
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
</script>
<?php if($total >= 10):?>
    <script>
        $(document).ready(function() {
            var price = $('.wei').data('sales');
            var total = $('.wei').text();
            if(total < 10.00){
                $('.can').text('不能提现');
                $(".can").click(function(){
                    dataLoadedError("最低提现额度为10元");
                });
                return false;
            }else{
                $('.can').text('可提现');
            }
            $(".can").click(function(){
                friendTipsTixian("平台将扣除15%的服务费，7个工作日内到账","放弃","提现",price);
            });

        });
        function friendTipsTixian(dialogContent,operateAssistText,operateMainText,price){
            var dialogStr =		'<div class="js_dialog toastDialogSure" id="iosDialog1" >' ;
            dialogStr +=		'<div class="appui-mask"></div>' ;
            dialogStr +=		'<div class="appui-dialog">' ;
            dialogStr +=			'<div class="appui-dialog__hd fs34 fc-blue"><strong class="appui-dialog__title">温馨提示</strong></div>' ;
            dialogStr +=			'<div class="appui-dialog__bd fs30 fc-black456">' + dialogContent + '</div>' ;
            dialogStr +=			'<div class="appui-dialog__ft fs30">' ;
            dialogStr +=				'<a id="tipsCancleID" class="appui-dialog__btn appui-dialog__btn_default fc-greyabc" onclick="backFunctionTixian()">' + operateAssistText + '</a>' ;
            dialogStr +=				'<a href="javascript:;" id="tipsSaveID" onclick="saveFunctionTixian('+price+')"  class="appui-dialog__btn appui-dialog__btn_primary fc-blue" >' + operateMainText + '</a>' ;
            dialogStr +=			'</div>' ;
            dialogStr +=		'</div>' ;
            dialogStr +=	'</div>' ;
            $("body").append(dialogStr);
        }
        function backFunctionTixian(){
            window.location.reload();
        }
        function saveFunctionTixian(price){
            tixian(price);
        }
        function tixian(price){
            dataLoading("申请提交中...");
            var csrf = $('input[name="csrf"]').val();
            $.ajax({
                type: "POST",
                url: "/members/tixian.html",
                data: {
                    price:price,
                    _csrf:csrf,
                },
                dataType: "json",
                success: function(data){
                    if(data.result == "success"){
                        dataLoadedSuccess("提交成功");

                        window.location.href = '/members/index.html'
                    }
                }
            });
        }
    </script>
<?php else:?>
    <script>
        $(document).ready(function() {
            var price = $('.wei').data('sales');
            var total = $('.wei').text();

            if(total < 10.00){
                $('.can').text('不能提现');
                $(".can").click(function(){
                    dataLoadedError("最低提现额度为10元");

                });
                return false;
            }else{
                $('.can').text('可提现');
            }



        });
    </script>
<?php endif;?>
</body>