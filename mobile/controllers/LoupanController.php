<?php

namespace mobile\controllers;

use Yii;
use mobile\models\Members;
use mobile\models\Products;
use yii\data\ActiveDataProvider;
use yii\web\Controller;
use yii\web\NotFoundHttpException;
use yii\filters\VerbFilter;
use mobile\controllers\BaseController;
use common\tools\htmls;
use dosamigos\qrcode\QrCode;

/**
 * MembersController implements the CRUD actions for Members model.
 */
class LoupanController extends BaseController
{
    public function actions(){
        $view = Yii::$app->view;
        $view->params['site'] = htmls::site();
        $view->params['wechat'] = htmls::wechat();
        $view->params['js'] = $this->setJs();
    }
    public function actionLoupan_list(){

        return $this->render('loupan_list');
    }
    /*
     * 获取信息
     */
    public function actionInfo(){
        if($_POST){
            $model = new Products();
            $file = Yii::$app->params['public'].'/attachment';
            $pernum = $_POST['pernum'];
            $list = $model->find()->asarray()->offset($_POST['start'])->limit($pernum)->all();
            $total = $model->find()->asarray()->count();
            $pages = ceil($total/$pernum);
            die(json_encode(
                [
                    'result'=>'success',
                    'list'=>$list,
                    'file'=>$file,
                    'page'=>[
                        'currentPage'=>$_POST['currentPage'],
                        'start'=>$_POST['start'],
                        'pernum'=>$pernum,
                        'total'=>$total,
                        'pages'=>$pages,
                    ],
                ]
            ));
        }
    }

    public function actionLoupan_page($id){
        $model = new Products();
        $info = $model->find()->asarray()->where(['id'=>$id])->one();
        return $this->render('loupan_page',['info'=>$info]);
    }
    public function actionHeadline(){
        return $this->render('headline');
    }


}