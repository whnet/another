<body>
<script type="text/javascript" src="../bdt/js/picPop.js"></script>
<link type="text/css" rel="stylesheet" href="../bdt/css/circle.css">
<div id="container" class="container article-container bg-grey">
    <div id="page">
        <div class="page__hd bg-white fc-balck b-b-grey scrollhd">
            <div class="statebar">
                <a class="nav-act left-act"  href="/site/index.html">
                    <img src="../bdt/images/nav_icon_back1.png">
                </a>
                <h2 class="fs34" id="qzName">成为会员</h2>
            </div>
        </div>

        <!--页面主体-->
        <div class="page__bd bg-grey scrollbd">
            <div class="top-space1"></div>
            <div class="circle-share-detail">
                <!-- 头部背景图显示区域 -->
                <div class="csd-head">
                    <img class="csd-head-bg filter3" id="backgroundPic" src="../bdt/images/default.jpg" style="margin-top: -216px; top: 50%;">
                    <div class="csd-head-body">
                        <i class="mt30">
                            <img src="<?=$feeUser['logo'];?>">
                        </i>
                        <h4 class="fs30 fc-black mt15" ><?=$feeUser['title'];?></h4>
                        <p class="fs20 fc-black"></p>
                    </div>
                </div>

                <!-- 分享圈子资料 -->
                <div class="csd-brief bg-white">
                    <div class="csd-brief-info">
                        <em class="csd-brief-liststyle"><i></i></em>
                        <h4 class="fs28 fwb">会员权益</h4>
                        <p class="fs26 fc-black mt10"><?=$feeUser['quanyi'];?></p>
                    </div>
                    <div class="csd-brief-join">
                        <em class="csd-brief-liststyle"><i></i></em>
                        <h4 class="fs28 fwb" id="joinPrice">加入会员:￥<?=$feeUser['price'];?>/年</h4>
                        <p class="fs26 mt10" id="joinSummary">付款成功后，您可以在<span><?=date('Y年m月d日',time());?>至<?=date('Y年m月d日',strtotime('+1 year'));?></span>查看、发布相关内容</p>
                    </div>
                </div>

            </div>

            <!--占位空间-->
            <div class="bottom-space1"></div>
        </div>
        <a class="add-circle bg-red fc-white fs28" id="toPayUser" data-price="<?=$feeUser['price'];?>"><span>支付¥<?=$feeUser['price'];?></span>成为会员</a>
        <input type="hidden" name="mid" value="<?=$mid;?>">
        <input type="hidden" name="preurl" value="<?=$preurl;?>">
    </div>
</div>
<script>
    $("#toPayUser").click(function(){
        joinFeeUser();
    });
    //调起微信支付,如果是免费就直接加入
    function joinFeeUser(){
        var price =$('#toPayUser').attr('data-price') * 100;
        if(price == 0){
            addUser(price);
        }else{
            //这里要唤起微信支付
            var csrf = $('input[name="csrf"]').val();
            $.ajax({
                type: "post",
                url: '/circle/wxpay.html',
                dataType: "json",
                async: true,
                data:{
                    "title":'feeuser',
                    "pay_id":0,
                    "price":price,
                    '_csrf':csrf,
                },
                success: function(data) {
                    if(data.result == 'success'){
                        getWxConfigUser(data.config.timestamp, data.config.nonceStr, data.config.package, data.config.signType, data.config.paySign);
                    }
                }
            });
        }

    }
    //微信相关
    function getWxConfigUser(timestamp, nonceStr, package, signType, paySign){
        wx.chooseWXPay({
            timestamp: timestamp,
            nonceStr: nonceStr,
            package: package,
            signType: signType,
            paySign: paySign,
            success: function (res) {
                // 支付成功后的回调后，返回上一个url,防止从分享中来的人支付后出现不能跳转问题
                goBack();

            }
        });
    }
    //向数据库写数据
    function addUser(price){
        var csrf = $('input[name="csrf"]').val();
        var mid = $('input[name="mid"]').val();
        var preurl = $('input[name="preurl"]').val();
        $.ajax({
            type: "post",
            url: '/circle/wxpay.html',
            dataType: "json",
            async: true,
            data:{
                "title":'feeuser',
                "pay_id":0,
                "price":price,
                '_csrf':csrf,
            },
            success: function(result) {
                clearToastDialog();
                window.location.href = preurl;
            }
        });
    }
</script>
<!--语音播放器-->
</body>