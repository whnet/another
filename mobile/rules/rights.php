<?php

namespace mobile\rules;

use Yii;
use mobile\models\Members;
use mobile\models\Experts;
use mobile\models\Pockets;
use mobile\models\Pocketget;
use mobile\models\Articles;
use mobile\models\Questions;
use mobile\models\Concerns;
use mobile\models\Circlemembers;
use yii\data\ActiveDataProvider;
use yii\web\Controller;
use yii\web\NotFoundHttpException;
use yii\filters\VerbFilter;
use mobile\controllers\BaseController;
use common\tools\htmls;
use common\tools\Reward;
use mobile\models\Circles;
use dosamigos\qrcode\QrCode;

$action = Yii::$app->controller->action->id;
$controller = Yii::$app->controller->id;

$member_id = Yii::$app->session['member_id'];
$feeuser = 1;
$ifnotfee = htmls::site();
$froms = Yii::$app->request->get('from');
$id = Yii::$app->request->get('id');
if(!$member_id){
    Yii::$app->session['tryinto'] = Yii::$app->request->getUrl();
    return $this->redirect('/members/login.html');
}


$memberInfo = Members::find()->asarray()->where(['id'=>$member_id])->one();
if(!empty($memberInfo)){//是否被禁言
    if($memberInfo['disallowed'] == 1){
        $site = htmls::site();
        echo "<script language=javascript>alert('{$site["blackhouse"]}');location.href='/site/index.html';</script>";
    }
}

if(!empty($_GET['circle_id'])){ //判断是不是在圈子里的信息
        $ifCircle = Circles::find()->asarray()->where(['id'=>$_GET['circle_id']])->count();
        if(!$ifCircle){
            $circleModel = new Circlemembers();
            $circleInfo = $circleModel->find()->asarray()->where(['mid'=>$member_id,'cid'=>$_GET['circle_id']])->one();
            //判断是否是从分享中出来的
            if($froms != 'singlemessage' && $froms !='timeline') {
                if (!$circleInfo) {
                    return $this->redirect('/circle/circle_share_detail.html?id=' . $_GET['circle_id']);
                }
            }else{
                return $this->redirect('/site/index.html');
            }
        }

}else{
    if($froms == 'singlemessage' || $froms =='timeline') {
        if ($action == 'red_packets_open') {
            return $this->redirect('/site/index.html');
        }
    }

    if($action =='article_detail' ||  $action =='qanda_detail' || $action =='circle_file_release' ||
	    $action =='article_edit' || $action =='start_ask' ){
        //如果有是详情页就判断这个文章是否属于会员，是的话可以免费阅读
        if(!empty($id)){
            if($action =='article_detail'){
                $info = Articles::find()->asarray()->where(['id'=>$id])->one();//查看文章的
            }elseif($action =='qanda_detail'){
                $info = Questions::find()->asarray()->where(['id'=>$id])->one();
                $expertId = $info['expert_id'];
                $expertInfo = Experts::find()->asarray()->where(['id'=>$expertId])->one();
                $expert = $expertInfo['member_id'];
            }

            //这是文章的详情
            if(empty($info)){//id不存在的话就跳转到首页
                return $this->redirect('/site/index.html');
            }else{
            	if($ifnotfee['price'] !='0.00'){
	                //这里要区分，如果是文章，只关注是不是作者，如果是问答，则关注是提问者和专家
	                if($action =='article_detail') {
	                    if ($info['member_id'] != $member_id) {//不是文章的作者
	                        if ($froms != 'singlemessage' && $froms !='timeline') {//不是从朋友圈来的
	                            if (!$feeuser) {
	                                Yii::$app->session['tryinto'] = Yii::$app->request->getUrl();
	                                return $this->redirect('/circle/feeuser.html');
	                            }
	                        } else {//从朋友圈来的规则
	                            if (!$feeuser) {
	                                Yii::$app->session['tryinto'] = Yii::$app->request->getUrl();
	                                return $this->redirect('/site/index.html');
	                            }
	                        }
	                    }
	                }elseif($action =='qanda_detail'){
	                    if ($info['member_id'] == $member_id || $expert ==$member_id) {
	                        if ($froms != 'singlemessage' && $froms !='timeline') {//不是从朋友圈来的
	                            if (!$feeuser) {
	                                Yii::$app->session['tryinto'] = Yii::$app->request->getUrl();
	                                return $this->redirect('/circle/feeuser.html');
	                            }
	                        } else {//从朋友圈来的规则
	                            if (!$feeuser) {
	                                Yii::$app->session['tryinto'] = Yii::$app->request->getUrl();
	                                return $this->redirect('/site/index.html');
	                            }
	                        }
	                    }else{
	                        if (!$feeuser) {
	                            Yii::$app->session['tryinto'] = Yii::$app->request->getUrl();
	                            return $this->redirect('/circle/feeuser.html');
	                        }
	                    }//是提问者或答主就可以查看
	                }
	
	            }
            }
        }else{
            if($froms != 'singlemessage' && $froms !='timeline'){
	            if($ifnotfee['price'] !='0.00') {
		            if (!$feeuser) {
			            Yii::$app->session['tryinto'] = Yii::$app->request->getUrl();
			            return $this->redirect('/circle/feeuser.html');
		            }
	            }
            }else{ //从朋友圈过来的
                return $this->redirect('/site/index.html');
            }
        }
    }

}