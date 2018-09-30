
function listDisplayTypeFunction(groups1,i){
    var hotActicleStr="";
     if (groups1[i].isForward==1) {
        var picStr = "";
        var picArray = "";
        if (groups1[i].rootArticle.homePic==null||groups1[i].rootArticle.homePic.length==0) {
            picStr = iconDefaultPicForNullUrl;
        }else{
            picArray = groups1[i].rootArticle.homePic.split(",");
            picStr = picArray[0];
        }
        var contentStr = "";
        var commentListCount = groups1[i].commentList.length;
        if (commentListCount>0){
            for (var j = 0; j < commentListCount; j++) {
                 contentStr += '<span class="fc-navy">//@'+groups1[i].commentList[j].author.nickname+'</span>'+groups1[i].commentList[j].content;
        };
            contentStr = groups1[i].content+contentStr;
        }else{
            contentStr =  groups1[i].content;
        }
        hotActicleStr = '<div class="ac-module-bd bg-white mb10">'+
                                        '<div class="topic-module">'+
                                            '<a class="article-layout article-layout-alltext" href="article_detail.html?id='+groups1[i].id+'">'+
									'<h4 class="fs30 fc-black face_tag">'+contentStr+'</h4>'+
								'</a>'+
								
                                                '<a class="link-style bg-grey fs28 mt10 fc-black" href="article_detail.html?id='+groups1[i].rootArticle.id+'">'+
									'<i>'+
										'<img src="'+picStr+'">'+
									'</i>'+
                                                   '<p>'+groups1[i].rootArticle.title+'</p>'+
                                                '</a>'+
								
                                            '<div class="user-comment mt10">'+
									'<a class="uc-right fs24 fc-greyabc" onclick="gotoUser_pageHtml('+groups1[i].authorId+')">'+
										'<span>'+
											'<img src="'+insertImgType(groups1[i].authorHeadPic,1)+'" />'+
										'</span>'+
										groups1[i].authorNikeName+
									'</a>'+
                                                '<div class="uc-left fs24">'+
                                                    // '<a class="uc-reprint mr20 fc-greyabc">'+groups1[i].forwardTimes+'</a>'+
                                                    '<a class="uc-message fc-greyabc">'+groups1[i].clickTimes+'</a>'+
                                                '</div>'+
                                            '</div>'+
								
                                        '</div>'+
                                    '</div>';
     }else{
     var domStr = "";  
	//0张，1张，3张，置顶，
	switch (groups1[i].listDisplayType) {
                case 0:{
                        hotActicleStr = '<div class="ac-module-bd bg-white mb10">' + '<div class="topic-module">' + '<a class="article-layout article-layout-alltext" href="article_detail.html?id='+groups1[i].id+'">' + '<h3 class="fs32 fc-black face_tag">'+groups1[i].title+'</h3>' + '<p class="fs26 fc-grey678 face_tag">'+groups1[i].content+'</p></a>' + '<div class="user-comment mt10">' + '<a class="uc-right fs24 fc-greyabc" onclick="gotoUser_pageHtml('+groups1[i].authorId+')">'+' <span><img src="'+insertImgType(groups1[i].authorHeadPic,1)+'" /></span>'+groups1[i].authorNikeName+'</a>' + '<div class="uc-left fs24">' + '<a class="uc-message fc-greyabc" href="#">'+groups1[i].clickTimes+'</a></div></div></div></div>';
                    }break;
                case 1:{
                        hotActicleStr = '<div class="ac-module-bd bg-white mb10">' + '<div class="topic-module">' + '<a class="article-layout" href="article_detail.html?id='+groups1[i].id+'">' + '<h3 class="fs32 fc-black face_tag">'+groups1[i].title+'</h3>' + '<p class="fs26 fc-grey678 face_tag">'+groups1[i].content+'</p>' + '<span><img src="'+groups1[i].homePic.split(",")[0]+'" /></span></a>' + '<div class="user-comment mt10">' + '<a class="uc-right fs24 fc-greyabc" onclick="gotoUser_pageHtml('+groups1[i].authorId+')">'+' <span><img src="'+insertImgType(groups1[i].authorHeadPic,1)+'" /></span>'+groups1[i].authorNikeName+'</a>' + '<div class="uc-left fs24">' + '<a class="uc-message fc-greyabc" href="#">'+groups1[i].clickTimes+'</a></div></div></div></div>';
                    }break;
                case 2:{
                    var picArray = groups1[i].homePic.split(",");
                        hotActicleStr = '<div class="ac-module-bd bg-white mb10">' + '<div class="topic-module">' + '<a class="article-layout article-layout-allimg" href="article_detail.html?id='+groups1[i].id+'">' + '<h3 class="fs32 fc-black face_tag">'+groups1[i].title+'</h3>' + '<p class="fs26 fc-grey678 face_tag">' + '<img src="'+picArray[0]+'" />' + '<img src="'+picArray[1]+'" />' + '<img src="'+picArray[2]+'" /></p></a>' + '<div class="user-comment mt10">' + '<a class="uc-right fs24 fc-greyabc" onclick="gotoUser_pageHtml('+groups1[i].authorId+')">'+' <span><img src="'+insertImgType(groups1[i].authorHeadPic,1)+'" /></span>'+groups1[i].authorNikeName+'</a>' + '<div class="uc-left fs24">' + '<a class="uc-message fc-greyabc" href="#">'+groups1[i].clickTimes+'</a></div></div></div></div>';
                    }break;
                case 3:{
                        domStr = '<div class="all-width-module bc-grey bg-white">' + '<div class="topic-module">' + '<a class="article-layout article-layout-recommend" href="article_detail.html?id='+groups1[i].id+'">' + '<span><img src="'+groups1[i].editorPic+'"/>' + '<i class="bg-orange fc-white fs28">今日推荐</i></span>' + '<h3 class="fs32 fc-navy">'+groups1[i].title+'</h3>' + '<div class="user-comment">' + '<a class="uc-right fs24 fc-greyabc" onclick="gotoUser_pageHtml('+groups1[i].authorId+')">'+' <span><img src="'+insertImgType(groups1[i].authorHeadPic,1)+'" /></span>'+groups1[i].authorNikeName+'</a>' + '<div class="uc-left fs24">' + '<a class="uc-message fc-greyabc" href="#">'+groups1[i].clickTimes+'</a>';
                    $('#top').html(domStr);
                }break;
                default:
     }     
     }
     return hotActicleStr;
}
