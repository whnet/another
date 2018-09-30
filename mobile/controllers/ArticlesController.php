<?php

namespace mobile\controllers;

use Yii;
use mobile\models\Members;
use mobile\models\Articles;
use mobile\models\Questions;
use mobile\models\Circles;
use mobile\models\Circlemembers;
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
use common\tools\Uploadfile;

/**
 * MembersController implements the CRUD actions for Members model.
 */
class ArticlesController extends BaseController
{
	public function init(){
		$this->enableCsrfValidation = false;
	}
    public function actions(){
        $view = Yii::$app->view;
        $view->params['site'] = htmls::site();
        $view->params['wechat'] = htmls::wechat();
        $view->params['js'] = $this->setJs();
    }

    public function actionIndex(){
        Yii::$app->session['tryinto'] = Yii::$app->request->getUrl();
        return $this->render('index');
    }
    public function actionSquare(){
        Yii::$app->session['tryinto'] = Yii::$app->request->getUrl();
        require_once(dirname(dirname(__FILE__)).'/rules/rights.php');
        $model = new Articles();
        $list = $model->find()->asarray()->all();
        $type = htmls::getPiece('topictype');
        return $this->render('square',[
                'list'=>$list,
                'type'=>$type,
            ]
        );
    }
    /*
     * 圈子里的详情
     */
        public function actionSquare_detail(){
            Yii::$app->session['tryinto'] = Yii::$app->request->getUrl();
            $model = new Articles();
            $member_id = Yii::$app->session['member_id'];
            $id = Yii::$app->request->get('id');
            $info = $model->find()->where(['id' => $id])->with('user')->one();
            $images = json_decode($info['pics'],true);
            //统计文章的阅读数，三分钟之内重复阅读即为一次
            $ip = Yii::$app->request->userIP;
            $session_time = Yii::$app->session['time'];
            if( (time() - $session_time)> 180){
                $time = Yii::$app->session['time']=time();
                $model->updateAll(['counts' => $info['counts'] + 1], 'id ='.$id);
            }elseif((time() - $session_time) == time()){
                $model->updateAll(['counts' => $info['counts'] + 1], 'id ='.$id);
            }


            //如果没有文章就重定向到首页，防止篡改
            if(!$info){
                return $this->redirect('/site/index.html');
            }
            //判断是否属于圈子的文章
            $circle_info = [];
            if($info['circle_id'] != 0){
                //查找圈子的相关信息，圈名字，介绍，圈主等
                $circle_id = $info['circle_id'];
                $model = new Circles();
                $circle_info = $model->find()->asarray()->with('user')->where(['id'=>$circle_id])->one();
            }
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
            //获取是否已经关注
            $foucs = Concerns::find()->asarray()->where(['mid'=>$member_id,'to_mid'=>$info['member_id']])->one();
            //推荐问答
            $questionModel = new Questions();
            $RecQuestions =  $questionModel->find()->with('expert')->asarray()->limit(3)->orderBy('views DESC')->all();

            return $this->render('square_detail',
                [
                    'info'=>$info,
                    'member_id'=>$member_id,
                    'format_time'=>htmls::formatTime($info['created']),
                    'circle_info'=>$circle_info,
                    'comments'=>$comments_list,
                    'images'=>$images,
                    'count'=>$count,
                    'to_user'=>$to_user,
                    'nums'=>$nums,
                    'dianzan'=>$dianzan,
                    'RecQuestions'=>$RecQuestions,
                    'foucs'=>$foucs,
                ]
            );
        }
    /*
     * 得到最新的文章
     */
        public function actionGetnew(){
            $model = new Articles();
            $mid = Yii::$app->session['member_id'];
            $pernum = $_POST['pernum'];
            $start = $_POST['start'];
            $list = $model->find()->asarray()
                ->with('user','dianzan','comment','redpocket','pockets')
                ->where(['from'=>'index'])
                ->orderBy('created DESC')
                ->all();
	        $listArray = [];
	        foreach($list as $k=>$v){
		        if(in_array($_POST['type'],explode(',',$v['type']))){
			        $listArray[] = $v;
		        }
	        }
            //判断user不能为空
            $lists = [];
            foreach($listArray as $k=>$v){
                if($v['user'] && $v['user']['disallowed'] == 0){
                    $lists[] = $v;
                }
            }
            //将处理后的数组进行分页
            $arrayList = array_slice($lists,$start,$pernum);
	        //待废弃
			//$listCount = $model->find()->asarray()
			//    ->with('user','dianzan','comment','redpocket','pockets')
			//    ->where(['type'=>$_POST['type'],'from'=>'index'])
			//    ->all();
			////判断user不能为空,计算总的个数
			//$listsCount = [];
			//foreach($listCount as $k=>$v){
			//    if($v['user'] && $v['user']['disallowed'] == 0){
			//        $listsCount[] = $v;
			//    }
			//
			//}

            $total = count($arrayList);
            $pages = ceil($total/$pernum);
            $file = Yii::$app->params['public'].'/attachment';

            die(json_encode(
                [
                    'result'=>'success',
                    'file'=>$file,
                    'mid'=>$mid,
                    'data'=>[
                        'list'=>$arrayList,
                        'page'=>[
                            'currentPage'=>intval($_POST['currentPage']),
                            'pages'=>$pages,
                            'pernum'=>intval($pernum),
                            'start'=>intval($_POST['start']),
                            'total'=>intval($total),
                        ],
                    ]
                ]
            ));

        }
        /*
         *  接收发帖的文章
         */
  public function actionFatie(){
      $model = new Articles();
      $member_id = Yii::$app->session['member_id'];
      $post = Yii::$app->request->post();
      $circle_id = isset($post['circle_id'])?$post['circle_id']:0;
      $title = !empty($post['title'])?$post['title']:$post['content'];
      $summary = !empty($post['summary'])?$post['summary']:$post['content'];
      if($post){
          $model->title = $title;
          $model->summary = $summary;
          $model->content = $post['content'];
          $model->member_id = $member_id;
          $model->from =  $post['from'];
          $model->publishtype =  $post['publishtype'];
          $model->circle_id =  $post['circle_id'];
          $model->created = time();
          $model->save();
          $id = $model->id;
          die(json_encode(['result'=>'success','id'=>$id]));
      }
  }
    /*
     * 接收文章信息
     */
    public function actionArticle_data(){
        $model = new Articles();
        $member_id = Yii::$app->session['member_id'];
        $post = Yii::$app->request->post();
        if($post){
            //上传图片将base64转为图片
            $uploader = new Uploadfile();
            //图片和视频的粗暴方法
            $pics = $_POST['pics'];
            $pnums = count($pics);
            $video = $_POST['videos'];
            $vnums = count($video);
            $base = Yii::getAlias("@public");
            $directory = '/articles/user'.$member_id.'/';
            $path = $base.$directory;
            $img = [];
            if($_POST['pics']){
                for($i=0;$i<$pnums;$i++){
                    $img[] = $directory.$uploader->base64_images($pics[$i],$path);
                }
                if(!$img){
                    die(json_encode(['result'=>'error']));
                }
            }

            if($_POST['videos']){
                for($j=0;$j<$vnums;$j++){
                    $video[] = $directory.$uploader->base64_videos($video[$j],$path);
                }
                if(!$video){
                    die(json_encode(['result'=>'error']));
                }
            }else{
                $video[1] = 0;
            }
            //图片和视频的粗暴方法
            $model->title = $post['title'];
            $model->member_id = $member_id;
            $model->summary = $post['summary'];
            $model->type = $post['type'];
            $model->content = $post['content'];
            $model->pics = json_encode($img);
            $model->videos = json_encode($video[1]);
            $model->circle_id = $post['circle_id'];
            $model->from = $post['from'];
            $model->publishtype = $post['publishtype'];
            $model->created = time();
            $info = $model->save();
            $id = $model->id;
            if($info){
                die(json_encode(['result'=>'success','id'=>$id]));
            }

        }
    }
    /*
     * 文章详情
     */
    public function actionArticle_detail(){
        Yii::$app->session['tryinto'] = Yii::$app->request->getUrl();
//        require_once(dirname(dirname(__FILE__)).'/rules/rights.php');
//        require_once(dirname(dirname(__FILE__)).'/rules/details.php');
        //判断是否是付费会员，如果不是就要求付费成为会员, 使用ajax去请求
        $member_id = Yii::$app->session['member_id'];
        if(!$member_id){
            Yii::$app->session['tryinto'] = Yii::$app->request->getUrl();
            return $this->redirect('/members/login.html');
        }

        //END

        $model = new Articles();
        $id = Yii::$app->request->get('id');
        $info = $model->find()->where(['id' => $id])->asarray()->with('user','expert')->one();
        $images = json_decode($info['pics'],true);
       //统计文章的阅读数，三分钟之内重复阅读即为一次
        $ip = Yii::$app->request->userIP;
        $session_time = Yii::$app->session['time'];
        if( (time() - $session_time)> 180){
            $time = Yii::$app->session['time']=time();
            $model->updateAll(['counts' => $info['counts'] + 1], 'id ='.$id);
        }elseif((time() - $session_time) == time()){
            $model->updateAll(['counts' => $info['counts'] + 1], 'id ='.$id);
        }


        //如果没有文章就重定向到首页，防止篡改
        if(!$info){
            return $this->redirect('/site/index.html');
        }
        //判断是否属于圈子的文章
        $circle_info = [];
        if($info['circle_id'] != 0){
            //查找圈子的相关信息，圈名字，介绍，圈主等
            $circle_id = $info['circle_id'];
            $model = new Circles();
            $circle_info = $model->find()->asarray()->with('user')->where(['id'=>$circle_id])->one();
            //判断是否是自己创建的圈子 $circle_info['member_id'] == $member_id
            if( ($circle_info['member_id'] == $member_id) || $circle_info ){
            }else{
            	//都不是就跳转到圈子付费页面
	            return $this->redirect('/circle/circle_share_detail.html?id='.$info['circle_id']);
            }
        }


        //获取点赞的次数
        $nums = Dianzan::find()->asarray()->where(['article_id'=>$_GET['id']])->count();
        $dianzan = Dianzan::find()->asarray()->where(['member_id'=>$member_id,'article_id'=>$_GET['id']])->one();
        //获取是否已经关注
        $foucs = Concerns::find()->asarray()->where(['mid'=>$member_id,'to_mid'=>$info['member_id']])->one();
        //推荐问答
        $questionModel = new Questions();
        $RecQuestions =  $questionModel->find()->with('expert')->asarray()->limit(3)->orderBy('views DESC')->all();
        //判断用户加入的圈子
        $circleModel = new Circlemembers();
        $circleInfo = $circleModel->find()->asarray()->where(['mid'=>$member_id,'cid'=>$info['circle_id']])->count();
        if($circle_info) {
            if ($circle_info['member_id'] != $member_id) {
                if (!$circleInfo && $info['from'] == 'circle') {
                    return $this->redirect('/circle/circle_share_detail.html?id=' . $info['circle_id']);
                }
            }
        }
        
        return $this->render('article_detail',
            [
                'info'=>$info,
                'member_id'=>$member_id,
                'format_time'=>htmls::formatTime($info['created']),
                'circle_info'=>$circle_info,
                'images'=>$images,
                'nums'=>$nums,
                'dianzan'=>$dianzan,
                'RecQuestions'=>$RecQuestions,
                'foucs'=>$foucs,
            ]
            );
    }
    /*
     * 异步加载评论
     */
    public function actionComments(){
        $comments = new Comments();
        $articleId = $_POST['id'];
        $list = $comments->find()->asarray()->with('user')->where(['article_id'=>$articleId])->orderBy('created DESC')->all();
        $count = count($list);
        $file = Yii::$app->params['public'].'/attachment';
        die(json_encode(['result'=>'success','count'=>$count,'list'=>$list, 'file'=>$file]));
    }
    /*
     * 文章详情
     */
    public function actionDetail(){
        $model = new Articles();
        $file = Yii::$app->params['public'].'/attachment';
        $info = $model->find()->asarray()->where(['id'=>$_POST['id']])->one();
        die(json_encode(['result'=>'success','info'=>$info,'file'=>$file]));
    }
   /*
    * 首页数据
    */
   public function actionRecarticle(){
       $model = new Articles();
       $mid = Yii::$app->session['member_id'];
       $pernum = $_POST['pernum'];
       $start = $_POST['start'];

       $list = $model->find()->asarray()
           ->with('user','dianzan','comment','redpocket','pockets','expert')
           ->where(['from'=>'index'])
           ->orderBy('listorder DESC, created DESC')
           ->all();
       $lists = [];
       foreach($list as $k=>$v){
           if($v['user'] && $v['user']['disallowed'] == 0 ){
               $lists[] = $v;
           }

       }
       //将处理后的数组进行分页
       $arrayList = array_slice($lists,$start,$pernum);


       //判断user不能为空,计算总的个数
       $listCounts = $model->find()->asarray()
           ->with('user','dianzan','comment','redpocket','pockets')
           ->where(['from'=>'index'])
           ->all();

       $listsCount = [];
       foreach($listCounts as $k=>$v){
           if($v['user'] && $v['user']['disallowed'] == 0 ){
               $listsCount[] = $v;
           }

       }
       $total = count($listsCount);

       $pages = ceil($total/$pernum);
       $file = Yii::$app->params['public'].'/attachment';
       //获取用户是否关注


     die(json_encode(
         [
             'result'=>'success',
             'file'=>$file,
             'mid'=>$mid,
             'data'=>[
             'list'=>$arrayList,
             'page'=>[
                 'currentPage'=>intval($_POST['currentPage']),
                 'pages'=>intval($pages),
                 'pernum'=>intval($pernum),
                 'start'=>intval($_POST['start']),
                 'total'=>intval($total),
             ],
             ]
         ]
     ));
   }
   /*
    * 获取圈子中的文章
    */
    public function actionCirclearticle(){
        $model = new Articles();
        $mid = Yii::$app->session['member_id'];
        $pernum = $_POST['pernum'];
        $start = $_POST['start'];
        $circle_id = $_POST['circle_id'];
        $list = $model->find()->asarray()
            ->with('user','dianzan','comment','redpocket','pockets','expert')
            ->where(['from'=>'circle','circle_id'=>$circle_id])
            ->orderBy("created DESC")
            ->all();
        $lists = [];
        foreach($list as $k=>$v){
            if($v['user'] && $v['user']['disallowed'] == 0){
                $lists[] = $v;
            }

        }

        //将处理后的数组进行分页
        $arrayList = array_slice($lists,$start,$pernum);


        //判断user不能为空,计算总的个数
        $listCounts = $model->find()->asarray()
            ->with('user','dianzan','comment','redpocket','pockets','expert')
            ->where(['from'=>'circle','circle_id'=>$circle_id])
            ->all();

        $listsCount = [];
        foreach($listCounts as $k=>$v){
            if($v['user'] && $v['user']['disallowed'] == 0){
                $listsCount[] = $v;
            }
        }
        $total = count($listsCount);
        $pages = ceil($total/$pernum);
        $file = Yii::$app->params['public'].'/attachment';
        //获取用户是否关注


        die(json_encode(
            [
                'result'=>'success',
                'file'=>$file,
                'mid'=>$mid,
                'data'=>[
                    'list'=>$arrayList,
                    'page'=>[
                        'currentPage'=>$_POST['currentPage'],
                        'pages'=>$pages,
                        'pernum'=>intval($pernum),
                        'start'=>$_POST['start'],
                        'total'=>$total,
                    ],
                ]
            ]
        ));
    }
      /*
       * 筛选不同的主题
       */
    public function actionThemes(){
        $model = new Articles();
        $file = Yii::$app->params['public'].'/attachment';
        $pernum = $_POST['pernum'];
        $data = $model->find()->asarray()->where(['themeid'=>$_POST['themeid']])->with('user')->offset($_POST['start'])->limit($pernum)->all();
        $total = $model->find()->asarray()->with('user')->where(['themeid'=>$_POST['themeid']])->count();
        $pages = ceil($total/$pernum);
        $format = [];
        for($i=0;$i< count($data);$i++){
           $format[] = htmls::formatTime($data[$i]['created']);
        }
        die(json_encode([
            'result'=>'success',
            'data'=>$data,
            'format'=>$format,
            'page'=>[
                'currentPage'=>$_POST['currentPage'],
                'start'=>$_POST['start'],
                'pernum'=>$pernum,
                'total'=>$total,
                'pages'=>$pages,
            ],
            'file'=>$file]));
    }
    /*
     * 热点文章
     */
    public function actionTopic(){

        return $this->render('topic');
    }
    public function actionTopics(){
        $model = new Articles();
        $pernum = $_POST['pernum'];
        $list = $model->find()->asarray()->with('user')->offset($_POST['start'])->limit($pernum)->all();
        $total = $model->find()->asarray()->count();
        $pages = ceil($total/$pernum);
        $file = Yii::$app->params['public'].'/attachment';
        die(json_encode([
            'result'=>'success',
            'list' =>$list,
            'file'=>$file,
            'page'=>[
                'currentPage'=>$_POST['currentPage'],
                'pages'=>$pages,
                'pernum'=>$pernum,
                'start'=>$_POST['start'],
                'total'=>$total,
            ],
        ])
        );
    }

    public function actionTopicqanda($id){
        $model = new Articles();
        $info = $model->find()->asarray()->where(['id'=>$id])->one();
        return $this->render('topicqanda',[
            'info'=>$info,
        ]);
    }
    /*
     * 回答
     */
    public function actionTopicqanda_record($id){
        $member_id = Yii::$app->session['member_id'];
        if(!$member_id){
            return $this->redirect('/members/login.html');
        }
        $model = new Articles();
        $info = $model->find()->asarray()->where(['id'=>$id])->one();
        return $this->render('topicqanda_record',[
            'info'=>$info,
        ]);
    }
    /*
     * 问答播放语音
     */
    public function actionListen(){
        require_once(dirname(dirname(__FILE__)).'/rules/ajaxrights.php');
        $member_id = Yii::$app->session['member_id'];
        $model = new Articles();
        $data = $model->find()->asarray()->where(['id'=>$_POST['qaId']])->one();
        die(json_encode([
            'result'=>'success',
            'data'=>[
                'urlType'=>'mp3',
                'answerType'=>'1',
                'couponsPayedStatus'=>'0',
                'listenQaType'=>'1',
                'urls'=>$data['voices'],
            ]
        ])
        );
    }

    public function actionArticle_edit(){

        require_once(dirname(dirname(__FILE__)).'/rules/rights.php');
        $type = htmls::getPiece('topictype');
        return $this->render('article_edit',['type'=>$type]);
    }

    /**
     * Deletes an existing Members model.
     * If deletion is successful, the browser will be redirected to the 'index' page.
     * @param integer $id
     * @return mixed
     */
    public function actionDelete()
    {
        $model = new Articles();
        $id = $_POST['id'];
        $model->findOne($id)->delete();
        die(json_encode(['status'=>'success']));
    }
	/**
	* 发布文章
	*/

	public function actionArticle_newedit(){
		require_once(dirname(dirname(__FILE__)).'/rules/rights.php');
		$type = htmls::getPiece('topictype');
		return $this->render('artice_newedit',['type'=>$type]);
	}
	/*
	 * 接收图片上传
	 */
	public function actionUpload(){
		if($_POST){
			$info=explode('.', $_FILES["article"]['name']);
			$member_id = Yii::$app->session['member_id'];
			$path = Yii::getAlias("@public");
			$directory = '/articles/';
			$name = $member_id.'-'.time().'.'.end($info);
			move_uploaded_file($_FILES["article"]["tmp_name"], $path.$directory . $name);
		}
		$path = Yii::getAlias("@public");
		$data['status'] = 1;
		$data['url'] = Yii::$app->params['publicVoice'] . $directory . $name;
		die(json_encode($data));
	}
}