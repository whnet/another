var myGallerySwiper = null;
var swipeSourceImgs = null;
var swiperHtml = '<div class="appui-gallery-swiper" id="js-gallery-swiper" style="display: none;">'
                    +'<div class="swiper" style="cursor: -webkit-grab;">'
                      +'<div class="close-image-btn" onclick="closeGallery()"></div>'
                        +'<div class="swiper-wrapper" id="swiper-wrapper">'
                        +'</div>'
                       // +'<div class="pagination">'
                        //  +'<span class="swiper-pagination-switch swiper-visible-switch swiper-active-switch"></span>'
                        //  +'<span class="swiper-pagination-switch"></span><span class="swiper-pagination-switch"></span>'
                         // +'<span class="swiper-pagination-switch"></span>'
                       // +'</div>'
                    +'</div>'
                +'</div>';
//alert(1113);
//$(document).ready(function() {
  
window.addEventListener('resize', function(event){
  if($('#js-gallery-swiper').length>0 && $('#js-gallery-swiper').css("display")!='none'){
    //$('#js-gallery-swiper').css("width",$(window).width());
    //$('#js-gallery-swiper').css("height",$(window).height());
    var currIndex = myGallerySwiper.realIndex;
    imageClickFunction(swipeSourceImgs,currIndex);
  }
});


//初始化Swiper
function imageClickFunction(imgSrcs,index) {
    if($('#js-gallery-swiper').length>0){
      $('#js-gallery-swiper').remove();
    }
    $("body").append(swiperHtml);
    
    $('#js-gallery-swiper').css("width",$(window).width());
    $('#js-gallery-swiper').css("height",$(window).height());

    swipeSourceImgs = imgSrcs;
     var sourceImgs = imgSrcs;

     $("#swiper-wrapper").html("");
     for (var i = 0; i < sourceImgs.length; i++) {
       $(".swiper-wrapper").append('<div class="swiper-slide">'+
        '<div class="swiper-zoom-container"> '+
        '<img id="swiper_img_'+i+'" data-src="'+removeMinStr(sourceImgs[i])+'" class="swiper-lazy">'+
        '<div class="swiper-lazy-preloader"></div></div></div>');
     };
     $('#js-gallery-swiper .swiper-slide').height($('#js-gallery-swiper').height());
     $('#js-gallery-swiper .swiper-zoom-container').height($('#js-gallery-swiper').height());
     $('#js-gallery-swiper').fadeIn();
    if(myGallerySwiper != null){
      myGallerySwiper.destroy(true,true);
    }
    myGallerySwiper = new Swiper('.swiper',{
      pagination : '.pagination',
      paginationHide :false,
      preloadImages:false,
      updateOnImagesReady : true,
      lazyLoading : true,
      zoom : true,
      onClick: function(swiper){
        $('#js-gallery-swiper').fadeOut(1000);
       // alert('你tap了Swiper');
      },
      onDoubleTap: function(swiper){
        //alert('你双击了Swiper');
      },
      onLazyImageReady: function(swiper, slide, image){
        if(image.width==0){
          //alert("settimeout image.width="+image.width);
          var currIndex = myGallerySwiper.realIndex;
          //alert("resetSwipeImgStyle-setTimeout");
          setTimeout("modifyImageStyle("+index+")",100);
        }else{
          resetSwipeImgStyle(image);
        }
        
      }
    });
    myGallerySwiper.slideTo(index, 0, false);
  //});
}

function modifyImageStyle(index){
  //alert("modifyImageStyle index="+index);
  var image = $("#swiper_img_"+index)[0];
  if(image.width==0){
    setTimeout("modifyImageStyle("+index+")",100);
  }else{
    //alert("toshow");
    resetSwipeImgStyle(image);
  }
}


function resetSwipeImgStyle(image){
  //if(image.width==0){
  //  alert("image.width="+image.width);
  //  setTimeout(resetSwipeImgStyle(image),100);
  //}
  var bw = $(window).width();
  var bh = $(window).height();

  var w ;
  var h ;
  var ratio = image.height/image.width ;
  //alert("image.naturalWidth="+image.naturalWidth);
  if(image.naturalWidth>bw){
    w = bw ;
    h = w * ratio ; 
  }else{
    w = image.naturalWidth ;
    h = w * ratio ; 
  }
  
  /*if(window.orientation == 90 || window.orientation == -90){
    if (w>bw) {
      image.style.position = 'absolute';
      image.style.top = '0';
      image.style.left = '50%';
      image.style.marginLeft = -bw/2 + 'px' ;
      image.parentNode.parentNode.style.overflow = 'auto';
    }else{
      var wTop = (bh-h)/2;
      image.style.position = 'absolute';
      image.style.top = hTop+'px';
      image.style.left = '50%';
      image.style.marginLeft = -w/2 + 'px' ; 
    }
  }else{*/
    if (h>bh) {
      image.style.position = 'absolute';
      image.style.top = '0';
      image.style.left = '50%';
      image.style.marginLeft = -w/2 + 'px' ;
      image.parentNode.parentNode.style.overflow = 'auto';
    }else{
      var hTop = (bh-h)/2;
      image.style.position = 'absolute';
      image.style.top = hTop+'px';
      image.style.left = '50%';
      image.style.marginLeft = -w/2 + 'px' ; 
    }
}
/*@ closeGallery()
**@ 关闭swiper轮播图
**@ wukai
*/
function closeGallery(){
  console.log("我开始关闭页面了!");
   $('#js-gallery-swiper').fadeOut();

}