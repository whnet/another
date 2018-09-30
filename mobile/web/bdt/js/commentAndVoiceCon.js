//语音控件
function voiceConType(groups,i){
  var doStr = "";
  if (groups[i].type==1) {
     //收听
     doStr = '<div class="voice-control mt5">'+
                  '<a id="a_play_'+groups[i].id+'" class="appui_qanda-voice-con fs30 fc-white play-audio bg-blue" onclick = "playAudioClickFunction('+groups[i].id+',1,1,\'a_play_'+groups[i].id+'\');">'+
                     '<i class="bg-blue"></i>'+
                      '<em class="tips">播放回答</em>'+
                      '<span class="appui_qanda-voice-wave"><em class="wave1"></em><em class="wave2" style="display: block;"></em><em class="wave3" style="display: block;"></em></span>'+
                      '<span class="appui_qanda-voice-wait" style="display:none;"></span>'+
                  '</a>'+
                   
                  '<span class="fs24 fc-greyabc ml5">'+groups[i].answerLen+'&quot;</span>'+
                  '<span class="fs24 fc-greyabc">'+groups[i].listenUserTimes+'人听过</span>'+
              '</div>';
  }else{
      //悬赏
      doStr = '<div class="voice-control mt5">'+
              '<a class="voice-con bg-orange fs30 fc-white" href="#">'+
                    '<i class="bg-orange">悬赏问题不需要显示</i>'+
                    '追加悬赏'+
                    '<span><img src="../themes/img/voice2.png"></span>'+
                '</a>'+
                '<span class="fs24 fc-greyabc ml5"></span>'+
                '<span class="fs24 fc-greyabc">悬赏金额'+groups[i].qfee+'元</span>'+
          '</div>';
  }
  return doStr;
}
