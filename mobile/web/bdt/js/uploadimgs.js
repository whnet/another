//上传图片
var picNextIndex = 0;
var picLen = 0;
var pics = new Array();
var maxInputLength=140;
var currSelectUserId = 0;
var currContent="";

// 上传图片
$(function() {
    $("#filehidden").change(function(){
        //隐藏input，禁止重复点击
        $("#filehidden").hide();
        var file = $(this).get(0).files[0];
        var rFilter = /^(image\/jpeg|image\/png)$/i; // 检查图片格式
        if (!rFilter.test(file.type)) {
            dataLoadedError("请选择jpeg、png格式的图片文件。");
            $("#filehidden").val("");
            return false;
        }else if(file.size>=5242880){
            dataLoadedError("图片尺寸太大，请选择小于5M的图片文件。");
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

            //图片处理
            var reader = new FileReader();
            reader.onload = function(e) {
                //调用方法，纠正角度等问题
                getImgData(this.result,jiaodu,function(data,srcWidth,srcHight){
                    var html = "<figure contenteditable=\"false\" id=\"figure_"+picNextIndex+"\">";
                    html +=   "<img id=\"img_"+picNextIndex+"\" onClick=\"showPic("+picNextIndex+")\";  src=\""+data+"\" style=\"width: 3.5rem; height: auto; margin-left: -1.75rem; margin-top: -2.33333rem;\"/>";
                    html +=   "<a class=\"loading_progress\" style=\"display:none;\"></a>";
                    html +=   "<span class=\"bg-orange\" onclick=\"deletePic("+picNextIndex+");\"><img src=\"../bdt/images/img_delete.png\" /></span>";
                    html += "</figure>";

                    $(".add-qanda-pic").before(html);
                    $(".loading_progress").fadeOut(1000);
                    //重新显示
                    $("#filehidden").show();

                    var img=document.getElementById("img_"+picNextIndex);
                    var tt = srcWidth/srcHight;
                    //var naturalWidth = img.naturalWidth;
                    //var naturalHeight = img.naturalHeight;
                    if(srcWidth>srcHight){
                        var ww = -3.5*tt/2 + "rem";
                        $("#img_"+picNextIndex).css({"height":"3.5rem","width":"auto","margin-left":ww,"margin-top":"-1.75rem"});
                    }else{
                        var hh = -3.5/tt/2 + "rem";
                        $("#img_"+picNextIndex).css({"width":"3.5rem","height":"auto","margin-left":"-1.75rem","margin-top":hh});
                    }

                    pics[picNextIndex]=data;
                    //设置允许上传的个数
                    var oldIndex = picNextIndex;
                    picLen++;
                    picNextIndex++;
                    if(picLen>=5){
                        $(".add-qanda-pic").hide();
                    }
                });
                //调用方法，纠正角度等问题END
            }
            reader.readAsDataURL(file);

        }
    });
})
// 上传图片END

function getImgData(img,dir,next){
    var image=new Image();
    image.onload=function(){
        var degree=0,drawWidth,drawHeight,width,height;
        drawWidth=this.naturalWidth;
        drawHeight=this.naturalHeight;
        //以下改变一下图片大小
        var maxSide = Math.max(drawWidth, drawHeight);
        /**if (maxSide > 1024) {
        var minSide = Math.min(drawWidth, drawHeight);
        minSide = minSide / maxSide * 1024;
        maxSide = 1024;
        if (drawWidth > drawHeight) {
          drawWidth = maxSide;
          drawHeight = minSide;
        } else {
          drawWidth = minSide;
          drawHeight = maxSide;
        }
      }*/
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
    $('.page__hd').css("z-index",0);
    $('#gallery').click(function(){
        $('.page__hd').css("z-index",2);
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


function deletePic(index){
    //alert('ok');
    $("#figure_"+index).remove();
    pics[index] = null;
    picLen--;
    if(picLen<9){
        $(".add-qanda-pic").show();
    }
}