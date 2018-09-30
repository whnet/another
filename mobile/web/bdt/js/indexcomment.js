
// // 点击查看评论
// $(document).ready(function(){
//     var comment=$('.comment_num');
//     var num=$('.comment_num').parent(".f-f-module").find(".comment").text();
//     console.log(num);
//     if(num==0){
//         $('.comment_num').parent(".f-f-module").find(".comment_num").removeClass("on");
//     }else if(num!=0){
//         $('.comment_num').parent(".f-f-module").find(".comment_num").addClass("on");
//     }
// })





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