<body class="bg-white">
<script type="text/javascript" src="../bdt/js/exif.js"></script>
<script type="text/javascript" src="../bdt/js/edit.min.js"></script>
<script type="text/javascript" src="../bdt/js/article_edit.js"></script>
<script type="text/javascript" src="../bdt/js/editor_cursor_position.js"></script>
<link type="text/css" rel="stylesheet" href="../bdt/css/edit.min.css">
<div id="container" class="container article-edit-container bg-grey">
	<div id="page">
		<!--页面导航栏-->
		<div class="page__hd page__hd-edit fc-black bg-white b-b-greyf1">
			<div class="statebar">
				<a class="fc-black fs34" id="back-btn">取消</a>
				<a class="fc-black fs34" id="submitContent">发布</a>
			</div>
		</div>
		<!--页面主体-->
		<div class="page__bd">
			<!--占位空间-->
			<div class="top-space1"></div>
			<div class="edit-module bg-white bc-greyf8">
				<div class="edit-title bc-greyf8 mt5">
					<textarea class="article-title fc-black fs34" id="titleInput" name="short-article-title" rows="2" placeholder="请输入标题"></textarea>
				</div>
				<div class="clear"></div>
				<div class="edit-content">
					<div class="edit-content-container">
						<div class="article-edit-module fc-grey678 fs30" id="edit-mark" contenteditable="true" onkeyup="setStartAndEnd(this)"
						     onmouseup="setStartAndEnd(this)" onfocus="setStartAndEnd(this)">请输入正文</div>
					</div>
					<div class="edit-tool-bar-con">
						<div class="edit-tool-bar twobtn bg-white bc-grey" style="bottom: 0rem; left: 0px; position: absolute;">
							<a class="edit-insert-pic" id="edit-insert-pic">
								<input id="filehidden" accept="image/*" class="filehidden" type="file" name="filehidden">
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<div id="js-bg" class="bg-black" style="display:none" onclick="$('#js-recommend').stop().animate({'top':'-100%'},300);$('.appui-recommend-close').stop().animate({'bottom':'-500%'},300,function(){$('#js-bg').stop().fadeOut();$('#js-recommend').stop().fadeOut(500);})"></div>
<!--文章转载-->
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

<input id="articleId" value="" type="hidden">
<input id="nickname" value="" type="hidden">



<!--自定义标签弹框--><div class="custom-tag-edit" id="custonTagEditDialog" style="display:none;">
	<div class="appui-mask"></div><div class="custom-tag-edit-con bg-white">
		<h3 class="fs32 fc-black">添加标签</h3>
		<input type="text" class="fs32 fc-black bg-greyfa" placeholder="输入新标签" id="tagcustomText">
		<p class="fs28"><a class="fc-grey666" id="cancelEditLabel">取消</a>
			<a class="fc-black" id="sureTagEditLabel">确定</a></p>
	</div>
</div>
<script>
    $('.publishtype').click(function(){
        $(this).toggleClass('publishcolor');
    });
</script>
</body>