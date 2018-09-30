<?php

use yii\helpers\Html;
use yii\grid\GridView;
use common\tools\htmls;

$this->params['breadcrumbs'][] = $this->title;
?>
<style>
    .fs30{
        line-height: 1rem;
    }
    .zhui{
        width:3rem;
        height:1.5rem;
        line-height:1.5rem;
        text-align:center;
        border-radius:10%;
        background:#e95513;
        color:white;
        font-size:18px;
        position:absolute;
        left:50%;
        transform:translateX(-50%);
        top:0;
        margin-top:.5rem;
    }
</style>
<script type="text/javascript" src="../bdt/js/myhomepage.js"></script>
<body class="bg-white">
<div id="container" class="container myhomepage-container bg-white">
    <div id="page">
        <!--页面导航栏-->
        <div class="page__hd bg-white fc-red b-b-grey has-tab scrollhd">
            <div class="statebar">
                <a class="nav-act left-act" onclick="goBack();"><img src="../bdt/images/nav_icon_back1.png"></a>
                <div class="tab-btn fs30 tab-btn-two" id="myhomepageTab">
                    <a class="bg-blue fc-white " onclick="categoryListFunction(0);">我答</a>
                    <a class="bg-blue" onclick="categoryListFunction(1);">我问</a>
                </div>
                <a class="nav-act right-act" id="page-act">
                    <img src="../bdt/images/nav_icon_publish.png">
                </a>
            </div>
        </div>
        <div class="clear"></div>
        <div class="page__bd mb10 bg-greyfa scrollhd">
            <div class="top-space4"></div>
            <div class="homepagelist" id="homepage0" style="top: 0px; display: block;">
                <div class="my-qanda">
                    <div class="appui-nocontent">
                        <span><img src="../bdt/images/nocontent.png"></span>
                        <p class="mt10 fs28 fc-greyabc">您还没有参与过问答</p>
                    </div>
                    <div class="my-qanda-list" id="answerList">
                        <?php foreach($answer as $k=>$v):?>
                        <div class="my-qanda-item bg-white mb10">
                            <div class="zhui_space" style="height:1.8rem;"></div>
                            <div class="my-qanda-item-hd">
                                <a><i>
                                    <img src="<?=$v['user']['photo']?>">
                                            <?php if($v['user']['vip'] == 1):?>
                                                <i><img src="../bdt/images/v2.png"></i>
                                            <?php endif;?>
                                        </i></i>
                                    <span class="fc-navy fs30 ml5"><?=$v['user']['nickname']?></span></a>
                                <span class="fc-blue fs30 ml5">
                                    <?php if($v['status'] == 2):?>已回答<?php elseif($v['status'] == 1):?>待回答
                                    <?php elseif($v['status'] == 3):?>已失效<?php elseif($v['status'] == 0):?>付款确认中
                                    <?php endif;?>
                                </span>
                                <div><i class="bg-orange"></i>
                                    <?php if($v['askprice'] == "0.00"):?>
                                        <span class="fc-orange fs30">免费</span>
                                    <?php else:?>
                                        <span class="fc-orange fs30">￥<?=$v['askprice']?></span>
                                    <?php endif;?>
                                </div>
                            </div>
                              <p class="my-qanda-item-bd fs30 fc-black mt5 face_tag" onclick="gotoQanda_recordHtml(<?=$v['id']?>,1,0,2)">
                                    <?php if($v['imgs'] != '[]'):?>
                                <i class="appui-qanda-question-imgtag"><img src="../bdt/images/img-tag.png"></i>
                                <?php endif;?>
                                <?=$v['question']?>
                              </p>
                            <div class="my-qanda-item-fd" style="margin-top:20px;">
                                <i class="fs28 fc-greyabc"><?=date('Y-m-d H:i:s',$v['created'])?></i>
                                <span class="fs28 fc-greyabc">
                                    <span class="fs28 fc-greyabc"><i><?=$v['views']?></i>浏览</span>
                                    <?php if($v['next']):?>
                                    <span class="zhui" onclick="gotoYiwen(<?=$v['id']?>)">追问</span>
                                    <?php endif;?>
                                </span>
                            </div>
                        </div>
                        <?php endforeach;?>
                    </div>
                </div>
            </div>
            <!--我答END-->
            <!--我问-->
            <div class="homepagelist" id="homepage1" style="top: 0px; display: none;">
                <div class="my-qanda">
                    <div class="appui-nocontent" >
                        <span><img src="../bdt/images/nocontent.png"></span>
                        <p class="mt10 fs28 fc-greyabc">您还没有提问过问题</p>
                    </div>
                    <div class="my-qanda-list">
                        <?php foreach($ask as $k=>$v):?>
                            <div class="my-qanda-item bg-white mb10" onclick="gotoArticDetailHtml(<?=$v['id']?>,'<?=$v['from']?>','<?=$v['publishtype']?>');">
                                <div class="my-qanda-item-hd"><a>
                                        <i>
                                            <img src="<?=$v['user']['photo']?>">
                                            <?php if($v['user']['vip'] == 1):?>
                                            <i><img src="../bdt/images/v2.png"></i>
                                            <?php endif;?>

                                        </i>
                                        <span class="fc-navy fs30 ml5"><?=$v['user']['nickname']?></span></a>
                                    <span class="fc-blue fs30 ml5">
                                        <?php if($v['status'] == 2):?>已回答
                                        <?php elseif($v['status'] == 1):?>待回答<?php elseif($v['status'] == 3):?>已失效
                                        <?php elseif($v['status'] == 0):?>付款确认中
                                        <?php endif;?>
                                    </span>
                                    <div><i class="bg-orange"></i>
                                        <?php if($v['askprice'] == "0.00"):?>
                                            <span class="fc-orange fs30">免费</span>
                                        <?php else:?>
                                            <span class="fc-orange fs30">￥<?=$v['askprice']?></span>
                                        <?php endif;?>
                                    </div></div>
                                <p class="my-qanda-item-bd fs30 fc-black mt5 face_tag">
                                    <?php if($v['imgs'] != '[]'):?>
                                        <i class="appui-qanda-question-imgtag">
                                            <img src="../bdt/images/img-tag.png">
                                        </i>
                                    <?php endif;?>
                                    </i>
                                    <?=$v['question']?></p>
                                <div class="my-qanda-item-fd">
                                    <i class="fs28 fc-greyabc"><?=date('Y-m-d H:i:s',$v['created'])?></i>
                                    <span class="fs28 fc-greyabc"><i><?=$v['views']?></i>浏览</span>
                                </div>
                            </div>
                        <?php endforeach;?>
                        <script>
                            function gotoArticDetailHtml(id, from, publishtype){
                                window.location.href = "/questions/qanda_detail.html?id="+id+"&from="+from+"&publishtype="+publishtype;
                            }
                        </script>
                    </div>
                </div>
            </div>
            <!--我问END-->
            <!--追问-->
            <div class="homepagelist" id="homepage2" style="top: 0px; display:none;">
                <div class="my-qanda">
                    <div class="appui-nocontent" >
                        <span><img src="../bdt/images/nocontent.png"></span>
                        <p class="mt10 fs28 fc-greyabc">您还没有追问问过问题</p>
                    </div>
                    <div class="my-qanda-list">
				        <?php foreach($ask as $k=>$v):?>
                            <div class="my-qanda-item bg-white mb10" onclick="gotoArticDetailHtml(<?=$v['id']?>,'<?=$v['from']?>','<?=$v['publishtype']?>');">
                                <div class="my-qanda-item-hd"><a>
                                        <i>
                                            <img src="<?=$v['user']['photo']?>">
									        <?php if($v['user']['vip'] == 1):?>
                                                <i><img src="../bdt/images/v2.png"></i>
									        <?php endif;?>

                                        </i>
                                        <span class="fc-navy fs30 ml5"><?=$v['user']['nickname']?></span></a>
                                    <span class="fc-blue fs30 ml5">
                                        <?php if($v['status'] == 2):?>已回答
                                        <?php elseif($v['status'] == 1):?>
                                            待回答
                                        <?php elseif($v['status'] == 3):?>
                                            已失效
                                        <?php elseif($v['status'] == 0):?>
                                            付款确认中
                                        <?php endif;?>
                                    </span>
                                    <div><i class="bg-orange"></i>
								        <?php if($v['askprice'] == "0.00"):?>
                                            <span class="fc-orange fs30">免费</span>
								        <?php else:?>
                                            <span class="fc-orange fs30">￥<?=$v['askprice']?></span>
								        <?php endif;?>
                                    </div></div>
                                <p class="my-qanda-item-bd fs30 fc-black mt5 face_tag">
							        <?php if($v['imgs'] != '[]'):?>
                                        <i class="appui-qanda-question-imgtag">
                                            <img src="../bdt/images/img-tag.png">
                                        </i>
							        <?php endif;?>
                                    </i>
							        <?=$v['question']?></p>
                                <div class="my-qanda-item-fd">
                                    <i class="fs28 fc-greyabc"><?=date('Y-m-d H:i:s',$v['created'])?></i>
                                    <span class="fs28 fc-greyabc"><i><?=$v['views']?></i>浏览</span>
                                </div>
                            </div>
				        <?php endforeach;?>
                        <script>
                            function gotoArticDetailHtml(id, from, publishtype){
                                window.location.href = "/questions/qanda_detail.html?id="+id+"&from="+from+"&publishtype="+publishtype;
                            }
                        </script>
                    </div>
                </div>
            </div>
            <!--追问END-->
            
        </div>
    </div>
</div>

<script>
    function gotoYiwen(id){
        window.location.href = "/members/yiwen.html?id="+id;
    }
    var content0 = $("#homepage0").find(".my-qanda-item-bd").text();
//我问
    if(content0!==""){
        $("#homepage0").find(".appui-nocontent").hide();

    }else if(content0==""){
        $("#homepage0").find(".appui-nocontent").show();
    };
</script>
<script>
    var content1=$("#homepage1").find(".my-qanda-item-bd").text();
//我问
    if (content1 !== "") {
        $("#homepage1").find(".appui-nocontent").hide();

    } else if (content1 == "") {
        $("#homepage1").find(".appui-nocontent").show();
    }


</script>
</body>
