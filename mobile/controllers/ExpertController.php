<?php

namespace mobile\controllers;

use Yii;
use mobile\models\Experts;
use mobile\models\Members;
use mobile\models\Articles;
use mobile\models\Circles;
use mobile\models\Comments;
use mobile\models\Dianzan;
use mobile\models\Concerns;
use mobile\models\Circlemembers;
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
class ExpertController extends BaseController
{
    public function actions(){
        $view = Yii::$app->view;
        $view->params['site'] = htmls::site();
        $view->params['wechat'] = htmls::wechat();
        $view->params['js'] = $this->setJs();
    }
    /*
     * 查找专家
     */
   public function actionFound_expert(){
       Yii::$app->session['tryinto'] = Yii::$app->request->getUrl();
       require_once(dirname(dirname(__FILE__)).'/rules/rights.php');
       $type = htmls::getPiece('experttype');
      return $this->render('found_expert',['type'=>$type]);
   }


	/*
	* 专家详情页
	*/
	public function actionExpert_detail(){
		Yii::$app->session['tryinto'] = Yii::$app->request->getUrl();
		$get = Yii::$app->request->get();
		$model = new Experts();
		$info = $model->find()
			->asarray()
			->with('user')
			->where(['member_id'=>$get['id'],'vip'=>1])
			->one();
		$tag = htmls::getPiece('experttype');
		foreach($tag as $k=>$v){
			$tags[$v['id']] = $v;
		}
		$types = explode(',',$info['type']);
		$nums = count($types);
		$names = '';
		foreach($types as $k=>$v){
			if($k < ($nums - 1)){
				$names .= $tags[$v]['name'].'、';
			}else{
				$names .= $tags[$v]['name'];
			}
			
		}
		//是否有圈子
		$modelCircles = new Circles();
		$circle = $modelCircles->find()->asarray()->with('user')->where(['member_id'=>$get['id']])->one();
		return $this->render('expert_detail',[
				'info'=>$info,
				'names'=>$names,
				'circle'=>$circle,
			]);
	}


   /*
    * ajax请求数据
    */
   public function actionFind(){
       $model = new Experts();
       $file = Yii::$app->params['public'].'/attachment';
       $pernum = $_POST['pernum'];
       
       $getModel = $model->find()
	       ->asarray()
	       ->with('user')
	       ->orderBy('listorder DESC')
	       ->limit($pernum);
       
       if($_POST['typeid'] == 0){
       	//推荐的所有专家
           $list = $getModel->offset($_POST['start'])
	           ->where(['rec'=>1,'vip'=>1])
               ->all();
       }else{
       	//对应分类下的老师
	       $list = [];
	       $lists = $getModel->offset($_POST['start'])
	           ->where(['vip'=>1])
               ->all();
	       foreach($lists as $k=>$v){
	       	 if(in_array($_POST['typeid'],explode(',',$v['type']))){
	       	 	$list[] = $v;
	         }
	       }
       }
	   $total = count($list);
       $pages = ceil($total/$pernum);
       
       die(json_encode([
           'result'=>'success',
           'list'=>$list,
           'file'=>$file,
           'page'=>[
               'currentPage'=>intval($_POST['currentPage']),
               'start'=>$_POST['start'],
               'pernum'=>$pernum,
               'total'=>$total,
               'pages'=>$pages,
           ],
       ]));
   }
	

}