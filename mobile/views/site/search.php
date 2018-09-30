<?php
use common\tools\htmls;
?>
<link type="text/css" rel="stylesheet" href="../bdt/css/professList.css">
<link type="text/css" rel="stylesheet" href="../bdt/css/circle.css">
<script type="text/javascript" src="../bdt/js/searchCommon.js"></script>
<script type="text/javascript" src="../bdt/js/keys.js"></script>
<body>
<div class="search-container bg-grey" id="container">
    <audio id="audio-mc" preload="preload" src=""></audio>
    <div id="page">
        <div class="page__hd page__hd-search b-b-grey bg-white scrollhd">
            <a class="nav-act left-act" onclick="goBack();"><img src="../bdt/images/nav_icon_back1.png"></a>
            <div class="search-module search-page-use">
                <span><img src="../bdt/images/search.png"></span>
                <em class="bg-blue"></em>
                <input type="text" class="fc-blue fs28" placeholder="请输入要搜索的内容" id="searchText">
            </div>
            <a class="search-btn bg-red fc-white fs28" id="searchBtn">搜索</a>
        </div>
        <div class="page__bd scrollbd bg-grey" id="page__bd">
            <div class="top-space7"></div>

            <!--暂无此搜索内容-->
            <div class="appui-nocontent" style="display:none">
                <span><img src="../bdt/images/nocontent.png"/></span>
                <p class="mt10 fs28 fc-greyabc" >暂无此搜索内容</p>
            </div>
            <!--暂无此搜索内容-->

            <?php if($expert):?>
            <!--搜索结果推荐-专家-->
            <div class="search-resault bg-white" id="search-resault-expert" style="display:block;">
                <h3 class="fs28 fc-black b-b-grey">专家
                    <a class="fs24 fc-blue b-t-grey" onclick="seeMoreExpert()" style="display:block;">

                        <i><img src="../bdt/images/search.png"></i>
                        <span>查看更多专家</span>
                        <i><img src="../bdt/images/go.png"></i>
                    </a>
                </h3>
                <div class="search-resault-list fs28 fc-black456 bg-grey professList">
                <?php foreach($expert as $k=>$v):?>
                    <div class="appui-expert bg-white">
                            <div class="appui-expert-headpic-level">
                                <img class="appui-expert-headpic" src="<?=$v['user']['photo']?>"><i>
                                    <img src="../bdt/images/v2.png"></i>
                            </div>
                            <div class="appui-expert-info" onclick="askExpert(<?=$v['id']?>)">
                                <a class="appui-expert-askbtn fs24 fc-white " >
                                    <?php if($v['price'] == '0.00'):?>免费提问<?php else:?><?=$v['price']?>元提问<?php endif;?>
                                </a>
                                <h3 class="appui-expert-name fs30 fc-black"><?=$v['realname']?></h3>
                                <p class="appui-expert-introduce fs24 fc-grey666 mt5"><?=$v['des']?></p>
                                <div class="appui-expert-tags fs18 mt5 fc-greyabc">
                                        <span style="display:block"></span>
                                </div>
                            </div>
                    </div>
                    <?php endforeach;?>
                </div>
                <script>
                    function askExpert(id){
                        window.location.href='/questions/wen_questions.html?id='+id+'&from=found&publishtype=ask';
                    }
                </script>
            </div>
            <?php endif;?>
            <?php if($circle):?>
            <!--搜索结果推荐-圈子-->
            <div class="search-resault bg-white mt10" id="search-resault-circle" style="display:block;">
                <h3 class="fs28 fc-black b-b-grey">圈子
                    <a class="fs24 fc-blue b-t-grey"  style="display:none;">
                        <i><img src="../bdt/images/search.png"></i>
                        <span>查看更多圈子</span>
                        <i><img src="../bdt/images/go.png"></i>
                    </a>
                </h3>
                <div class="search-resault-list bg-grey fs28 fc-black456 circleList">
                    <?php foreach($circle as $k=>$v):?>
                        <div class="circle-item-x bg-white fc-black mb10">
                            <a class="circle-headpic">
                                <img src="../bdt/images/default.jpg"></a>
                            <div class="circle-info">
                                <a class="goto-circle fs24 bc-green fc-green" href="/circle/circle_page.html?id=<?=$v['id']?>" style="display:block" >去逛逛</a>
                                <h3 class="circle-info-name fs30 fc-black"><?=$v['name']?></h3>
                                <p class="circle-info-canshu fs20 fc-grey999">
                                    <span>圈主:<?=$v['expert']['realname']?></span>
                                    <span class="ml<?=$v['id']?>">成员:<em><?=count($v["incircle"])?></em>人</span>
                                </p>
                                <p class="circle-info-introduce fs24 fc-grey666 mt5"><?=$v['user']['slogan']?></p>
                            </div>
                        </div>
                    <?php endforeach;?>

                </div>
            </div>
            <?php endif;?>
            <?php if($ask):?>
            <!--搜索结果推荐-问答-->
            <div class="search-resault bg-white mt10" id="search-resault-qanda" style="display:block;">
                <h3 class="fs28 fc-black b-b-grey">问答
                    <a class="fs24 fc-blue b-t-grey" onclick="seeMoreQue()" style="">
                        <i><img src="../bdt/images/search.png"></i>
                        <span>查看更多问答</span>
                        <i><img src="../bdt/images/go.png"></i>
                    </a>
                </h3>
                <div class="search-resault-list bg-grey fs28 fc-black456 qandaList">
                    <?php foreach($ask as $k=>$v):?>
                        <div class="appui-qanda-module mb10" >
                            <div class="appui-qanda-question" onclick="goQADetailHtml(<?=$v['id']?>)"><?=$v['question']?></div>
                            <?php if($v['voice']):?>
                            <div class="appui-qanda-answer">
                                <div class="appui-qanda-expertphoto" >
                                    <img src="<?=$v['expert']['photo']?>">
                                    <i class="appui-userlevel bc-white">
                                        <img src="../bdt/images/v2.png"></i>
                                </div>
                                <div class="appui-qanda-answerstyle voice free" id="a_play_0_<?=$v['id']?>" onclick="playAudioQaClickFunction(<?=$v['id']?>,1,1,'a_play_0_<?=$v['id']?>');">
                                    <i></i>
                                    <span class="appui_qanda-voice-wave">
                                        <em class="wave1"></em>
                                        <em class="wave2"></em>
                                        <em class="wave3"></em>
                                    </span>
                                    <em class="tips">免费收听</em>
                                </div>

                                <em class="appui-qanda-answer-time"><?=$v['voice_time']?>"</em>
                            </div>
                                <?php else:?>

                                <div class="appui-qanda-answerstyle pictext free">
                                    <i></i><span class="appui-qanda-answerstyle-wave"></span><em class="tips">点击阅读</em>
                                </div>
                            <?php endif;?>

                            <div class="appui-qanda-expertinfo">
                                <div class="appui-qanda-expertinfo">
                                    <div class="time-statistic fs22" id="bottom_1_80">
                                        <span class="fc-greyabc mr10 "><i><?=htmls::formatTime($v['created']);?></i></span>
                                        <span class="fc-greyabc"><i><?=$v['views']?></i>阅读</span>
                                        <span class="fc-red"></span><div class="statistic">
                                            <a class="like fc-greyabc <?php if(htmls::dianzan($v['id'])):?>on fc-red<?php endif;?>" onclick="dianzanClick(<?=$v['id']?>,1,<?=$mid;?>)" id="dianzan<?=$v['id']?>"><?=count($v['dianzan'])?></a>
                                            <a class="comment ml10 fc-greyabc" id="pinglun_<?=$v['id']?>"><?=count($v['comment'])?></a>
                                        </div></div></div>
                            </div>

                        </div>
                    <?php endforeach;?>

                </div>
            </div>
            <?php endif;?>
            <?php if($articles):?>
                <!--搜索结果推荐-问答-->
                <div class="search-resault bg-white mt10" id="search-resault-qanda" style="display:block;">
                    <h3 class="fs28 fc-black b-b-grey">发现</h3>
                    <div class="search-resault-list bg-grey fs28 fc-black456 qandaList">
                        <?php foreach($articles as $k=>$v):?>
                            <div class="appui-qanda-module mb10" >
                                <div class="appui-qanda-question" onclick="gotoArticDetailHtml(<?=$v['id']?>)"><?=$v['title']?></div>

                                <div class="appui-qanda-answer">
                                    <div class="appui-qanda-expertphoto">
                                        <img src="<?=$v['user']['photo']?>">
                                        <i class="appui-userlevel bc-white">
                                            <img src="../bdt/images/v2.png"></i>
                                    </div>
                                    <?php if($v['voices']):?>
                                    <div class="appui-qanda-answerstyle voice free" id="a_play_0_<?=$v['id']?>" onclick="playAudioQaClickFunction(<?=$v['id']?>,2   ,1,'a_play_0_<?=$v['id']?>');">
                                        <i></i>
                                        <span class="appui_qanda-voice-wave">
						                    <em class="wave1"></em>
                                            <em class="wave2"></em>
                                            <em class="wave3"></em></span>
                                        <em class="tips">免费收听</em>
                                        <span class="appui_qanda-voice-wait" style="display:none;"></span>
                                    </div>
                                    <em class="appui-qanda-answer-time"><?=$v['voice_time']?>"</em>
                                        <?php else:?>
                                        <span onclick="gotoArticDetailHtml(<?=$v['id']?>)"><?=htmls::substr($v['summary'],60);?></span>
                                    <?php endif;?>

                                </div>

                                <div class="appui-qanda-expertinfo">
                                    <div class="appui-qanda-expertinfo">
                                        <div class="time-statistic fs22" id="bottom_1_<?=$v['id'];?>">
                                            <span class="fc-greyabc mr10 "><i><?=htmls::formatTime($v['created']);?></i></span>
                                            <span class="fc-greyabc"><i><?=$v['counts']?></i>阅读</span>
                                            <span class="fc-red"></span><div class="statistic">
                                                <a class="like fc-greyabc <?php if(htmls::dianzan($v['id'])):?>on fc-red<?php endif;?>" onclick="dianzanClickluntan(<?=$v['id']?>,1,<?=$mid;?>)" id="dianzan<?=$v['id']?>"><?=count($v['dianzan'])?></a>
                                                <a class="comment ml10 fc-greyabc" id="pinglun_<?=$v['id']?>"><?=count($v['comment'])?></a>
                                            </div></div>
                                    </div>
                                </div>

                            </div>
                        <?php endforeach;?>

                    </div>
                </div>
            <?php endif;?>
            <script>
                function seeMoreExpert(){
                    window.location.href = "/expert/found_expert.html";
                }
                function goQADetailHtml(id){
                    window.location.href = "/questions/qanda_detail.html?id="+id;
                }
                function seeMoreLoupan(){
                    window.location.href = "/loupan/loupan_list.html";
                }
                function seeMoreCircle(){
                    window.location.href = "/expert/found_expert.html";
                }
                function seeMoreQue(){
                    window.location.href = "/questions/qanda.html";
                }
                function gotoArticDetailHtml(id){
                    window.location.href = "/articles/article_detail.html?id="+id+"&from=index&publishtype=article";
                }
                //点赞点踩界面
                var ddClick = false;
                function dianzanClick(id,type, mid){
                    if(mid == undefined){
                        dataLoading("请先登录");
                        window.location.href="/members/login.html";
                        return false;
                    }
                    if (ddClick==false) {
                        ddClick=true;
                        if ($('#dianzan'+id).hasClass("on")) {
                            zanOrCaiRequest(0, 1,id);
                        }else{
                            zanOrCaiRequest(1, 1,id);
                        }
                    }
                }
                function dianzanClickluntan(id,type, mid){
                    if(mid == undefined){
                        dataLoading("请先登录");
                        window.location.href="/members/login.html";
                        return false;
                    }
                    if (ddClick==false) {
                        ddClick=true;
                        if ($('#dianzan'+id).hasClass("on")) {
                            zanOrCaiRequestluntan(0, 1,id);
                        }else{
                            zanOrCaiRequestluntan(1, 1,id);
                        }
                    }
                }
                //data:{"articleId":1,"type":"0-取消操作，1-执行操作","status":"0-踩，1-点赞","userId":"userId"}
                function zanOrCaiRequest(type, status, id) {
                    //currAttitude：0-当前是踩，1-赞，2-无表示
                    var csrf = $('input[name="csrf"]').val();
                    $.ajax({
                        type: "post",
                        url: '/dianzan/dianzan.html',
                        dataType: "json",
                        async: true,
                        data: {
                            "question_id": id,
                            "type": type,
                            "_csrf": csrf,
                        },
                        success: function(result) {
                            ddClick = false;
                            if (result.result == "success") {
                                //"data":{"currStatus":"当前态度：0-踩，1-点赞，2-无表情","totLikes":"总点赞人数","totOppose":"总点踩人数"}
                                var zanCount = $('#dianzan'+id).html();
                                if (result.data.currStatus==1) {
                                    $('#dianzan'+id).addClass('on fc-red');
                                    dataLoadedSuccess("点赞成功");
                                    $('#dianzan'+id).text(parseInt(zanCount)+1);
                                }else if (result.data.currStatus==0) {
                                    dataLoadedSuccess("点踩成功");
                                    $('#dianzan'+id).text(parseInt(zanCount)-1);
                                    $('#dianzan'+id).removeClass('on fc-red');
                                }
                            }
                        }
                    });


                }
                function zanOrCaiRequestluntan(type, status, id) {
                    //currAttitude：0-当前是踩，1-赞，2-无表示
                    var csrf = $('input[name="csrf"]').val();
                    $.ajax({
                        type: "post",
                        url: '/dianzan/dianzan.html',
                        dataType: "json",
                        async: true,
                        data: {
                            "article_id": id,
                            "type": type,
                            "_csrf": csrf,
                        },
                        success: function(result) {
                            ddClick = false;
                            if (result.result == "success") {
                                //"data":{"currStatus":"当前态度：0-踩，1-点赞，2-无表情","totLikes":"总点赞人数","totOppose":"总点踩人数"}
                                var zanCount = $('#dianzan'+id).html();
                                if (result.data.currStatus==1) {
                                    $('#dianzan'+id).addClass('on fc-red');
                                    dataLoadedSuccess("点赞成功");
                                    $('#dianzan'+id).text(parseInt(zanCount)+1);
                                }else if (result.data.currStatus==0) {
                                    dataLoadedSuccess("点踩成功");
                                    $('#dianzan'+id).text(parseInt(zanCount)-1);
                                    $('#dianzan'+id).removeClass('on fc-red');
                                }
                            }
                        }
                    });


                }
            </script>
        </div>
    </div>
</div>




</body>
