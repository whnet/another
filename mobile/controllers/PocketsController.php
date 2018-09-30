<?php

namespace mobile\controllers;

use Yii;
use mobile\models\Members;
use mobile\models\Pockets;
use mobile\models\Pocketget;
use mobile\models\Articles;
use mobile\models\Concerns;
use yii\data\ActiveDataProvider;
use yii\web\Controller;
use yii\web\NotFoundHttpException;
use yii\filters\VerbFilter;
use mobile\controllers\BaseController;
use common\tools\htmls;
use common\tools\Reward;
use mobile\models\Circles;
use dosamigos\qrcode\QrCode;


class PocketsController extends BaseController
{
    public function actions(){
        $view = Yii::$app->view;
        $view->params['site'] = htmls::site();
        $view->params['wechat'] = htmls::wechat();
        $view->params['js'] = $this->setJs();
    }
    public function actionTest(){
        $reward = new Reward();
        $redPocket = $reward->splitReward(1,10,100);
        var_dump($redPocket);
    }
    public function actionRed_packets(){
        Yii::$app->session['tryinto'] = Yii::$app->request->getUrl();
        require_once(dirname(dirname(__FILE__)).'/rules/rights.php');
            return $this->render('red_packets');
    }
    public function actionRed_packets_fightluck(){
        require_once(dirname(dirname(__FILE__)).'/rules/rights.php');
        return $this->render('red_packets_fightluck');
    }
    /*
     * 打开红包
     */
    public function actionRed_packets_open($id){
        Yii::$app->session['tryinto'] = Yii::$app->request->getUrl();
        require_once(dirname(dirname(__FILE__)).'/rules/rights.php');
        $member_id = Yii::$app->session['member_id'];
        if(!$member_id){
            Yii::$app->session['tryinto'] = Yii::$app->request->getUrl();
            return $this->redirect('/members/login.html');
        }
        $modelPockets = new Pockets();
        $info = $modelPockets->find()->with('user')->where(['id'=>$id])->asarray()->one();
        $pocketgetMoedel = new Pocketget();
        $list = $pocketgetMoedel->find()->with('user')->where(['pocket_id'=>$id])->asarray()->orderBy('created DESC')->all();
        $redNums = count($list);
        $my = $pocketgetMoedel->find()->where(['member_id'=>$member_id])->andWhere(['pocket_id'=>$id])->with('user')->asarray()->one();
        return $this->render('red_packets_open',[
            'info'=>$info,
            'list'=>$list,
            'redNums'=>$redNums,
            'my'=>$my,
        ]);
   }

    /*
     * 接受红包数据
     */
    public function actionRedpackets(){
        if($_POST){
            if($_POST['circle_id']){
                $circle_id = $_POST['circle_id'];
            }else{
                $circle_id = 0;
            }
          $member_id = Yii::$app->session['member_id'];
          $model = new Pockets();
          $model->total_money = $_POST['tot'];
          $model->last_money = $_POST['tot'];
          $model->pocket_nums = $_POST['packets'];
          $model->last_nums = $_POST['packets'];
          $model->message = $_POST['notes'];
          $model->pocket_type = $_POST['splitType'];
          $model->give_type = $_POST['type'];
          $model->circle_id = $circle_id;
          $model->from = $_POST['from'];
          $model->publishtype = $_POST['publishtype'];
          $model->created = time();
          $model->member_id = $member_id;
          $model->status = 1;
          $model->trade = $_POST['trade'];
          $model->save();
          $id = $model->id;
          //同时在articles表中插入数据
              $articleModel = new Articles();
              $articleModel->redid = $id;
              $articleModel->member_id = $member_id;
              $articleModel->title = $_POST['notes'];
              $articleModel->summary = $_POST['notes'];
              $articleModel->content =$_POST['notes'];
              $articleModel->circle_id = $circle_id;
              $articleModel->from =$_POST['from'];
              $articleModel->publishtype =$_POST['publishtype'];
              $articleModel->created = time();

              $articleModel->save();

          if($id){
              if($circle_id){
                  //根据圈子，跳转到指定页面
                  die(json_encode(['result'=>'success','type'=>'circle','id'=>$id]));
              }else{
                  die(json_encode(['result'=>'success','type'=>'open','id'=>$id]));
              }

          }
        }
    }
    /*
     * 领取红包
     */
    public function actionGetred(){
        require_once(dirname(dirname(__FILE__)).'/rules/ajaxrights.php');
        if($_POST){
            $member_id = Yii::$app->session['member_id'];
            if(!$member_id){
                die(json_encode(['result'=>'error','message'=>'请先登录','msg'=>'login']));
            }
            //一个人只能领取一次
            $pocketgetModel = new Pocketget();
            $info = $pocketgetModel->find()->asarray()->where(['member_id'=>$member_id,'pocket_id'=>$_POST['redid']])->one();
            if($info){
                die(json_encode(['result'=>'error','message'=>'您已领取']));
            }
            //获得总的钱数
            $model = new Pockets();
            $pocket = $model->find()->where(['id'=>$_POST['redid']])->asarray()->one();
            if($pocket['last_money'] != 0){
                $reward = new Reward();
                //发红包逻辑
                $redPocket = $reward->splitReward($pocket['last_money'],$pocket['last_nums'],100);
                $member_id = Yii::$app->session['member_id'];
                $pocketgetModel = new Pocketget();
                $pocketgetModel->member_id = $member_id;
                $pocketgetModel->pocket_id = $_POST['redid'];
                $pocketgetModel->get_price = $redPocket[0];
                $pocketgetModel->created = time();
                $pocketgetModel->save();
                $id = $pocketgetModel->id;
                if($id){
                    $pocket = $model->updateAll(['last_money' => $pocket['last_money'] - $redPocket[0],'last_nums'=>$pocket['last_nums']-1], 'id ='.$_POST['redid']);
                    die(json_encode(['result'=>'success','id'=>$id]));
                }
            }else{
                die(json_encode(['result'=>'error','message'=>'红包已领完']));
            }



        }

    }
    /*
     * 发放红包，增加粉丝
     */
   public function actionChangefans(){
       $member_id = Yii::$app->session['member_id'];
       //获得发红包人的id
       $info = Pockets::find()->asarray()->where(['id'=>$_POST['redid']])->one();

       $model = new Concerns();
       $find = $model->find()->asarray()->where(['mid'=>$member_id,'to_mid'=>$info['member_id']])->one();
       if($find){
           die(json_encode(['result'=>'error']));
       }
       //判断是否已关注，已关注则终止
       //向concerns中新增数据

       $model->mid = $member_id;
       $model->to_mid = $info['member_id'];
       $model->themeid = 0;
       $model->created = time();
       $model->save();
       $id = $model->id;
       if($id){
           die(json_encode(['result'=>'success']));
       }
   }





}








