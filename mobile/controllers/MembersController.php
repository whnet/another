<?php

namespace mobile\controllers;

use Yii;
use mobile\models\Members;
use mobile\models\Wxpayrecord;
use mobile\models\Experts;
use mobile\models\Concerns;
use mobile\models\Tixian;
use mobile\models\Circlemembers;
use mobile\models\Articles;
use mobile\models\Questions;
use mobile\models\Zhuiquestions;
use mobile\models\Pocketget;
use mobile\models\Codes;
use yii\data\ActiveDataProvider;
use yii\web\Controller;
use yii\web\NotFoundHttpException;
use yii\filters\VerbFilter;
use mobile\controllers\BaseController;
use common\tools\htmls;
use common\tools\Uploadfile;
use dosamigos\qrcode\QrCode;
use Flc\Dysms\Client;
use Flc\Dysms\Request\SendSms;
use EasyWeChat\Foundation\Application;

use common\widgets\Imagecompress;


class MembersController extends BaseController
{
    public function actions(){
        $view = Yii::$app->view;
        $view->params['site'] = htmls::site();
        $view->params['wechat'] = htmls::wechat();
        $view->params['js'] = $this->setJs();
    }
    /**
     * Lists all Members models.
     * @return mixed
     */
    public function actionIndex()
    {
	    $cookie = Yii::$app->request->cookies;
	    $openid = $cookie->getValue('openid')?$cookie->getValue('openid'):'';
	    $user = Members::find()->asarray()
		    ->where(['openid'=>$openid])
		    ->with('expert')
		    ->one();
	    if(!$openid || !$user){
		    unset($_SESSION);
		    Yii::$app->session['onece'] = 'onece';
		    $this->startWx();
	    }
	    
	    $member_id = $user['id'];
        $feeusers = Yii::$app->session['feeuser'];
        
        if(empty($member_id)){
	        Yii::$app->session['tryinto'] = Yii::$app->request->getUrl();
	        return $this->redirect('/members/wxlogin.html');
        }else{
	        //判断
	        $cookies['openid'] = $cookie->getValue('openid')?$cookie->getValue('openid'):'';
            if($user['openid'] != $cookies['openid']){
                Yii::$app->session['tryinto'] = Yii::$app->request->getUrl();
            }
            Yii::$app->session['member_id']=$member_id;
        }
        //我的收入

        //查询提现表中，此用户的申请记录的最新时间，如果没有证明从未提现过，收入就是按照所有的计算，如果有记录，只选择大于最新提现的时间的记录
        $findTixianForNewMethod = Tixian::find()->asarray()->where(['mid'=>$member_id])->orderBy('created DESC')->all();
        if($findTixianForNewMethod){
            $tixianLastTime = $findTixianForNewMethod[0]['created'];
            //统计大于最新的提现时间
            if($user['expert']){ //回答收入
                $questionModel = new Questions();
                $QuestionPrice = $questionModel->find()->asarray()
                    ->where(['expert_id'=>$member_id])
                    ->andWhere(['status'=>2])
                    ->andWhere(['>','created',$tixianLastTime])
                    ->sum('askprice');
                if(!$QuestionPrice){
                    $QuestionPrice = "0.00";
                }
            }else{
                $QuestionPrice = "0.00";
            }
            //红包收入
            $PocketgetModel = new Pocketget();
            $PocketPrice = $PocketgetModel->find()
                ->where(['member_id'=>$member_id])
                ->andWhere(['>','created',$tixianLastTime])
                ->sum('get_price');
            if(!$PocketPrice){
                $PocketPrice = '0.00';
            }
            //圈子收入，从加入的圈子中计算
            $CircleModel = new Circlemembers();
            $CirclePrice = $CircleModel->find()->asarray()
                ->where(['qid'=>$member_id])
                ->andWhere(['status'=>1])
                ->andWhere(['>','created',$tixianLastTime])
                ->sum('price');
            if(!$CirclePrice){
                $CirclePrice = '0.00';
            }else{
                $CirclePrice = $CirclePrice;
            }
            //统计大于最新的提现时间END
        }else{
            if($user['expert']){ //回答收入
                $questionModel = new Questions();
                $QuestionPrice = $questionModel->find()->asarray()
                    ->where(['expert_id'=>$member_id])
                    ->andWhere(['status'=>2])
                    ->sum('askprice');
                if(!$QuestionPrice){
                    $QuestionPrice = "0.00";
                }
            }else{
                $QuestionPrice = "0.00";
            }
            //红包收入
            $PocketgetModel = new Pocketget();
            $PocketPrice = $PocketgetModel->find()->where(['member_id'=>$member_id])->sum('get_price');
            if(!$PocketPrice){
                $PocketPrice = '0.00';
            }
            //圈子收入，从加入的圈子中计算
            $CircleModel = new Circlemembers();
            $CirclePrice = $CircleModel->find()->asarray()->where(['qid'=>$member_id])->andWhere(['status'=>1])->sum('price');
            if(!$CirclePrice){
                $CirclePrice = '0.00';
            }else{
                $CirclePrice = $CirclePrice;
            }
        }
            //总的收入等于回答收入+红包收入+圈子收入 乘以分成
            $site = htmls::site();
            $totals = $QuestionPrice + $PocketPrice + $CirclePrice;
            $total = number_format($totals, 2);
        //我的收入 END


        $model = new Concerns();
        //我关注的 查找mid
        $concern = $model->find()->asarray()->with('concerns')->where(['mid'=>$member_id])->count();
        //粉丝 查找to_mid
        $fans = $model->find()->asarray()->with('fans')->where(['to_mid'=>$member_id])->count();
        //判断是否是付费会员
        $feeuserStatus = Wxpayrecord::find()->asarray()->where(['mid'=>$member_id,'pay_type'=>'feeuser'])->orderBy('created DESC')->all();
        //如果加入了会员，则显示会员信息,应该从支付订单中查找
        $circelMember = Circlemembers::find()->asarray()->where(['mid'=>$member_id])->one();
        if(!empty($feeuserStatus)){
            $feeuser = $feeuserStatus[0];
        }else{
            $feeuser = 0;
        }

        //提现的金额
        $tixian = Tixian::find()->where(['mid'=>$member_id])->sum('price');
        return $this->render('index', [
            'user' => $user,
            'concern' => $concern,
            'fans' => $fans,
            'member_id' => $member_id,
            'feeuser' => $feeuser,
            'feeusers' => $feeusers,
            'total' => $total,
            'tixian' => $tixian,
            'circelMember' => $circelMember,
            'site' => $site,
        ]);
    }
    /**
     * members to login
     */
    public function actionLogin(){
        return $this->redirect('/members/wxlogin.html');
    }

    public function actionWxlogin(){
        $model = new Members();
        $cookie = Yii::$app->request->cookies;
        $user['openid'] = $cookie->getValue('openid')?$cookie->getValue('openid'):'';
        $info = $model->find()->asarray()->where(['openid'=>$user['openid']])->one();
        if(!empty($info)){
	        $setCookies = Yii::$app->response->cookies;
	        $setCookies->add(new \yii\web\Cookie([
		        'name' => 'openid',
		        'value' => $info["openid"],
		        'expire' => time() + 3600*30,
	        ]));
            Yii::$app->session['member_id']=$info["id"];
            Yii::$app->session['openid']=$info["openid"];
	        return $this->redirect(Yii::$app->session['tryinto']);
        }

        if($user['openid']){
            //判断是否是付费会员
            $wxMe = $model->find()->asarray()
                ->where(['openid'=>$user['openid']])->one();
            if($wxMe['openid']){
                Yii::$app->session['member_id'] = $wxMe['id'];
                Yii::$app->session['nickname'] = $wxMe['nickname'];
                return $this->redirect(Yii::$app->session['tryinto']);
            }else{
	            $cookie = Yii::$app->request->cookies->get('openid');
	            Yii::$app->response->getCookies()->remove($cookie);
            }
        }else{
            $this->startWx();
        }
	    //return $this->redirect('/members/index.html');
		return $this->redirect(Yii::$app->session['tryinto']);
    }
    /*
     * 请求数据看 是否是付费的会员
     */
    public function actionIsfeeuser(){
        if(stripos($_SERVER['HTTP_USER_AGENT'], 'MicroMessenger')) {
            if ($_GET) {
                $mid = Yii::$app->session['member_id'];
                if (!$mid) {//强制登录
                    Yii::$app->session['feeuser'] = 0;
                    die(json_encode(['result' => 'tologin']));
                }
                $info = Members::find()->asarray()->where(['id' => $mid])->one();
                if (!empty($info)) {
                    //START
                    $time = time() - $info['feetime'];
                    if ($info['feeuser'] == 1 && $time < 365 * 24 * 3600) {
                        Yii::$app->session['feeuser'] = 1;
                        die(json_encode(['result' => 'success', 'status'=>1]));
                    } elseif ($info['vip'] == 1) {//专家
                        Yii::$app->session['feeuser'] = 1;
                        die(json_encode(['result' => 'success', 'status'=>1]));
                    } elseif ($info['isguanjia'] == 1) {//管家
                        Yii::$app->session['feeuser'] = 1;
                        die(json_encode(['result' => 'success', 'status'=>1]));
                    } elseif ($info['honnoruser'] == 1) {//系统设置会员
                        Yii::$app->session['feeuser'] = 1;
                        die(json_encode(['result' => 'success', 'status'=>1]));
                    } else {//其余不是会员
                        Yii::$app->session['feeuser'] = 0;
                        die(json_encode(['result' => 'error', 'status'=>0]));
                    }
                    //END
                } else {
                    Yii::$app->session['feeuser'] = 0;
                    die(json_encode(['result' => 'error', 'status'=>0]));
                }

            }
        }
    }
	/*
	 * 请求数据看 是否回答了问题
	 */
	public function actionIsanswer(){
		if ($_GET) {
			$mid = Yii::$app->session['member_id'];
			if (!$mid) { //强制登录
				Yii::$app->session['feeuser'] = 0;
				die(json_encode(['result' => 'tologin']));
			}
			//找到没有回答的问题
			$count = Questions::find()->asarray()->where(['status'=>1,'expert_id'=>$mid])->count();
			die(json_encode(['result' => 'success', 'status'=>intval($count)]));
		}
	}
	
	/**
     * members to regist 待废弃
     */
    public function actionRegist(){

        $model = new Members();
        $post = Yii::$app->request->post();
        if($post){
            $model->nickname = $post['nickname'];
            $model->phone = $post['phone'];
            $model->pwd = md5($post['pwd']);
            if(isset($post['openid'])){
                $model->openid = $post['openid'];
            }else{
                $model->openid = '';
            }
            $model->created = time();
            $info = $model->save();
            $id = $model->id;
            if($info){
                Yii::$app->session['member_id']=$id;
                die(json_encode($info));
            }

        }
        return $this->render('regist');
    }
    /*
     *  查看是否绑定了手机
     */
    public function actionIfbindmobile(){
        $model = new Members();
        $member_id = Yii::$app->session['member_id'];
        $info = $model->find()->asarray()->where(['id' => $member_id])->one();
        die(json_encode(['result'=>'success','info'=>$info]));
    }
    /**
     * members to sets
     */
    public function actionMyset(){

        if(isset($_GET['loginout'])){
            $session = \Yii::$app->session;
            $session->removeAll();
            return $this->redirect('/site/index.html');
        }
        return $this->render('myset');
    }
    /*
     * 绑定与解绑手机号码
     */
    public function actionMyset_bind_phone(){


        return $this->render('myset_bind_phone',['mobile'=>1]);
    }
    public function actionPassword_edit()
    {
        $model = new Members();
        $post = Yii::$app->request->post();
        if($post){
            $member_id = Yii::$app->session['member_id'];
            $user = $this->findModel($member_id);
            if( ($user['pwd'] == $post['oldPassword']) && ($post['newPassword1'] == $post['newPassword2']) ){
                $model->updateAll(['pwd' => $post['newPassword2']], 'id ='.$member_id);
                die(json_encode(['result'=>'success']));
            }else{
                die(json_encode(['message'=>'修改失败']));
            }


        }
        return $this->render('password_edit');
    }
    public function actionAboutus_details(){
        return $this->render('aboutus_details');
    }
    public function actionFeedback(){
        $member_id = Yii::$app->session['member_id'];
        if(!$member_id){
            Yii::$app->session['tryinto'] = Yii::$app->request->getUrl();
            return $this->redirect('/members/login.html');
        }
        return $this->render('feedback');
    }
    public function actionPersonal_data(){
        $member_id = Yii::$app->session['member_id'];
        if(!$member_id){
            Yii::$app->session['tryinto'] = Yii::$app->request->getUrl();
            return $this->redirect('/members/login.html');
        }else{
            $user = $this->findModel($member_id);
            Yii::$app->session['member_id']=$user['id'];
        }
        $model = new Members();
        $post = Yii::$app->request->post();
        if($post){
            $member_id = Yii::$app->session['member_id'];
            $model->updateAll(['sex' => $post['sex']], 'id ='.$member_id);
        }
        return $this->render('personal_data',['user'=>$user]);
    }
    public function actionUser_photo_edit(){
        $model = new Members();
        $member_id = Yii::$app->session['member_id'];
        if(!$member_id){
            Yii::$app->session['tryinto'] = Yii::$app->request->getUrl();
            return $this->redirect('/members/login.html');
        }
        $user = $this->findModel($member_id);
        return $this->render('user_photo_edit',['model'=>$model, 'user'=>$user]);
    }
    //头像上传
    public function actionUploader(){
        $model = new Members();
        $member_id = Yii::$app->session['member_id'];
        //将本地图片作为远程图片进行保存，同时判断是否修改过头像，如果有，微信就不自动获取头像
        $photo = Yii::$app->params['public'].'/attachment'.$_POST['photo'];
        $info = $model->updateAll(['photo' => $photo], 'id ='.$member_id);
        if($info){
            die(json_encode(['result'=>'success']));
        }

    }
    public function actionPersonal_data_name_edit(){
        $model = new Members();
        $post = Yii::$app->request->post();
        if($post){
            $member_id = Yii::$app->session['member_id'];
            if($post['index'] == 0){
                $model->updateAll(['nickname' => $post['nickname']], 'id ='.$member_id);
            }else{
                $model->updateAll(['slogan' => $post['nickname']], 'id ='.$member_id);
            }

            die(json_encode(['result'=>'success','index'=>$post['index']]));
        }
        return $this->render('personal_data_name_edit');
    }
   //所属行业
    public function actionPersonal_data_industry_edit(){

        return $this->render('personal_data_industry_edit');
    }
    //我的钱包
    public function actionMywallet(){
        $site = htmls::site();
        $member_id = Yii::$app->session['member_id'];

        if(!$member_id){
            Yii::$app->session['tryinto'] = Yii::$app->request->getUrl();
            return $this->redirect('/members/login.html');
        }
        //查询提现表中，此用户的申请记录的最新时间，如果没有证明从未提现过，收入就是按照所有的计算，如果有记录，只选择大于最新提现的时间的记录
        $findTixianForNewMethod = Tixian::find()->asarray()->where(['mid'=>$member_id])->orderBy('created DESC')->all();
         if($findTixianForNewMethod){
             $tixianLastTime = $findTixianForNewMethod[0]['created'];
             //统计大于最新的提现时间
                 $expert = Experts::find()->where(['member_id'=>$member_id])->asarray()->one();
                 if($expert){//回答收入
                     $questionModel = new Questions();
                     $QuestionPrice = $questionModel->find()->asarray()
                         ->where(['expert_id'=>$member_id])
                         ->andWhere(['status'=>2])
                         ->andWhere(['>','created',$tixianLastTime])
                         ->sum('askprice');
                     if(!$QuestionPrice){
                         $QuestionPrice = "0.00";
                     }
                 }else{
                     $QuestionPrice = "0.00";
                 }
                 //红包收入
                 $PocketgetModel = new Pocketget();
                 $PocketPrice = $PocketgetModel->find()
                     ->where(['member_id'=>$member_id])
                     ->andWhere(['>','created',$tixianLastTime])
                     ->sum('get_price');
                 if(!$PocketPrice){
                     $PocketPrice = '0.00';
                 }
                 //圈子收入，从加入的圈子中计算
                 $CircleModel = new Circlemembers();
                 $CirclePrice = $CircleModel->find()->asarray()
                     ->where(['qid'=>$member_id])
                     ->andWhere(['status'=>1])
                     ->andWhere(['>','created',$tixianLastTime])
                     ->sum('price');
                 if(!$CirclePrice){
                     $CirclePrice = '0.00';
                 }else{
                     $CirclePrice = $CirclePrice;
                 }
             //统计大于最新的提现时间END
         }else{
             $expert = Experts::find()->where(['member_id'=>$member_id])->asarray()->one();
             if($expert){//回答收入
                 $questionModel = new Questions();
                 $QuestionPrice = $questionModel->find()->asarray()
                     ->where(['expert_id'=>$member_id])
                     ->andWhere(['status'=>2])
                     ->sum('askprice');
                 if(!$QuestionPrice){
                     $QuestionPrice = "0.00";
                 }
             }else{
                 $QuestionPrice = "0.00";
             }
             //红包收入
             $PocketgetModel = new Pocketget();
             $PocketPrice = $PocketgetModel->find()->where(['member_id'=>$member_id])->sum('get_price');
             if(!$PocketPrice){
                 $PocketPrice = '0.00';
             }
             //圈子收入，从加入的圈子中计算
             $CircleModel = new Circlemembers();
             $CirclePrice = $CircleModel->find()->asarray()->where(['qid'=>$member_id])->andWhere(['status'=>1])->sum('price');
             if(!$CirclePrice){
                 $CirclePrice = '0.00';
             }else{
                 $CirclePrice = $CirclePrice;
             }
         }


        //总的收入等于回答收入+红包收入+圈子收入
        $total = $QuestionPrice + $PocketPrice + $CirclePrice;
        $totalAfter = $total * $site['quanzifencheng'];
        //已提现成功的金额
        $tixians = Tixian::find()->where(['mid'=>$member_id])->andWhere(['status'=>1])->sum('price');
        $tixian = $tixians?$tixians:0;
        //已申请未审核通过金额
        $shenheTixians = Tixian::find()->where(['mid'=>$member_id])->andWhere(['status'=>0])->sum('price');
        $shenheTixian  = $shenheTixians?$shenheTixians:0;
        //待提现金额,总金额*百分比 - （已提现 + 未审核）
        $daitixianjine = number_format($totalAfter - ($tixian + $shenheTixian),2);


        //提现记录
        $tixianRecord = Tixian::find()->where(['mid'=>$member_id])->andWhere(['status'=>1])->all();
        $fencheng =  (1 - $site['quanzifencheng']) * 100;
        return $this->render('mywallet',[
            "QuestionPrice"=>$QuestionPrice,
            "PocketPrice"=>$PocketPrice,
            "CirclePrice"=>$CirclePrice,
            "total"=>number_format($total,2),
            "tixian"=>number_format($tixian,2),
            "fencheng"=>$fencheng,
            "shenheTixian"=>number_format($shenheTixian,2),
            "daitixianjine"=>number_format($daitixianjine,2),
            "tixianRecord"=>$tixianRecord,
            "bili"=>$site['quanzifencheng']
        ]);
    }
    public function actionTixian(){
        //提交体现申请
        $mid = Yii::$app->session['member_id'];
        $info = Members::find()->asarray()->where(['id'=>$mid])->one();
        if($info['openid']){
            $model = new Tixian();
            $model -> mid = $mid;
            $model -> openid = $info['openid'];
            $model -> price = $_POST['price'];
            $model -> created = time();
            $model -> save();
            $id = $model->id;
            if($id){
                die(json_encode(['result'=>'success']));
            }else{
                die(json_encode(['result'=>'error']));
            }

        }else{
            die(json_encode(['result'=>'error']));
        }

    }
    public function actionMycoupon(){
        $member_id = Yii::$app->session['member_id'];
        if(!$member_id){
            Yii::$app->session['tryinto'] = Yii::$app->request->getUrl();
            return $this->redirect('/members/login.html');
        }
        return $this->render('mycoupon');
    }
    //我的关注
    public function actionMyrelations(){
        $member_id = Yii::$app->session['member_id'];
        if(!$member_id){
            Yii::$app->session['tryinto'] = Yii::$app->request->getUrl();
            return $this->redirect('/members/login.html');
        }
        $mid = Yii::$app->session['member_id'];
        $model = new Concerns();

        //我关注的 查找mid
        $concern = $model->find()->asarray()->with('fans')->where(['mid'=>$mid])->all();
        //粉丝 查找to_mid
        $fans = $model->find()->asarray()->with('concerns')->where(['to_mid'=>$mid])->all();


        return $this->render('myrelations',[
            'concern'=>$concern,
            'fans'=>$fans,
        ]);
    }

    public function actionMyrelationstest(){
        $member_id = Yii::$app->session['member_id'];
        if(!$member_id){
            Yii::$app->session['tryinto'] = Yii::$app->request->getUrl();
            return $this->redirect('/members/login.html');
        }
        $mid = Yii::$app->session['member_id'];
        $model = new Concerns();

        //我关注的 查找mid
        $concern = $model->find()->asarray()->with('fans')->where(['mid'=>$mid])->all();
        //粉丝 查找to_mid
        $fans = $model->find()->asarray()->with('concerns')->where(['to_mid'=>$mid])->all();



        return $this->render('myrelations',[
            'concern'=>$concern,
            'fans'=>$fans,
        ]);
    }
    /*
     * 我答，我问，我听
     */
    public function actionMyhomepage(){
        $member_id = Yii::$app->session['member_id'];
        if(!$member_id){
            Yii::$app->session['tryinto'] = Yii::$app->request->getUrl();
            return $this->redirect('/members/login.html');
        }
        //查看是否通过点击通知栏进入我的问答中 $_GET['read']
	    if(isset($_GET['read']) && $_GET['read'] == 1){
		    Yii::$app->session['read'] = 1;
	    }
        $model = new Questions();
        //我的回答,
        $answer = $model->find()->asarray()
            ->where(['expert_id'=>$member_id])
            ->with('user','next')->orderBy('created DESC')->all();
        //我的提问
        $ask = $model->find()->asarray()
            ->where(['member_id'=>$member_id])
            ->with('user','next')->orderBy('created DESC')->all();
        
        return $this->render('myhomepage',[
            'answer'=>$answer,
            'ask'=>$ask,
            'member_id'=>$member_id,
        ]);
    }
    // 追问追答，模板使用 我的问答
	public function actionYiwen(){
		$member_id = Yii::$app->session['member_id'];
		if(!$member_id){
			Yii::$app->session['tryinto'] = Yii::$app->request->getUrl();
			return $this->redirect('/members/login.html');
		}
		//查看是否通过点击通知栏进入我的问答中 $_GET['read']
		if(isset($_GET['read']) && $_GET['read'] == 1){
			Yii::$app->session['read'] = 1;
		}
		$model = new Zhuiquestions();
		//我的回答,
		$answer = $model->find()->asarray()
			->where(['expert_id'=>$member_id,'qaid'=>intval($_GET['id'])])
			->with('user')->orderBy('created DESC')->all();
		
		return $this->render('yiwen',[
			'answer'=>$answer,
			'member_id'=>$member_id,
		]);
	}
	// 追问追答 我的回答
	public function actionYida(){
		$member_id = Yii::$app->session['member_id'];
		if(!$member_id){
			Yii::$app->session['tryinto'] = Yii::$app->request->getUrl();
			return $this->redirect('/members/login.html');
		}
		//查看是否通过点击通知栏进入我的问答中 $_GET['read']
		if(isset($_GET['read']) && $_GET['read'] == 1){
			Yii::$app->session['read'] = 1;
		}
		$model = new Zhuiquestions();
		//我的回答,
		$answer = $model->find()->asarray()
			->where(['member_id'=>$member_id,'qaid'=>intval($_GET['id'])])
			->with('user')->orderBy('created DESC')->all();
		
		return $this->render('yida',[
			'answer'=>$answer,
			'member_id'=>$member_id,
		]);
	}
    //使用ajax分别请求数据,将我问，我答，合并
    public function actionMyanswer(){
        $type = $_POST['type'];
        if($type == 'ask'){
            $typeName = 'member_id';
            $typeId = $mid;
        }elseif($type == "answer"){
            $typeName = 'expert_id';
            $typeId = $expert;
        }

        $member_id = Yii::$app->session['member_id'];
        $expert = Yii::$app->session['expert'];
        $model = new Questions();
        $pernum = $_POST['pernum'];
        $list = $model->find()->asarray()->where([$typeName=>$typeId])->with('user')->offset($_POST['start'])->limit($pernum)->all();

        $total = $model->find()->asarray()->where([$typeName=>$typeId])->count();
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
     * 申请成为专家
     */
    public function actionQanda_certify(){
        $member_id = Yii::$app->session['member_id'];
        if(!$member_id){
            Yii::$app->session['tryinto'] = Yii::$app->request->getUrl();
            return $this->redirect('/members/login.html');
        }
        //查看会员信息
        $info = Members::find()->asarray()->where(['id'=>$member_id])->one();
        //查看认证的信息
        $apply = Experts::find()->asarray()->where(['member_id'=>$member_id])->one();
        $type_id = explode(',',$apply['type']);
        $type = htmls::getPiece('experttype');
        return $this->render('qanda_certify',['info'=>$info,'type'=>$type,'apply'=>$apply,'type_id'=>$type_id]);
    }
    public function actionApply(){
        if($_POST){
            $model = new Experts();
            $mid = Yii::$app->session['member_id'];
            $model->member_id = $mid;
            $model->realname = $_POST['realname'];
            $model->honor = $_POST['honor'];
            $model->des = $_POST['des'];
            $model->price = $_POST['price'];
            $model->type = $_POST['type'];
            $model->card = $_POST['card'];
            $model->vip = 0;
            $model->created = time();
            $model->save();
            $id = $model->id;
            if($id){
                die(json_encode(['result'=>'success']));
            }
        }
    }
    public function actionChangeapply(){
        $model = new Experts();
        $mid = $_POST['mid'];
        $info = $model->updateAll([
            'realname'=>$_POST['realname'],
            'honor'=>$_POST['honor'],
            'des'=>$_POST['des'],
            'price'=>$_POST['price'],
            'type'=>$_POST['type'],
            'card'=>$_POST['card'],
            'vip'=>0,
            'created'=>time(),
        ], "member_id ='{$mid}'");
        if($info){
            die(json_encode(['result'=>'success']));
        }else{
            die(json_encode(['result'=>'error']));
        }

    }
    /*
     * 上传图片认证图片
     */
    public function actionUpload(){
        $uploader = new Uploadfile();
        $base = Yii::getAlias("@public");
        $directory = '/expert/';
        $path = $base.$directory;
        $img = $directory.$uploader->base64_images($_POST['content'],$path);
        $file = Yii::$app->params['public'].'/attachment';
        die(json_encode(['result'=>'success','img'=>$img,'file'=>$file]));
    }
    /*
     * 上传头像
     */
    public function actionUploadheader(){
        $uploader = new Uploadfile();
        $base = Yii::getAlias("@public");
        $directory = '/wxhead/';
        $path = $base.$directory;
        $img = $directory.$uploader->base64_images($_POST['content'],$path);
        $file = Yii::$app->params['public'].'/attachment';
        die(json_encode(['result'=>'success','img'=>$img,'file'=>$file]));
    }

    //我的消息
    public function actionMynotice(){
        $member_id = Yii::$app->session['member_id'];
        if(!$member_id){
            Yii::$app->session['tryinto'] = Yii::$app->request->getUrl();
            return $this->redirect('/members/login.html');
        }
        return $this->render('mynotice');
    }
    //我的关注
    public function actionHouse_circle(){
        $member_id = Yii::$app->session['member_id'];
        if(!$member_id){
            Yii::$app->session['tryinto'] = Yii::$app->request->getUrl();
            return $this->redirect('/members/login.html');
        }
        return $this->render('house_circle');
    }
    //我发布的
    public function actionMyarticle(){
        $model = new Articles();
        $member_id = Yii::$app->session['member_id'];
        if(!$member_id){
            Yii::$app->session['tryinto'] = Yii::$app->request->getUrl();
            return $this->redirect('/members/login.html');
        }
        $list = $model->find()->asarray()->where(['member_id'=>$member_id])->all();
        return $this->render('myarticle',['list'=>$list]);
    }
    //我的二维码
    public function actionMyqrcode(){
        $member_id = Yii::$app->session['member_id'];
        if(!$member_id){
            Yii::$app->session['tryinto'] = Yii::$app->request->getUrl();
            return $this->redirect('/members/login.html');
        }
        $user = $this->findModel($member_id);
        //测试
        //测试END
        // 我的二维码
	    $domain = Yii::$app->request->hostInfo;
	    $member_id = Yii::$app->session['member_id'];
	    $url = $domain.'/expert/expert_detail.html?id='.$member_id.'&from=found&publishtype=ask';
        //回答问题的个数
	    //未付款0 已付款1 已回答2
	    $questionModel = new Questions();
	    $count =  $questionModel->find()->where(['member_id'=>$member_id])->andWhere(['status'=>2])->asarray()->count();
		//标签
	    $model = new Experts();
	    $info = $model->find()
		    ->asarray()
		    ->with('user')
		    ->where(['member_id'=>$member_id,'vip'=>1])
		    ->one();
	    $tag = htmls::getPiece('experttype');
	    if($info['type']){
	    foreach($tag as $k=>$v){
		    $tags[$v['id']] = $v;
	    }
	    $types = explode(',',$info['type']);
	    $nums = count($types);
	    $names = '';
	    foreach($types as $k=>$v){
			$names[] = $tags[$v]['name'];
	    }
	    }else{
	    	$names = [];
	    }
	    // 将远程图片base64
        return $this->render('myqrcode',[
        	'user'=>$user,
        	'count'=>$count,
        	'names'=>$names,
        	'qrcodeurl'=>$url,
        ]);
    }

    public function actionQrcode()
    {
        //二维码生成方法

        $domain = Yii::$app->request->hostInfo;
        $member_id = Yii::$app->session['member_id'];
        $url = $domain.'/expert/expert_detail.html?id='.$member_id.'&from=found&publishtype=ask';
	    $errorCorrectionLevel = "H";
	    $matrixPointSize = "4";
        return QrCode::png($url, false, $errorCorrectionLevel, $matrixPointSize);
    }
    /**
     * Displays a single Members model.
     * @param integer $id
     * @return mixed
     */
    public function actionView($id)
    {
        return $this->render('view', [
            'model' => $this->findModel($id),
        ]);
    }


    /**
     * Creates a new Members model.
     * If creation is successful, the browser will be redirected to the 'view' page.
     * @return mixed
     */
    public function actionCreate()
    {
        $model = new Members();

        if ($model->load(Yii::$app->request->post()) && $model->save()) {
            return $this->redirect(['view', 'id' => $model->id]);
        } else {
            return $this->render('create', [
                'model' => $model,
            ]);
        }
    }

    /**
     * Updates an existing Members model.
     * If update is successful, the browser will be redirected to the 'view' page.
     * @param integer $id
     * @return mixed
     */
    public function actionUpdate($id)
    {
        $model = $this->findModel($id);

        if ($model->load(Yii::$app->request->post()) && $model->save()) {
            return $this->redirect(['view', 'id' => $model->id]);
        } else {
            return $this->render('update', [
                'model' => $model,
            ]);
        }
    }
		
    /*
     * 发送验证码
     */
    public function actionCode(){
        if($_POST){
	        $rand = rand(111111, 999999);
	        $config = Yii::$app->params['alidayu'];
	        $client  = new Client($config);
	        $sendSms = new SendSms;
	        $sendSms->setPhoneNumbers($_POST['phone']);
	        $sendSms->setSignName(trim('华麦律师'));
	        $sendSms->setTemplateCode('SMS_126351052');
	        $sendSms->setTemplateParam(['code' => $rand]);
	        $sendSms->setOutId('demo');
	        $sendInfo = $client->execute($sendSms);
	        $model = new Codes();
	        $model->code = $rand;
	        $model->phone = $_POST['phone'];
	        $model->created = time();
	        $model->save();
	        die(json_encode(['result'=>'success','msg'=>$sendInfo]));
        }
    }
    /*
     * 绑定手机号
     */
    public function actionBindphone(){
        //检验验证码是否正确
        $code = $this->Verify($_POST['code']);
        if(!$code){
            die(json_encode(['result'=>'error','msg'=>'验证码错误']));
        }
        $model = new Members();
        $member_id = Yii::$app->session['member_id'];
        $info =  $model->updateAll(['phone'=>$_POST['phone']], "id ='{$member_id}'");
        if($info){
            die(json_encode(['result'=>'success']));
        }
    }
    /*
     * 检查验证码,注册微信数据
     */
    public function actionDologin(){
        if($_POST){
            $code = $this->verify($_POST['code']);
            if(!$code){
                die(json_encode(['result'=>'error','msg'=>'验证码错误']));
            }
            $model = new Members();
            $post = Yii::$app->request->post();
            //检查手机号是否已被注册
            $check = $model->find()->asarray()->where(['phone'=>$post['phone']])->count();
            if($check){
                die(json_encode(['result'=>'error','msg'=>'该手机号已被注册']));
            }
            if($post){
                $model->nickname = $post['nickname'];
                if(isset($post['photo'])){
                    //如果是微信,就下载头像到本地
                    $base = Yii::getAlias("@public");
                    $directory = '/wxhead/';
                    $path = $base.$directory;
                    $saveName = time().rand(100,999).rand(100,999).'.png';
                    $filename = $path.$saveName;
                    if (!file_exists($path) && !mkdir($path, 0777, true)) {
                        return false;
                    }
                    $photo = $this->saveWeixinFile($post['photo'], $filename, $path, $saveName);
                    $model->photo = $directory.$saveName;
                }else{
                    $model->photo = '';
                }

                $model->phone = $post['phone'];
                if(isset($post['pwd'])){
                    $model->pwd = md5($post['pwd']);
                }else{
                    $model->openid = "";
                }

                if(isset($post['openid'])){
                    $model->openid = $post['openid'];
                }else{
                    $model->openid = '';
                }
                $model->created = time();
                $info = $model->save();
                $id = $model->id;
                if($info){
                    Yii::$app->session['member_id']=$id;
                    die(json_encode(['result'=>'success']));
                }

            }

        }
    }

		/**
		* 上传图片到服务器
		*/


		function base64imgsave($img){
		//文件夹日期
		$ymd = date("Ymd");
		//图片路径地址
		$basedir = 'upload/base64/'.$ymd.'';
		$fullpath = $basedir;
		if(!is_dir($fullpath)){
		mkdir($fullpath,0777,true);
		}
		$types = empty($types)? array('jpg', 'gif', 'png', 'jpeg'):$types;

		$img = str_replace(array('_','-'), array('/','+'), $img);

		$b64img = substr($img, 0,100);
		if(preg_match('/^(data:\s*image\/(\w+);base64,)/', $b64img, $matches)){
		$type = $matches[2];
		if(!in_array($type, $types)){
		return array('status'=>1,'info'=>'图片格式不正确，只支持 jpg、gif、png、jpeg哦！','url'=>'');
		}
		$img = str_replace($matches[1], '', $img);
		$img = base64_decode($img);
		$photo = '/'.md5(date('YmdHis').rand(1000, 9999)).'.'.$type;
		file_put_contents($fullpath.$photo, $img);
		$ary['status'] = 1;
		$ary['info'] = '保存图片成功';
		$ary['url'] = $basedir.$photo;
		return $ary;
		}
		$ary['status'] = 0;
		$ary['info'] = '请选择要上传的图片';
		return $ary;
		} 

    /**
     * Deletes an existing Members model.
     * If deletion is successful, the browser will be redirected to the 'index' page.
     * @param integer $id
     * @return mixed
     */
    public function actionDelete($id)
    {
        $this->findModel($id)->delete();

        return $this->redirect(['index']);
    }

    protected function findModel($id)
    {
        if (($model = Members::findOne($id)) !== null) {
            return $model;
        } else {
            throw new NotFoundHttpException('The requested page does not exist.');
        }
    }
}
