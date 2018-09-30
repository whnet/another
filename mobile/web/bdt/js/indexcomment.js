
// 开始点评
if(result.data.list[i].data.length){
    for(var k=0;k<result.data.list[i].comment.length;k++){
        if(result.com == result.data.list[i].comment[k].member_id){
            pubcommentClick();
        }
    }
}
// 评论
function pubcommentClick(a,b,c,obj,n){
    alert("1")
    var commentBox="";
    $(obj).parents(".focus-list").find(".comment-box").toggleClass("active");
    if(n==1){
        commentBox+='<div class="comment-box">'+
            '<div class="comment-content" contenteditable="true"></div>'+
            '<span class="comment-btn" onclick="pubcommentClick(\' + result.data.list[i].id + \',\' + result.data.list[i].id + \',1,this,1)">评论</span>'+
            '</div>';
        $(obj).parents(".f-l-bottom").siblings(".comment-main").prepend(commentBox);

    }else if(n==2){
        commentBox+='<div class="comment-box">'+
            '<div class="comment-content" contenteditable="true"></div>'+
            '<span class="comment-btn" onclick="pubcommentClick(\' + result.data.list[i].id + \',\' + result.data.list[i].id + \',1,this,2)">评论</span>'+
            '</div>';
        $(obj).parents(".comment-main").prepend(commentBox);
    };
    //禁用评论的点击按钮
    $(obj).css("pointer-events","none");
};