var flag = 0;
var currentPage = 1;
var pernum = 4;
var start = 0;
$(document).ready(function() {
    getTopics();
    $('.page__bd').scroll(function(){
        if (flag==0){
            var a = "";
            console.log($('#downloadMoreData').length);
            if ($('#downloadMoreData').length > 0){
                a = document.getElementById("downloadMoreData").offsetTop;
                if (a >= $(this).scrollTop() && a < ($(this).scrollTop()+$(window).height()-40)) {
                    flag = -1;
                    downloadMoreData();
                }
            }
        };
    });
})

//加载更过-拼命加载中...
function downloadMoreData() {
    currentPage++;
    getTopics();
}
//数据请求
function getTopics(){
    var csrf = $('input[name="csrf"]').val();
    var start = pernum * (currentPage -1);
    $.ajax({
        url: '/articles/topics.html',
        type: 'post',
        dataType: 'json',
        data:{
            "currentPage": currentPage,
            'start':start,
            "pernum":pernum,
            '_csrf':csrf
        },
        success: function(result){
            if (result.result == "success") {
                listTopics(result);
            }else{
                dataLoadedError(result.message);
            }
        }
    })
}
//循环模板并赋值
function listTopics(result){
    var list = '';
    for(var i=0;i<result.list.length;i++){
        list += '<div class="topic_iten  bg-white" onclick="gotoTopicHtml('+result.list[i].id+')"><div class="ti_top">' +
            '<i onclick="gotoUser_pageHtml('+result.list[i].user.id+',event)"><img src="'+result.file+result.list[i].user.photo+'" />' +
            '<i><img src="../bdt/images/v2.png" /></i></i><div class="ti_author_time"><div>' +
            '<a class="fs28" onclick="gotoUser_pageHtml('+result.list[i].user.id+',event)">'+result.list[i].user.nickname+'</a>' +
            '<span class="fs20 fc-greyabc">2017-05-27</span>' +
            '</div><p class="fs18 fc-greyabc">'+result.list[i].user.slogan+'</p></div></div><div class="ti_content">' +
            '<h1 class="fs32 fc-black">'+result.list[i].title+'</h1>' +
            '<h2 class="fs26 fc-grey666">'+result.list[i].summary+'</h2></div>' +
            '<div class="ti_state fc-greyabc">' +
            '<p class="fs24">6行家参与&middot;0听过&middot;14评论</p>' +
            '<i><img src="../bdt/images/sanjiao.png" /></i>' +
            '<p class="fs24">猛戳查看详情</p></div></div>';
    }
    $('#getTopics').append(list);
    showMessage(result);
}
//切换状态
function showMessage(result){
    if (result.page.pages > result.page.currentPage) {
        if (flag=-1) {
            flag = 0;
        };
        $('#downloadMoreData').remove();
        $('#getTopics').append('<a id="downloadMoreData" class="appui_loadmore fs32 fc-greyabc">拼命加载中<i class="loadmore"></i></a>');
    }else if (result.page.pages == result.page.currentPage && result.page.pages >= 1) {
        $('#downloadMoreData').remove();
        $('#getTopics').append('<a class="appui_loadmore fs32 fc-greyabc">已经没有了</a>');
    }else if(result.list.length == 0){
        $('#getTopics').html(commonNoMoreContent("暂无专家"));
    }
}
function gotoTopicHtml(id){
    window.location.href ="/articles/topicqanda.html?id="+id;

}