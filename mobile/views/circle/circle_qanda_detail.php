<?php

use yii\helpers\Html;
use yii\grid\GridView;

$this->params['breadcrumbs'][] = $this->title;
?>
<body class=" bg-white">
<script type="text/javascript" src="../bdt/js/circle_qanda_detail.js"></script>
<div id="container" class="container">
    <div id="page">
        <!--页面导航栏-->
        <div class="page__hd bg-white fc-black b-b-grey scrollhd">
            <div class="statebar">
                <a class="nav-act left-act" onclick="goBack();"><img src="../bdt/images/nav_icon_back1.png"></a>
                <a class="fs32 fc-black back-btn" id="back_index" href="index.html" style="display: none;">首页</a>
                <h2 class="fs34" id="title_id">周浩的提问</h2>
            </div>
            <div class="page__hd-tips bg-greyf1" style="display:none;" id="coupon_count_div">
                <p class="fs24 fc-grey999">您有<span class="fc-black fs28" id="coupon_count_id">3</span>张围观券，本次收听免费！</p>
                <a class="bg-white" id="coupon_count_close"><img src="../bdt/images/nav_icon_close1.png"></a>
            </div>
        </div>
        <div class="page__bd bg-greyfa scrollbd">
            <!--无优惠券-->
            <div class="top-space1" id="noneCouponSpace" style="display:block;"></div>
            <!--有优惠券-->
            <div class="top-space6" id="hasCouponSpace" style="display:none;"></div>
            <!-------------问答详情----------------------->
            <div class="qanda-detail bg-greyfa">
                <!-------------问题相关信息----------------------->
                <div class="qanda-detail-con">
                    <!--48小时未回答退款提示-未回答则显示-已回答则隐藏-->
                    <div style="display:none" class="timeout-tips fs30 fc-grey999 bg-grey" id="tui_expired_text_id"></div>

                    <!--提问者信息-价格-状态--->
                    <div class="asker-price-status bg-white">
                        <!--提问者信息-点击可跳转至提问者主页-->
                        <a class="asker-info">
                            <span class="asker-headpic"><img id="asker_pic_id" src="../bdt/images/user_22062_100.jpg"></span>
                            <span class="asker-orther fs28" id="asker_nickname_id">周浩</span>
                        </a>
                        <!--价格-状态-->
                        <div class="price-status">
                            <div class="price-coupon">
									<span class="price">
										<i class="fs30 fc-red" id="price_id">免费</i><!--价格-->
										<em style="display:none" class="bg-black" id="price_line_id"></em><!--横线-->
									</span>
                                <span style="display:none" class="coupon" id="price_coupon_id"><img src="../bdt/images/coupon_icon.png"></span>
                            </div>
                            <span class="status fs20 fc-grey666" style="" id="expired_text_id">已撤回</span>
                        </div>
                    </div>

                    <!--原问--可有图-->
                    <div class="question-common bg-white">
                        <!--问题内容-->
                        <div class="question-info fs30">
                            <span class="question-tag fc-blue fwb mr5">原问</span>
                            <p class="question-text fc-black" id="asker_content_id">快快乐乐</p>
                        </div>
                        <!--问题图片-问题与回答中图片列表公用部分-->
                        <div class="question-piclist" style="display:none;" id="asker_content_pic_id"></div>
                        <!--问答来源于话题则显示话题入口-->
                        <a class="topicqanda_back mt5" id="topicqanda_back" style="display:none;">
                            <span><img src="" id="topicqanda_pic"></span>
                            <span class="fs28 fc-blue fwb">查看原话题，了解更多回答</span>
                        </a>
                        <!--统计数据-提问时间-->
                        <div class="ask-time-statistic fs24 fc-grey666" id="ask_time_statistic1">
                            <span class="ask-time" id="ask_time_id_1">刚刚</span>
                            <a class="reanswer-btn bg-greyfa fs24 fc-red ml20" id="reanswer_id_1" style="display:none;">重答</a>
                            <p class="answer-statistic"><span id="listen_times_id_1"></span></p>
                        </div>
                    </div>

                    <!--原问回答-气泡-语音模式-20170415汪飞增加--新回答详情-图文||语音-->
                    <div class="answer-common bg-white" style="display:none;" id="answer_main_id_1">
                        <div class="answer-common-bg bg-greyfa">
                            <div class="answer-tag-expert">
                                <span class="fs28 fc-white bg-green">行家说</span>
                                <a class="answer-expert">
										<span class="answer-expert-pic mr5">
											<img src="/data/pic/photo1/user_22031_100.jpg" id="answer_expert_pic1"><i><img src="../bdt/images/v2.png"></i>
										</span>
                                    <span class="answer-expert-name">
											<i class="fs28 fc-black" id="answer_expert1">绍兴师爷</i>
											<i class="fs20 fc-grey999" id="answer_time1"></i>
										</span>
                                </a>
                            </div>

                            <div class="appui-qanda-answer" id="answer_wave_mod_id" style="display:none;">
                                <div id="voice_state_id" class="appui-qanda-answerstyle">
                                    <i></i>
                                    <span class="appui_qanda-voice-wave">
											<em class="wave1"></em>
											<em class="wave2"></em>
											<em class="wave3"></em>
										</span>
                                    <em class="tips" id="voice_state_text_id">免费播放</em>
                                    <span class="appui_qanda-voice-wait" style="display:none;"></span>
                                </div>
                            </div>

                            <div class="pictext-info fs30" id="answer_picmod_mod_id" style="display:none;">
                                <div class="answer-piclist" id="pictext_pic_id" style="display:none;"></div>
                            </div>
                        </div>
                    </div>

                    <!--追问-无图-->
                    <div class="question-common add-question bg-white mt10" style="display:none;" id="add_question_id">
                        <!--问题内容-->
                        <div class="question-info fs30">
                            <span class="question-tag fc-blue fwb mr5">追问</span>
                            <p class="question-text fc-black" id="add_question_text_id"></p>
                        </div>

                        <div class="ask-time-statistic fs24 fc-grey666" style="display:none;" id="ask_time_statistic2">
                            <span class="ask-time" id="ask_time_id_2"></span>
                            <a class="reanswer-btn bg-greyfa fs24 fc-red ml20" id="reanswer_id_2" style="display:none;">重答</a>
                            <a class="go-answer-btn bg-greyfa fs24 fc-red ml20" id="goAnswerAddQuestBtn" style="display:none;">回答</a>
                        </div>
                    </div>



                    <!--追问回答-气泡-语音模式-20170415汪飞增加--新回答详情-图文||语音-->
                    <div class="answer-common bg-white" style="display:none;" id="answer_main_id_2">
                        <div class="answer-common-bg bg-greyfa">
                            <div class="answer-tag-expert">
                                <span class="fs28 fc-white bg-green">行家说</span>
                                <a class="answer-expert">
										<span class="answer-expert-pic mr5">
											<img src="/data/pic/photo1/user_22031_100.jpg" id="answer_expert_pic2"><i><img src="../bdt/images/v2.png"></i>
										</span>
                                    <span class="answer-expert-name">
											<i class="fs28 fc-black" id="answer_expert2">绍兴师爷</i>
											<i class="fs20 fc-grey999" id="answer_time2"></i>
										</span>
                                </a>
                            </div>

                            <div class="appui-qanda-answer" id="answer_wave_mod_id_2" style="display:none;">
                                <div id="voice_state_id_2" class="appui-qanda-answerstyle">
                                    <i></i>
                                    <span class="appui_qanda-voice-wave">
											<em class="wave1"></em>
											<em class="wave2"></em>
											<em class="wave3"></em>
										</span>
                                    <em class="tips" id="voice_state_text_id_2">免费播放</em>
                                    <span class="appui_qanda-voice-wait" style="display:none;"></span>
                                </div>
                                <em class="appui-qanda-answer-time" style="display:none;" id="voice_state_time_id_2"></em>
                            </div>

                            <div class="pictext-info fs30" id="answer_picmod_mod_id_2" style="display:none;">
                                <!--<p class="pictext-text fc-grey666" id="pictext_text_id_2"></p>-->
                                <div class="answer-piclist" id="pictext_pic_id_2" style="display:none;"></div>
                            </div>
                        </div>
                    </div>

                    <!--回答者信息-头像等级-信息-加关注-20170415增加-新版答主信息-->
                    <div class="expert-follow bg-white mt10" id="expert-follow" style="display:none;">
                        <div class="expert-info new-addfocus" id="expertInfo">
                            <!--回答者信息-头像等级-信息-加关注-20170415汪飞注释-->
                            <!--<span class="headpic-level">
                                <img id="answer_author_pic_id" src="../bdt/images/photo/user_5_100.jpg?v=20161201134229" />
                            </span>-->
                            <div class="expert-orther">
                                <span class="fs28 fc-black" id="answer_author_nickName_id">绍兴师爷</span>
                                <span class="fs28 fc-greyabc ml10" id="answer_author_fans_id">97粉丝</span>
                                <p class="fs20 fc-greyabc" id="answer_author_lable_id">投资,营销,户型</p>
                            </div>
                        </div>
                        <a class="add-follow fs20 fc-red bc-red" onclick="requestDoFocus(22031,undefined,undefined,event)" id="focusID22031">关注</a></div>


                    <!--问答操作-撤回（只允许提问者在提问后的一段时间内可撤回）-追问（只对提问者开放并且只在问题被回答后开放）-->
                    <div class="qanda-act" id="qanda_act_id" style="display:block">
                        <a class="bg-greyf1 fs30 fc-greyabc" style="display: block;" id="cancle_qe_id">已撤回</a>
                        <a class="bg-greyf1 fs30 fc-greyabc" style="display:none;" onclick="$('#add-qanda-dialog').fadeIn();" id="addQuestion">追问</a>
                        <!--<a class="bg-orange fs30 fc-white" style="display:none;" id="rewardBtn">打赏</a>-->
                        <!--<a class="bg-orange fs30 fc-white" style="display:none;" id="addAnswerBtn">回答追问</a>-->
                    </div>

                    <div id="about_us" class="mt10" style="display:none;">
                        <h2 class="fs28 mt20">关注"律乎"，获取<span class="fc-red">最新内容</span></h2>
                        <div>
                            <img src="../bdt/images/wenfangba.jpg?v=20170221161736" alt="">
                        </div>
                    </div>

                </div>

                <!--评论模块-->
                <div class="comment-module mt10" style="display:none;" id="CommentModule">
                    <div class="comment-module-con">
                        <div class="comment-module-hd fs30 fc-black">
                            <span class="b-b-blue">共有<i id="commentCount">0</i>条评论</span>
                        </div>
                        <div class="comment-module-bd">
                            <div class="comment-list-con">
                            </div>
                        </div>
                    </div>
                </div>
                <!--评论模块END-->
            </div>
            <!--占位空间-->
            <div class="bottom-space1"></div>
        </div>

        <div class="page__fd bg-white b-t-greyf1 scrollfdc" id="foot_comment_menu">
            <div class="appui-comment-fixed zan-share">
                <span class="appui-comment-btn bc-grey fs28 fc-grey666 bc-grey" onclick="commentBtn('',43);">写下你的评论...</span>
                <a class="appui-share-btn" onclick="share()" id="share"><s></s><i>分享</i>
                    <span style="display:none" class="fc-white fs20 bc-white">0</span></a>
                <a class="appui-collect-btn" onclick="collectionBtn()" id="collection"><s></s>
                    <i>收藏</i><span style="display:none" class="fc-white fs20 bc-white">0</span></a>
                <a class="appui-like-btn " onclick="dianzanBtn(15)" id="dianzan"><s></s><i>赞</i>
                    <span class="fc-white fs20 bc-white">12</span>
                </a>


            </div>
        </div>
    </div>
</div>

<!--其他部分-->
<a class="switch-btn bg-white" style="display:none;" id="shareSwitchBtn">
    <img class="guide" src="../bdt/images/switch_guide.png">
    <img class="comment" src="../bdt/images/switch_comment.png">
</a>

<!--加入圈子-->
<!--<a class="add-circle bg-red fc-white fs28" id="addCircleBtn" style="display: none;"><span>￥300</span> 加入圈子</a>-->

<!-- 分享的提示框 -->
<div class="circle-share-dialog" id="shareView" style="display:none;">
    <div class="appui-mask black"></div>
    <div class="circle-share-con">
        <img src="../bdt/images/circle_share_pic.png">
        <a id="closeShare" class="circle-share-close">
            <img src="../bdt/images/circle_share_btn.png"></a>
    </div>
</div>

<!--弹出评论框-->
<div id="container-pop" class="container comment-edit-container bg-grey" style="display:none;">
    <div id="page-pop">
        <!--页面导航栏-->
        <div class="page__hd page__hd-edit fc-black bg-white b-b-grey">
            <div class="statebar">
                <a class="fc-black fs34" id="cancleID">取消</a>
                <h2 class="fs36" id="titleID">评论</h2>
                <a class="fc-black fs34" id="sendID">发送</a>
            </div>
        </div>
    </div>
</div>
<!--弹出评论框-->


<!--分享进入时底部有固定切换按钮-->
<a class="switch-btn bg-white" style="display:none;" id="shareSwitchBtn">
    <img class="guide" src="../bdt/images/switch_guide.png">
    <img class="comment" src="../bdt/images/switch_comment.png">
</a>

<!--追问-->
<div class="js_dialog" id="add-qanda-dialog" style="display:none;">
    <div class="appui-mask"></div>
    <div class="add-qanda bg-white">
        <textarea id="zhuiwenQuestionStr" class="fs30 fc-black bc-grey bg-greyfa" placeholder="向Ta提问，等Ta语音回答；公开问题公开追问"></textarea>
        <a class="fs30 fc-white bg-orange" onclick="sendAddQuestion()">免费追问</a>
        <a class="close bc-white" onclick="$('#add-qanda-dialog').fadeOut();"><img src="../bdt/images/img_delete.png"></a>
    </div>
</div>

<!--播放器-->
<audio id="audio-mc" style="display:none;" preload="preload" src=""></audio>

<!--分享提示-->
<div class="share-money" style="display:none;" id="shareView">
    <div class="appui-mask"></div>
    <div class="share-moner-con">
        <img src="../bdt/images/share_money.png">
        <a class="has-know fc-white fs28 closePopShare_dd">知道了</a>
        <a id="closeShare" class="close bc-white closePopShare_dd"><img src="../bdt/images/close.png"></a>
    </div>
</div>



<div id="js-bg" class="bg-black" style="display:none"></div>
<div id="js-page" class="bg-greyfa">
    <div class="appui_js_page">
        <div style="display:none" class="appui_js_page-hd bg-white fs28 fc-grey678 b-t-grey" id="commentObject">评论对象：评论内容</div>
        <div id="appiu_js_page-actID" class="appiu_js_page-act bg-white fs30 b-t-grey"></div>
        <div class="appiu_js_page-act bg-white fs30 fc-greyabc b-t-grey mt5">
            <a class="fc-black" id="appiu_js_page-cancel">取消</a></div>
    </div>
</div>

</body>

