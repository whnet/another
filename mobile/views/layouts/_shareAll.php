<?php
use yii\helpers\Url;
?>
<?php if(stripos($_SERVER['HTTP_USER_AGENT'], 'MicroMessenger')):?>
    <?php
    $a = Yii::$app->controller->action->id;
    ?>

    <script>
        wx.config(<?=$this->params['js']->config(array('onMenuShareTimeline','onMenuShareAppMessage','onMenuShareQQ','onMenuShareWeibo','onMenuShareQZone','startRecord','stopRecord','onVoiceRecordEnd','playVoice','pauseVoice','stopVoice','onVoicePlayEnd',
            'uploadVoice','downloadVoice','chooseImage','previewImage','uploadImage','downloadImage','translateVoice','getNetworkType','openLocation','getLocation','hideOptionMenu','showOptionMenu','hideMenuItems',
            'showMenuItems','hideAllNonBaseMenuItem','showAllNonBaseMenuItem','closeWindow','scanQRCode','chooseWXPay','openProductSpecificView','addCard','chooseCard','openCard'), false);?>);
        <?php if($a == 'article_detail'  || $a == 'circle_qanda_detail'):?>
            var title = $('input[name="title"]').val();
            var imgs = $('.shareimages').val();
            var imgUrl = '';
            if(imgs == undefined){
                imgUrl = '<?=Yii::$app->params['public'];?><?=$this->params['wechat']['shareImg'];?>';
            }else{
                imgUrl = $('.shareimages').val();
            }
            var deses = $('input[name="des"]').val();
            var dd=deses.replace(/<\/?.+?>/g,"");
            var des=dd.replace(/ /g,"");
            var link = '<?=Yii::$app->request->hostInfo;?><?=Yii::$app->request->getUrl();?>';
        <?php elseif($a == 'qanda_detail'):?>
            var title = $('#asker_content_id').text();
            var imgUrl = '<?=Yii::$app->params['public'];?><?=$this->params['wechat']['shareImg'];?>';
            var des = "<?=$this->params['wechat']['shareTitle'];?>";
            var link = '<?=Yii::$app->request->hostInfo;?><?=Yii::$app->request->getUrl();?>';
        <?php elseif($a == 'red_packets_open'):?>
            var title = '我在律乎社区发红包了，快来抢吧～!';
            var imgUrl = '<?=Yii::$app->request->hostInfo;?>/bdt/images/hongbao.png';
            var des = "<?=$this->params['wechat']['shareDesc'];?>";
            var link = '<?=Yii::$app->request->hostInfo;?><?=Yii::$app->request->getUrl();?>';
        <?php else:?>
            var title = "<?=$this->params['wechat']['shareTitle'];?>";
            var des = "<?=$this->params['wechat']['shareDesc'];?>";
            var imgUrl = '<?=Yii::$app->params['public'];?><?=$this->params['wechat']['shareImg'];?>';
            var link = '<?=Yii::$app->request->hostInfo;?><?=Yii::$app->request->getUrl();?>';
        <?php endif;?>
        wx.ready(function(){
            wx.onMenuShareTimeline({
                title: title,
                link: link,
                imgUrl: imgUrl,
            });
            wx.onMenuShareAppMessage({
                title: title,
                desc: des,
                link: link,
                imgUrl: imgUrl,
            });
        });
    </script>
<?php endif;?>


