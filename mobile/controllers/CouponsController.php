<?php

namespace mobile\controllers;

use Yii;
use mobile\models\Members;
use mobile\models\Circles;
use mobile\models\Circlemembers;
use mobile\models\Coupons;
use yii\data\ActiveDataProvider;
use yii\web\Controller;
use yii\web\NotFoundHttpException;
use yii\filters\VerbFilter;
use mobile\controllers\BaseController;
use common\tools\htmls;
use dosamigos\qrcode\QrCode;


class CouponsController extends BaseController
{
 /*
  * 查询优惠券个数及类型
  */
 public function actionNums(){
     if($_POST){
         $model = new Coupons();
         $mid = Yii::$app->session['member_id'];
         $info = $model->find()->asarray()->where(['type'=>$_POST['type'],'mid'=>$mid,'status'=>1])->all();
         $nums = count($info);
         die(json_encode([
                 'result'=>'success',
                 'info'=>$info,
                 'nums'=>$nums,
             ]
         ));
     }

 }










}