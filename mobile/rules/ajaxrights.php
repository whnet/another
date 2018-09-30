<?php
namespace mobile\rules;

use Yii;
use mobile\models\Members;
use mobile\models\Pockets;
use mobile\models\Pocketget;
use mobile\models\Articles;
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

//判断异步的权限
$member_id = Yii::$app->session['member_id'];
$feeuser = Yii::$app->session['feeuser'];
if(!$member_id){
    Yii::$app->session['tryinto'] = Yii::$app->request->getUrl();
    die(json_encode(['result'=>'notmember']));
    exit();
}
if(!$feeuser){
    Yii::$app->session['tryinto'] = Yii::$app->request->getUrl();
    die(json_encode(['result'=>'notfeeuser']));
    exit();
}
$memberInfo = Members::find()->asarray()->where(['id'=>$member_id])->one();
if(!empty($memberInfo)){
    if($memberInfo['disallowed'] == 1){
        die(json_encode(['result'=>'jinyan']));
        exit();
    }
}
//判断异步的权限