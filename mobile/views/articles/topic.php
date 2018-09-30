<html>
<head>
    <script type="text/javascript" src="../bdt/js/article_list.js"></script>
    <script type="text/javascript" src="../bdt/js/topic.js"></script>
    <script type="text/javascript" src="../bdt/js/commentAndVoiceCon.js"></script>
</head>
<body>
<div id="container" class="index-container bg-grey">
    <div id="page">
        <!--页面导航栏-->
        <div class="page__hd words_act fc-black bg-white b-b-greyf1 scrollhd" id="topicHead">
            <div class="statebar">
                <!-- <a class="fc-grey666 fs34 words_act">取消</a> -->
                <!-- <a class="nav-act left-act" id="back1"><img src="../bdt/images/nav_icon_back1.png" /></a> -->
                <h2 class="fs36" id="pageTitle">热点</h2>
                <!-- <a class="fc-black fs34">完成</a> -->
                <a class="nav-act left-act" onclick="goBack();"><img src="../bdt/images/nav_icon_back1.png" /></a>
            </div>
        </div>
        <!--页面导航栏-->
        <div class="page__hd bg-white fc-blue b-b-grey has-tab" id="articleHead" style="display:none;">
            <div class="statebar">
                <!-- <a class="nav-act left-act" id="back"><img src="../bdt/images/nav_icon_back1.png" /></a> -->
                <div class="tab-btn fs30 tab-btn-two" id="topicTab">
                    <a class="bg-blue fc-white tab-on" id="newId" onclick="newButtonClick()">最新</a>
                    <a class="fc-blue" id="choicenessId" onclick="choicenessButtonClick()">最热</a>
                </div>
            </div>
        </div>
        <!--页面主体-->
        <div class="page__bd scrollbd"  id="page__bd">
            <!--占位空间-->
            <div class="top-space4"></div>
            <!--话题列表-->
            <div class="topic_list newtopic-list" id="getTopics">


                <a onclick="downloadMoreData();" id="downloadMoreData" class="appui_loadmore fs32 fc-greyabc">拼命加载中<i class="loadmore"></i></a>
            </div>
        </div>
    </div>
</div>
<audio id="audio-mc" style="display:none;" preload="preload" src=""></audio>
</body>
</html>