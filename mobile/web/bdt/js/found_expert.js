// qanda_author.js
var currentPage = 1;
var totalPage = "";
var pernum=7;
var userTest = "";
var page = 1;
var flag = 0;
var labelIndex = "";
var categoryPreID = -1;
var index = 0;

var line = 0;
var defaultName = "";
var defaultIndex = 0;
var firstId = 0;
var firstName = 0;
var windowTop=0; //初始话可视区域距离页面顶端的距离
$(document).ready(function() {

    ajaxLabelCon(index);
    //页面滚动
    $('.page__bd').scroll(function(){
        if (flag==0){
            var a = "";
            if ($('#downloadMoreData').length > 0){
                a = document.getElementById("downloadMoreData").offsetTop;
                if (a >= $(this).scrollTop() && a < ($(this).scrollTop()+$(window).height()-40)) {
                    flag = -1;
                    downloadMoreData();
                }
            }
        };
    });

    $("#smallNav").css({"top":"0","height":"6rem"});

    //初始化优惠券数据并布局顶部标签栏样式


    //顶部标签展开更多
    $("#showMoreBtn").on('click',function(event) {
        event.preventDefault();
        var Height=$("#smallNav").height();
        // console.log(Height);
        if (Height=="80") {
            $("#smallNav").css("height","auto");
            $("#smallNav>div:nth-of-type(1)").css("height","auto");
            $("#smallNav>div:nth-of-type(1)").css("height","auto");
            $(".page__bd ").css("padding-top",$("#smallNav").height()+"px");
        }else{
            $("#smallNav").css("height","6rem");
            $("#smallNav>div:nth-of-type(1)").css("height","6rem");
            $(".page__bd ").css("padding-top","6rem");
        }
    });
    //上下滚动收起和显示头尾
    scroolView();
    //头部搜索点击效果
    $('#searchID , #searchID1').click(function(e) {
        $('body').append(initSearchUI());
        $('#searchText').attr('placeholder',"搜索行家");
        $('.search-container').show();
        set_focus();
    });

});




function labelCommon(index,id,name) {
    currentIndex = index;
    if (categoryPreID == id) {
        $("#openTheNav").hide();
        return;
    }
    categoryPreID = id;

    //初始化参数
    currentPage = 1;
    totalPage = 1;
    $('#professList').html("");
    // 根据index值进行ajax请求
    ajaxLabelCon(currentIndex);
    if($('#topBigDiv').css('top') != '0px'){
        if($('.page__hd-tips').css('display') != 'none'){
            $('.page__bd').css('padding-top','4.05rem');
        }else{
            $('.page__bd').css('padding-top','2.55rem');
        }
    }
    // requestListItem(index);
}
//切换标签
function ajaxLabelCon(currentIndex){
    index = currentIndex;
    var csrf = $('input[name="csrf"]').val();
    var start = pernum * (currentPage -1);
    $.ajax({
        url: '/expert/find.html',
        type: 'post',
        dataType: 'json',
        data:{
            "typeid":currentIndex,
            'start':start,
            "pernum":pernum,
            "currentPage": currentPage,
            '_csrf':csrf},
        success: function(result){
            if (result.result == "success") {
                listExperters(result);
            }else{
                dataLoadedError(result.message);
            }
        }
    })
}

//获取每个分类下的专家
    function listExperters(result){
         var list = '';
         for(var i=0;i<result.list.length;i++){
             if(result.list[i].price == 0.00){
                 var ask = '免费提问';
             }else{
                 var ask = result.list[i].price+'元提问';
             }

             list +='<div class="appui-expert bg-white" >'+
                     '<div class="appui-expert-headpic-level" >'+
                     '<img class="appui-expert-headpic" src="'+result.list[i].user.photo+'">'+
                         '<i><img src="../bdt/images/v2.png"></i>'+
                     '</div>'+
                     '<div class="appui-expert-info">'+
                     '<a class="appui-expert-askbtn fs24 fc-white " onclick="jumptoexpert('+result.list[i].user.id+')" ' +
                     'style="display:block">'+ask+'</a>'+
                     '<h3 class="appui-expert-name fs30 fc-orange" onclick="window.location.href=\'/expert/expert_detail.html?id='+result.list[i].user.id+'\'">'+result.list[i].realname+'</h3>'+
                     '<p class="appui-expert-introduce fs24 fc-grey666 mt5">'+result.list[i].honor+'</p>'+
                     '<p class="appui-expert-introduce fs24 fc-grey666 mt5" onclick="window.location.href=\'/expert/expert_detail.html?id='+result.list[i].user.id+'\'">'+result.list[i].des+'</p>'+

                     // '<div class="appui-expert-tags fs18 mt5 fc-greyabc" >'+'<span style="display:block"></span>'+
                     // '</div>'+
                     '</div>'+
                     '</div>';
         }
         $('#professList').append(list);
         showMessage(result);
    }
function jumptoexpert(id){
        window.location.href = '/questions/wen_questions.html?id='+id+'&from=found&publishtype=ask';
}
function showMessage(result){
    if (result.page.pages > result.page.currentPage) {
        if (flag=-1) {
            flag = 0;
        };

        $('#downloadMoreData').remove();
        $('#professList').append('<a id="downloadMoreData" class="appui_loadmore fs32 fc-greyabc">上拉加载更多<i class="loadmore"></i></a>');
    }else if (result.page.pages == result.page.currentPage && result.page.pages >= 1) {
        $('#downloadMoreData').remove();
        $('#professList').append('<a class="appui_loadmore fs32 fc-greyabc">已经没有了</a>');
    }else if(result.list.length == 0){
        $('#professList').html(commonNoMoreContent("暂无专家"));
    }
}
//加载更过-拼命加载中...
function downloadMoreData() {
    currentPage++;
    ajaxLabelCon(index);
}


//优惠券
function coupons(){
    $.ajax({
        url: '/coupons/nums.html',
        type: 'post',
        dataType: 'json',
        data: {"conponsType":"提问券"},
        success: function (result){
            //获取优惠券数据
            if (result.result == "success") {
                //提问券不等于0--显示“使用优惠券提示”
                if(result.data.couponsCount>0){
                    $(".page__hd-tips p span").html(result.data.couponsCount);
                    $(".page__hd-tips").show();
                    $('.page__bd').css('padding-top','4rem')
                    //$("#noneCouponSpace").hide();
                    //$("#hasCouponSpace").show();
                    //$("#openTheNav").css("top","5.55rem");
                    $("#smallNav").css({"top":"2.55rem","height":"2.5rem"
                    });
                    //$(".professList").css("padding-top","4rem");

                    //关闭“使用优惠券提示”
                    $(".page__hd-tips a").on('click', function(event) {
                        event.preventDefault();
                        $(".page__hd-tips").hide();
                        $('.page__bd').css('padding-top','5.1rem')
                        //$("#noneCouponSpace").show();
                        //$("#hasCouponSpace").hide();
                        //$("#openTheNav").css("top","4.05rem");
                        $("#smallNav").css({"top":"2.55rem","height":"2.5rem"});
                        //$(".professList").css("padding-top","4rem");
                    });
                }else{
                    $(".page__hd-tips").hide();
                    $('.page__bd').css('padding-top','5.1rem')
                    $("#noneCouponSpace").show();
                    $("#hasCouponSpace").hide();
                    $("#openTheNav").css("top","4.05rem");
                    $("#smallNav").css({"top":"2.55rem","height":"2.55rem"});
                    $(".professList").css("padding-top","4rem");
                }
            }
            //获取优惠券数据失败
            else{
                $(".page__hd-tips").hide();
                $('.page__bd').css('padding-top','5.1rem')
                //$("#noneCouponSpace").show();
                //$("#hasCouponSpace").hide();
                //$("#openTheNav").css("top","4.05rem");
                $("#smallNav").css({"top":"2.55rem","height":"2.55rem"});
                //$(".professList").css("padding-top","4rem");
            }
        }
    });
}
function getOpenLabel1(data) {
    var openDom = "";
    var nowIndex = 0;
    $.each(data,function (index,val) {
        if (data[index].id==labelIndex) {
            nowIndex = index;
            openDom+='<span class="fs28 fc-grey666 active" onclick=\"judgeIndex1('+index+','+data[index].id+',\''+data[index].name+'\',1)\">'+data[index].name+'</span>';
        }else{
            openDom+='<span class="fs28 fc-grey666" onclick=\"judgeIndex1('+index+','+data[index].id+',\''+data[index].name+'\',1)\">'+data[index].name+'</span>';
        }
    });
    $("#openTheNav p:first").html(openDom);
}
function getOpenLabel2(data) {
    var openDom = "";
    var nowIndex = 0;
    $.each(data,function (index,val) {
        if (data[index].id==labelIndex) {
            nowIndex = index;
            openDom+='<span class="fs28 fc-grey666 active" onclick=\"judgeIndex('+index+','+data[index].id+',\''+data[index].name+'\',2)\">'+data[index].name+'</span>';
        }else{
            openDom+='<span class="fs28 fc-grey666" onclick=\"judgeIndex('+index+','+data[index].id+',\''+data[index].name+'\',2)\">'+data[index].name+'</span>';
        }
    });
    $("#openTheNav p:last").html(openDom);
}

function getFirstLabel(data) {
    var openDom = "";
    var nowIndex = 0;
    $.each(data,function (index,val) {
        if (data[index].id==labelIndex) {
            nowIndex = index;
            openDom+='<span class="fs28 fc-grey666 active" onclick=\"judgeIndex1('+index+','+data[index].id+',\''+data[index].name+'\',1)\">'+data[index].name+'</span>';
        }else{
            openDom+='<span class="fs28 fc-grey666" onclick=\"judgeIndex1('+index+','+data[index].id+',\''+data[index].name+'\',1)\">'+data[index].name+'</span>';
            firstId = data[0].id;
            firstName = data[0].name;
        }
    });
    $("#smallNav div:first p").html(openDom);
}
function getLastLabel(data) {
    var openDom = "";
    var nowIndex = 0;
    $.each(data,function (index,val) {
        if (data[index].id==labelIndex) {
            nowIndex = index;
            openDom+='<span class="fs28 fc-grey666 active" onclick=\"judgeIndex('+index+','+data[index].id+',\''+data[index].name+'\',2)\">'+data[index].name+'</span>';
        }else{
            openDom+='<span class="fs28 fc-grey666" onclick=\"judgeIndex('+index+','+data[index].id+',\''+data[index].name+'\',2)\">'+data[index].name+'</span>';
        }
    });
    $("#smallNav div:last p").html(openDom);
}

//如果点击的是非5个主要标签则替换固定标签栏第6个标签
//展开标签第一排点击效果
function judgeIndex1(index,id,name,num){
    line = 1;
    labelCommon(index,id,name);
    needToMove(index,num,id,name);
    $(this).addClass('active');
    if(index>=15){
        $("#smallNav div:first span").eq(15).remove();
        // $("#smallNav div:first p").append('<span class="fs28 fc-grey666 active" onclick=\"judgeIndex1('+index+','+id+',\''+name+'\',2)\">'+name+'</span>');
        $("#smallNav div:first span").removeClass('active');
        $("#smallNav div:first span").eq(15).addClass('active');
    }
    $("#smallNav div:last span").removeClass('active');
    $("#openTheNav p:last span").removeClass('active');
    $("#openTheNav p:first span").eq(index).addClass('active');
    $("#smallNav span").eq(id).addClass('active');
    
}
//展开标签第二排点击效果
function judgeIndex(index,id,name,num){
    line = 2;
    labelCommon(index,id,name);
    labelPosWhere(index);
    needToMove(index,num,id,name);
    $("#smallNav div:first span").eq(15).remove();
    $("#smallNav div:first p").append('<span class="fs28 fc-grey666 active" onclick=\"judgeIndex('+index+','+id+',\''+name+'\',2)\">'+name+'</span>');
    $("#smallNav div:first span").removeClass('active');
    $("#smallNav div:first span").eq(15).addClass('active');
    $("#openTheNav p:first span").removeClass('active');
}
//点击展开的标签后定位固定标签位置以及展开标签中选中的标签
function needToMove(index,num,id,name) {
    //第一排展开标签
    if(num==1){
        $("#smallNav div:first span").removeClass('active');
        $("#smallNav div:first span").eq(index).addClass('active');
        $("#openTheNav p:first span").removeClass('active');
        $("#openTheNav p:first span").eq(index).addClass('active');
    }
    //第二排展开标签
    else{
        $("#smallNav div:last span").removeClass('active');
        $("#smallNav div:last span").eq(index).addClass('active');
        $("#openTheNav p:last span").removeClass('active');
        $("#openTheNav p:last span").eq(index).addClass('active');
    }
    $("#openTheNav").hide();
}
function labelPosWhere(index){
    $("#smallNav div:first p").width($("#smallNav").outerWidth()-$("#smallNav img").width()-5);
    $("#smallNav div:first p").css("overflow","hidden");
    var isGoLeftNow = (($("#smallNav div:last span").outerWidth()+5)*(index+1))/$("#smallNav").outerWidth();
    var minIndex = Math.floor(($("#smallNav").outerWidth()/$("#smallNav div:last span").outerWidth()-1)/2);
    if(isGoLeftNow > 0.5){
        $("#smallNav div:last").animate({scrollLeft : 50*(index-minIndex)},400);
    }
    if(index<=3){
        $("#smallNav div:last").animate({scrollLeft :0},400);
    }
}




function gotoQuestionsHtml1(id,e){
    if (id==userTest.id) {
        dataLoadedError("非常抱歉您不能向自己提问");
    }else{
        window.location = "qanda_questions.html?id="+id;
    }
    e ? e.stopPropagation() : event.cancelBubble = true;
    event.cancelBubble = true;
}




function myClose(){
    writeClientSession("line",line);
    writeClientSession("expertLable",categoryPreID);
    var position = $('.page__bd').scrollTop();
    writeClientSession('expertList-position',position);
    writeClientSession('expertList-page',currentPage);
}

