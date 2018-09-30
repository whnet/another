<?php

namespace mobile\controllers;

use Yii;
use mobile\models\Members;
use mobile\models\Questions;
use mobile\models\Zhuiquestions;
use mobile\models\Experts;
use mobile\models\Articles;
use mobile\models\Circles;
use mobile\models\Comments;
use mobile\models\Concerns;
use mobile\models\Dianzan;
use mobile\models\Listen;
use mobile\models\Circlemembers;
use yii\data\ActiveDataProvider;
use yii\web\Controller;
use yii\web\NotFoundHttpException;
use yii\filters\VerbFilter;
use mobile\controllers\BaseController;
use common\tools\htmls;
use common\tools\Uploadfile;
use dosamigos\qrcode\QrCode;

/**
 * MembersController implements the CRUD actions for Members model.
 */
class QuestionsController extends BaseController
{
    public function actions(){
        $view = Yii::$app->view;
        $view->params['site'] = htmls::site();
        $view->params['wechat'] = htmls::wechat();
        $view->params['js'] = $this->setJs();
    }

  public function actionQanda(){
      Yii::$app->session['tryinto'] = Yii::$app->request->getUrl();
      require_once(dirname(dirname(__FILE__)).'/rules/rights.php');
      $type = htmls::getPiece('experttype');
      return $this->render('qanda',['type'=>$type]);
  }
  public function actionQandatest(){
      Yii::$app->session['tryinto'] = Yii::$app->request->getUrl();
      require_once(dirname(dirname(__FILE__)).'/rules/rights.php');
      $type = htmls::getPiece('experttype');
      return $this->render('qandatest',['type'=>$type]);
  }
		/*
		* 新的回答页
		*/
		public function actionNewqanda_record(){
		Yii::$app->session['tryinto'] = Yii::$app->request->getUrl();
		require_once(dirname(dirname(__FILE__)).'/rules/rights.php');
		$type = htmls::getPiece('experttype');
		return $this->render('newqanda_record',['type'=>$type]);
		}
/*
 * 问答详情
 */
  public function actionQanda_detail($id){
      Yii::$app->session['tryinto'] = Yii::$app->request->getUrl();
      require_once(dirname(dirname(__FILE__)).'/rules/rights.php');
      //END
      //未付款0 已付款1 已回答2
      $questionModel = new Questions();
      $question =  $questionModel->find()->where(['id'=>$id])->andWhere(['<>','status',0])->asarray()->one();
      // 问题的回答者 和 提问者 $question['member_id'] $question['expert_id'] ,当前用户的
	  $member_id = Yii::$app->session['member_id'];
	  if($question['member_id'] == $member_id || $question['expert_id'] == $member_id){
	  	$topay = 0;
	  }else{
	  	$topay = 1;
	  }
		
      $pics = json_decode($question['imgs'], true);
      $answerImgs = json_decode($question['answerimgs'], true);
      $memberModel = new Members();
      $user =  $memberModel->find()->asarray()->where(['id'=>$question['member_id']])->one();

      $expert = Experts::find()->asarray()->where(['member_id'=>$question['expert_id']])->with('user')->one();
      $circlModel = new Circles();
      $circle = $circlModel->find()->asarray()->where(['member_id'=>$question['expert_id']])->one();

      //加载用户评论，没有选择异步加载
      $comments = new Comments();
      $comments_list = $comments->find()->asarray()->with('user')->where(['article_id'=>$_GET['id']])->orderBy('created DESC')->all();
      $count = count($comments_list);
      $to_user = [];
      foreach($comments_list as $k=>$v){
          if($v['to_member_id'] !=0){
              $to_user[$v['id']] =  Members::find()->asarray()->where(['id'=>$v['to_member_id']])->orderBy('created DESC')->one();
          }
      }
      //获取点赞的次数
      $nums = Dianzan::find()->asarray()->where(['article_id'=>$_GET['id']])->count();
      $dianzan = Dianzan::find()->asarray()->where(['member_id'=>$member_id,'article_id'=>$_GET['id']])->one();

      //推荐问答
      $RecQuestions =  $questionModel->find()->with('expert')->asarray()->limit(3)->orderBy('views DESC')->all();
      //更新阅读次数
      $questionModel->updateAll(['views' => $question['views'] + 1], 'id ='.$id);
      //是否是追答
	  if($question['continue_ask'] == 1 && $question['status'] == 2){
		  $continue_list = Zhuiquestions::find()->asarray()
			  ->where([
			  	  'qaid'=>$question['id'],
				  'member_id'=>$question['member_id'],
				  'expert_id'=>$question['expert_id'],
				  'status'=>2
			  ])
			  ->all();
	  }else{
		  $continue_list = [];
	  }
	  if($question['continue_ask'] == 1 && $question['status'] == 2
		  && $question['member_id'] == $member_id && intval($question['continue_nums']) <=3 ){
		  $continue = 1;
	  }else{
		  $continue = 0;
	  }
	  
      return $this->render('qanda_detail',[
          'question'=>$question,
          'user'=>$user,
          'expert'=>$expert,
          'circle'=>$circle,
          'dianzan'=>$dianzan,
          'member_id'=>$member_id,
          'mid'=>$question['member_id'],
          'eid'=>$question['expert_id'],
          'nums'=>$nums,
          'topay'=>$topay,
          'continue_list'=>$continue_list,
          'pics'=>$pics,
          'answerImgs'=>$answerImgs,
          'count'=>$count,
          'continue'=>$continue,
          'comments'=>$comments_list,
          'RecQuestions'=>$RecQuestions,
          'format_time'=>htmls::formatTime($question['created']),
      ]);
  }
  /*
   * 专家回答页面
   */
  public function actionQanda_record($id){
      Yii::$app->session['tryinto'] = Yii::$app->request->getUrl();
      $model = new Questions();
      $info = $model->find()->asarray()->where(['id'=>intval($id)])->with('user')->one();
      $pics = json_decode($info['imgs'],true);
      return $this->render('qanda_record',['info'=>$info,'pics'=>$pics]);
  }
  /*
   * 追问追答页面
   */
	public function actionYiwen_record($id){
		Yii::$app->session['tryinto'] = Yii::$app->request->getUrl();
		$model = new Zhuiquestions();
		$info = $model->find()->asarray()->where(['id'=>intval($id)])->with('user')->one();
		$pics = json_decode($info['imgs'],true);
		return $this->render('yiwen_record',['info'=>$info,'pics'=>$pics]);
	}

  /*
   * 向专家提问
   */
  public function actionWen_questions(){
      //提问状态 0 提问成功但为付款 1 提问成功且付费成功 2 已回答 3 已失效
      //判断是否是付费会员，如果不是就要求付费成为会员, 使用ajax去请求
      Yii::$app->session['tryinto'] = Yii::$app->request->getUrl();
      $member_id = Yii::$app->session['member_id'];
      $feeuser = Yii::$app->session['feeuser'];
      if(!$member_id){
          Yii::$app->session['tryinto'] = Yii::$app->request->getUrl();
          return $this->redirect('/members/login.html');
      }
      //END
      if(!$member_id){
          Yii::$app->session['tryinto'] = Yii::$app->request->getUrl();
          return $this->redirect('/members/login.html');
      }
      $model = new Experts();
      $info = $model->find()->asarray()->where(['member_id'=>$_GET['id']])->with('user')->one();
      //如果是专家自己，则不能向自己提问
      //获取是否已经关注
      $foucs = Concerns::find()->asarray()->where(['mid'=>$member_id,'to_mid'=>$info['user']['id']])->one();
      //获取已关注的人数
      $concerns = Concerns::find()->where(['to_mid'=>$info['member_id']])->count();
      return $this->render('wen_questions',[
          'info'=>$info,
          'tags'=>json_decode($info['user']['tags'], true),
          'foucs'=>$foucs,
          'concerns'=>$concerns,
          'member_id'=>$member_id,
      ]);
  }

  public function actionMyself(){
      $member_id = Yii::$app->session['member_id'];
      $mid = $_POST['mid'];
      if($member_id == $mid){
          die(json_encode(['result'=>'success','msg'=>'不能向自己提问']));
      }else{
	      die(json_encode(['result'=>'error','msg'=>'It is OK']));
      }
  }
  /*
   * 接收问题
   */
  public function actionAsk(){
      $model = new Questions();
      $member_id = Yii::$app->session['member_id'];
      //查找对应的type
      $expert = Experts::find()->asarray()->where(['member_id'=>$_POST['expert_id']])->one();

      if(!$member_id){
          Yii::$app->session['tryinto'] = Yii::$app->request->getUrl();
          return $this->redirect('/members/login.html');
      }

      $uploader = new Uploadfile();
      $pics = $_POST['pics'];
      $nums = count($pics);
      $base = Yii::getAlias("@public");
      $directory = '/questions/user'.$_POST['expert_id'].'/';
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
      $model->trade = $_POST['trade'];
      $model->question = $_POST['content'];
      $model->open = $_POST['openstatus'];
      $model->expert_id = $_POST['expert_id'];//expert_id 就是member_id
      $model->member_id = $member_id;
      $model->askprice = $_POST['price']/100;
      $model->typeid = $expert['type'];
      if($_POST['price'] == 0){
          $model->status = 1;
      }else{
          $model->status = 0;
      }

      $model->from = $_POST['from'];
      $model->publishtype = $_POST['publishtype'];
      if(isset($_POST['circle_id'])){
          $model->circle_id = $_POST['circle_id'];
      }else{
          $model->circle_id = 0;
      }

      $model->imgs = json_encode($img);
      $model->created = time();
      $model->save();
      $id=$model->id;
      die(json_encode(['result'=>'success','data'=>['id'=>$id]]));

  }
    /*
   * 回答问题
   */
    public function actionAnswer(){
        if($_POST){
            $uploader = new Uploadfile();
            $member_id = Yii::$app->session['member_id'];
            $model = new Questions();
            $content = $_POST['content'];
            if(isset($_POST['pics'])){
                $pics = $_POST['pics'];
            }else{
                $pics = '';
            }

            $nums = count($pics);
            $base = Yii::getAlias("@public");
            $directory = '/questions/user'.$member_id.'/';
            $path = $base.$directory;
            $img = [];
            if(isset($_POST['pics'])){
                for($i=0;$i<$nums;$i++){
                    $img[] = $directory.$uploader->base64_images($pics[$i],$path);
                }
                if(!$img){
                    die(json_encode(['result'=>'error']));
                }
            }
            $imgs = json_encode($img);
            //0 支付为成功； 1支付成功；2回答成功
            $model->updateAll([
            	'status' => 2,
	            'article'=>$content,
	            'answerimgs'=>$imgs,
	            'listen_type'=>$_POST['listentype'],
	            'open_price'=>$_POST['price'],
	            'continue_ask'=>$_POST['zhuitype'],
	            'continue_nums'=>$_POST['nums'],
            ], 'id ='.$_POST['id']);
            die(json_encode(['result'=>'success']));
        }
    }
    /*
     * 一问一答
     */
	public function actionAnsweryiwen(){
		if($_POST){
			$uploader = new Uploadfile();
			$member_id = Yii::$app->session['member_id'];
			$model = new Zhuiquestions();
			$content = $_POST['content'];
			if(isset($_POST['pics'])){
				$pics = $_POST['pics'];
			}else{
				$pics = '';
			}
			
			$nums = count($pics);
			$base = Yii::getAlias("@public");
			$directory = '/questions/user'.$member_id.'/';
			$path = $base.$directory;
			$img = [];
			if(isset($_POST['pics'])){
				for($i=0;$i<$nums;$i++){
					$img[] = $directory.$uploader->base64_images($pics[$i],$path);
				}
				if(!$img){
					die(json_encode(['result'=>'error']));
				}
			}
			$imgs = json_encode($img);
			//0 支付为成功； 1支付成功；2回答成功
			$model->updateAll([
				'status' => 2,
				'article'=>$content,
				'answerimgs'=>$imgs,
				'listen_type'=>$_POST['listentype'],
				'open_price'=>$_POST['price'],
			], 'id ='.$_POST['id']);
			die(json_encode(['result'=>'success']));
		}
	}

  /*
   * 问答播放语音
   */
  public function actionListen(){
      $member_id = Yii::$app->session['member_id'];
      $model = new Questions();
      $data = $model->find()->asarray()->where(['id'=>$_POST['qaId']])->one();
      die(json_encode([
          'result'=>'success',
          'data'=>[
              'urlType'=>'mp3',
              'answerType'=>'1',
              'couponsPayedStatus'=>'0',
              'listenQaType'=>'1',
              'urls'=>$data['voice'],
          ]
      ])
      );
  }
  /*
   * 追问追答的语音播放
   */
	public function actionListenyiwen(){
		$member_id = Yii::$app->session['member_id'];
		$model = new Zhuiquestions();
		$data = $model->find()->asarray()->where(['id'=>$_POST['qaId']])->one();
		die(json_encode([
			'result'=>'success',
			'data'=>[
				'urlType'=>'mp3',
				'answerType'=>'1',
				'couponsPayedStatus'=>'0',
				'listenQaType'=>'1',
				'urls'=>$data['voice'],
			]
		])
		);
	}
  /*
   * 是否偷听、偷看了这个问题
   */
  public function actionTouting(){
	  $member_id = Yii::$app->session['member_id'];
	  $model = new Listen();
	  $data = $model->find()->asarray()->where(['question_id'=>$_POST['qid'],'member_id'=>$member_id])->one();
	  //找到问题的相关信息
	  $info = Questions::find()->asarray()->where(['id'=>$_POST['qid']])->one();
	  if($data){
	  	die(json_encode([
	  		'result'=>'success',
		    'mid'=>$info['member_id'],
		    'eid'=>$info['expert_id'],
	    ]));
	  }else{
		  die(json_encode([
			  'result'=>'error',
			  'mid'=>$info['member_id'],
			  'eid'=>$info['expert_id'],
		  ]));
	  }
  }
  /*
   * 筛选不同的问题
   */
  public function actionFilter(){
      $model = new Questions();
      $member_id = Yii::$app->session['member_id'];
      $file = Yii::$app->params['public'].'/attachment';
      $pernum = $_POST['pernum'];
      $start = $_POST['start'];
      if($_POST['typeid'] == 0){
          $data = $model->find()->asarray()
              ->where(['rec'=>1,'status'=>2,'open'=>1])
              ->with('expert','dianzan','comment','member')
              ->orderBy('listorder DESC')
              ->all();
      }else{
          $data = $model->find()->asarray()
              ->where(['typeid'=>$_POST['typeid'],'status'=>2,'open'=>1])
              ->with('expert','dianzan','comment','member')
              ->orderBy('listorder DESC')
              ->all();
      }
      $lists = [];
      foreach($data as $k=>$v){
           if($v['expert']){
              $lists[] = $v;
          }

      }
      //将处理后的数组进行分页
      $arrayList = array_slice($lists,$start,$pernum);
      if($_POST['typeid'] == 0) {
          $listCounts = $model
              ->find()->asarray()
              ->where(['rec' => 1, 'status' => 2,'open'=>1])
              ->with('expert', 'dianzan', 'comment')->all();
      }else{
          $listCounts = $model
              ->find()->asarray()
              ->where(['typeid' => $_POST['typeid'], 'status' => 2,'open'=>1])
              ->with('expert', 'dianzan', 'comment')->all();
      }
      $listsCount = [];
      foreach($listCounts as $k=>$v){
          if($v['expert']){
              $listsCount[] = $v;
          }

      }
      $total = count($listsCount);
      $pages = ceil($total/$pernum);
      die(json_encode([
          'result'=>'success',
          'data'=>$arrayList,
          'page'=>[
              'currentPage'=>intval($_POST['currentPage']),
              'start'=>intval($_POST['start']),
              'pernum'=>intval($pernum),
              'total'=>intval($total),
              'pages'=>intval($pages),
          ],
          'file'=>$file,
          'mid'=>intval($member_id),
      ]));           
  }

  public function actionStart_ask(){
      require_once(dirname(dirname(__FILE__)).'/rules/rights.php');
      $type = htmls::getPiece('experttype');


      return $this->render('start_ask',['type'=>$type]);
  }

    /*
     * 问答消息通知列表
     */
  public function actionNotice(){
      $member_id = Yii::$app->session['member_id'];
      $model = new Questions();
      $mid = Yii::$app->session['member_id'];
      $pernum = $_POST['pernum'];
      $list = $model->find()->asarray()->where(['expert_id'=>$_POST['expert']])->with('user')->offset($_POST['start'])->limit($pernum)->all();

      $total = $model->find()->asarray()->where(['expert_id'=>$_POST['expert']])->count();
      $pages = ceil($total/$pernum);
      $file = Yii::$app->params['public'].'/attachment';
      die(json_encode(
          [
              'result'=>'success',
              'file'=>$file,
              'mid'=>$mid,
              'data'=>[
                  'list'=>$list,
                  'page'=>[
                      'currentPage'=>$_POST['currentPage'],
                      'pages'=>$pages,
                      'pernum'=>$pernum,
                      'start'=>$_POST['start'],
                      'total'=>$total,
                  ],
              ]
          ]
      ));
  }
  /*
   * 改变消息阅读的状态
   */
  public function actionOpened(){
      if($_POST){
          $member_id = Yii::$app->session['member_id'];
          $model = new Questions();
          $info =  $model->updateAll(['haveread' => 1], 'id ='.$_POST['id']);
          if($info){
              die(json_encode(['result'=>'success']));
          }

      }
  }
  /*
   * 查询通知状态,可现实还有多少条未读消息
   * 未读消息的条数
   *从问答消息中、还有系统消息中获得
   */
  public function actionNoticestatus(){
    if($_POST){
        $expert = $_POST['expert'];
        $status = $_POST['status'];
        $member_id = Yii::$app->session['member_id'];
        $model = new Questions();
        $nums = $model->find()->asarray()->where(['expert_id'=>$expert, 'haveread'=>$status])->count();
        die(json_encode(['result'=>'success','nums'=>intval($nums)]));
    }

  }
  /*
   * 追问追答，不涉及的支付功能，读取属于哪个问题，继承参数
   */
  public function actionContinueask(){
	  if($_POST){
	  	$info = Questions::find()->asarray()->where(['id'=>intval($_POST['qaId'])])->one();
	  	// 追问追答 新建一个表
		  $model = new Zhuiquestions();
		  $model->member_id = $info['member_id'];
		  $model->qaid = $info['id'];
		  $model->expert_id = $info['expert_id'];
		  $model->question = $_POST['content'];
		  $model->circle_id = $info['circle_id'];
		  $model->open = $info['open'];
		  $model->status = 1;
		  $model->askprice = 0;
		  $model->voice = 0;
		  $model->continue_ask = 0;
		  $model->typeid = $info['typeid'];
		  $model->themeid = 0;
		  $model->from = $info['from'];
		  $model->publishtype = $info['publishtype'];
		  $model->listorder = $info['listorder'];
		  $model->open_price = 0;
		  $model->created = time();
		  $info = $model->save();
		  if($info){
		  	// 提问成功后，向老师推送模版消息
			  die(json_encode(['result'=>'success']));
		  }else{
			  die(json_encode(['result'=>'error']));
		  }
	  }
  }
	
}