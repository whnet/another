<link type="text/css" rel="stylesheet" href="../bdt/css/edit.min.css">
<link type="text/css" rel="stylesheet" href="../bdt/css/edit.min.css">
<script type="text/javascript" src="../bdt/js/topicqanda.js">
</script>
<body>
<div id="container" class="container bg-greyf1 topicqanda-container">
    <div id="page">
        <!--页面导航栏-->
        <div class="page__hd fc-balck scrollhd">
            <div class="statebar">
                <a class="nav-act left-act" onclick="goBack();">
                    <img src="../bdt/images/nav_icon_back.png">
                </a>
                <h2 class="fs34" style="display: none;">
                    话题
                </h2>
                <!--<a class="nav-act right-act" href="#"><img src="../bdt/images/nav_icon_more.png"/></a>-->
            </div>
        </div>
        <!--页面主体-->
        <div class="page__bd scrollbd" id="page__bd">
            <!--轮播图-->
            <div class="topicqanda-banner">
                <div class="swiper-container swiper-container-horizontal swiper-container-autoheight swiper-container-android">
                    <div class="swiper-wrapper" style="height: 160px; transform: translate3d(0px, 0px, 0px);">
                        <div class="swiper-slide swiper-slide-active" style="">
                            <img src="../bdt/images/topic-02-1-1495605848.png">
                        </div>
                    </div>
                    <div class="swiper-pagination">
                    </div>
                </div>
            </div>
            <!--话题信息-我要发言-->
            <div class="topicqanda-detail bg-white">
                <h2 class="fs32 fc-black" id="titleId"><?=$info['title']?></h2>
                <div class="topicqanda-summary show-text mt5 hide-text">
                    <!-- hide-text 这个用来控制是否显示完全 -->
                    <p class="fs28 fc-black"><?=$info['content']?></p>
                    <span class="more-text fs24 fc-blue">
                            <i>
                                更多
                            </i>
                            <img src="../bdt/images/moretext.png">
                        </span>
                </div>
                <div class="ask-say">
                    <a class="wantsay bg-blue fs32 fc-white" href="/articles/topicqanda_record.html?id=<?=$_GET['id']?>">
                        我要发言
                    </a>
                </div>
            </div>
            <div class="topicqanda-module">
                <div class="topicqanda-module-head fs28">
                </div>

                <div class="topicqanda-list" id="topicqanda-list">

                    <div class="topicqanda-item bg-white mb10" id="topic4140">
                        <a class="topicqanda-headpic">
                            <img src="/data/pic/photo/user_3928_80.jpg">
                            <i class="appui-userlevel bc-white">
                                <img src="../bdt/images/v2.png">
                            </i>
                        </a>
                        <div class="topicqanda-item-info">
                            <div class="name-label">
                                <a class="fc-black fs28">田佳烨Alina</a>
                                <i class="line bg-greyd"></i>
                                <p class="fc-greyabc fs24">
                                    添家置业总经理 海外房产专家
                                </p>
                            </div>
                            <div class="answer-comment">
                                <div class="appui-qanda-answer">
                                    <div class="appui-qanda-answerstyle voice free" id="a_play_0_12" onclick="playAudioClickFunction(12,1,1,'a_play_0_12');">
                                        <i></i>
                                        <span class="appui_qanda-voice-wave">
                                                <em class="wave1"></em>
                                                <em class="wave2"></em>
                                                <em class="wave3"></em>
                                            </span>
                                        <em class="tips">免费收听</em>
                                        <span class="appui_qanda-voice-wait" style="display:none;"></span>
                                    </div>
                                    <em class="appui-qanda-answer-time">300"</em>
                                    <span class="appui-qanda-answer-listen">21人收听</span>
                                </div>
                            </div>
                            <div class="time-statistic fc-greyabc fs22">
                                    <span>2017-05-24</span>
                                <div class="statistic">
                                    <a class="like " onclick="dianzanClick(4140)" id="dianzan4140">14</a>
                                    <a class="comment ml10" id="pinglun_4140" onclick="commentClick(4140,4140)">1</a>
                                    <span class="show-comment" id="showComment_4140" onclick="showCommentList(4140,0,0)" style="opacity: 0.3;"><img src="../bdt/images/up_more.png"></span>
                                </div>
                            </div>
                        </div>
                        <div class="topicqanda-item-comment bg-greyfa b-t-grey" style="display:none;" id="commentDiv_4140">
                        </div>
                    </div>


                    <div class="topicqanda-item bg-white mb10" id="topic4149">
                        <a class="topicqanda-headpic">
                            <img src="/data/pic/photo7/user_14647_80.jpg?1491909910505">
                        </a>
                        <div class="topicqanda-item-info">
                            <div class="name-label">
                                <a class="fc-black fs28">
                                    宋小小
                                </a>
                            </div>
                            <div class="answer-comment">
                                <div class="show-text hide-text fc-black fs28" onclick="openOrClose(4149)"
                                     id="showMore4149">
                                    <p id="content4149">
                                        国内升值力大，市场也宽阔，为什么要把钱给外国人赚
                                    </p>
                                </div>
                            </div>
                            <div class="time-statistic fc-greyabc fs22">
                                    <span>2017-05-24</span>
                                <div class="statistic">
                                    <a class="like " onclick="dianzanClick(4149)" id="dianzan4149">10</a>
                                    <a class="comment ml10" id="pinglun_4149" onclick="commentClick(4149,4149)">1</a>
                                    <span class="show-comment" id="showComment_4149" onclick="showCommentList(4149,0,1)">
                                            <img src="../bdt/images/down_more.png">
                                        </span>
                                </div>
                            </div>
                        </div>
                        <div class="topicqanda-item-comment bg-greyfa b-t-grey" id="commentDiv_4149">
                            <div class="comment-item" id="commentListID_4157">
                                <div onclick="commentClick(4157,4149,'田佳烨Alina')" id="comment_4157" class="comment-item-content paddingtopleft0 fs28 fc-black face_tag">
                                        <span class="fc-navy">田佳烨Alina</span>
                                    <span class="fc-black mr5 ml5">回复</span>
                                    <a class="fc-navy" >宋小小</a>
                                    :不要单面看问题，等中国人在国外也普遍置业后，而且国外是永久产权，那我们有可能会占领很多地球土地资源了～此外，当你买了再卖的时候，不就是在賺外国的钱了!
                                </div>
                            </div>
                        </div>
                    </div>
                <a id="downloadMoreData" class="appui_loadmore fs28 fc-greyabc">拼命加载中<i class="loadmore"></i></a>
                </div>
            </div>
            <div class="bottom-space4">
            </div>
        </div>
    </div>
    <audio id="audio-mc" style="display:none;" preload="preload" src="">
    </audio>
</div>
<!-- 轮播图 -->
<div class="appui-gallery-swiper" id="js-gallery-swiper" style="display: none;">
    <!--图片预览轮播-->
    <!-- swiper-slide-visible swiper-slide-active -->
    <div class="swiper" style="cursor: -webkit-grab;">
        <div class="swiper-wrapper" id="swiper-wrapper">
            <!-- <div class="swiper-slide">
            <img data-src="C:\Users\Administrator\Desktop\2.png" class="swiper-lazy">
            <div class="swiper-lazy-preloader"></div>
            </div> -->
            <!-- <div class="swiper-slide">
            <img data-src="../bdt/images/gallery/gallery2.jpg?v=20161201134425" class="swiper-lazy">
            <div class="swiper-lazy-preloader"></div>
            </div>
            <div class="swiper-slide">
            <div data-background="path/to/picture-3.jpg" class="swiper-lazy">slide3</div>
            </div> -->
            <!-- <a class="swiper-slide" href="javascript:;"><img src="../bdt/images/gallery/gallery1.jpg?v=20161201134425" /></a>
            <a class="swiper-slide" href="javascript:;"><img src="../bdt/images/gallery/gallery2.jpg?v=20161201134425" /></a>
            <a class="swiper-slide" href="javascript:;"><img src="../bdt/images/gallery/gallery3.jpg?v=20161201134426" /></a> -->
        </div>
        <div class="pagination">
                <span class="swiper-pagination-switch swiper-visible-switch swiper-active-switch">
                </span>
            <span class="swiper-pagination-switch">
                </span>
            <span class="swiper-pagination-switch">
                </span>
            <span class="swiper-pagination-switch">
                </span>
        </div>
    </div>
</div>
<!-- 评论框 -->
<div id="container-pop" class="container comment-edit-container bg-grey"
     style="display:none;">
    <div id="page-pop">
        <!--页面导航栏-->
        <div class="page__hd page__hd-edit fc-black bg-white b-b-grey">
            <div class="statebar">
                <a class="fc-black fs34" onclick="cancleBtn()" id="cancleID">
                    取消
                </a>
                <h2 class="fs36" id="titleID">
                    回答
                </h2>
                <a class="fc-black fs34" onclick="sendBtn()" id="sendID">
                    发送
                </a>
            </div>
        </div>
        <!--页面主体-->
        <div class="page__bd">
            <!--占位空间-->
            <div class="top-space1">
            </div>
            <div class="edit-module bg-white bc-grey">
                <div class="edit-content">
                    <div class="edit-content-container">
                        <div class="article-comment-edit-module fc-grey678 fs34" contenteditable="false">
                            <!--插入文字示例-->
                            <textarea class="fs34 fc-black" id="edit-mark" placeholder="请输入评论内容">
                                </textarea>
                            <!-- <p contenteditable="true" id="edit-mark"><span class="fc-navy">//@我是国宝</span>自从8月2日起，海外投资者在温哥华卑诗省（British Columbia）购房需要多交15%的买家税，然而，温哥华的当地居民认为多征收的15%买家税还不够。</p> -->
                        </div>
                        <div class="forward-link" style="display:none">
                            <a class="link-style bg-grey fs28">
                                <i>
                                    <img src="">
                                </i>
                                <p>
                                </p>
                            </a>
                        </div>
                        <span id="placeholder" class="fc-greyabc fs30" style="display:none;">
                            </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!--<div class="video_dialog" style="display:none;">
<div class="appui-mask"></div>
<video class="appui-video" id="myVideo" style="display:none" controls="controls"><!-- controls="controls"-->
<!-- <source src="/i/movie.ogg" type="video/ogg">
<source src="http://7xjdah.com1.z0.glb.clouddn.com/HTML5%E7%9A%84%E5%89%8D%E4%B8%96%E4%BB%8A%E7%94%9F%E5%89%AF%E6%9C%AC.mp4" type="video/mp4">
<!-- Your browser does not support the video tag.
</video>
</div>-->
</body>