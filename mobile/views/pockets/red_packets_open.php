<?php
use common\tools\htmls;
?>
<body class="bg-greyfa">
<div id="container" class="container red_packets_container">
    <div id="page">
        <!--页面导航栏-->
        <div class="page__hd redpacketbg scrollhd">
            <div class="statebar">
                <a class="nav-act left-act" onclick="goBack();"><img src="../bdt/images/nav_icon_back.png"></a>
                <h2 class="fs34 fc-white" style="font-weight:600">红包</h2>
            </div>
        </div>
        <div class="page__bd scrollbd">
            <div class="rp_open bg-white">
                <div class="rpo_silhouette">
                    <i id="headPic"><img src="<?=$info['user']['photo']?>"></i>
                    <h1 class="fs40" id="userName"><?=$info['user']['nickname']?>的红包</h1>
                </div>
                <?php if( ($info['pocket_nums'] - $redNums) >0):?>
                <div class="rpo_amount_container">
                    <h2 class="fs32 fc-greyabc" id="titleId">您已经获得红包</h2>
                    <div class="rpo_money fc-black" id="rpo_money_div">
                        <p ><?=$my['get_price']?></p>
                        <span class="fs30">元</span>
                    </div>
                </div>
                <?php else:?>
                    <div class="rpo_amount_container">
                        <h2 class="fs32 fc-greyabc" >红包已经被领完</h2>
                    </div>
                <?php endif;?>

                <div class="rpo_receive_status">
                    <span class="fs28" id="redCountStatus"><?=$info['pocket_nums']?>个红包，被领<?=$redNums?>个</span>
                    <!-- <a class="fs28" id="continue" href="red_packets.html">继续发送</a> -->
                </div>
            </div>

            <!--打开红包-->
            <div class="packet-record packer_record b-t-greye6" id="rpr_record1">
                <ul class="packet-record-list">
                    <?php foreach($list as $k=>$v):?>
                    <li class="packet-record-item b-b-greye6"><i class="pri-headpic mr5">
                            <img src="<?=$v['user']['photo']?>"></i>
                        <span class="pri-type-time"><i class="fs28 fc-black"><?=$v['user']['nickname']?></i>
                            <i class="fs20 fc-grey666"><?=htmls::formatTime($v['created']);?></i></span>
                        <em class="pri-quota fc-black fs24"><?=$v['get_price']?>元</em>
                    </li>
                    <?php endforeach;?>
                </ul>

            </div>

        </div>

    </div>
</div>



</body>