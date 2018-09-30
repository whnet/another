<?php

namespace mobile\controllers;

use Yii;
use mobile\models\Members;
use mobile\models\Articles;
use mobile\models\Circles;
use mobile\models\Comments;
use mobile\models\Dianzan;
use mobile\models\Concerns;
use yii\data\ActiveDataProvider;
use yii\web\Controller;
use yii\web\NotFoundHttpException;
use yii\filters\VerbFilter;
use mobile\controllers\BaseController;
use common\tools\htmls;
use dosamigos\qrcode\QrCode;
use yii\behaviors\TimestampBehavior;
use yii\db\Expression;

/**
 * MembersController implements the CRUD actions for Members model.
 */
class DianzanController extends BaseController
{
    /*
     * 点赞
     */
    public function actionDianzan(){

        $post = Yii::$app->request->post();
        require_once(dirname(dirname(__FILE__)).'/rules/ajaxrights.php');

        if(isset($post['article_id'])) {
            $list = Dianzan::find()->asarray()->where(['member_id' => $member_id, 'article_id' => $post['article_id']])->one();
        }else if(isset($post['question_id'])) {
            $list = Dianzan::find()->asarray()->where(['member_id' => $member_id, 'question_id' => $post['question_id']])->one();
        }
        if($list){
            $model = new Dianzan();
            $model->findOne($list['id'])->delete();
            die(json_encode(['result'=>'success','data'=>['currStatus'=>0]]));
        }else{
            $model = new Dianzan();
            $model->member_id = $member_id;
            if(isset($post['article_id'])){
                $model->article_id = $post['article_id'];
            }else{
                $model->article_id = 0;
            }
            if(isset($post['question_id'])){
                $model->question_id = $post['question_id'];
            }else{
                $model->question_id = 0;
            }
            $model->created = time();
            $model->save();
            die(json_encode(['result'=>'success','data'=>['currStatus'=>1]]));
        }


    }
    /*
     * 关注
     */
    public function actionConcerns(){
        $post = Yii::$app->request->post();
        require_once(dirname(dirname(__FILE__)).'/rules/ajaxrights.php');
        $model = new Concerns();
        if(!isset($_POST['type'])){
            $_POST['type'] = 'notype';
        }
        if(!isset($post['themeid'])){
            $post['themeid'] = 'nothemeid';
        }

        if($_POST['type'] == 'themes'){
            $list = $model->find()->asarray()->where(['mid'=>$member_id,'themeid'=>$post['themeid']])->one();
        }else{
            $list = $model->find()->asarray()->where(['mid'=>$member_id,'to_mid'=>$post['to_mid']])->one();
        }

        if($list){
            $model->findOne($list['id'])->delete();
            die(json_encode(['result'=>'success','data'=>['currStatus'=>0]]));
        }else{
            $model->mid = $member_id;
            if($_POST['type'] == 'themes') {
                $model->themeid = $post['themeid'];
            }else{
                $model->to_mid = $post['to_mid'];
            }
            $model->created = time();
            $model->save();
            die(json_encode(['result'=>'success','data'=>['currStatus'=>1]]));
        }
    }
    /*
     * 查看是否一关注，这个用在了themes中，其他的也可以改进
     */
    public function actionIfconcern(){
        $post = Yii::$app->request->post();
        require_once(dirname(dirname(__FILE__)).'/rules/ajaxrights.php');
        $model = new Concerns();
        if($_POST['type'] == 'themes'){
            $list = $model->find()->asarray()->where(['mid'=>$member_id,'themeid'=>$post['themeid']])->one();
        }else{
            $list = $model->find()->asarray()->where(['mid'=>$member_id,'to_mid'=>$post['to_mid']])->one();
        }
        if($list){
            die(json_encode(['result'=>'success','data'=>['currStatus'=>1]]));
        }else{
            die(json_encode(['result'=>'success','data'=>['currStatus'=>0]]));
        }



    }
    /*
     * 收听语音的记录
     */





}