<?php

namespace mobile\rules;

use Yii;
use mobile\models\Members;
use mobile\models\Pockets;
use mobile\models\Pocketget;
use mobile\models\Articles;
use mobile\models\Concerns;
use mobile\models\Questions;
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

//$action = Yii::$app->controller->action->id;
//$member_id = Yii::$app->session['member_id'];
//$feeuser = Yii::$app->session['feeuser'];
////如果没有就去让微信登录,得到member_id
////如果是这篇文章的作者就能查看
//$id = Yii::$app->request->get('id');
//if($action == 'qanda_detail'){//如果是问题，则从问题表中查找
//    $shareQuestion = Questions::find()->asarray()->where(['id'=>$id])->one();
//    if(!$feeuser){
//        if($shareQuestion['member_id'] != $member_id){
//            return $this->redirect('/site/index.html');
//        }
//    }
//
//
//}
//
////如果不是，判断是否是付费会员，如果是就可以看，不是就跳转到首页
////目的就是如果是会员就能直接查看，不是的就跳转到首页