<?php

namespace mobile\controllers;

use Yii;
use mobile\models\Members;
use mobile\models\Articles;
use mobile\models\Circles;
use mobile\models\Comments;
use yii\data\ActiveDataProvider;
use yii\web\Controller;
use yii\web\NotFoundHttpException;
use yii\filters\VerbFilter;
use mobile\controllers\BaseController;
use common\tools\htmls;
use dosamigos\qrcode\QrCode;
use yii\behaviors\TimestampBehavior;
use yii\db\Expression;
use common\tools\Uploadfile;

/**
 * MembersController implements the CRUD actions for Members model.
 */
class CommentsController extends BaseController
{
    public function actions(){
        $view = Yii::$app->view;
        $view->params['site'] = htmls::site();
        $view->params['wechat'] = htmls::wechat();
        $view->params['js'] = $this->setJs();
    }
    //接收评论
    public function actionComment(){
        $post = Yii::$app->request->post();
        $member_id = Yii::$app->session['member_id'];
        $model = new Comments();
        $model->member_id = $member_id;
        $model->to_member_id = $post['to_mid'];
        $model->article_id = $post['id'];
        $model->content = $post['textContent'];
        $model->created = time();
        $info = $model->save();
        $id = $model->id;
        $user = [];
        if($info){
            $user = Members::find()->asarray()->where(['id'=>$member_id])->one();
        }
        die(json_encode(['result'=>'success','user'=>$user,'data'=>['id'=>$id,'content'=>$post['textContent'],'mid'=>$member_id]]));
    }
    //接受话题中发言的图文信息
    public function actionTopiccomment(){
        $post = Yii::$app->request->post();
        $uploader = new Uploadfile();
        $pics = $_POST['pics'];
        $nums = count($pics);
        $base = Yii::getAlias("@public");
        $directory = '/questions/user/';
        $path = $base.$directory;
        $img = [];
        if($_POST['pics']){
            for($i=0;$i<$nums;$i++){
                $img[] = $directory.$uploader->base64_images($pics[$i],$path);
            }
            if(!$img){
                die(json_encode(['result'=>'error']));
            }
        }
        $member_id = Yii::$app->session['member_id'];
        $model = new Comments();
        $model->member_id = $member_id;
        $model->to_member_id = 0;
        $model->article_id = $_POST['topicId'];
        $model->content = $_POST['content'];
        $model->voice = '';
        $model->pics = json_encode($img);;
        $model->created = time();
        $model->save();
        $id = $model->id;
        if($id){
            die(json_encode(['result'=>'success']));
        }
    }
    //删除评论
    public function actionDelcomment(){
        $post = Yii::$app->request->post();
        $model = new Comments();
        $model->findOne($post['commentId'])->delete();
        die(json_encode(['status'=>'success']));

    }
}