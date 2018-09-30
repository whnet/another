<?php
namespace mobile\controllers;

use Yii;
use mobile\controllers\BaseController;
use common\tools\htmls;
use mobile\models\Questions;
use mobile\models\Articles;
use mobile\models\Products;
use mobile\models\Banners;
use mobile\models\Members;
use mobile\models\Experts;
use mobile\models\Circles;
use mobile\models\Dianzan;




class SiteController extends BaseController
{
    public function actions(){
        $view = Yii::$app->view;
        $view->params['site'] = htmls::site();
        $view->params['wechat'] = htmls::wechat();
        $view->params['js'] = $this->setJs();
    }

    /*
     * 首页
     */
    public function actionIndex()
    {
        if(!stripos($_SERVER['HTTP_USER_AGENT'], 'MicroMessenger')) {
            return $this->redirect('/members/wxlogin.html');
        }

        Yii::$app->session['tryinto'] = Yii::$app->request->getUrl();

        $mid = Yii::$app->session['member_id'];
        //轮播图
        $banner = htmls::getPiece('hdp');

        //问题，包括语音问答
        $questionModel = new Questions();
        $questions = $questionModel->find()->where(['rec'=>1])->with('expert')->limit(3)->all();
        //查看是否有未回答的问题
        if($mid){
            $counts = $questionModel->find()->where(['expert_id'=>$mid,'status'=>1])->count();
            $expert = Experts::find()->where(['member_id'=>$mid])->count();
        }else{
            $counts = 0;
	        $expert = 0;
        }
        return $this->render('index',[
            'questions'=>$questions,
            'banner'=>$banner,
            'counts'=>$counts,
            'expert'=>$expert,
        ]);
    }
    /*
     * 搜索
     */
    public function actionSearch(){
        Yii::$app->session['tryinto'] = Yii::$app->request->getUrl();
        $mid = Yii::$app->session['member_id'];
        //关键词
        $keys = $_GET['keys'];
        //行家 expert
        $expert = Experts::find()->with('user')
	        ->where(['like','realname',$keys])
	        ->asarray()->all();

        //圈子 circle
        $circleModel = new Circles();
        $circle = $circleModel->find()->asarray()->where(['like','name',$keys])
	        ->with('user','incircle','expert')->all();
        //问答 ask
        $ask = Questions::find()->asarray()->where(['like','question',$keys])
	        ->andwhere(['status'=>2])
	        ->with('expert','dianzan','comment')->all();
        //论坛
        $articles = Articles::find()->asarray()->where(['like','title',$keys])
	        ->andwhere(['from'=>'index'])->with('user','dianzan','comment','redpocket')->all();

        return $this->render('search',[
            "expert"=>$expert,
            "circle"=>$circle,
            "ask"=>$ask,
            "mid"=>$mid,
            "articles"=>$articles,
        ]);
    }
}
