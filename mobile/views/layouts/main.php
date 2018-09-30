<?php

/* @var $this \yii\web\View */
/* @var $content string */

use yii\helpers\Html;
use yii\bootstrap\Nav;
use yii\bootstrap\NavBar;
use yii\widgets\Breadcrumbs;
use mobile\assets\AppAsset;
use common\widgets\Alert;
use \common\tools\htmls;
use yii\helpers\Url;

AppAsset::register($this);
$c = Yii::$app->controller->action->id;
?>

<?php $this->beginPage() ?>
<?php $site = htmls::site();?>
<!doctype html>
<html lang="en"><head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1.0, maximum-scale=1.0">
    <title><?=$this->params['site']['title'];?></title>
    <meta name="keywords" content="<?=$this->params['site']['keywords'];?>" />
    <meta name="description" content="<?=$this->params['site']['description'];?>" />

    <meta name="format-detection" content="telephone=no">
<!--    <link type="text/css" rel="stylesheet" href="../mui/css/mui.css">-->
    <link type="text/css" rel="stylesheet" href="../bdt/css/reset.css">
    <?php if($c == 'found_expert' || $c == 'loupan_list' || $c == "loupan_page" || $c == "search"):?>
        <link type="text/css" rel="stylesheet" href="../bdt/css/appui.min.css">
    <?php else:?>
        <link type="text/css" rel="stylesheet" href="../bdt/css/newappui.min.css">
    <?php endif;?>
    <script type="text/javascript" src="../bdt/js/jquery-1.10.1.min.js"></script>
    <script type="text/javascript" src="../bdt/js/jquerysession.js"></script>
    <script type="text/javascript" src="http://res.wx.qq.com/open/js/jweixin-1.2.0.js"></script>
    <link type="text/css" rel="stylesheet" href="../bdt/css/layout.css">
    <link type="text/css" rel="stylesheet" href="../bdt/css/swiper-3.4.0.min.css">
    <script type="text/javascript" src="../bdt/js/util.js"></script>
    <script type="text/javascript" src="../bdt/js/config.js"></script>
    <script type="text/javascript" src="../bdt/js/common.js"></script>
    <script type="text/javascript" src="../bdt/js/browserSet.js"></script>
    <script type="text/javascript" src="../layui/layui.js"></script>
    <script type="text/javascript" src="../bdt/js/swiper-3.4.0.min.js"></script>
    <script type="text/javascript" src="../bdt/js/stopWechatBlackBg.js"></script>
    <script type="text/javascript" src="../bdt/js/detailComment.js"></script>
    <script type="text/javascript" src="../bdt/js/comment.js"></script>
    <script type="text/javascript" src="../bdt/js/exif.js"></script>
    <script type="text/javascript" src="../bdt/js/cropper.js"></script>
    <script type="text/javascript" src="../bdt/js/playVoiceCommon.js"></script>
    <?php if($c != 'article_edit'):?>
    <script type="text/javascript" src="../bdt/js/uploadimgs.js"></script>
    <?php endif;?>
</head>
<?= $content ?>
<?=$this->render('_shareAll')?>
<input type="hidden" name="csrf" value="<?= Yii::$app->request->csrfToken ?>" >
<input type="hidden" name="host" value="<?=Yii::$app->params['publicVoice'];?>" >
<?=$this->params['site']['content'];?>
</html>
<?php $this->endPage() ?>
