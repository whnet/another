<?php

use yii\helpers\Html;
use yii\grid\GridView;
use common\tools\htmls;

$this->params['breadcrumbs'][] = $this->title;
?>
<body class=" bg-white">
<link type="text/css" rel="stylesheet" href="../bdt/css/edit.min.css">
<link type="text/css" rel="stylesheet" href="../bdt/css/qanda.css">
<script type="text/javascript" src="../bdt/js/hidpi-canvas.min.js"></script>
<script type="text/javascript" src="../bdt/js/qanda_detail.js"></script>
<script type="text/javascript" src="../bdt/js/comment.js"></script>
<script type="text/javascript" src="../bdt/js/picPop.js"></script>
<script type="text/javascript" src="../bdt/js/edit.min.js"></script>
<script type="text/javascript" src="../bdt/js/editor_cursor_position.js"></script>


<div id="container" class="container">
    <div id="page">
        <!--页面导航栏-->
        <div class="page__hd bg-white fc-black b-b-grey scrollhd">
            <div class="statebar">
                <a class="nav-act left-act" onclick="goBack();"><img src="../bdt/images/nav_icon_back1.png"></a>
                <a class="fs32 fc-black back-btn" href="index.html" style="display: none;">首页</a>
                <h2 class="fs34"><?=$user['nickname']?>的提问</h2>
            </div>
        </div>
        <div class="page__bd bg-greyfa scrollbd" style="padding-top:2.2rem;">
            <div class="qanda-detail bg-greyfa">
                
            <!--问题回答的页面-->
                <div class="qanda-detail-con">
                    <div class="asker-price-status bg-white" style="height:0px">
                        <div class="price-status">
                            <div class="price-coupon">
									<span class="price">
										<i class="fs30 fc-red" id="price_id"  data-mid="<?=$member_id?>" data-price="<?=$question['open_price']?>" data-type="<?=$question['listen_type']?>"></i>
										<em style="display:none" class="bg-black" id="price_line_id"></em>
									</span>
                            </div>
                            <span class="status fs20 fc-grey666"></span>
                        </div>
                    </div>
                    
                    <div class="question-common bg-white">
                        <div class="question-info fs30">
                            <span class="question-tag fc-blue fwb mr5">原问</span>
                            <p class="question-text fc-black"><?=$question['question']?></p>
                            <p class="question-text fc-black">
                                <?php if($pics):?>
                                    <?php foreach($pics as $k=>$v):?>
                                        <img  class="images" style="height:auto;width:100%;margin:5px;" src="<?=Yii::$app->params['public'].'/attachment'.$pics[$k]?>"?>
                                    <?php endforeach;?>
                                <?php endif;?>
                            </p>
                        </div>
                        <div class="ask-time-statistic fs24 fc-grey666">
                            <span class="ask-time"><?=date('Y-m-d',$question['created'])?></span>
                            <?php if($question['status'] == 2):?>
                            <p class="answer-statistic"><span><?=$question['views'];?>人浏览</span></p>
                            <?php endif;?>
                        </div>

                    </div>
                <?php if($question['status'] == 2):?>
                    <div class="answer-common bg-white">
                        <div class="answer-common-bg bg-greyfa">
                            <div class="answer-tag-expert">
                                <span class="fs28 fc-white bg-green">专家说</span>
                            </div>
                            <?php if($question['voice']):?>
                                <div class="appui-qanda-answer">
                                    <a class="answer-expert">
										<span class="answer-expert-pic mr5">
											<img src="<?=$expert['user']['photo']?>">
                                                <i><img src="../bdt/images/v2.png"></i>
										</span>
                                        <span class="answer-expert-name">
											<i class="fs28 fc-black"><?=$expert['realname']?></i>
										</span>
                                    </a>
                                    <div id="a_play_0_<?=$question['id']?>" class="appui-qanda-answerstyle free voice" onclick="playAudioQaClickFunction(<?=$question['id']?>,1,1,'a_play_0_<?=$question['id']?>',<?=$question['listen_type']?>,'<?=$question['open_price']?>',<?=$topay?>);">
                                        <i></i>
                                        <span class="appui_qanda-voice-wave">
                                                <em class="wave1"></em>
                                                <em class="wave2"></em>
                                                <em class="wave3"></em>
                                            </span>
                                        <em class="tips">免费收听</em>
                                        <span class="appui_qanda-voice-wait" style="display:block;"></span>
                                    </div>
                                    <em class="appui-qanda-answer-time" ><?=$question['voice_time'];?>"</em>
                                </div>
                            <?php endif;?>
                            
                            <?php if($question['article']):?>
	                            <?php if($question['listen_type'] == 1):?>
                                    <div class="pictext-info fs30" style="display:block;">
                                        <p class="pictext-text fc-grey666">
                                            <?=$question['article'];?></p>
                                        <div class="pay-btn">
                                            <div class="pay-btn-mask"></div>
                                            <span>付费查看全部回答</span>
                                        </div>
                                        <p class="question-text fc-black">
                                            <?php if($answerImgs):?>
                                                <?php foreach($answerImgs as $k=>$v):?>
                                                    <img  class="images" style="height:auto;width:100%;margin:5px;" src="<?=Yii::$app->params['public'].'/attachment'.$answerImgs[$k]?>"?>
                                                <?php endforeach;?>
                                            <?php endif;?>
                                        </p>
                                    </div>
                               <?php else:?>
                                    <div class="pictext-info fs30" style="display:block;">
                                        <p class="pictext-text fc-grey666" style="height: auto;"><?=$question['article'];?></p>
                                        <p class="question-text fc-black">
				                            <?php if($answerImgs):?>
					                            <?php foreach($answerImgs as $k=>$v):?>
                                                    <img  class="images" style="height:auto;width:100%;margin:5px;"
                                                          src="<?=Yii::$app->params['public'].'/attachment'.$answerImgs[$k]?>"?>
					                            <?php endforeach;?>
				                            <?php endif;?>
                                        </p>
                                    </div>
	                            <?php endif;?>
                            <?php endif;?>
                        </div>
                    </div>
                    <?php else:?>
                    <div class="answer-common bg-white">
                        <div class="answer-common-bg bg-greyfa">
                            <div class="answer-tag-expert">
                                <span class="fs28 fc-white bg-green">专家说</span>
                                <a class="answer-expert">
										<span class="answer-expert-pic mr5">
											<img src="<?=$expert['user']['photo']?>"><i>
                                                <img src="../bdt/images/v2.png"></i>
										</span>
                                    <span class="answer-expert-name">
											<i class="fs28 fc-black"><?=$expert['realname']?></i>
									</span>
                                </a>
                            </div>
                                <div class="pictext-info fs30">
                                    <p class="pictext-text fc-grey666" style="text-align:center">专家暂未回答</p>
                                </div>
                        </div>
                    </div>
                    <!--回答-气泡-语音模式 END-->
                    <?php endif;?>
                </div>
                
                <?php if($continue_list):?>
	            <?php foreach($continue_list as $k=>$v):?>
                <div class="qanda-detail-con">
                    <div class="question-common bg-white">
                        <div class="question-info fs30">
                            <span class="question-tag fc-blue fwb mr5">追问</span>
                            <p class="question-text fc-black"><?=$v['question']?></p>
                            <p class="question-text fc-black">
					            <?php if($pics):?>
						            <?php foreach($pics as $k=>$v):?>
                                        <img  class="images" src="<?=Yii::$app->params['public'].'/attachment'.$pics[$k]?>"?>
						            <?php endforeach;?>
					            <?php endif;?>
                            </p>
                        </div>
                        <div class="ask-time-statistic fs24 fc-grey666">
                            <span class="ask-time"><?=date('Y-m-d',$v['created'])?></span>
                        </div>

                    </div>
		            <?php if($v['status'] == 2):?>
                        <div class="answer-common bg-white">
                            <div class="answer-common-bg bg-greyfa">
                                <div class="answer-tag-expert">
                                    <span class="fs28 fc-white bg-green">专家说</span>
                                </div>
					            <?php if($v['voice']):?>
                                    <div class="appui-qanda-answer">
                                        <a class="answer-expert">
										<span class="answer-expert-pic mr5">
											<img src="<?=$expert['user']['photo']?>">
                                                <i><img src="../bdt/images/v2.png"></i>
										</span>
                                            <span class="answer-expert-name">
											<i class="fs28 fc-black"><?=$expert['realname']?></i>
										</span>
                                        </a>
                                        <div id="a_play_0_<?=$v['id']?>" class="appui-qanda-answerstyle free voice" onclick="playYiwen(<?=$v['id']?>,1,1,'a_play_0_<?=$v['id']?>',<?=$v['listen_type']?>,'<?=$v['open_price']?>',<?=$topay?>);">
                                            <i></i>
                                            <span class="appui_qanda-voice-wave">
                                                <em class="wave1"></em>
                                                <em class="wave2"></em>
                                                <em class="wave3"></em>
                                            </span>
                                            <em class="tips">免费收听</em>
                                            <span class="appui_qanda-voice-wait" style="display:block;"></span>
                                        </div>
                                        <em class="appui-qanda-answer-time" ><?=$v['voice_time'];?>"</em>
                                    </div>
					            <?php endif;?>
					
					            <?php if($v['article']):?>
						            <?php if($v['listen_type'] == 1):?>
                                        <div class="pictext-info fs30" style="display:block;">
                                            <p class="pictext-text fc-grey666">
									            <?=$v['article'];?></p>
                                            <div class="pay-btn">
                                                <div class="pay-btn-mask"></div>
                                                <span>付费查看全部回答</span>
                                            </div>
                                            <p class="question-text fc-black">
									            <?php if($answerImgs):?>
										            <?php foreach($answerImgs as $k=>$v):?>
                                                        <img  class="images" style="height:auto;width:100%;margin:5px;" src="<?=Yii::$app->params['public'].'/attachment'.$answerImgs[$k]?>"?>
										            <?php endforeach;?>
									            <?php endif;?>
                                            </p>
                                        </div>
						            <?php else:?>
                                        <div class="pictext-info fs30" style="display:block;">
                                            <p class="pictext-text fc-grey666" style="height: auto;"><?=$v['article'];?></p>
                                            <p class="question-text fc-black">
									            <?php if($answerImgs):?>
										            <?php foreach($answerImgs as $k=>$v):?>
                                                        <img  class="images" style="height:auto;width:100%;margin:5px;"
                                                              src="<?=Yii::$app->params['public'].'/attachment'.$answerImgs[$k]?>"?>
										            <?php endforeach;?>
									            <?php endif;?>
                                            </p>
                                        </div>
						            <?php endif;?>
					            <?php endif;?>
                            </div>
                        </div>
		            <?php else:?>
                        <div class="answer-common bg-white">
                            <div class="answer-common-bg bg-greyfa">
                                <div class="answer-tag-expert">
                                    <span class="fs28 fc-white bg-green">专家说</span>
                                    <a class="answer-expert">
										<span class="answer-expert-pic mr5">
											<img src="<?=$expert['user']['photo']?>"><i>
                                                <img src="../bdt/images/v2.png"></i>
										</span>
                                        <span class="answer-expert-name">
											<i class="fs28 fc-black"><?=$expert['realname']?></i>
											<i class="fs20 fc-grey999"><?=htmls::formatTime($v['created']);?></i>
										</span>
                                    </a>
                                </div>
                                <div class="pictext-info fs30" style="display:block;">
                                    <p class="pictext-text fc-grey666" style="text-align:center">专家暂未回答</p>
                                </div>
                            </div>
                        </div>
                        <!--回答-气泡-语音模式 END-->
		            <?php endif;?>
                </div>
                <?php endforeach;?>
                <?php endif;?>
            <!-- 圈子-->
	            <?php if(!$question['circle_id']):?>
		            <?php if($circle):?>
                        <div class="add-circle-con bg-white" style="padding-top:0px;">
                            <div class="add-circle-indetail bg-white">
                                <h3 class="fc-black fs24">本文答主创建了<span class="fwb ml5 mr5"><?=$circle['name']?></span>圈子</h3>
                                <div class="circle-and-expert mt20"><i>
                                        <img src="<?=Yii::$app->params['public'].'/attachment'.$circle['logo']?>"></i>
                                    <div class="cae-middle">
                                        <h3 class="fs30 fwb fc-black"><?=$circle['name']?></h3>
                                        <p class="fs20 fc-grey999">
                                            <span class="expert-name"><?=$expert['realname']?></span>
                                        </p>
                                    </div>
                                    <a class="add-circle-btn bc-grey fc-red fs24" href="/circle/circle_share_detail.html?id=<?=$circle['id']?>" >去逛逛</a>
                                </div><p class="circle-discript fs24 fc-grey999 mt10" ><?=$circle['des']?></p>
                            </div>
                        </div>
		            <?php endif;?>
	            <?php endif;?>
            <!-- 圈子-->
                
                <!--问题回答的页面-->
	            <?php if($continue):?>
                    <div class="qanda-act" id="qanda_act_id" style="display:block;">
                        <a class="bg-greyf1 fs30 fc-greyabc" onclick="$('#add-qanda-dialog').fadeIn();" id="addQuestion">追问</a>
                    </div>
                <?php endif;?>
                <!--推荐问答-->
                    <div class="recommend-qanda mt10" style="display:none">
                        <h2 class="recommend-qanda-head fs30 fc-black bg-white">推荐问答</h2>
                      <?php foreach($RecQuestions as $k=>$v):?>
                        <div class="recommend-qanda-item bg-white" onclick="gotoQADetail(<?=$v['id'];?>,1,'4')">
                            <h3 class="fs30 fc-black"><?=$v['question']?></h3>
                            <p class="fs24 fc-grey999 mt5">
                                <span><?=$v['expert']['realname'];?></span><span><?=$v['views'];?>人阅读</span></p>
                            <span><img src="../bdt/images/icon06.png"></span>
                        </div>
                        <?php endforeach;?>
                    </div>
                <!--推荐问答END-->
                    <!--文章评论模块-->
                    <div class="comment-module mt10"  id="CommentModule">
                        <div class="comment-module-con">
                            <div class="comment-module-hd b-b-grey fs30 fc-black">
                                <span class="b-b-blue">共有<i id="commentCount"><?=$count?></i>条评论</span>
                            </div>
                            <div class="comment-module-bd">
                                <div class="comment-list-con">
                                    <?php foreach($comments as $k=>$v):?>
                                        <div class="comment-item bc-grey" id="commentListID<?=$v['id']?>">
                                            <div class="comment-item-author">
                                                <a><i><img src="<?=$v['user']['photo']?>"></i>
                                                    <span class="ml5">
                                                        <i class="fs30 fc-navy"><?=$v['user']['nickname']?></i>
                                                        <i class="fs20 fc-greyabc"><?=htmls::formatTime($v['created'])?></i>
                                                    </span>
                                                </a>
                                            </div>
                                            <div onclick="commonJS(<?=$v['user']['id']?>,<?=$v['id']?>)" id="comment<?=$v['id']?>" class="comment-item-content fs30 fc-black  face_tag">
                                                <?php if($v['to_member_id'] !=0):?>
                                                    <span class="fc-black">回复:</span>
                                                    <span class="fc-black"><?=$to_user[$v['id']]['nickname']?></span>
                                                <?php endif;?>
                                                <?=$v['content']?>
                                            </div>
                                        </div>
                                    <?php endforeach;?>
                                    <input type="hidden" name="member" value="<?=$member_id?>" >
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
            <div class="bottom-space1"></div>
        </div>
        <div class="page__fd bg-white b-t-greyf1 scrollfdc" id="foot_comment_menu">
            <div class="appui-comment-fixed zan-share">
                <span class="appui-comment-btn bc-grey fs28 fc-grey666 bc-grey" onclick="commentBtn('',<?=$_GET['id'];?>);">写下你的评论...</span>
                <a class="appui-share-btn" onclick="share()" id="share"><s></s><i>分享</i>
                    <span style="display:none" class="fc-white fs20 bc-white">0</span></a>
                <a class="appui-collect-btn" onclick="collectionBtn()" id="collection"><s></s>
                    <i>收藏</i><span style="display:none" class="fc-white fs20 bc-white">0</span></a>
                <a class="appui-like-btn <?php if($dianzan):?>on<?php endif;?>" onclick="dianzanBtn(<?=$member_id?>)" id="dianzan"><s></s><i>赞</i>
                    <span class="fc-white fs20 bc-white"><?=$nums?></span>
                </a>
            </div>
        </div>
    </div>
</div>


<!--追问-->
<div class="js_dialog" id="add-qanda-dialog" style="display:none;">
    <div class="appui-mask"></div>
    <div class="add-qanda bg-white">
        <textarea id="zhuiwenQuestionStr" class="fs30 fc-black bc-grey bg-greyfa" placeholder="向Ta提问，等Ta语音回答；公开问题公开追问"></textarea>
        <a class="fs30 fc-white bg-orange" onclick="sendAddQuestion()">免费追问</a>
        <a class="close bc-white" onclick="$('#add-qanda-dialog').fadeOut();"><img src="../bdt/images/img_delete.png"></a>
    </div>
</div>

<audio id="audio-mc" style="display:none;" preload="preload" src=""></audio>

<div id="container-pop" class="container comment-edit-container bg-grey" style="display:none;">
    <div id="page-pop">
        <div class="page__hd page__hd-edit fc-black bg-white b-b-grey">
            <div class="statebar">
                <a class="fc-black fs34" id="cancleID">取消</a>
                <h2 class="fs36" id="titleID">评论</h2>
                <a class="fc-black fs34" id="sendID">发送</a>
            </div>
        </div>
        <div class="page__bd">
            <div class="top-space1"></div>
            <div class="edit-module bg-white bc-grey">
                <div class="edit-content">
                    <div class="edit-content-container">
                        <div class="article-comment-edit-module fc-grey678 fs30" contenteditable="false">
                            <textarea class="fs34 fc-black" id="edit-mark" placeholder="请输入评论内容"></textarea>
                        </div>
                        <span id="placeholder" class="fc-greyabc fs30"></span>
                    </div>

                </div>
            </div>
        </div>
    </div>
</div>
<div id="js-page" class="bg-greyfa">
    <div class="appui_js_page">
        <div style="display:none" class="appui_js_page-hd bg-white fs28 fc-grey678 b-t-grey" id="commentObject">评论对象：评论内容</div>
        <div id="appiu_js_page-actID" class="appiu_js_page-act bg-white fs30 b-t-grey"></div>
        <div class="appiu_js_page-act bg-white fs30 fc-greyabc b-t-grey mt5">
            <a class="fc-black" id="appiu_js_page-cancel">取消</a></div>
    </div>
</div>
</body>
