
FUN(document).ready(function() {
	var FUNnav = FUN(".wk_nav");
	nav(FUNnav);
	FUNnav.find("li").hover(function() {
		var left = FUN(this).position().left + 40;
		FUNnav.find(".wk_nav_icon").stop().animate({
			left: left
		}, 400)
	}, function() {
		var left = FUNnav.find(".on").position().left + 40;
		FUNnav.find(".wk_nav_icon").stop().animate({
			left: left
		}, 300)
	});
	FUN(".wk_ewm").hover(function() {
		FUN(this).find("img").show()
	}, function() {
		FUN(this).find("img").hide()
	});
	var banner = setInterval(play, 3400);
	FUN("#list_pic li").hover(function() {
		var FUNpic = FUN("#pic");
		var size = FUNpic.find("li").size();
		var index = FUN(this).index();
		var width = FUN(window).width();
		var FUNobj = FUNpic.find("li").eq(index);
		FUN(this).addClass("on").siblings().removeClass("on");
		FUNpic.width(width * size).find("li").width(width);
		setPosition(FUNobj);
		FUNpic.animate({
			left: -width * index
		}, 600, function() {
			picScroll(FUNobj)
		});
		clearInterval(banner)
	}, function() {
		banner = setInterval(play, 3400)
	});
	FUN('.wk_thumbnail_a').hover(function() {
		FUN(this).children('.wk_projectinfo').fadeIn('fast', function() {
			FUN(this).children('.wk_meta').animate({
				bottom: 0 + "px"
			})
		})
	}, function() {
		FUN(this).children('.wk_projectinfo').fadeOut('fast', function() {
			FUN(this).children('.wk_meta').animate({
				bottom: -60 + "px"
			}, 1)
		})
	});
	FUN("#wk_fp-nav li").on("click", function() {
		var index = FUN(this).index();
		scroll_to(index)
	});
	var FUNobj2 = FUN('.wk_section2');
	var FUNobj3 = FUN('.wk_section3');
	var FUNobj4 = FUN('.wk_section4');
	var FUNobj5 = FUN('.wk_section5');
	var FUNobj6 = FUN('.wk_section6');
	var time = 1200;
	FUNobj2.find('.wk_home_title').animate({
		top: '0'
	}, 1500, 'easeOutExpo');
	FUNobj2.find('.wk_service_text').animate({
		left: '0'
	}, 1500, 'easeOutExpo');
	FUNobj2.find('.wk_serve_column').animate({
		bottom: '0'
	}, 1500, 'easeOutExpo');
	FUNobj3.find('.wk_succeed_title').css({
		position: "relative"
	}).animate({
		top: '-220px'
	}, time, 'easeOutExpo');
	FUNobj3.find('.wk_success_text').css({
		position: "relative"
	}).animate({
		left: '-110%'
	}, time, 'easeOutExpo');
	FUNobj3.find('.wk_portfolio-grid').css({
		position: "relative"
	}).animate({
		bottom: '-1000px'
	}, time, 'easeOutExpo');
	FUNobj4.find('.wk_home_solutions_title').css({
		position: "relative"
	}).animate({
		left: '-120%'
	}, time, 'easeOutExpo');
	FUNobj4.find('.wk_home_solutions_text').css({
		position: "relative"
	}).animate({
		right: '-120%'
	}, time, 'easeOutExpo');
	FUNobj4.find('.wk_home_solutions_list').css({
		position: "relative"
	}).animate({
		top: '-600px'
	}, time, 'easeOutExpo');
	FUNobj5.find('.wk_home_news_title').css({
		position: "relative"
	}).animate({
		bottom: '-500px'
	}, time, 'easeOutExpo');
	FUNobj5.find('.wk_home_news_text').css({
		position: "relative"
	}).animate({
		right: '-110%'
	}, time, 'easeOutExpo');
	FUNobj5.find('.wk_home_news_list').css({
		position: "relative"
	}).animate({
		left: '-110%'
	}, time, 'easeOutExpo');
	FUNobj6.find('.wk_home_partner_title').css({
		opacity: 0.2
	});
	FUNobj6.find('.wk_home_partner_text').css({
		opacity: 0.2
	});
	FUNobj6.find('.wk_home_partner_list').css({
		opacity: 0.2
	});
	FUN(".wk_serve_column dt").each(function() {
		var that = this;
		FUN(that).bind({
			mouseenter: function() {
				item4Timer = setTimeout(function() {
					width = FUN(that).width() * 1.2;
					height = FUN(that).height() * 1.2;
					FUN(that).find('img').animate({
						'width': width,
						'height': height,
						'top': -20,
						'left': -27
					}, 500)
				}, 200)
			},
			mouseleave: function() {
				clearTimeout(item4Timer);
				FUN(that).find('img').animate({
					'width': FUN(that).width(),
					'height': FUN(that).height(),
					'top': '0',
					'left': '0'
				}, 500)
			}
		})
	})
});



 FUN(window).scroll(function() {
    var boxElemets = FUN(".wk_section");
    var docViewTop = FUN(window).scrollTop();
    var docViewBottom = docViewTop + FUN(window).height();
    FUN.each(boxElemets, function() {
        var otop = FUN(this).offset().top+300;
        var is_init = FUN(this).attr('init')
        if (otop < docViewBottom) {
            FUN(this).attr('init', 'true');
            var sid = FUN(this).attr("id");
            var FUNobj2 = FUN('.wk_section2');
            var FUNobj3 = FUN('.wk_section3');
            var FUNobj4 = FUN('.wk_section4');
            var FUNobj5 = FUN('.wk_section5');
            var FUNobj6 = FUN('.wk_section6');
            var time = 1200;
            var delay = 0;
            if (sid == "wk_section3") {
                FUNobj3.find('.wk_succeed_title').css({position: "relative"}).delay(delay).animate({top: '0'}, 1500, 'easeOutExpo');
                FUNobj3.find('.wk_success_text').css({position: "relative"}).delay(delay).animate({left: '0'}, 1500, 'easeOutExpo');
                FUNobj3.find('.wk_portfolio-grid').css({position: "relative"}).delay(delay).animate({bottom: '0'}, 1500, 'easeOutExpo');
            } else if (sid == "wk_section4") {
                FUNobj4.find('.wk_home_solutions_title').css({position: "relative"}).delay(delay).animate({left: '0'}, 1500, 'easeOutExpo');
                FUNobj4.find('.wk_home_solutions_text').css({position: "relative"}).delay(delay).animate({right: '0'}, 1500, 'easeOutExpo');
                FUNobj4.find('.wk_home_solutions_list').css({position: "relative"}).delay(delay).animate({top: '0'}, 1500, 'easeOutExpo');  
            } else if (sid == "wk_section5") {
                FUNobj5.find('.wk_home_news_title').css({position: "relative"}).delay(delay).animate({bottom: '0'}, 1500, 'easeOutExpo');
                FUNobj5.find('.wk_home_news_text').css({position: "relative"}).delay(delay).animate({right: '0'}, 1500, 'easeOutExpo');
                FUNobj5.find('.wk_home_news_list').css({position: "relative"}).delay(delay).animate({left: '0'}, 1500, 'easeOutExpo');
            } else if (sid == "wk_section6") {
                FUNobj6.find('.wk_home_partner_title').delay(delay).animate({opacity:1});
                FUNobj6.find('.wk_home_partner_text').delay(delay).animate({opacity:1});
                FUNobj6.find('.wk_home_partner_list').delay(delay).animate({opacity:1});
            }
        }
    });
    var docViewTop = FUN(window).scrollTop();
    var cur_index = 0;
    if (docViewTop >= 3936) {
        cur_index = 5;
    } else if (docViewTop >= 3196) {
        cur_index = 4;
    } else if (docViewTop >= 2489) {
        cur_index = 3;
    } else if (docViewTop >= 1382) {
        cur_index = 2;
    } else if (docViewTop >= 660) {
        cur_index = 1;
    }
    FUN("#wk_fp-nav li a").eq(cur_index).addClass("active");
    FUN("#wk_fp-nav li").eq(cur_index).siblings().find("a").removeClass("active");
});

function scroll_to(i_tab) {
	FUN("#wk_fp-nav li a").eq(i_tab).addClass("active");
	FUN("#wk_fp-nav li").eq(i_tab).siblings().find("a").removeClass("active");
	var top = FUN(".wk_section").eq(i_tab).offset().top;
	FUN('html,body').animate({
		scrollTop: top
	}, 500);
	var FUNobj2 = FUN('.wk_section2');
	var FUNobj3 = FUN('.wk_section3');
	var FUNobj4 = FUN('.wk_section4');
	var FUNobj5 = FUN('.wk_section5');
	var FUNobj6 = FUN('.wk_section6');
	var time = 1200;
	var delay = 0;
	if (i_tab == 2) {
		FUNobj3.find('.wk_succeed_title').css({
			position: "relative"
		}).delay(delay).animate({
			top: '0'
		}, 1500, 'easeOutExpo');
		FUNobj3.find('.wk_success_text').css({
			position: "relative"
		}).delay(delay).animate({
			left: '0'
		}, 1500, 'easeOutExpo');
		FUNobj3.find('.wk_portfolio-grid').css({
			position: "relative"
		}).delay(delay).animate({
			bottom: '0'
		}, 1500, 'easeOutExpo')
	}
	if (i_tab == 3) {
		FUNobj4.find('.wk_home_solutions_title').css({
			position: "relative"
		}).delay(delay).animate({
			left: '0'
		}, 1500, 'easeOutExpo');
		FUNobj4.find('.wk_home_solutions_text').css({
			position: "relative"
		}).delay(delay).animate({
			right: '0'
		}, 1500, 'easeOutExpo');
		FUNobj4.find('.wk_home_solutions_list').css({
			position: "relative"
		}).delay(delay).animate({
			top: '0'
		}, 1500, 'easeOutExpo')
	}
	if (i_tab == 4) {
		FUNobj5.find('.wk_home_news_title').css({
			position: "relative"
		}).delay(delay).animate({
			bottom: '0'
		}, 1500, 'easeOutExpo');
		FUNobj5.find('.wk_home_news_text').css({
			position: "relative"
		}).delay(delay).animate({
			right: '0'
		}, 1500, 'easeOutExpo');
		FUNobj5.find('.wk_home_news_list').css({
			position: "relative"
		}).delay(delay).animate({
			left: '0'
		}, 1500, 'easeOutExpo')
	}
	if (i_tab == 5) {
		FUNobj6.find('.wk_home_partner_title').delay(delay).animate({
			opacity: 1
		});
		FUNobj6.find('.wk_home_partner_text').delay(delay).animate({
			opacity: 1
		});
		FUNobj6.find('.wk_home_partner_list').delay(delay).animate({
			opacity: 1
		})
	}
}

//轮播
function play() {
	var FUNpic = FUN("#pic");
	var FUNpicLi = FUNpic.find("li");
	var size = FUNpicLi.size();
	var FUNlist = FUN("#list_pic");
	var width = FUN(window).width();
	FUNpicLi.width(width);
	var index = FUNlist.find(".on").index();
	FUNpic.css({
		width: width * (size + 1)
	});
	if (index < (size - 1)) {
		FUNlist.find("li").eq(index + 1).addClass("on").siblings().removeClass("on");
		setPosition(FUNpicLi.eq(index + 1));
		FUNpic.animate({
			left: -width * (index + 1)
		}, 600, function() {
			picScroll(FUNpicLi.eq(index + 1))
		})
	} else if (index == (size - 1)) {
		FUNlist.find("li").eq(0).addClass("on").siblings().removeClass("on");
		setPosition(FUNpicLi.eq(0));
		FUNpic.animate({
			left: 0
		}, 600, function() {
			picScroll(FUNpicLi.eq(0))
		})
	}
}
function setPosition(FUNobj) {
	var FUNtitle = FUNobj.find(".b_title");
	var FUNtext = FUNobj.find(".b_text");
	var FUNinfo = FUNobj.find(".b_info");
	var FUNfirst = FUNtext.find("img:first-child");
	var FUNlast = FUNtext.find("img:last-child");
	var width = FUN(window).width();
	var wTitle = FUNtitle.find("img").width();
	var wText = FUNtext.find("img:eq(1)").width();
	var wInfo = FUNinfo.find("img").width();
	FUNtitle.find("img").css({
		position: "relative",
		left: -width / 2 - wTitle / 2
	});
	FUNinfo.find("img").css({
		position: "relative",
		left: width / 2 + wInfo / 2
	});
	FUNfirst.css({
		position: "relative",
		left: -width / 2 - wText / 2
	});
	FUNlast.css({
		position: "relative",
		left: width / 2 + wText / 2
	});
	FUNtext.find("img:eq(1)").css({
		opacity: 0
	})
}
function picScroll(FUNobj) {
	var FUNtitle = FUNobj.find(".b_title");
	var FUNtext = FUNobj.find(".b_text");
	var FUNinfo = FUNobj.find(".b_info");
	var FUNfirst = FUNtext.find("img:first-child");
	var FUNlast = FUNtext.find("img:last-child");
	FUNtitle.find("img").animate({
		left: 0
	}, 1000);
	FUNinfo.find("img").animate({
		left: 0
	}, 1000);
	FUNtext.find("img:eq(1)").animate({
		opacity: 1
	}, 800, function() {
		FUNfirst.animate({
			left: 0
		}, 400);
		FUNlast.animate({
			left: 0
		}, 400)
	})
}

//导航
function nav(FUNobj) {
	var left = FUNobj.find(".on").position().left + 40;
	var width = FUNobj.find(".on").width();
	FUNobj.find(".wk_nav_icon").css({
		left: left,
		width: width
	})
}


