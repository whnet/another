<body class="bg-greyfa" onunload="myClose()">
<script type="text/javascript" src="../bdt/js/red_packets_fightluck.js"></script>
<div id="container" class="container red_packets_container">
    <div id="page">
        <!--页面导航栏-->
        <div class="page__hd bg-white b-b-greyf1 scrollhd">
            <div class="statebar">
                <a class="nav-act left-act" onclick="goBack();">
                    <img src="../bdt/images/nav_icon_back1.png"></a>
                <h2 class="fs34 fc-black" style="font-weight:600">发红包</h2>
            </div>
        </div>
        <div class="page__bd scrollbd">
            <!--占位空间-->
            <div class="top-space1"></div>

            <div class="rp_fight_luck_content textinput" id="redpacket0" style="display: block;">
                <div class="rpf_money bg-white">
                    <i><img src="../bdt/images/pin.png"></i>
                    <h1 class="fs30">总金额</h1>
                    <p class="fs30">元</p>
                    <input id="redMoney0" type="number" placeholder="输入金额" class="fs30">
                </div>
                <div class="fs26" style="color:#596470; line-height:1.5rem; margin-left:0.75rem">当前为拼手气，<a class="fs26 fc-blue" id="changeType0">改为普通红包</a></div>
                <div class="rpf_number bg-white mt10">
                    <h1 class="fs30">红包个数</h1>
                    <p class="fs30">个</p>
                    <input id="redCount0" type="number" placeholder="输入个数" class="fs30">
                </div>
                <div class="bg-white rpf_brief">
                    <textarea id="notes0" placeholder="我在圈子发了红包，先到先得哟!" class="fs30 notes"></textarea>
                    <span class="fs30 fc-greyabc"><i id="length0" class="fs30 fc-greyabc">0</i>/30</span>
                </div>
                <p class="total_money mt20" id="totalMoney0" style="display:none;"><em class="fs28">￥</em><span class="fs50" id="totalMoneyAmount0"></span></p>
                <div class="rpf_total">
                    <a id="buttonTitle0" onclick="sendRedPacketFunction(0)" class="fs36">塞钱进红包</a>
                </div>
                <p class="fs26 rpf_ad">抢到红包的人，会成为你的粉丝哟!</p>
            </div>

            <div class="rp_fight_luck_content textinput" id="redpacket1" style="display: none;">
                <div class="rpf_money bg-white">
                    <h1 class="fs30">单个金额</h1>
                    <p class="fs30">元</p>
                    <input id="redMoney1" type="number" placeholder="输入金额" class="fs30">
                </div>
                <div class="fs26" style="color:#596470; line-height:1.5rem; margin-left:0.75rem">当前为普通红包，<a class="fs26 fc-blue" id="changeType1">改为拼手气红包</a></div>
                <div class="rpf_number bg-white mt10">
                    <h1 class="fs30">红包个数</h1>
                    <p class="fs30">个</p>
                    <input id="redCount1" type="number" placeholder="输入个数" class="fs30">
                </div>
                <div class="bg-white rpf_brief">
                    <textarea id="notes1" placeholder="我在圈子发了红包，先到先得哟!" class="fs30 notes"></textarea>
                    <span class="fs30 fc-greyabc"><i id="length1" class="fs30 fc-greyabc">0</i>/30</span>
                </div>
                <p class="total_money mt20" id="totalMoney1" style="display:none;"><em class="fs28">￥</em><span class="fs50" id="totalMoneyAmount1"></span></p>
                <div class="rpf_total">
                    <a id="buttonTitle1" onclick="sendRedPacketFunction(1)" class="fs36">塞钱进红包</a>
                </div>
                <p class="fs26 rpf_ad">抢到红包的人，会成为你的粉丝哟!</p>
            </div>

        </div>

    </div>
</div>



</body>