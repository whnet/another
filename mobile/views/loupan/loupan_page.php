<body>
<link type="text/css" rel="stylesheet" href="../bdt/css/pullToRefresh.css">
<link type="text/css" rel="stylesheet" href="../bdt/css/edit.min.css">
<script type="text/javascript" src="../bdt/js/picPop.js"></script>
<script type="text/javascript" src="../bdt/js/commonExpert.js"></script>
<script type="text/javascript" src="../bdt/js/loupan_page.js"></script>
<script type="text/javascript" src="../bdt/js/commonArticList.js"></script>
<script type="text/javascript" src="../bdt/js/commentListInPostlist.js"></script>
<script type="text/javascript" src="../bdt/js/comment_component.js"></script>

<div id="container" class="container userpage-container bg-greyf1">
    <div id="page">
        <!--页面导航栏-->
        <div class="page__hd fc-white">
            <div class="statebar">
                <a class="nav-act left-act" onclick="goBack();">
                    <img src="../bdt/images/nav_icon_back.png"></a>
                <h2 id="loupanPageTitle" class="fs34" style="display:none;"><?=$info['name']?>的主页</h2>
            </div>
        </div>

        <!--页面主体-->
        <div class="page__bd" id="page__bd">
            <!--行家信息-->
            <div class="loupan-pagehead bg-white">
					<span class="loupan-pagehead-bg">
						<img class="filter3" id="loupanHeadBg" src="../bdt/images/headbg_loupan.jpg">
					</span>
                <div class="loupan-info">
                    <span class="loupan-info-headpic"><img id="loupanHeadImg" src="<?=Yii::$app->params['public'].'/attachment'.$info['cover']?>"></span>
                    <div class="loupan-name-bankuai fc-white">
                        <h3 class="fs34" id="loupanName"><?=$info['name']?></h3>
                        <em class="fs24" style="">|</em>
                        <span class="fs24" id="loupanPlate" style=""><?=$info['summary']?></span>
                    </div>
                    <p class="loupan-address fs20 fc-black456" id="loupanAddress"><?=$info['place']?></p>
                </div>
            </div>
            <div class="loupan-actbtn-bar bg-white" id="loupanActbtnBar" style="position: static; box-shadow: rgba(0, 0, 0, 0) 0px 0px 0.5rem;">
                <a class="loupan-ask-btn bc-blue fc-blue fs24" id="loupanPub">
                    <img src="../bdt/images/circle_pub_btn.png">发表</a>
                <a class="loupan-pub-btn bc-blue fc-blue fs24" id="loupanAsk">
                    <img src="../bdt/images/circle_ask_btn.png">提问</a>
                <a class="loupan-member-btn bc-blue fc-blue fs24" id="loupanAddFocus">
                    <img src="../bdt/images/circle_addfocus_btn.png">关注</a>
                <a class="loupan-member-btn bc-blue fc-blue fs24" style="display:none;" id="loupanCancelFocus">
                    <img src="../bdt/images/circle_cancelfocus_btn.png">已关注</a>
            </div>

            <!--行家主页分类导航-->
            <div class="expert-pagenavbar bg-greyf1 fs24" id="pagenavbar" style="padding-top: 0px;height:0.5rem">
<!--                <span class="pagenav fwb" id="pagenav0">全部主题<i class="bg-red" style="display: block;"></i></span>-->
<!--                <span class="pagenav ml20" id="pagenav1">精选<i class="bg-red" style="display:none;"></i></span>-->
<!--                <span class="pagenav ml20" id="pagenav2">问答<i class="bg-red" style="display:none;"></i></span>-->
<!--                <span class="pagenav ml20" id="pagenav3">点评<i class="bg-red" style="display:none;"></i></span>-->
            </div>

            <div class="loupan-pages" id="loupanPageList">
                <a id="downloadMoreData" class="appui_loadmore fs32 fc-greyabc">拼命加载中<i class="loadmore"></i></a>
            </div>

        </div>
    </div>
</div>

<div class="container bg-greyf1" id="container-expert" style="display:none;">
    <div id="page-expert">
        <!--页面导航栏-->
        <div class="page__hd fc-black scrollhd bg-white b-b-grey">
            <div class="statebar">
                <a class="nav-act left-act" id="closeExpertList"><img src="../bdt/images/nav_icon_close1.png"></a>
                <h2 class="fs34">向行家提问</h2>
            </div>
        </div>
        <div class="page__bd" id="expertpage">
            <div class="top-space1"></div>
            <div id="expertList">
                <a id="downloadMoreData" class="appui_loadmore fs32 fc-greyabc">拼命加载中<i class="loadmore"></i></a>
            </div>
        </div>
    </div>
</div>

<!--语音播放器-->
<audio id="audio-mc" style="display:none;" preload="preload" src=""></audio>


<script>
    $('.dynamic-link').each(function(index, element) {
        $(this).find('span').css('margin-top',-$(this).find('span').height()/2);
    });

</script>
<!--//发布弹出框-->
<div class="publish-type" style="display:none">
    <div class="publish-type-list fs32 fc-black type4">
        <a href="/circle/circle_file_release.html?from=loupan&publishtype=fatie"><i>
                <img src="../bdt/images/message_pic.jpg"></i>
            <span class="fc-black">发帖</span></a>
        <a href="/articles/article_edit.html?from=loupan&publishtype=article">
            <i><img src="../bdt/images/message_article.jpg"></i>
            <span class="fc-black">文章</span></a>
        <a href="/pockets/red_packets.html?from=loupan&publishtype=redpack">
            <i><img src="../bdt/images/message_packet.jpg"></i>
            <span class="fc-black">红包</span></a>
        <a href="/questions/start_ask.html?from=loupan&publishtype=ask&circle_id=0" >
            <i><img src="../bdt/images/message_qanda.jpg"></i>
            <span class="fc-black">提问</span></a>
    </div>
    <a class="close-publish-btn bg-white" id="closePubBtn">
        <img src="../bdt/images/publish_red.png"></a>
</div>

</body>