var picNextIndex = 0;
var picLen = 0;
var pics = new Array();
var videoNextIndex = 0;
var videoLen = 0;
var videos = new Array();
var selectStart = 0;
var selectEnd = 0;
var isFirst = true;
var selection;
var startParentNode;
var endParentNode;
var jiaodu = 0;
var editStatus = 0;

var testNum =0;

var anchorNode,focusNode,anchorNodeParent,focusNodeParent;
var cursorNode = null;
var cursorPosition = 0;

var weixinDisPlayStyle = "<style>.rich_media_inner{padding-left:0px;padding-right:0px;}</style>";

var contents = null;
var contentsLen = 0;
var uploadPics = null;
var uploadVideos = null;
var outerImgCnt = 0;
var outerVideoCnt = 0;
//var autoSummary = "";
var isCancle = "";

var publishLocationId = "0";
var publishLocationType = "";

var g_article_edit_summary = "";
var from = "";
$(function() {
    from = request("from");
    if (from=="square") {
        publishLocationType = "";
    }else if (from=="circle") {
        publishLocationType = "2";
    }else if (from=="loupan_page") {
        publishLocationType = "1";
    }

    publishLocationId = request("publishLocationId");
    if (publishLocationId == null) {
        publishLocationId = "";
    }

    //如果来源于圈子或楼盘就显示编辑标签工具栏
    // if(from=='loupan_page'){
    // 	$('.edit-tool-bar').css({'bottom':'2.5rem','left':'0','position':'absolute'});
    // 	$('#editLabel').show();
    // 	LoadLouPanContentType("editLabel");
    // }
    // else if(from=='circle'){
    // 	$('#editLabel').show();
    // 	$('.edit-tool-bar').css({'bottom':'2.5rem','left':'0','position':'absolute'});
    // 	//根据圈子编号得到圈主
    // 	requestQzShow(publishLocationId);
    // }

    //短文编辑页面-计算正文区域高度
    var hEdit =  $(window).height() - 100 ;
    $('.article-edit-container .edit-content').height(hEdit);
    var hEditCon = hEdit-50;
    if(from=='loupan_page' || from=='circle'){
        hEditCon = hEdit-100;
    }
    $('.edit-content-container').height(hEditCon);
    $(window).resize(function(e) {
        var hEdit =  $(window).height() - 100 ;
        $('.article-edit-container .edit-content').height(hEdit);
        if(from=='loupan_page' || from=='circle'){
            hEditCon = hEdit-100;
        }
        $('.edit-content-container').height(hEditCon);
    });



    $("#back-btn").click(function() {
        friendTips1("是否要放弃您当前编辑的内容？","放弃","继续编辑");
    });

    $("#edit-mark").text("请输入正文");
    //插入图片,运行正常
    $("#filehidden").change(function(){
        var file = $(this).get(0).files[0];
        var rFilter = /^(image\/jpeg|image\/png)$/i; // 检查图片格式
        if (!rFilter.test(file.type)) {
            dataLoadedError("请选择jpeg、png格式的图片文件。");
            $("#filehidden").val("");
            return false;
        }else{

            EXIF.getData(file,function(){
                jiaodu=EXIF.getTag(this,'Orientation');
            });

            if (typeof FileReader === 'undefined') {
                alert('Your browser does not support FileReader...');
                return false;
            }
            var reader = new FileReader();
            reader.onload = function(e) {
                getImgData(this.result,jiaodu,function(data,srcWidth,srcHight){
                    pics[picNextIndex]=data;
                    console.log(pics);
                    var oldIndex = picNextIndex;
                    picLen++;
                    picNextIndex++;
                    if(editStatus==0){
                        $("#edit-mark").text("");
                    }
                    editStatus = 1;
                    insertImgIntoCurrSection(oldIndex);
                    $("#filehidden").val("");
                });
            }
            reader.readAsDataURL(file);
        }
    });

    //插入视频yanli
    $("#filehiddenVideo").change(function(){
        var file = $(this).get(0).files[0];
        var rFilter = /^(video\/mp4|video\/quicktime)$/i; // 检查图片格式
        if (!rFilter.test(file.type)) {
            dataLoadedError("请选择正确的视频文件。");
            $("#filehidden").val("");
            return false;
        }else{
            if (typeof FileReader === 'undefined') {
                alert('Your browser does not support FileReader...');
                return false;
            }
            var reader = new FileReader();
            reader.onload = function(e) {
                // getImgData(this.result,jiaodu,function(data,srcWidth,srcHight){
                videos[videoNextIndex]=this.result;//data;
                var oldIndex = videoNextIndex;
                videoLen++;
                videoNextIndex++;
                if(editStatus==0){
                    $("#edit-mark").text("");
                }
                editStatus = 1;
                insertVideoIntoCurrSection(oldIndex,URL.createObjectURL(file));
                $("#filehiddenVideo").val("");
                //});
            }
            reader.readAsDataURL(file);
        }
    });

    $("#submitContent").click(function(){
        var title = trim($("#titleInput").val()).replace(/</g, "&lt;").replace(/>/g, "&gt;");
        var summary = getTextFromHtml(trim($("#summaryInput").val()));
        var editNode = document.getElementById("edit-mark");
        if(title == ""){
            dataLoadedError("请输入文章的标题");
        }else if(trim(editNode.innerText.replace(/[\r\n]/g,""))=="" && !hasImgNode(editNode) && !hasVideoNode(editNode) ||editNode.innerText=="请输入正文"){
            dataLoadedError("请输入要分享的内容");
        }else{
            if(summary == ""){
                if($("#articleId")!=null && $("#articleId").val()!=""){
                    $("#summaryInput").val(g_article_edit_summary);
                }else{
                    initContentGet();
                    setInputToContents(editNode);
                    var textContent = getInputContentFromContents();
                    var shareSummary = createAutoSummary(textContent);
                    $("#summaryInput").val(createAutoSummary(textContent));
                }
            }

            $('#js-bg').stop().fadeIn();
            $('#js-recommend').stop().fadeIn(500,function(){$('#js-recommend').stop().animate({'top':'20%'},300);$('.appui-recommend-close').stop().animate({'bottom':'-2.4rem'},300);$('.link-style p').each(function(){
                $(this).css('margin-top',-$(this).height()/2);
            });
            });
        }
    });
    $("#confirmSubmit").click(function(){

        var title = trim($("#titleInput").val()).replace(/</g, "&lt;").replace(/>/g, "&gt;");
        var summary = getTextFromHtml(trim($("#summaryInput").val()));//.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        var editNode = document.getElementById("edit-mark");
        var iconDefaultPicForNullUrl;
        var type = '';
        var length = $(".publishcolor").length;
        $(".publishcolor").each(function(i){
            if(i != (length - 1)){
                type += $(this).data('type')+',';
            }else{
                type += $(this).data('type');
            }
        });
        //summary中不能有连续2个回车键。过滤连续两个回车键
        while (true){
            if(summary.indexOf("\r\n\r\n")>=0){
                summary = summary.replace("\r\n\r\n","\r\n");
            }else if(summary.indexOf("\n\n")>=0){
                summary = summary.replace("\n\n","\n");
            }else if(summary.indexOf("\r\r")>=0){
                summary = summary.replace("\r\r","\r");
            }else{
                break;
            }
        }
        $("#summaryInput").val(summary);
        //clearAllNode(editNode);
        if(title == ""){
            dataLoadedError("请输入文章的标题");
        }else if(summary == ""){
            dataLoadedError("请输入文章摘要");
        }else if(trim(editNode.innerText.replace(/[\r\n]/g,""))=="" && !hasImgNode(editNode) && !hasVideoNode(editNode)||editNode.innerText=="请输入正文"){
            dataLoadedError("请输入要分享的内容");
        }else{
            if($("#articleId")!=null && $("#articleId").val()!=""){
                var imgStr = getPisStrFromNode(editNode);
                publishGrabArticle($("#articleId").val(),$("#nickname").val(),$("#edit-mark").html(),title,summary,imgStr);
            }else{
                initContentGet();
                setInputToContents(editNode);

                $("#contentTitle").text(title);
                if(uploadPics.length>0){
                    $("#contentHomePic").attr("src",uploadPics[0]);
                }else{
                    $("#contentHomePic").attr("src",iconDefaultPicForNullUrl);
                }
                var textContent = getInputContentFromContents();
                submitContent(textContent,title,summary,type);//发布文章
                $('#js-recommend').stop().animate({'top':'-100%'},300);
                $('.appui-recommend-close').stop().animate({'bottom':'-500%'},300,function(){$('#js-bg').stop().fadeOut();$('#js-recommend').stop().fadeOut(500);});
            }

            $('#js-recommend').stop().animate({'top':'-100%'},300);
            $('.appui-recommend-close').stop().animate({'bottom':'-500%'},300,function(){$('#js-bg').stop().fadeOut();$('#js-recommend').stop().fadeOut(500);});




        }
    });



    $("#edit-mark").focus(function(){
        if(editStatus==0){
            $("#edit-mark").text("");
            $("#funBox").show();
            $("#submitContent").show();
            $("#pre-btn").hide();
        }
    });

    $("#edit-mark").blur(function(){
        var editContent = $("#edit-mark").html();
        if(editStatus==0){
            if(editContent==""){
                $("#edit-mark").text("请输入正文");
            }else{
                editStatus = 1;
            }
        }
    });

    $("#titleInput").blur(function(){
        var titleInputVal = $("#titleInput").val();
        //如果使用》=0的话未必是地址，只要标题中包含这个就会执行，这是不对的
        if(titleInputVal.indexOf("http://mp.weixin.qq.com")==0 || titleInputVal.indexOf("https://mp.weixin.qq.com")==0){
            $.ajax({
                type: "post",
                url: doGrabArticleByTypeUrl,//doGrabArticleByType
                dataType: "json",
                async: true,
                data: {
                    "type":"enterURL",
                    "publicName":"",
                    "articleCount":0,
                    "enterURL":titleInputVal
                },
                success: function(result) {
                    if (result.result == "success") {
                        dataLoading("文章抓取中...");
                        editStatus=1;
                        setTimeout(getGrabArticleByTypeTimeOut,3000);
                    } else {
                        alert(result.message);
                    }
                }
            });
        }

    });

    $("#edit-mark").keydown(function(e){
        var cancelKey=false;
        var keyCode=window.event.keyCode;

        cursorNode = focusNode;
        cursorPosition = selectEnd;

        if(keyCode == 8 && anchorNode==focusNode && selectStart ==0 &&(anchorNode.nodeType!=1 || anchorNode.id !="edit-mark")){
            cancelKey = keycode8();
        }else if(keyCode == 46 && anchorNode==focusNode && selectEnd == anchorNode.length && !isLastChildren(anchorNode)){
            cancelKey = keycode46();
        }

        if(cancelKey){
            setCursorPosition(cursorNode,cursorPosition);
            window.event.keyCode=0;
            window.event.returnValue=false;
            clearAllNode(document.getElementById("edit-mark"));
            return false;
        }

    });

});

function initContentGet(){
    contents = null;
    contentsLen = 0;
    contents = new Array();
    uploadPics = null;
    uploadPics = new Array();
    uploadVideos = null;
    uploadVideos = new Array();
    outerImgCnt = 0;
    outerVideoCnt = 0;
}

function backFunction(){
    DeleteCookie('AutoSaveContenttitle');
    DeleteCookie('AutoSaveContentcontent');
    customHistoryUtilsBack();
}

function setInputToContents(node){
    if(node.nodeType==3){
        var my = new Array();
        my[0] = 3;
        my[1] = node.nodeValue.replace(/[\r\n]/g,"");
        my[1] = trim(my[1]).replace(/</g, "&lt;").replace(/>/g, "&gt;");

        contents[contentsLen] = my;
        contentsLen++;
    }else if(node.nodeName == "IMG"){
        var my = new Array();
        my[0] = 1;
        my[1] = node.id;
        if(my[1] != null && my[1].substr(0,6) == "wfimg_"){
            //自己插入的图片
            var srcImgId = Number(my[1].replace("wfimg_",""));
            var upLength = uploadPics.length;
            //将base64转成图片文件进行存放
            uploadPics[upLength] = pics[srcImgId];
            my[2] = ""+my[1];
        }else{
            my[1] = "outer_"+outerImgCnt;
            my[2] = node.src;
            outerImgCnt++;
        }
        contents[contentsLen] = my;
        contentsLen++;
    }else if(node.nodeName == "VIDEO"){
        var my = new Array();
        my[0] = 2;
        my[1] = node.id;
        if(my[1] != null && my[1].substr(0,8) == "wfvideo_"){
            //自己插入的视频
            var srcVideoId = Number(my[1].replace("wfvideo_",""));
            var upLength = uploadVideos.length;
            uploadVideos[upLength] = videos[srcVideoId];
            my[2] = "http://www.baidu.com"+my[1];
        }else{
            //copy外来图片
            my[1] = "outer_"+outerVideoCnt;
            my[2] = node.src;
            outerVideoCnt++;
        }
        contents[contentsLen] = my;
        contentsLen++;
    }else if(node.nodeName == "DIV" || node.nodeName == "P"){
        var my = new Array();
        my[0] = 0;
        my[1] = "";
        contents[contentsLen] = my;
        contentsLen++;
    }else if(node.nodeName == "BR"){
        var my = new Array();
        my[0] = 3;
        my[1] = "<br>";
        contents[contentsLen] = my;
        contentsLen++;
    }
    if(node.nodeType==1 && node.hasChildNodes()){
        var childrens = node.childNodes;
        for(var i=0;i<childrens.length;i++){
            setInputToContents(childrens[i]);
        }
    }
}


function getInputContentFromContents(){
    var html = "";
    for(var i=0;i<contentsLen;i++){
        if(i==0){
            if(contents[i][0]==3){
                html = "<p class='mb5'>" + contents[i][1];
            }else if(contents[i][0]==0){
                html = "<p class='mb5'>";
            }else if(contents[i][0]==2){
                html = "<p class='mb5'><i class='video_tag'><video id='" + contents[i][1] + "' src='"+contents[i][2]+"' controls='controls'>您的浏览器不支持 video 标签。</video></i></p>";
            }else{
                html = "<p class='mb5'><i class='img_tag'><img id='" + contents[i][1] + "' src='"+contents[i][2]+"' /></i></p>";
            }
        }else{
            if(contents[i-1][0] == 1 || contents[i-1][0] == 2){
                if(contents[i][0]==1){
                    html += "<p class='mb5'><i class='img_tag'><img id='" + contents[i][1] + "' src='"+contents[i][2]+"' /></i></p>";
                }else if(contents[i][0]==2){
                    html += "<p class='mb5'><i class='video_tag'><video id='" + contents[i][1] + "' src='"+contents[i][2]+"' controls='controls'>您的浏览器不支持 video 标签。</video></i></p>";
                }else{
                    html += "<p class='mb5'>"+contents[i][1];
                }
            }else if(contents[i-1][0] == 0){
                if(contents[i][0]==1){
                    html += "<i class='img_tag'><img id='" + contents[i][1] + "' src='"+contents[i][2]+"' /></i></p>";
                }else if(contents[i][0]==2){
                    html += "<i class='video_tag'><video id='" + contents[i][1] + "' src='"+contents[i][2]+"' controls='controls'>您的浏览器不支持 video 标签。</video></i></p>";
                }else if(contents[i][0]==3){
                    html += contents[i][1];
                }
            }else if(contents[i-1][0] == 3){
                if(contents[i][0]==3){
                    html += contents[i][1];
                }else if(contents[i][0]==1){
                    html += "</p><p class='mb5'><i class='img_tag'><img id='" + contents[i][1] + "' src='"+contents[i][2]+"' /></i></p>";
                }else if(contents[i][0]==2){
                    html += "</p><p class='mb5'><i class='video_tag'><video id='" + contents[i][1] + "' src='"+contents[i][2]+"' controls='controls'>您的浏览器不支持 video 标签。</video></i></p>";
                }else{
                    html += "</p><p class='mb5'>";
                }
            }
        }

        if(i==contentsLen-1 && contents[i][0]!=1){
            html += "</p>"
        }
    }
    return html;
}

/**
 function setCursorPosition(node,postion){
	var el = node;
	if(el.nodeType ==1){
		el.focus();
	}
	var moveTo = postion;
	if($.support.msie){
		var rng;
		el.focus();
		rng = document.selection.createRange();
		if(moveTo == -1){
			moveTo = -el.innerText.length;
		}
		rng.moveStart('character', moveTo);
		var text = rng.text;
		for (var i = 0; i < el.innerText.length; i++) {
			if (el.innerText.substring(0, i + 1) == text.substring(text.length - i - 1, text.length)) {
				result = i + 1;
			}
		}
	}else{
		var range = document.createRange();
		range.selectNodeContents(el);
		if(postion != -1){
			range.setEnd(el,postion);
		}

		range.collapse(false);
		var sel = window.getSelection();
		sel.removeAllRanges();
		sel.addRange(range);
	}
}*/

function getFirstChildren(node){
    if(node.hasChildNodes()){
        return getFirstChildren(node.firstChild);
    }else{
        return node;
    }
}

function keycode8(){
    var cancelKey=false;
    var optAnchorNode = anchorNode;
    if(optAnchorNode.nodeType==1 && optAnchorNode.hasChildNodes()){
        optAnchorNode = getFirstChildren(optAnchorNode);
    }
    var parentNode = optAnchorNode.parentNode;
    var preNode = getOperateNode(anchorNode);

    if(optAnchorNode.nodeType==1 && (optAnchorNode.innerText=="" || optAnchorNode.innerText=="\n" || optAnchorNode.innerText=="\r") && !hasImgNode(optAnchorNode) && !hasVideoNode(optAnchorNode)){
        parentNode.removeChild(optAnchorNode);
        cancelKey = true;
        //if(parentNode.lastChild != null){
        //	cursorNode = parentNode.lastChild;
        //	cursorPosition = -1;
        //}else{
        cursorNode = parentNode;
        cursorPosition = -1;
        //}
    }else if(preNode == null){
    }else if(preNode.nodeType==3 && optAnchorNode.nodeType==3){
        cursorPosition = preNode.length;
        preNode.nodeValue = preNode.nodeValue+anchorNode.nodeValue;
        parentNode.removeChild(anchorNode);
        cancelKey = true;
        cursorNode = preNode;
    }else if(preNode.nodeType==3){
        preNode.nodeValue = preNode.nodeValue.substring(0,preNode.length-1);
        cancelKey = true;
        cursorNode = preNode;
        cursorPosition = preNode.length;
    }else{
        var preNodeParent = preNode.parentNode;
        preNodeParent.removeChild(preNode);
        cancelKey = true;
        cursorNode = anchorNode;
        cursorPosition = 0;
    }

    return cancelKey;
}

function keycode46(){
    var cancelKey=false;
    var nextNode = getOperateNodeNext(anchorNode);
    if(nextNode == null){
        return false;
    }
    var parentNode = nextNode.parentNode;

    if(nextNode.nodeType==1 && (nextNode.innerText=="" || nextNode.innerText=="\n" || nextNode.innerText=="\r") && !hasImgNode(nextNode) && !hasVideoNode(nextNode)){
        parentNode.removeChild(nextNode);
        cancelKey = true;
    }else if(nextNode.nodeType==3 && anchorNode.nodeType==3){
        cursorPosition = anchorNode.length;
        anchorNode.nodeValue = anchorNode.nodeValue+nextNode.nodeValue;
        parentNode.removeChild(nextNode);
        cancelKey = true;
    }else if(nextNode.nodeType==3){
        nextNode.nodeValue = nextNode.nodeValue.substring(1,preNode.length);
        cancelKey = true;
    }else{
        parentNode.removeChild(nextNode);
        cancelKey = true;
    }

    return cancelKey;
}

function isLastChildren(node){
    var result = false;
    var parent = document.getElementById("edit-mark");
    while (parent.hasChildNodes()){
        if(parent==node){
            result = true;
            break;
        }else{
            parent = parent.lastChild;
        }
    }
    if(result && node.hasChildNodes()){
        if((node.innerText!="" && node.innerText!="\n" && node.innerText!="\r") || hasImgNode(node) || hasVideoNode(node)){
            result = false;
        }
    }

    return result;
}

function hasImgNode(node){
    if(node.nodeName=="IMG"){
        return true;
    }else if(node.hasChildNodes()){
        var childrens = node.childNodes;
        for(var i=0;i<childrens.length;i++){
            var  hasImg = hasImgNode(childrens[i]);
            if(hasImg){
                return true;
            }
        }
    }

    return false;
}

function hasVideoNode(node){
    if(node.nodeName=="VIDEO"){
        return true;
    }else if(node.hasChildNodes()){
        var childrens = node.childNodes;
        for(var i=0;i<childrens.length;i++){
            var  hasVideo = hasVideoNode(childrens[i]);
            if(hasVideo){
                return true;
            }
        }
    }

    return false;
}

function getOperateNode(fromNode){
    var toNode = null;
    if(fromNode.previousSibling != null){
        toNode = fromNode.previousSibling;
        toNode = getLastOperateNode(toNode);
    }else{
        toNode = fromNode.parentNode;
        if(toNode.id !="edit-mark"){
            toNode = getOperateNode(toNode);
        }else{
            toNode = null;
        }
    }

    return toNode;
}

function getOperateNodeNext(fromNode){
    var toNode = null;
    if(fromNode.nextSibling != null){
        toNode = fromNode.nextSibling;
        toNode = getLastOperateNodeNext(toNode);
    }else{
        toNode = fromNode.parentNode;
        if(toNode.id !="edit-mark"){
            toNode = getOperateNodeNext(toNode);
        }else{
            toNode = null;
        }
    }

    return toNode;
}
function getLastOperateNodeNext(node){
    if(node.nodeType==3 || node.nodeName=="IMG" || node.nodeName=="VIDEO"){
        return node;
    }else if(node.innerHTML==""){
        return node;
    }else{
        return getLastOperateNodeNext(node.firstChild);
    }
}

function getLastOperateNode(node){
    if(node.nodeType==3 || node.nodeName=="IMG" || node.nodeName=="VIDEO"){
        return node;
    }else if(node.innerHTML==""){
        return node;
    }else{
        return getLastOperateNode(node.lastChild);
    }
}


function clearAllNode(node){
    if (node.hasChildNodes()){
        var childrens = node.childNodes;
        for(var i=0;i<childrens.length;i++){
            clearAllNode(childrens[i])
        }
    }
    clearEmptyNode(node);
}

function clearEmptyNode(node){
    var parent = node.parentNode
    if(node.nodeType==1 && node.nodeName != "IMG" && node.nodeName != "VIDEO" && node.innerHTML=="" && node.nodeName !="BR"){
        parent.removeChild(node);
    }else if(node.nodeType==3 && node.length==0){
        parent.removeChild(node);
    }
}

function insertImgIntoCurrSection(picIndex){
    var textBox = document.getElementById("edit-mark");
    var pre ="";
    var post = "";

    var imgNode = document.createElement("img");
    imgNode.src = pics[picIndex];
    imgNode.id = "wfimg_"+picIndex;

    if(typeof(anchorNode) == "undefined"){
        var parentNode = textBox;
        parentNode.insertBefore(imgNode, parentNode.firstChild);
    }else if(anchorNode==focusNode && anchorNode.nodeName=="#text"){
        if(selectStart<selectEnd){
            pre = anchorNode.nodeValue.substring(0,selectStart);
            post = anchorNode.nodeValue.substring(selectEnd);
        }else{
            pre = anchorNode.nodeValue.substring(0,selectEnd);
            post = anchorNode.nodeValue.substring(selectStart);
        }
        var parentNode = anchorNode.parentNode;
        var preNode=document.createTextNode(pre);
        var postNode=document.createTextNode(post);

        parentNode.insertBefore(preNode, anchorNode);
        parentNode.insertBefore(imgNode, anchorNode);
        parentNode.insertBefore(postNode, anchorNode);
        parentNode.removeChild(anchorNode);
    }else if(anchorNode==focusNode){
        var begin = selectStart;
        var end = selectEnd;
        if(selectStart>selectEnd){
            begin = selectEnd;
            end = selectStart;
        }
        for(var i=end-1;i>=begin;i--){
            anchorNode.removeChild(anchorNode.childNodes[i]);
        }
        if(anchorNode.hasChildNodes()){
            anchorNode.insertBefore(imgNode, anchorNode.childNodes[begin]);
        }else{
            anchorNode.appendChild(imgNode);
        }

    }
    //extBox.innerHTML = pre + insertHtml + post;
    $('.face-select').hide();

    set_focus();
}


function insertAIntoCurrSection(title){
    var textBox = document.getElementById("edit-mark");
    var pre ="";
    var post = "";

    var iNode = document.createElement("i");
    iNode.innerHTML = "#"+title+"#";

    if(typeof(anchorNode) == "undefined"){
        var parentNode = textBox;
        parentNode.insertBefore(iNode, parentNode.firstChild);
    }else if(anchorNode==focusNode && anchorNode.nodeName=="#text"){
        if(selectStart<selectEnd){
            pre = anchorNode.nodeValue.substring(0,selectStart);
            post = anchorNode.nodeValue.substring(selectEnd);
        }else{
            pre = anchorNode.nodeValue.substring(0,selectEnd);
            post = anchorNode.nodeValue.substring(selectStart);
        }
        var parentNode = anchorNode.parentNode;
        var preNode=document.createTextNode(pre);
        var postNode=document.createTextNode(post);

        parentNode.insertBefore(preNode, anchorNode);
        parentNode.insertBefore(iNode, anchorNode);
        parentNode.insertBefore(postNode, anchorNode);
        parentNode.removeChild(anchorNode);
    }else if(anchorNode==focusNode){
        console.log("selectStart="+selectStart+",selectEnd="+selectEnd);

        var begin = selectStart;
        var end = selectEnd;
        if(selectStart>selectEnd){
            begin = selectEnd;
            end = selectStart;
        }
        for(var i=end-1;i>=begin;i--){
            anchorNode.removeChild(anchorNode.childNodes[i]);
        }
        if(anchorNode.hasChildNodes()){
            anchorNode.insertBefore(iNode, anchorNode.childNodes[begin]);
        }else{
            anchorNode.appendChild(iNode);
        }
    }
    $('.face-select').hide();

    set_focus();
}

function insertVideoIntoCurrSection(videoIndex,videoUrl){
    //var insertHtml = "<img id=\"img_"+picIndex+"\"  src=\""+pics[picIndex]+"\" />";;
    var textBox = document.getElementById("edit-mark");
    //var pre = textBox.substr(0, selectStart);
    //var post = textBox.value.substr(selectEnd);
    var pre ="";
    var post = "";

    var videoNode = document.createElement("video");
    videoNode.src = videoUrl;
    videoNode.id = "wfvideo_"+videoIndex;
    videoNode.controls = "controls";


    if(typeof(anchorNode) == "undefined"){
        var parentNode = textBox;
        parentNode.insertBefore(videoNode, parentNode.firstChild);
    }else if(anchorNode==focusNode && anchorNode.nodeName=="#text"){
        if(selectStart<selectEnd){
            pre = anchorNode.nodeValue.substring(0,selectStart);
            post = anchorNode.nodeValue.substring(selectEnd);
        }else{
            pre = anchorNode.nodeValue.substring(0,selectEnd);
            post = anchorNode.nodeValue.substring(selectStart);
        }
        var parentNode = anchorNode.parentNode;
        var preNode=document.createTextNode(pre);
        var postNode=document.createTextNode(post);

        parentNode.insertBefore(preNode, anchorNode);
        parentNode.insertBefore(videoNode, anchorNode);
        parentNode.insertBefore(postNode, anchorNode);
        parentNode.removeChild(anchorNode);
    }else if(anchorNode==focusNode){
        console.log("selectStart="+selectStart+",selectEnd="+selectEnd);

        var begin = selectStart;
        var end = selectEnd;
        if(selectStart>selectEnd){
            begin = selectEnd;
            end = selectStart;
        }
        for(var i=end-1;i>=begin;i--){
            anchorNode.removeChild(anchorNode.childNodes[i]);
        }
        if(anchorNode.hasChildNodes()){
            anchorNode.insertBefore(videoNode, anchorNode.childNodes[begin]);
        }else{
            anchorNode.appendChild(videoNode);
        }

    }
    //extBox.innerHTML = pre + insertHtml + post;
    $('.face-select').hide();
    set_focus();
}
// 获取焦点
function setStartAndEnd(obj){
    var el = $("#edit-mark");
    selection = window.getSelection();
    anchorNode = selection.anchorNode;
    focusNode = selection.focusNode;
    selectStart = selection.anchorOffset;
    selectEnd = selection.focusOffset;
}

function createAutoSummary(textContent){
    var autoSummary = "";
    var tt = textContent.split("<p class='mb5'>");
    for(var i=0;i<tt.length;i++){
        if(tt[i].length>1 && tt[i].substring(0,1)!="<"){
            if(autoSummary == ""){
                autoSummary = tt[i].split("</p>")[0];
            }else{
                autoSummary += "<br>" + tt[i].split("</p>")[0];
            }
        }
        if(autoSummary.length>=50){
            break;
        }
    }

    return getTextFromHtml(autoSummary);

}

//发布文章
function submitContent(textContent,title,summary,type){
    dataLoading("正在发布中...");
    var title = title;
    var content = textContent;
    var csrf = $('input[name="csrf"]').val();
    if(uploadPics == ''){
        uploadPics = 0;
    }
    if(uploadVideos == ""){
        uploadVideos =0;
    }
    $.ajax({
        type: "POST",
        url: "/articles/article_data.html",
        data: {
            "title":title,
            "content":content,
            "summary":summary,
            "type":type,
            "pics":uploadPics,
            "videos":uploadVideos,
            'from':request('from'),
            'publishtype':request('publishtype'),
            'circle_id':request('circle_id'),
            _csrf:csrf
        },
        dataType: "json",
        success: function(data){
            if(data.result == 'success'){
                dataLoadedSuccess("发布成功,即将跳转");
                window.location.replace("/articles/article_detail.html?id="+data.id+"&from="+request('from')+"&publishtype="+request('publishtype'));
            }

        }
    });
}
//发布抓取的文章
function publishGrabArticle(articleId,nikeName,contents,title,summary,imgStr){
    $.ajax({
        type: "post",
        url: publishGrabArticleUrl,
        dataType: "json",
        async: true,
        data: {
            "articleId":articleId,
            "nikeName":nikeName,
            "contents":contents,
            "title":title,
            "summary":summary,
            "imgStr":imgStr,
            "articleType":"",
            "publishLocationId":publishLocationId,
            "publishLocationType":publishLocationType,
            "tagLabel":tag_cur_name
        },
        success: function(result) {
            if (result.result == "success") {
                clearToastDialog();
                dataLoadedSuccess("发布成功,即将跳转");
                //window.location.replace("myarticle.html");
                window.location.replace("/article_detail.html?id="+result.data.id);
            } else {
                alert(result.message);
            }
        }
    });
}
function deletePic(index){
    //alert('ok');
    $("#figure_"+index).remove();
    pics[index] = null;
    picLen--;
    if(picLen<9){
        $(".add-message-pic").show();
    }
}

/**
 function set_focus()
 {
     var el = $("#edit-mark");
     el=el[0];  // jquery 对象转dom对象
     el.focus();
     if($.support.msie){
         var rng;
         el.focus();
         rng = document.selection.createRange();
         rng.moveStart('character', -el.innerText.length);
         var text = rng.text;
         for (var i = 0; i < el.innerText.length; i++) {
             if (el.innerText.substring(0, i + 1) == text.substring(text.length - i - 1, text.length)) {
                 result = i + 1;
             }
         }
     }else{
         var range = document.createRange();
         range.selectNodeContents(el);
         range.collapse(false);
         var sel = window.getSelection();
         sel.removeAllRanges();
         sel.addRange(range);
     }
 }*/

// @param {string} img 图片的base64
// @param {int} dir exif获取的方向信息
// @param {function} next 回调方法，返回校正方向后的base64
function getImgData(img,dir,next){
    var image=new Image();
    image.onload=function(){
        var degree=0,drawWidth,drawHeight,width,height;
        drawWidth=this.naturalWidth;
        drawHeight=this.naturalHeight;
        //以下改变一下图片大小
        var maxSide = Math.max(drawWidth, drawHeight);
        if (maxSide > 1337) {
            var minSide = Math.min(drawWidth, drawHeight);
            minSide = minSide / maxSide * 1337;
            maxSide = 1337;
            if (drawWidth > drawHeight) {
                drawWidth = maxSide;
                drawHeight = minSide;
            } else {
                drawWidth = minSide;
                drawHeight = maxSide;
            }
        }
        var canvas=document.createElement('canvas');
        canvas.width=width=drawWidth;
        canvas.height=height=drawHeight;
        var context=canvas.getContext('2d');
        //判断图片方向，重置canvas大小，确定旋转角度，iphone默认的是home键在右方的横屏拍摄方式
        switch(dir){
            //iphone横屏拍摄，此时home键在左侧
            case 3:
                degree=180;
                drawWidth=-width;
                drawHeight=-height;
                break;
            //iphone竖屏拍摄，此时home键在下方(正常拿手机的方向)
            case 6:
                canvas.width=height;
                canvas.height=width;
                degree=90;
                drawWidth=width;
                drawHeight=-height;
                break;
            //iphone竖屏拍摄，此时home键在上方
            case 8:
                canvas.width=height;
                canvas.height=width;
                degree=270;
                drawWidth=-width;
                drawHeight=height;
                break;
        }
        //使用canvas旋转校正
        context.rotate(degree*Math.PI/180);
        context.drawImage(this,0,0,drawWidth,drawHeight);
        //返回校正图片
        next(canvas.toDataURL("image/jpeg",0.8),Math.abs(canvas.width),Math.abs(canvas.height));
    }
    image.src=img;
}

function showPic(index){
    $('#gallery').fadeIn();
    $('#gallery').click(function(){
        $('#gallery').fadeOut();
    });
    $('.appui-gallery__img img').attr('src',pics[index]);
    if($('.appui-gallery__img img').height() > $('.appui-gallery__img').height()){
        $('.appui-gallery__img img').css({'top':'0','margin-top':'0'});
    }
    else{
        $('.appui-gallery__img img').css({'top':'50%','margin-top':-$('.appui-gallery__img img').height()/2});
    }
}
//弹出@功能界面

function linkmanPage(){
    $('#edit-insert-link').click(function(e) {
        $('#js-friends').animate({'right':'0','opacity':'1'},300);
        //获取可以@的好友
        friendList();
    });
}
function friendList(){
    // var doStr = "";
    // for (var i = 0; i < 10; i++) {
    //       doStr += '<a class="contacts-item b-b-grey bg-white">'+
    //                    '<i><img src="images/photo/user_2_100.jpg" /></i>'+
    //                    '<h2 class="fs30 fc-navy">高级房地产dav</h2>'+
    //                    '<span class="bg-white"></span>'+
    //                '</a>';
    // };
    // $('.contacts-list').append(doStr);

    $('#closeJsFriends,#sureJsFriends').click(function(e) {
        $('#js-friends').animate({'right':'-100%','opacity':'0'},300);
    });
    $('.contacts-item').each(function(index, element) {
        $(this).click(function(e) {
            $(this).find('span').toggleClass('selected');
        });
    });
    // var pinYinArr = new Array();
    var nameArr = ["df","打酱油","风闸与","你是哪里来的","爱就是一个","我是国宝","风闸与","风闸与","你是哪里来的","爱就是一个"];
    //    for (var i = 0; i < nameArr.length; i++) {
    //    	var name = nameArr[i];
    // 	pinYinArr.put(name.toPinyin().toLowerCase());
    // }
    // var listPinYin = $('#contacts0').find('h2').toPinyin();
    $("#serchInput").keyup(function(){
        var serchInput = $("#serchInput").val();
        var myReg = /^[\u4e00-\u9fa5]+$/;	//判断汉字的正则表达式
        var pinYin = $(this).toPinyin(0).toLowerCase();
        for (var i = 0; i < nameArr.length; i++) {
            var listPinYin = $('#contacts'+i).find('h2').toPinyin(1).toLowerCase();
            if (listPinYin.indexOf(pinYin)!=-1) {
                $('#contacts'+i).show();
                if (myReg.test(serchInput)&&nameArr[i].indexOf(serchInput)==-1) {	//输入的是汉字
                    //ajax调用
                    $('#contacts'+i).hide();
                }
            }else{
                $('#contacts'+i).hide();
            }
        }
    });
    // $("#serchInput").bind('input propertychange',function(){
    // 	// alert("输入框内容发生了改变");
    // 	var pinYin = $(this).toPinyin(0).toLowerCase();
    // 	// var a = new Array(1, 2, 3, 4, 5);
    // 	for (var i = 0; i < nameArr.length; i++) {
    // 		var listPinYin = $('#contacts'+i).find('h2').toPinyin(1).toLowerCase();
    // 		if (listPinYin.indexOf(pinYin)!=-1) {
    // 			// selectFriend(i);
    // 			$('#contacts'+i).show();
    // 			if (nameArr[i].indexOf($(this).val())==-1) {
    // 				$('#contacts'+i).hide();
    // 			};
    // 		}else{
    // 			$('#contacts'+i).hide();
    // 		}
    // 		// &&nameArr[i].indexOf($(this).val())!=-1
    // 	}
    // });
}
function selectFriend(i){
    // $('.contacts-list').before();
    $('#contacts'+i).show();
    // var doStr = "";
    // doStr += '<a class="contacts-item b-b-grey bg-white">'+
    //                    '<i><img src="images/photo/user_2_100.jpg" /></i>'+
    //                    '<h2 class="fs30 fc-navy">我是国宝</h2>'+
    //                    '<span class="bg-white"></span>'+
    //                '</a>';
    // $('.contacts-list').html(doStr);
}//得到抓取的文章内容
function getGrabArticleDetails(id){
    $.ajax({
        type: "post",
        url: getGrabArticleContentByIdUrl,
        dataType: "json",
        async: true,
        data: {
            "contentId":id
        },
        success: function(result) {
            if (result.result == "success") {
                var articleContent=result.articleContent;
                g_article_edit_summary = getTextFromHtml(articleContent.content).trim().substring(0,70);
                if(g_article_edit_summary.lastIndexOf("。")>10){
                    g_article_edit_summary = g_article_edit_summary.substring(0,g_article_edit_summary.lastIndexOf("。")+1);
                }
                $("#edit-mark").html(articleContent.style+weixinDisPlayStyle+articleContent.content);
            } else {
                alert(result.message);
            }
        }
    });
}
function getGrabArticleByTypeTimeOut(){
    $.ajax({
        type: "post",
        url: getDoGrabArticleStatus,
        dataType: "json",
        async: true,
        data: {},
        success: function(result) {
            if (result.result == "success") {
                clearToastDialog();
                $("#titleInput").val(result.title);
                $("#articleId").val(result.id);
                $("#nickname").val(result.nickname);
                getGrabArticleDetails(result.contentid);
            } else {
                setTimeout(getGrabArticleByTypeTimeOut,1000);
            }
        }
    });
}
var g_imgArray;
//var g_imgStr = "";
//var g_imgCount = 0;
function getPisStrFromNode(node){
    // g_imgStr = "";
//	g_imgCount = 0;
    g_imgArray=new Array();
    getPisStrFromNodeIn(node);
    return g_imgArray;
}
function getPisStrFromNodeIn(node){
    if(node.nodeName == "IMG"){
        //	g_imgStr = g_imgStr + node.getAttribute("src")+",";
        //	g_imgCount =g_imgCount + 1;
        g_imgArray[g_imgArray.length]=node.getAttribute("src");
    }
    if(node.nodeType==1 && node.hasChildNodes()){
        var childrens = node.childNodes;
        for(var i=0;i<childrens.length;i++){
            getPisStrFromNodeIn(childrens[i]);
        }
    }
}

function myClose(){
    if (from=="circle") {
        //alert(1);
        writeClientSession("circleRefresh",1);
    };
}

//富文本编辑器
$("#addText").click(function(){
    $("#editBox").show();
    $("#funBox").hide();
    $("#submitContent").hide();
    $("#pre-btn").show();
});

//录语音
$("#addVoice").click(function(){
    $(".content-box").show();
    $(".content-box").css("margin-top","-75%");
    $(".voice-box").show();
    $("#funBox").hide();
    $("#submitContent").show();
    $("#pre-btn").hide();
});
//水平线
$("#addLine").click(function(){
    $("#edit-mark").html("<span style='width:100%;height:1px;display:inline-block;background-color:black'>");
    $("#funBox").hide();
    $("#submitContent").show();
    $("#pre-btn").hide();
})
// 点赞
// $("#dianZan").click(function(){
//     $(this).find("img").attr("src","../bdt/images/like1.png")
//     $(".edit—mask").hide();
// })
//关闭
$("#close").click(function(){
    $("#funBox").hide();
    $("#submitContent").show();
    $("#pre-btn").hide();
});


//取消插入文字
$(".close_btn").click(function(){
    $("#editBox").hide();
    $("#submitContent").show();
    $("#pre-btn").hide();
    $(".w-e-text").html("");
});
$(".submit_btn").click(function(){
    var addText=$(".w-e-text").html();
    var Text=$("#edit-mark").html();
    $("#edit-mark").html(addText);
    $(".mask-box").hide();
    $("#submitContent").show();
    $("#pre-btn").hide();
    $(".w-e-text").html("")
})

//插入图片
// $("#addImg").on("click",function(){
// 	alert("1")
//     var file = $(this).get(0).files[0];
//     var rFilter = /^(image\/jpeg|image\/png)$/i; // 检查图片格式
//     if (!rFilter.test(file.type)) {
//         dataLoadedError("请选择jpeg、png格式的图片文件。");
//         $("#addImg").val("");
//         return false;
//     }else{
//
//         EXIF.getData(file,function(){
//             jiaodu=EXIF.getTag(this,'Orientation');
//         });
//
//         if (typeof FileReader === 'undefined') {
//             alert('Your browser does not support FileReader...');
//             return false;
//         }
//         var reader = new FileReader();
//         reader.onload = function(e) {
//             getImgData(this.result,jiaodu,function(data,srcWidth,srcHight){
//                 pics[picNextIndex]=data;
//                 console.log(pics);
//                 var oldIndex = picNextIndex;
//                 picLen++;
//                 picNextIndex++;
//                 if(editStatus==0){
//                     $("#edit-mark").text("");
//                 }
//                 editStatus = 1;
//                 insertImgIntoCurrSection(oldIndex);
//                 $("#addImg").val("");
//             });
//         }
//         reader.readAsDataURL(file);
//     }
// });