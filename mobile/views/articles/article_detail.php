<?php

use yii\helpers\Html;
use yii\grid\GridView;
use common\tools\htmls;

$this->params['breadcrumbs'][] = $this->title;
?>
<link type="text/css" rel="stylesheet" href="../bdt/css/edit.min.css">
<script type="text/javascript" src="../bdt/js/edit.min.js"></script>
<script type="text/javascript" src="../bdt/js/editor_cursor_position.js"></script>
<script type="text/javascript" src="../bdt/js/qanda_detail.js"></script>
<script type="text/javascript" src="../bdt/js/article_detail.js"></script>
<script type="text/javascript" src="../bdt/js/playVoiceCommon.js"></script>

<body>
<audio id="audio-mc" style="display:none;" preload="preload" src=""></audio>
<div id="container" class="container article-container bg-greyfa">
    <div id="page">
        <!--页面导航栏-->
        <div class="page__hd bg-white fc-black b-b-grey">
            <div class="statebar">
                <a class="nav-act left-act" onclick="goBack();"><img src="../bdt/images/nav_icon_back1.png"></a>
                <a class="fs32 fc-black back-btn" href="" id="back_index" style="display:none;">首页</a>
                <h3 class="fs32" id="headTitle">详情</h3>
               <?php if($info['member_id'] == $member_id):?>
                <a class="nav-act right-act del" onclick="collectionAndReport()" data-del="<?=$info['id']?>" style="display:block">
                    <img src="../bdt/images/nav_icon_delete1.png">
                </a>
                <?php endif;?>
            </div>
        </div>
        <div class="page__bd">
            <div class="top-space1"></div>
            <div class="article-detal-module bg-white">
                <div class="article-detail-con">
                    <?php if($_GET['publishtype'] == 'fatie' || $_GET['publishtype'] == 'article'):?>
                    <h2 class="fc-black fs40 mb10" id="articleTitle"><?=$info['title']?></h2>
                    <?php endif;?>
                        <div class="author-focus-time-read bg-greyfa">
                            <div class="author-focus fs24">
                                <a class="mr5">
                                    <img src="<?=$info['user']['photo']?>"><i>
                                        <?php if($info['user']['vip'] == 1):?>
                                        <img src="../bdt/images/v2.png"></i>
                                        <?php endif;?>
                                </a>
                                <div>
                                    <a class="fc-navy"><?=$info["expert"]['realname']?></a>
                                    <?php if($info['member_id'] != $member_id):?>
                                    <span onclick="facus(<?=$member_id?>,<?=$info['member_id']?>)" id="focus" class="bc-grey fc-red fs24 " sytle="margin-top:0;margin-left:0">
                                        <?php if(!$foucs):?>+关注<?php else:?>已关注<? endif;?>
                                    </span>
                                    <?php endif;?>
                                    <p class="appui-expert-intro fs24 fc-grey666 mt5"><?=$info["expert"]['honor']?></p>
                                    <i class="fs26 fc-greyabc"><?=$format_time?></i>
                                </div>
                            </div>
                            <div class="time-read">
                                <span class="fs30 fc-grey678"><?=$info['counts']?></span>
                                <span class="fs20 fc-greyabc">阅读</span>
                            </div>
                        </div>

                    <!--长文详情-->
                    <?php if($info['voices']):?>
                        <div class="module-container square_detail">
                            <div class="module-content message-detail-content mt10">
                                <div class="text-style-no-height mt10">
                                    <p class="fs34 fc-black face_tag"><?=$info['content']?></p>
                                </div>
                                <div class="voice-layout mt10">
                                    <div class="appui-qanda-answer">
                                        <div class="appui-qanda-answerstyle voice free" id="a_play_0_<?=$info['id']?>" onclick="playAudioQaClickFunction(<?=$info['id']?>,2,1,'a_play_0_<?=$info['id']?>');">
                                            <i></i><span class="appui_qanda-voice-wave">
                                                <em class="wave1"></em>
                                                <em class="wave2"></em>
                                                <em class="wave3"></em>
                                            </span>
                                            <em class="tips">免费收听</em>
                                            <span class="appui_qanda-voice-wait" style="display:none;"></span></div>
                                        <em class="appui-qanda-answer-time"><?=$info['voice_time']?>"</em>
                                    </div>
                                </div>
                            </div>
                        </div>
                    <?php endif;?>
                    <div class="article-detail fs36 mt10 fc-black face_tag" id="div_id">
                        <?php if(!$info['voices']):?>
                        <div id="div_heights" style="font-size:0.8rem"><?=$info['content'];?></div>
                        <?php endif;?>

                        <?php if($_GET['publishtype'] == 'fatie'):?>
                            <?php if($images):?>
                                    <?php foreach($images as $k=>$v):?>
                                       <img  class="images" style="height:auto;width:100%;margin:5px;" src="<?=Yii::$app->params['public'].'/attachment'.$images[$k]?>"?>
                                    <?php endforeach;?>
                           <?php endif;?>
                            <?php endif;?>

                        <?php if($_GET['publishtype'] == 'fatie' || $_GET['publishtype'] == 'article'):?>
                            <?php if($images):?>
                                    <input  type="hidden" class="shareimages" value="<?=Yii::$app->params['public'].'/attachment'.$images[0]?>" >
                            <?php endif;?>
                        <?php endif;?>

                        <?php if($info['title']):?>
                        <input type="hidden" name="title" value="<?=$info['title']?>">
                            <?php elseif($info['summary']):?>
                            <input type="hidden" name="title" value="<?=$info['summary']?>">
                            <?php else:?>
                            <input type="hidden" name="title" value="<?=$info['content']?>">
                        <?php endif;?>
                        <input type="hidden" name="des" value="<?=$info['summary']?>">
                        <!-- 正文END-->
                        <?php if(!$_GET['publishtype'] == 'fatie'):?>
                        <div class="disclaimer fs24 bg-greyfa mb10 mt10" id="disclaimer">
                                <span class="fc-red">转载声明：</span><p>文章内容转载于网络，仅供大家学习和交流。如果侵害了您的合法权益，请您及时与我们联系，我们会在第一时间删除相关内容</p>
                            </div>
                        <?php endif;?>
                     </div>
                    <!-- 转载说明-->
                    <!-- <div class="show-all fs30 fc-navy">查看全文</div>-->

                    <!--详情页面中行家创建的圈子入口-->
                    <?php if($info['circle_id'] != 0):?>
                        <div class="add-circle-con bg-white mt20" style="padding: 0px;" >
                            <div onclick="gotoCirclePage('/circle/circle_page.html?id=<?=$circle_info['id']?>&from=article_detail')" class="add-circle-indetail bg-white">
                                <h3 class="fc-black fs24">本文来源于<span class="fwb ml5 mr5" ><?=$circle_info['user']['nickname']?></span>的<span class="fwb ml5 mr5" id="qzname">
                                        <?=$circle_info['name']?></span>圈子
                                    </h3>
                                <div class="circle-and-expert mt10"><i>
                                        <img src="<?=Yii::$app->params['public'].'/attachment'.$circle_info['logo']?>" id="qzbgpic"></i>
                                    <div class="cae-middle"><h3 class="fs30 fwb fc-black" id="qzname1"><?=$circle_info['name']?></h3>
                                        <p class="fs20 fc-grey999"><span class="expert-name" id="qzusernickname1"><?=$circle_info['user']['nickname']?></span>
                                        </p></div>
                                    <a class="add-circle-btn bc-grey fc-red fs24" href="/circle/circle_page.html?id=<?=$circle_info['id']?>&from=square_detail">去逛逛</a></div>
                                <p class="circle-discript fs24 fc-grey999 mt10" id="qzmemo"><?=$circle_info['des']?></p></div>
                        </div>
                    <?php endif;?>

                </div>
<!--                <div id="about_us" style="display:none;">-->
<!--                    <h2 class="fs28 mt20">关注“律乎社区”,获取<span class="fc-red">最新内容</span></h2>-->
<!--                    <div>-->
<!--                        <img src="../bdt/images/wenfangba.jpg" alt="">-->
<!--                    </div>-->
<!--                </div>-->
            </div>
            <?php if($info['member_id'] != $member_id):?>
<!--                <div class="qanda-act" id="qanda_act_id" style="">-->
<!--                <a class="bg-orange fs30 fc-white" id="rewardBtn">打赏</a>-->
<!--                </div>-->
            <?php endif;?>
            <!--文章评论模块-->
            <div class="comment-module mt10"  id="CommentModule">
             <!--评论列表-->
                <div class="comment-module-con">
                    <div class="comment-module-hd b-b-grey fs30 fc-black">
                        <span class="b-b-blue">共有<i id="commentCount">0</i>条评论</span>
                    </div>
                    <div class="comment-module-bd">
                        <div class="comment-list-con">
                        </div>
                    </div>
                </div>
                <!--评论列表-->
            </div>
            <!--文章评论模块END-->
            <input type="hidden" name="member" value="<?=$member_id;?>" >
            <input type="hidden" name="toMid" value="<?=$info['user']['id'];?>" >
            <!-- 占位空间 -->
            <div class="bottom-space1"></div>
        </div>

        <div class="page__fd bg-white b-t-greyf1 scrollfdc" id="foot_comment_menu">
            <div class="appui-comment-fixed zan-share">
                <span class="appui-comment-btn bc-grey fs28 fc-grey666 bc-grey" onclick="commentBtn('',<?=$_GET['id'];?>);">写下你的评论...</span>
                <a class="appui-share-btn" onclick="share()" id="share"><s></s><i>分享</i>
                    <span style="display:none" class="fc-white fs20 bc-white">0</span></a>
                <a class="appui-collect-btn" onclick="collectionBtn()" id="collection"><s></s>
                    <i>收藏</i><span style="display:none" class="fc-white fs20 bc-white">0</span></a>
                <a class="appui-like-btn <?php if($dianzan):?>on<?php endif;?>"  <?php if($info['member_id'] != $member_id):?>onclick="dianzanBtn(<?=$member_id?>)" id="dianzan"<?php endif;?> ><s></s><i>赞</i>
                    <span class="fc-white fs20 bc-white"><?=$nums?></span>
                </a>


            </div>
        </div>


    </div>
</div>

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
        <img src="../bdt/images/share1.png">
        <a id="closeShare" class="circle-share-close">
            <img src="../bdt/images/share-btn.png"></a>
    </div>
</div>

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
        <!--页面主体-->
        <div class="page__bd">
            <!--占位空间-->
            <div class="top-space1"></div>
            <div class="edit-module bg-white bc-grey">
                <div class="edit-content">
                    <div class="edit-content-container">
                        <div class="article-comment-edit-module fc-grey678 fs30" contenteditable="false">
                            <textarea class="fs34 fc-black" id="edit-mark" placeholder="请输入评论内容"></textarea>
                            <input type="hidden" name="replyId" value="" >
                        </div>
                        <span id="placeholder" class="fc-greyabc fs30"></span>
                    </div>

                </div>
            </div>
        </div>
    </div>
</div>

<!--弹出的解释说明-->
<div class="js_dialog_disclaimer" style="display:none;">
    <div class="appui-mask"></div>
    <div class="appui-helptext bg-white" id="disclaimerHelptext" style="display:none;">
        <h2 class="appui-helptext-hd fs32 fc-black b-b-grey">免责声明</h2>
        <div class="appui-helptext-bd fc-black456 b-b-grey">
            <div class="appui-helptext-bd-con fc-black">
                <p class="fs30 mb20">1、“律乎平台”部分文章信息来源于网络转载是出于传递更多信息之目的，并不意味着赞同其观点或证实其内容的真实性。如其他媒体、网站或个人从本网下载使用，必须保留本网注明的“稿件来源”，并自负版权等法律责任。如对稿件内容有疑议，请及时与我们联系。</p>
                <p class="fs30 mb20">2、“律乎平台”致力于提供合理、准确、完整的资讯信息，但不保证信息的合理性、准确性和完整性，且不对因信息的不合理、不准确或遗漏导致的任何损失或损害承担责任。本网站所有信息仅供参考，不做交易和服务的根据， 如自行使用本网资料发生偏差，本站概不负责，亦不负任何法律责任。</p>
                <p class="fs30 mb20">3、任何由于黑客攻击、计算机病毒侵入或发作、因政府管制而造成的暂时性关闭等影响网络正常经营的不可抗力而造成的损失，本网站均得免责。由于与本网站链接的其它网站所造成之个人资料泄露及由此而导致的任何法律争议和后果，本网站均得免责。</p>
                <p class="fs30 mb20">4、本网站如因系统维护或升级而需暂停服务时，将事先公告。若因线路及非本公司控制范围外的硬件故障或其它不可抗力而导致暂停服务，于暂停服务期间造成的一切不便与损失，本网站不负任何责任。</p>
                <p class="fs30 mb20">5、本网站使用者因为违反本声明的规定而触犯中华人民共和国法律的，一切后果自己负责，本网站不承担任何责任。</p>
                <p class="fs30 mb20">6、凡以任何方式登陆本网站或直接、间接使用本网站资料者，视为自愿接受本网站声明的约束。</p>
                <p class="fs30 mb20">7、本声明未涉及的问题参见国家有关法律法规，当本声明与国家法律法规冲突时，以国家法律法规为准。</p>
                <p class="fs30 mb20">8、本网站如无意中侵犯了哪个媒体或个人的知识产权，请来信或来电告之，本网站将立即给予删除。</p>
            </div>
        </div>
        <h2 class="appui-helptext-fd fs32 fc-orange">知道了</h2>
    </div>
</div>


<div class="js_dialog" id="js_dialog_reward" style="display:none;z-index:5;">
    <div class="appui-mask"></div><div class="appui-helptext bg-white" id="helptext" style="display:none;">
        <h2 class="appui-helptext-hd fs32 fc-black b-b-grey">打赏说明</h2>
        <div class="appui-helptext-bd fc-black456 b-b-grey">
            <div class="appui-helptext-bd-con fc-black">
                <p class="fs30 mb10">1、提问者所提出的问题被成功回答后，通过其他第三人的付费收听来获得收入。每被付费收听一次，获得<span id="touListenFee">0</span>元；</p>
                <p class="fs30 mb10">2、行家通过回答他人提出的问题来获得收入。每成功回答一条，获得相应金额；</p>
                <p class="fs30 mb10">3、行家通过回答问题被第三人付费收听来获得收入。每被付费收听一次，获得<span id="touListenFee1">0</span>元；</p>
                <p class="fs30 mb10">4、若问答被分享，通过分享页面进入付费收听而产生的收益，分享者获得<span id="shareListenShare">0</span>元，提问者与回答者均获得<span id="shareListenQA">0</span>元；</p>
                <!-- 		<p class="fs30 mb10">5、若问答被连续二次分享，通过连续二次分享页面进入且付费收听而产生的收益，二次分享者获得<span id="lv2ShareListenShare">0</span>元，提问者、回答者与一次分享者均获得<span id="lv2ShareListenQA">0</span>元；</p> --><p class="fs30 mb10">5、所有收入扣除<span id="qaFeeRate">0</span>作为平台佣金。账户余额大于<span id="minPayCash">0</span>元，每日21点系统自动将账户里的余额划到微信钱包内，用户也可前往“律乎吧”公众号提现；</p><p class="fs30 mb10">6、备注：免费围观券收听，行家、提问者、分享者都没有收益。</p></div></div>
        <h2 class="appui-helptext-fd fs32 fc-orange">知道了</h2></div></div>

<!--大赏页面-->
<div id="container-reward" class="container bg-white" style="z-index: 4; display:none;">
    <div id="page"><!--页面导航栏--><div class="page__hd fc-white rewardbg words_act">
            <div class="statebar">
                <a class="nav-act left-act" id="certifyHome" href="javascript:void(0);">
                    <img src="../bdt/images/nav_icon_back.png"></a>
                <h2 class="fs34">打赏</h2>
                <span class="nav-act right-act fs24 fc-white" style="width:3rem; text-align:center; display:none;" id="rewardTips">打赏说明</span></div></div>
        <div class="page__bd"><div class="reward-layout">
                <div class="bg-headpic"><img src="../bdt/images/reward_headbg.png"></div>
                <!--打上金额选择-->
                <div class="reward-amount">
                    <h3 class="fs34 fc-red">请选择打赏金额：</h3>
                    <ul class="reward-amount-list fs34">
                        <li class="reward-amount-item mt10 on" amount="1" changecolor="0">1元</li>
                        <li class="reward-amount-item mt10" id="amount5" amount="5" changecolor="1">5元</li>
                        <li class="reward-amount-item mt10" amount="10" changecolor="0">10元</li>
                        <li class="reward-amount-item mt10" amount="20" changecolor="0">20元</li>
                        <li class="reward-amount-item mt10" amount="50" changecolor="0">50元</li>
                        <li class="reward-amount-item mt10" id="tuhaoAct">土豪随意</li>
                    </ul>
                </div>
                <!--土豪做法-->
                <div class="tuhao-reward" id="tuhaoReward" style="display:none;">
                    <h3 class="fs34 fc-red">土豪请随意：</h3>
                    <input type="text" class="amount-input mt10 fs34" placeholder="请输入打赏金额" id="tuhaoRewardAmount"></div>
                <a class="reward-pay fs34" onclick="confirmPayReward()">确认支付</a></div></div></div></div>
                <div id="js-bg" class="bg-black" style="display:none"></div>
      <div id="js-page" class="bg-greyfa"><div class="appui_js_page">
        <div style="display:none" class="appui_js_page-hd bg-white fs28 fc-grey678 b-t-grey" id="commentObject">评论对象：评论内容</div>
        <div id="appiu_js_page-actID" class="appiu_js_page-act bg-white fs30 b-t-grey"></div>
              <div class="appiu_js_page-act bg-white fs30 fc-greyabc b-t-grey mt5">
            <a class="fc-black" id="appiu_js_page-cancel">取消</a></div></div></div>


</body>
