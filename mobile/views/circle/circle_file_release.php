<link type="text/css" rel="stylesheet" href="../bdt/css/editfile.min.css" />
<link type="text/css" rel="stylesheet" href="../bdt/css/qanda.css" />
<script type="text/javascript" src="../bdt/js/exif.js"></script>
<script type="text/javascript" src="../bdt/js/file_release.js"></script>
<script type="text/javascript" src="../bdt/js/editor_cursor_position.js"></script>
<body class="bg-white">
<div id="container" class="container message-edit-container">
    <div id="page">
        <audio id="audio-mc" style="display:none;" preload="preload"></audio>
        <!-- 编辑页面 start -->
        <div class="edit_box">
            <!--头部信息 start-->
            <div class="page__hd page__hd-edit fc-white bg-white bc-grey" style="position:fixed">
                <div class="file-header-title">
                    <div id="back-btn" class="left fs32">取消</div>
                    <div class="center fs40">发帖</div>
                    <div id="issueBtn" class="right fs32 fc-blue">发布</div>
                </div>
            </div>
            <!--头部信息 end-->

            <!--主要内容 start-->
            <div class="page_bd">
                <!--占位空间-->
                <div class="top-space1"></div>
                <div class="edit-module bg-white bc-greyf8 autoheight">
                    <div class="edit-title bc-greyf8 mt5">
                        <textarea class="article-title fc-black fs34" id="message_title" name="short-article-title" rows="2" placeholder="请输入标题"></textarea>
                    </div>
                    <div class="clear"></div>
                    <div class="edit-content" >
                        <div class="edit-content-container">
                            <div class="article-edit-module fc-grey678 fs30" id="edit-mark"  placeholder="请输入您想分享的内容" contenteditable="true" onkeyup="setStartAndEnd(this)" onmouseup="setStartAndEnd(this)" onfocus="setStartAndEnd(this)"></div>
                        </div>
                    </div>
                    <script>
                        //短文编辑页面-计算正文区域高度
                        var hEdit =  $(window).height() - 50 ;
                        $('.article-edit-container .edit-content').height(hEdit);
                        var hEditCon = hEdit-50;
                        $('.edit-content-container').height(hEditCon);
                        $("#edit-mark").blur(function(){

                                var hEdits =  $(window).height() - 50;
                                     var hEditCons = hEdits-50;
                                $('.article-edit-container .edit-content').height(hEdits);
                                $('.edit-content-container').height(hEditCons);
                                $('.autoheight').css('margin-top','100px');

                        });


                        function setStartAndEnd(obj){
                            var el = $("#edit-mark");
                            selection = window.getSelection();
                            anchorNode = selection.anchorNode;
                            focusNode = selection.focusNode;
                            selectStart = selection.anchorOffset;
                            selectEnd = selection.focusOffset;
                        }
                    </script>
                </div>
<!--                <div class="edit-module bg-white" style="height:100%;">-->
<!--                    <div class="message-content fc-grey678 fs30" style="height:100%;">-->
<!--                        <!--短消息标题-->
<!--                        <input class="message-title fs34 b-b-greyf1" id="message_title" contenteditable="true" placeholder="请输入标题（必填）" autofocus/>-->
<!--                        <!--短消息正文-->
<!--                        <div class="edit-content-container">-->
<!--                            <div style="padding-top:20px;" class="article-edit-module fc-grey678 fs30" id="edit-mark"  onkeyup="onfoucstexts(this)" onmouseup="onfoucstexts(this)" oninput="onfoucstexts(this)" onchange="onfoucstexts(this)" contenteditable="true"  placeholder="请输入您想分享的内容"></div>-->
<!--                        </div>-->
                        <style>
                            #edit-mark:empty::before {
                                content: attr(placeholder);
                            }
                        </style>
<!--                    </div>-->
<!--                </div>-->
            <script>


            </script>
                <div class="upload-file">
                    <div class="select-view"></div>
                    <div class="nav-type file-box">
                        <div class="nav-item nav-photo">
                            <div id="selectImg">
                                <input style="diplay:block;opacity: 0;" type="file" accept="image/*;capture=camera" multiple="true" name="filehidden"></div>
                        </div>
                        <div class="nav-item nav-voice"></div>

                    </div>

                 <!-- 录音界面-->
                    <div class="content-box" style="display:none;">
                        <div class="voice-box" style="display:none;">
                            <div class="message-voice bg-grey" style="display:block;" >
                                <div class="answer-mc bg-white b-t-grey">
                                    <p class="fs30 fc-grey456">录音最长300秒，单次录音最长60秒，最多加录4次</p>
                                    <div class="answer-log-list mt30">
                                        <a class="answer-log-item bg-greyabc" id="answer-log-item0" onclick="recordButton(0)">
                                            <i class="bg-orange" style="left:0;"></i>
                                            <em class="bg-orange" style="width:0;"></em>
                                            <span class="fc-greyabc fs28">0s</span>
                                        </a>
                                        <a class="answer-log-item bg-greyabc" id="answer-log-item1" onclick="recordButton(1)">
                                            <i class="bg-orange" style="left:0;"></i>
                                            <em class="bg-orange" style="width:0;"></em>
                                            <span class="fc-greyabc fs28">0s</span>
                                        </a>
                                        <a class="answer-log-item bg-greyabc" id="answer-log-item2" onclick="recordButton(2)">
                                            <i class="bg-orange" style="left:0;"></i>
                                            <em class="bg-orange" style="width:0;"></em>
                                            <span class="fc-greyabc fs28">0s</span>
                                        </a>
                                        <a class="answer-log-item bg-greyabc" id="answer-log-item3" onclick="recordButton(3)">
                                            <i class="bg-orange" style="left:0;"></i>
                                            <em class="bg-orange" style="width:0;"></em>
                                            <span class="fc-greyabc fs28">0s</span>
                                        </a>
                                        <a class="answer-log-item bg-greyabc" id="answer-log-item4" onclick="recordButton(4)">
                                            <i class="bg-orange" style="left:0;"></i>
                                            <em class="bg-orange" style="width:0;"></em>
                                            <span class="fc-greyabc fs28">0s</span>
                                        </a>
                                    </div>
                                    <p class="fs30 fc-greyabc mt10">点击每段录音可试听或重录</p>
                                </div>
                                <!-------------问答详情-回答------------------------>
                                <div class="qanda-record-answer">
                                    <!--开始录音-->
                                    <div class="prompt-box">
                                        <p>点击此处开始录音</p>
                                        <span class="angle"></span>
                                    </div>
                                    <span class="time-show fs34 fc-orange">0s</span>
                                    <div class="control-btn">
                                        <!--录音按钮-->
                                        <div class="main-control bg-white" id="record-btn">
                                            <img src="../bdt/images/record.png"></div>
                                        <!--录音和破防录音-停止录音后即可播放录音-播放中可暂停可继续播放-->
                                        <div class="main-control bg-greyf1" id="record-play" style="display:none;">
                                            <!--录音进度-->
                                            <div class="record-percent-circle">
                                                <span class="record-percent left-record-percent"></span>
                                                <span class="record-percent right-record-percent wth0"></span>
                                            </div>
                                            <!--播放进度-->
                                            <div class="play-percent-circle" style="display:none;">
                                                <span class="play-percent left-play-percent"></span>
                                                <span class="play-percent right-play-percent wth0"></span>
                                            </div>
                                            <!--控制按钮-->
                                            <div class="control-con bg-white">
                                                <span class="record-stop bg-orange"></span>
                                                <span class="play-start" style="display:none;"><img src="../bdt/images/start.png"></span>
                                                <span class="play-stop bg-orange" style="display:none;"></span>
                                            </div>
                                        </div>
                                        <a class="chonglu-btn bg-white fc-orange fs34" id="chonglu-btn" style="display:none;">重录</a>
                                        <a class="addlu-btn bg-white fc-orange fs34" id="addlu-btn" style="display:none;">加录</a>
                                    </div>
                                    <p class="record-tips fs32 fc-black456 mt10">点击开始录音最多录制300”...</p>
                                </div>
                            </div>

                        </div>
                    </div>
                    <!-- 录音界面-->


                </div>
            </div>
            <!--主要内容 start-->
        </div>
        <!-- 编辑页面 end -->

        <!-- 选择文件类型 end -->
    </div>
</div>

<div class="appui-gallery" id="gallery" style="display:none;">
    <span class="appui-gallery__img"><img src=""></span>
</div>

<!--选取录音-->
<!--<div class="popup-select popup-select-show" style="display:block">-->
<div class="popup-select">
    <div class="select-list">
        <p class="select-btn fs34">选取录音<input type="file" id="selectRecord" multiple="multiple" display="none"></p>
        <p class="select-btn fs34" id="recordVoice">录音</p>
        <p class="select-btn fs34">取消</p>
    </div>
</div>
<!--选取录音END-->

<div id="js-bg" class="bg-black" style="display:none" onclick="$('#js-recommend').stop().animate({'top':'-100%'},300);$('.appui-recommend-close').stop().animate({'bottom':'-500%'},300,function(){$('#js-bg').stop().fadeOut();$('#js-recommend').stop().fadeOut(500);})"></div>
<!--文章转载-->
<div id="js-recommend" class="bg-white" style="display:block;">
    <div class="appui-recommend-module">
        <div class="appui-recommend-module-hd bg-greyfa">
            <h2 class="fs28 fc-black456">发布确认</h2></div>
        <div class="clear"></div>
        <div class="appui-recommend-module-bd mt5">
            <div class="clear"></div>
            <h4 class="fs28 fc-grey666 mt10 ">请输入标题(可选)，能提高阅读量哦！</h4>
            <textarea class="bc-grey fs32 fc-black456 mt10 mb10 addtitle" id="summaryInput"   placeholder="请输入标题(可选)，能提高阅读量哦！" contenteditable="true" maxlength="40"></textarea>

        </div>
        <div class="appui-open-publish" id="appuiOpenPublish" style="display:none;">
				<span class="mr5" style="margin-left: 0.8rem;">
					<i class="bg-white"></i>
				</span>
            <p class="fs28 fc-grey666">公开发布</p>
        </div>
        <div class="appui-recommend-module-fd mt5 mb10">
         <?php if($_GET['from'] != 'circle'):?>
                <div class="fs28">
                    <a class="publishtype publishcolor" data-type="0">综合</a>
                    <?php foreach($type as $k=>$v):?>
                        <a class="publishtype bg-grey" data-type="<?=$v['id'];?>"><?=$v['name'];?></a>
                    <?php endforeach;?>
                </div>
                <script>
                    $('.publishtype').click(function(){
                        $(this).not('bg-blue').addClass('publishcolor');
                        $('.publishtype').not(this).removeClass('publishcolor').addClass('bg-grey');
                    });
                </script>
            <?php endif;?>

            <a class="bg-blue fs28 fc-white" id="confirmSubmit">发表</a>
        </div>
    </div>
    <a class="appui-recommend-close bg-orange" onclick="$('#js-recommend').stop().animate({'top':'-100%'},300);$('.appui-recommend-close').stop().animate({'bottom':'-500%'},300,function(){$('#js-bg').stop().fadeOut();$('#js-recommend').stop().fadeOut(500);})"><img src="../bdt/images/close.png"></a>
</div>


<div class="custom-tag-edit" id="custonTagEditDialog" style="display:none;">
    <div class="appui-mask"></div><div class="custom-tag-edit-con bg-white">
        <h3 class="fs32 fc-black">添加标签</h3>
        <input type="text" class="fs32 fc-black bg-greyfa" placeholder="输入新标签" id="tagcustomText">
        <p class="fs28">
            <a class="fc-grey666" id="cancelEditLabel">取消</a>
            <a class="fc-black" id="sureTagEditLabel">确定</a></p>
    </div>
</div>
</body>