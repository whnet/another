<body class="bg-white">
<script type="text/javascript" src="../bdt/js/exif.js"></script>
<script type="text/javascript" src="../bdt/js/edit.min.js"></script>
<script type="text/javascript" src="../bdt/js/article_edit.js"></script>
<script type="text/javascript" src="../bdt/js/editor_cursor_position.js"></script>
<link type="text/css" rel="stylesheet" href="../bdt/css/edit.min.css">
<script src="../eleditor/webuploader.min.js"></script>
<script src="../eleditor/Eleditor.js"></script>
<style type="text/css">
    /********** 长文编辑 ************/
    .f-clearfloat{zoom:1}
    .f-clearfloat:after{display:block;clear:both;content:"";visibility:hidden;height:0}
    .m-article-edit-page{padding:3rem .75rem 0;}
    .m-article-header{display:table;width:100%}
    .m-article-title{background:#fff;width:100%;-webkit-border-radius:.2rem;-moz-border-radius:.2rem;border-radius:.2rem;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;padding:0 .5rem;min-height:2.25rem;display:table-cell;vertical-align:middle;padding:.5rem}
    .m-article-title>div{max-width:100%;outline:0;word-break:break-all;overflow:auto}
    .m-article-title>div:empty:before{content:attr(placeholder);color:#bbb;display:block;text-align:center}
    .m-article-title>div:focus:before{content:none}
    .record-title>div:empty:before{text-align:left}
    .record-title>div{ padding: 0.5rem 0;}
    .m-cropper-content{position:absolute;z-index:5;padding-bottom:2.5rem;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;left:0;top:0;width:100%;height:100%;background:#fff;display:none;overflow: hidden}
    .m-cropper-init{width:100%;height:100%}
    .m-cropper-btn{width:100%;height:2.5rem;bottom:0;position:absolute;background:#232323;color:#fff}
    .m-cropper-btn>ul>li{float:left;width:20%;height:2.5rem;display:inline-block}
    .m-cropper-btn>ul>li>img{height:100%;width:auto;margin:0 auto}
    .m-article-lable{position:absolute;bottom:0;width:100%;height:2.2rem;left:0}
    .m-article-lable>div{float:left;width:25%;text-align:center}
    .m-article-lable>div>a{line-height:1.2rem;display:inline-block;margin-top:.5rem;width:70%;-webkit-border-radius:.1rem;-moz-border-radius:.1rem;border-radius:.1rem}
    .m-article-record-content{width: 100%;}
    .article-voice-box{padding: 0.5rem; border: 0.05rem solid #e6e6e6; }
    .article-voice-box .article-play-btn{ display: table-cell; vertical-align: middle;}
    .article-voice-box>h5{display:table-cell;vertical-align:middle;padding-left:.75rem}
    .Eleditor-area > .m-article-set-margin{display: block;width: 100%;padding: 0;margin: 0.5rem auto 0;text-align: center;height: 1.75rem;background: transparent;}
    .m-article-set-margin .article-set-margin{display: inline-block;right: 0.5rem;text-align: center;background: #fff;height: 1.75rem;-webkit-border-radius: 0.875rem;-moz-border-radius: 0.875rem;border-radius: 0.875rem;padding:0 0.25rem;}
    .article-set-margin > i{display: inline-block;margin: 0 0.25rem;height: 100%;}
    .article-set-margin > i > img{height: 100%;width: auto;}
    /********** 长文编辑 ************/
    .Eleditor-area {
        background: #fff;
        padding: 5px;
        font-size: 16px;
        line-height: 20px;
        color:#000;
    }
    .Eleditor-placeholder{
        text-align: center;
        padding: 50px;
    }
    .page_hd{
        width: 100%;
        height: 2.2rem;
        display: block;
        line-height: 2.2rem;
        text-align: center;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 0;
        border-top: none;
        border-right: none;
        border-left: none;
    }
    .Eleditor-wrap{
        z-index:100;
    }
    .m-article-content{
        overflow-y: auto;
    }
    .nav-act{
        width: 3.2rem;
    }

</style>
<div id="container" class="container article-edit-container bg-grey">
    <div id="page">
        <div class="page__hd page__bd bg-white b-b-grey fc-balck">
            <div class="statebar">
                <a class="nav-act left-act" id="back-btn">取消</a>
                <a class="nav-act fc-blue right-act fs32" id="submitContent">发布</a>
            </div>
        </div>
        <div class="m-article-edit-page">
            <div class="edit-title bc-greyf8 mt5">
                <textarea class="article-title fc-black fs34" id="titleInput"  rows="2" placeholder="请输入标题"></textarea>
            </div>
            <div class="m-article-content mt10">
                <div id="contentEditor">
                    <p class="Eleditor-placeholder">添加内容模块</p>
                </div>
            </div>
        </div>
    </div>
</div>
<div id="js-bg" class="bg-black" style="display:none" onclick="$('#js-recommend').stop().animate({'top':'-100%'},300);$('.appui-recommend-close').stop().animate({'bottom':'-500%'},300,function(){$('#js-bg').stop().fadeOut();$('#js-recommend').stop().fadeOut(500);})"></div>
<div id="js-recommend" class="bg-white" style="display:none;">
    <div class="appui-recommend-module">
        <div class="appui-recommend-module-hd bg-greyfa">
            <h2 class="fs28 fc-black456">发布确认</h2></div>
        <div class="clear"></div>
        <div class="appui-recommend-module-bd mt5">
            <div class="clear"></div>
            <h4 class="fs28 fc-grey666">请输入摘要，能提高阅读量哦！</h4>
            <textarea class="bc-grey fs32 fc-black456 mt10 mb10" id="summaryInput" contenteditable="true" placeholder="给文章添加一段摘要，能提高阅读量哦！"></textarea>
        </div>
        <div class="appui-recommend-module-fd mt5 mb10">
			<?php if($_GET['from'] != 'circle'):?>
                <div class="fs28">
                    <a class="publishtype publishcolor bg-grey" data-type="0">综合</a>
					<?php foreach($type as $k=>$v):?>
                        <a class="publishtype bg-grey" data-type="<?=$v['id'];?>"><?=$v['name'];?></a>
					<?php endforeach;?>
                </div>
			<?php endif;?>
            <a class="bg-blue fs28 fc-white" id="confirmSubmit">发表</a>
        </div>
    </div>
    <a class="appui-recommend-close" onclick="$('#js-recommend').stop().animate({'top':'-100%'},300);$('.appui-recommend-close').stop().animate({'bottom':'-500%'},300,function(){$('#js-bg').stop().fadeOut();$('#js-recommend').stop().fadeOut(500);})">
        <img src="../bdt/images/close.png"></a>
</div>
<!--判断是否有未发布的-->
<div class="js_dialog toastDialogSure autosave" style="display:none">
    <div class="appui-mask"></div>
    <div class="appui-dialog">
        <div class="appui-dialog__hd fs34 fc-blue"><strong class="appui-dialog__title">温馨提示</strong></div>
        <div class="appui-dialog__bd fs30 fc-black456">您有未发布的文章，是否继续编辑</div>
        <div class="appui-dialog__ft fs30">
            <a class="appui-dialog__btn appui-dialog__btn_default fc-greyabc" onclick="tocansel()">放弃</a>
            <a href="javascript:;" id="tipsSaveID" onclick="toedit()" class="appui-dialog__btn appui-dialog__btn_primary fc-blue">继续编辑</a>
        </div>
    </div>
</div>
<!--判断是否有未发布的-->
<input id="articleId" value="" type="hidden">
<input id="nickname" value="" type="hidden">
<script>
    var t;
    var clint = document.documentElement.clientHeight;
    $('.m-article-content').css('height',clint-200);
    var artEditor = new Eleditor({
        el: '#contentEditor',
        upload:{
            server: '/articles/upload.html',
            fileSizeLimit: 2,
            formName: 'article',
            formData:{'_csrf':'{{csrf_token()}}'},
        },
    });
    $('#saveBtn').click(function(){
        var _content = artEditor.getContent();
    });

    // 5分钟自动保存一次
    $('.Eleditor-placeholder').click(function(){
        var t = setInterval(function(){ getContent() }, 1000);
    });
    // 触发停止
    $('.Eleditor-commit').click(function(){
        clearInterval(t);
    });
    function edit(){
        var t = setInterval(function(){ getContent() }, 1000);
    }
    function getContent(){
        var title = $("#titleInput").val();
        var content = $('.textarea').html();
        AutoSave(title,'title');
        AutoSave(content,'content');
    }
</script>
<script>
    $('.publishtype').click(function(){
        $(this).toggleClass('publishcolor');
    });
    function tocansel(){
        DeleteCookie('AutoSaveContenttitle');
        DeleteCookie('AutoSaveContentcontent');
        $('.autosave').css('display','none');
    }
    function toedit(){
        $('.autosave').css('display','none');
        var title = GetCookie('AutoSaveContenttitle');
        var content = '<p onclick="edit()">'+GetCookie('AutoSaveContentcontent')+'</p>'
        $("#titleInput").val(title)
        $('.Eleditor-area').html(content);
    }
</script>
</body>