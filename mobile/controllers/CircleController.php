<?php

namespace mobile\controllers;

use Yii;
use mobile\models\Concerns;
use mobile\models\Dianzan;
use mobile\models\Members;
use mobile\models\Experts;
use mobile\models\Circles;
use mobile\models\Questions;
use mobile\models\Listen;
use mobile\models\Pockets;
use mobile\models\Wxpayrecord;
use mobile\models\Circlemembers;
use common\tools\Uploadfile;
use yii\data\ActiveDataProvider;
use yii\web\Controller;
use yii\web\NotFoundHttpException;
use yii\filters\VerbFilter;
use mobile\controllers\BaseController;
use common\tools\htmls;
use dosamigos\qrcode\QrCode;

use mobile\components\NoCsrf;

//微信支付
use EasyWeChat\Payment\Order;

/**
 * MembersController implements the CRUD actions for Members model.
 */
class CircleController extends BaseController
{
    public function actions(){
        $view = Yii::$app->view;
        $view->params['site'] = htmls::site();
        $view->params['wechat'] = htmls::wechat();
        $view->params['js'] = $this->setJs();

    }
    public function behaviors()
    {
        return [
            'csrf' => [
                'class' => NoCsrf::className(),
                'controller' => $this,
                'actions' => [
                    'notifyfeeuser',
                    'notifyask',
                    'notifyredpack',
                    'notifycircle',
                    'notifylisten',
                ]
            ]
        ];
    }
    /*
     * 我的圈子
     */
    public function actionCircle_my(){
        Yii::$app->session['tryinto'] = Yii::$app->request->getUrl();
        //判断是否登录
        $member_id = Yii::$app->session['member_id'];
        require_once(dirname(dirname(__FILE__)).'/rules/rights.php');
        if(!$member_id){
            Yii::$app->session['tryinto'] = Yii::$app->request->getUrl();
            return $this->redirect('/members/login.html');
        }
        $model = new Circles();
        //会员信息
        $info = Members::find()->asarray()->where(['id'=>$member_id])->with('feeuser')->one();
        //作为VIP创建的圈子个数,从circles中查找,包括审核通过和未通过
        $count = $model->find()->asarray()->where(['member_id'=>$member_id])->count();
        //加入的圈子
        $myCircle = CircleMembers::find()->asarray()
            ->where(['mid'=>$member_id])
            ->andWhere(['status'=>1])
            ->with('circle','user','incircle','expert')
            ->all();

        //我创建的圈子
        $MyCreated = $model->find()->asarray()->where(['member_id'=>$member_id])->with('user','incircle')->orderBy('status ASC')->all();
        //所有圈子的列表
        $creatCircle = $model->find()->asarray()->where(['member_id'=>$member_id])->andWhere(['status'=>1])->with('user')->count();

        //推荐圈子，除了已经关注和自己创建的其他圈子, where 不等于一个数组 In, 使用hasMany 查出有多少会员
        $filterMy = [];
        $filterCreated = [];
        if($myCircle){
            foreach($myCircle as $k=>$v){
                $filterMy[] = $v['cid'];
            }
        }
        if($MyCreated){
            foreach($MyCreated as $k=>$v){
                $filterCreated[] = $v['id'];
            }
        }
        //END
        $filter = array_merge($filterMy, $filterCreated);


        $recCircles = $model->find()->asarray()
            ->with('user','incircle','expert')
            ->where(['status'=>1])
            ->andWhere(['not in','id',$filter])
            ->all();

        return $this->render('circle_my',[
            'info'=>$info,
            'count'=>$count,
            'myCircle'=>$myCircle,
            'MyCreated'=>$MyCreated,
            'recCircles'=>$recCircles,
        ]);
    }
    public function actionCircle_creat(){
        Yii::$app->session['tryinto'] = Yii::$app->request->getUrl();
        //判断是否登录
        $feeuser = Yii::$app->session['feeuser'];
        $member_id = Yii::$app->session['member_id'];
        require_once(dirname(dirname(__FILE__)).'/rules/rights.php');
        if(!$member_id){
            Yii::$app->session['tryinto'] = Yii::$app->request->getUrl();
            return $this->redirect('/members/login.html');
        }
        if(!$feeuser){
            Yii::$app->session['tryinto'] = Yii::$app->request->getUrl();
            return $this->redirect('/site/index.html');
        }
        $model = new Circles();
        //判断是否是专家或群管,只有这两个身份才能创建圈子
        $mInfo = Members::find()->asarray()->where(['id'=>$member_id])->one();
        $expertInfo = Experts::find()->asarray()->where(['member_id'=>$member_id])->one();

        if($mInfo['isguanjia'] == 1){//管家可以创建无数个圈子

        }elseif($expertInfo['vip'] == 1){//专家只可以创建一个圈子
            $circleNums = $model->find()->asarray()->where(['member_id'=>$member_id])->count();
            if($circleNums > 1){
                return $this->redirect('/circle/circle_my.html?from=index');
            }
        }else{//如果不是这两个身份就退回到首页
            return $this->redirect('/circle/circle_my.html?from=index');
        }

        $post = Yii::$app->request->post();
        if($post){
           $model->member_id = Yii::$app->session['member_id'];
           $model->name = $post['name'];
           $model->des = $post['summary'];
           $model->logo = $post['logo'];
           $model->feetype = $post['feeType'];
           $model->joinprice = $post['joinPrice'];
           $model->created = time();
           $model->save();
           $id = $model->id;
           if($id){
               die(json_encode(['result'=>'success','id'=>$id]));
           }
        }
        return $this->render('circle_creat');
    }
    /*
     * 上传圈子图片
     */
    public function actionUpload(){
        $uploader = new Uploadfile();
        $base = Yii::getAlias("@public");
        $directory = '/circles/';
        $path = $base.$directory;
        $img = $directory.$uploader->base64_images($_POST['file'],$path);
        $file = Yii::$app->params['public'].'/attachment';
        die(json_encode(['result'=>'success','img'=>$img,'file'=>$file]));
    }

    /*
     * 圈子信息
     */
    public function actionCircle_page(){
        //判断是否登录
        Yii::$app->session['tryinto'] = Yii::$app->request->getUrl();
        $member_id = Yii::$app->session['member_id'];
        require_once(dirname(dirname(__FILE__)).'/rules/rights.php');
        if(!$member_id){
            Yii::$app->session['tryinto'] = Yii::$app->request->getUrl();
            return $this->redirect('/members/login.html');
        }

        //查找会员是否在指定的圈子中
        $circleModel = new Circlemembers();
        $circleInfo = $circleModel->find()->asarray()
	        ->where(['mid'=>$member_id,'cid'=>$_GET['id']])
	        ->with('user','expert')
	        ->one();
        //如果圈子收费，未加入了圈子，不是作者自己
        $model = new Circles();
        $info = $model->find()->asarray()->with('user','expert')->where(['id'=>$_GET['id']])->one();
        if( ($info['user']['id'] != $member_id) &&  (!$circleInfo) ){
            return $this->redirect('/circle/circle_share_detail.html?id='.$_GET['id']);
        }
       //$info['member_id'] == $member_id 就隐藏掉提问按钮
        //加入圈子的人数
        $allCircleMembers = $circleModel->find()->where(['cid'=>$_GET['id']])->all();
        $nums = count($allCircleMembers);
        return $this->render('circle_page',[
            'info'=>$info,
            'circleInfo'=>$circleInfo,
            'nums'=>$nums,
            'mid'=>$member_id,
        ]);
    }
    //查询圈子是否到期
    public function actionDeadtime(){
        $member_id = Yii::$app->session['member_id'];
        //判断加入圈子的类型，主要判断按年付费的是否到期
        $info =Circles::find()->asarray()->where(['id'=>$_POST['id']])->one();
        $quanzhu = $info['member_id'];

        if($info['feetype'] == 1 && $member_id !=$quanzhu){
            //如果是付费圈子就做判断是否支付成功,圈主除外
            $Circlemembers = Circlemembers::find()->asarray()->where(['mid'=>$member_id,'cid'=>$_POST['id']])->andWhere(['status'=>1])->one();
            if(!empty($Circlemembers)){
                die(json_encode(['result'=>'paying','msg'=>'支付结果确认中,请稍候','code'=>$Circlemembers['id'], 'status'=>$Circlemembers['status'] ]));
            }else{
                die(json_encode(['result'=>'paying','msg'=>'支付失败','code'=>0 ,'status'=>0]));
            }

            $addCircleDate = Wxpayrecord::find()->where(['mid'=>$member_id,'pay_id'=>$_POST['id']])->asarray()->one();
            $addTime = $addCircleDate['created'];
            $nowTime = time();
            if($nowTime - $addTime > 365 * 24 * 7200){
                //删除circleMembers中的记录
                $info =Circlemembers::findOne(['mid'=>$member_id,'cid'=>$_POST['id']])->delete();
                if($info){
                    die(json_encode(['result'=>'dead','msg'=>'圈子到期了，请续费']));
                }

             }
        }else{//0免费 1按年付费 2付费后永久免费
            die(json_encode(['result'=>'notyear','msg'=>'']));
        }


    }
    //支付失败后，删除status = 0 的记录
    public function actionTodelete(){
        $mid = Yii::$app->session['member_id'];
        $cid = $_POST['id'];
        $models = new Circlemembers();
        $info = $models->findOne(['mid'=>$mid,'cid'=>$cid, 'status'=>0])->delete();
        die(json_encode(['result'=>'success','msg'=>'成功']));
    }
    //查询是否支付成功,忘了从哪使用这个方法了
    public function actionTocommit(){
        $mid = Yii::$app->session['member_id'];
        $cid = $_POST['id'];
        $models = new Circlemembers();
        $info = $models->find()-asarray()->where(['mid'=>$mid,'cid'=>$cid])->andWhere(['status'=>1])->one();
        if(!empty($info)){
            if($info['status'] == 1){
                die(json_encode(['result'=>'success','msg'=>'支付确认成功']));
            }else{
                die(json_encode(['result'=>'error','msg'=>'支付确认失败']));
            }
        }

    }
    public function actionAddcircle(){
        //判断是否登录
        $member_id = Yii::$app->session['member_id'];
        if(!$member_id){
            Yii::$app->session['tryinto'] = Yii::$app->request->getUrl();
            return $this->redirect('/members/login.html');
        }
        $model = new Circlemembers();
        if(!$member_id){
            return false;
        }
        $post = Yii::$app->request->post();
        $model->mid = $member_id;
        $model->cid = $post['cid'];
        $model->qid = $post['qid'];
        $model->price = $post['price'];
        $model->trade = isset($post['trade'])?$post['trade']:0;
        if($post['trade'] == 0){
            $model->status = 1;
        }else{
            $model->status = 0;
        }

        $model->created = time();
        $model->save();
        die(json_encode(['status'=>'success']));
    }

    public function actionCircle_qanda_questions(){
        //判断是否登录
        $member_id = Yii::$app->session['member_id'];
        require_once(dirname(dirname(__FILE__)).'/rules/rights.php');
        if(!$member_id){
            Yii::$app->session['tryinto'] = Yii::$app->request->getUrl();
            return $this->redirect('/members/login.html');
        }
        $model = new Members();
        $info = $model->find()->asarray()->where(['id'=>$_GET['mid']])->one();

        //获取是否已经关注
        $foucs = Concerns::find()->asarray()->where(['mid'=>$member_id,'to_mid'=>$info['id']])->one();
        //获取已关注的人数
        $concerns = Concerns::find()->where(['to_mid'=>$info['id']])->count();
        return $this->render('circle_qanda_questions',[
            'info'=>$info,
            'foucs'=>$foucs,
            'concerns'=>$concerns,
            'member_id'=>$member_id,
        ]);
    }
    /*
     * 查看圈子成员
     */
    public function actionCircle_members(){
        //判断是否登录
        $member_id = Yii::$app->session['member_id'];
        if(!$member_id){
            Yii::$app->session['tryinto'] = Yii::$app->request->getUrl();
            return $this->redirect('/members/login.html');
        }
        $circleMembers = new Circlemembers();
        $members = $circleMembers->find()->asarray()->with('user')->where(['cid'=>$_GET['id']])->all();
        return $this->render('circle_members',['members'=>$members]);
    }
    /*
     * 查看圈子成员及相关信息
     */
    public function actionCircle_data_expert(){
        //判断是否登录
        $member_id = Yii::$app->session['member_id'];
        if(!$member_id){
            Yii::$app->session['tryinto'] = Yii::$app->request->getUrl();
            return $this->redirect('/members/login.html');
        }
        $model = new Circles();
        $info = $model->find()->asarray()->with('user')->where(['id'=>$_GET['id']])->one();
        //圈子成员头像
        $circleMembers = new Circlemembers();
        $members = $circleMembers->find()->asarray()->with('user')->where(['cid'=>$_GET['id']])->all();
        $nums = count($members);
        //个人信息
        $userModel = new Members();
        $user = $userModel->find()->where(['id'=>$member_id])->one();
        return $this->render('circle_data_expert',[
            'info'=>$info,
            'members'=>$members,
            'user'=>$user,
            'nums'=>$nums,
            'member_id'=>$member_id,
        ]);
    }
    /*
     * 退出圈子
     */
    public function actionExitcircle(){
        //判断是否登录
        $member_id = Yii::$app->session['member_id'];
        if(!$member_id){
            Yii::$app->session['tryinto'] = Yii::$app->request->getUrl();
            return $this->redirect('/members/login.html');
        }
        $model = new Circlemembers();
        $info = $model->findOne(['mid'=>$member_id,'cid'=>$_POST['id']])->delete();
        die(json_encode(['result'=>'success']));
    }
    public function actionCircle_data_name_edit(){
        //判断是否登录
        $member_id = Yii::$app->session['member_id'];
        if(!$member_id){
            Yii::$app->session['tryinto'] = Yii::$app->request->getUrl();
            return $this->redirect('/members/login.html');
        }
        return $this->render('circle_data_name_edit');
    }
    /*
     * 付费加入圈子，其实免费的也可以，这里调用微信
     */
    public function actionCircle_share_detail(){
//        require_once(dirname(dirname(__FILE__)).'/rules/rights.php');
        $member_id = Yii::$app->session['member_id'];
        $memberInfo = Members::find()->asarray()->where(['id'=>$member_id])->one();
        if(!$member_id){
            Yii::$app->session['tryinto'] = Yii::$app->request->getUrl();
            return $this->redirect('/members/login.html');
        }
        $feeuser = Yii::$app->session['feeuser'];
        $model = new Circlemembers();
        $info = $model->find()->asarray()->where(['cid'=>$_GET['id'],'mid'=>$member_id])->andWhere(['status'=>1])->one();
        if(($info) ){
            return $this->redirect('/circle/circle_page.html?id='.$_GET['id']);
        }
        $model = new Circles();
        $info = $model->find()->asarray()->with('user','expert')->where(['id'=>$_GET['id']])->one();

        //圈子成员
        $circleMembers = new Circlemembers();
        $members = $circleMembers->find()->asarray()->with('user')->where(['cid'=>$_GET['id']])->all();

        return $this->render('circle_share_detail',['info'=>$info,'members'=>$members]);
    }
    
    public function actionCircle_file_release(){
        require_once(dirname(dirname(__FILE__)).'/rules/rights.php');
        //获取话题类别
        $type = htmls::getPiece('topictype');
        return $this->render('circle_file_release',['type'=>$type]);
    }
    /*
     * 成为全局的付费会员
     */
    public function actionFeeuser(){
		//如果没有设置会员就不能查看这个页面
	    $fee = htmls::site();
	    if($fee['price'] == '0.00'){
		    return $this->redirect('/members/index.html');
	    }
        Yii::$app->session['tryinto'] = Yii::$app->request->getUrl();
        require_once(dirname(dirname(__FILE__)).'/rules/rights.php');
        $member_id = Yii::$app->session['member_id'];
        $preurl = Yii::$app->session['tryinto'];
        //如果是会员就跳转到会员中心
        $info = Members::find()->asarray()->where(['id' => $member_id])->one();
        $time = time() - $info['feetime'];
        if ($info['feeuser'] == 1 && $time < 365 * 24 * 3600) {
            Yii::$app->session['feeuser'] = 1;
            //是会员就不让看到这个页面
            return $this->redirect('/members/index.html');
        }
	    
        return $this->render('feeuser',[
            'mid'=> $member_id,
            'preurl'=> $preurl,
            'feeUser'=> htmls::site(),
        ]);
    }
    /*
     * 圈子中的问答详情
     */
    public function actionCircle_qanda_detail(){
        //判断是否登录
        $member_id = Yii::$app->session['member_id'];
        if(!$member_id){
            Yii::$app->session['tryinto'] = Yii::$app->request->getUrl();
            return $this->redirect('/members/login.html');
        }
        return $this->render('circle_qanda_detail');
    }
    /*
     * 微信支付相关
     */
    public function actionWxpay(){
        $title = $_POST['title'];
        $price = $_POST['price'];
        $pay_id = $_POST['pay_id'];
        //当前用户的openid
        $cookie = Yii::$app->request->cookies;
        $openid = $cookie->getValue('openid');
        //获取微信配置
        $payment = $this->wxPay();
        $rand = time().rand(100,999).rand(1,999);
       if($title == 'redpack'){
           $circleNotifyUrl = Yii::$app->params['notifyUrl'].'/circle/notifyredpack.html';
       }elseif($title == 'feeuser'){
            $circleNotifyUrl = Yii::$app->params['notifyUrl'].'/circle/notifyfeeuser.html';
       }elseif($title == 'ask'){
            $circleNotifyUrl = Yii::$app->params['notifyUrl'].'/circle/notifyask.html';
       }elseif($title == 'circle'){
           $circleNotifyUrl = Yii::$app->params['notifyUrl'].'/circle/notifycircle.html';
       }elseif($title == 'listen'){
	       $circleNotifyUrl = Yii::$app->params['notifyUrl'].'/circle/notifylisten.html';
       }
        $attributes = [
            'trade_type'       => 'JSAPI', // JSAPI，NATIVE，APP...
            'body'             => $title,
            'detail'           => $title,
            'out_trade_no'     => $rand,
            'total_fee'        => $price, // 单位：分
            'notify_url'       => $circleNotifyUrl,
            'openid'           => $openid,
        ];
        $order = new Order($attributes);

        $result = $payment->prepare($order);
        if ($result->return_code == 'SUCCESS' && $result->result_code == 'SUCCESS'){
            $prepayId = $result->prepay_id;
        }else{
            die($result->return_msg);
        }

        $config = $payment->configForJSSDKPayment($prepayId, false);
        if($config){
            //在支付记录数据库中新增数据，状态为0,回调通知成功后再变为1
            $member_id = Yii::$app->session['member_id'];
            $model = new Wxpayrecord();
            $model->mid = $member_id;
            $model->pay_id = $pay_id;
            $model->price = $price/100;
            $model->pay_type = $title;
            $model->trade = $rand;
            $model->created = time();
            $model->status = 0;
            $model->save();
            //将members中此会员的feeuser变为1,或者在notiyUrl中根据openid更新
        }
        die(json_encode(['result'=>'success','config'=>$config,'trade'=>$rand]));

    }
    /*
     * notify_url,需要在NoCsrf 中把csrf关闭
     */
    public function actionNotifyask(){//问题表
        $payment = $this->wxPay();
        $response = $payment->handleNotify(function($notify, $successful){
            if($successful){
                //更新账单表
                $model = new Wxpayrecord();
                $model->updateAll(['status' => 1], "trade ={$notify['out_trade_no']}");
                //更新问题表中的status
                $QuestionModel = new Questions();
                $id = $QuestionModel->updateAll(['status' => 1], "trade ={$notify['out_trade_no']}");
                if($id){
                    return true;
                }else{
                    return false;
                }
            }

        });
        $response->send();

    }
	public function actionNotifylisten(){
		$payment = $this->wxPay();
		$response = $payment->handleNotify(function($notify, $successful){
			if($successful){
				//更新账单表
				$model = new Wxpayrecord();
				$result = $model->updateAll(['status' => 1], ['trade'=>$notify['out_trade_no'],'status'=>0]);
				// 找到收听问题的id
				$listen = $model->find()->asarray()->where(['trade'=>$notify['out_trade_no']])->one();
				//更新问题表中的status
				if($result){
					$ListenModel = new Listen();
					$ListenModel->question_id = $listen['pay_id'];
					$ListenModel->member_id = $listen['mid'];
					$ListenModel->created = time();
					$id = $ListenModel->save();
					if($id){
						return true;
					}else{
						return false;
					}
				}else{
					return false;
				}
			}
			
		});
		$response->send();
		
	}
    //feeuser的异步通知
    public function actionNotifyfeeuser(){//付费会员表
        $payment = $this->wxPay();
        $response = $payment->handleNotify(function($notify, $successful){
            if($successful){
                //更新账单表
                $model = new Wxpayrecord();
                $model->updateAll(['status' => 1], "trade ={$notify['out_trade_no']}");

                //同时根据openid更新members表中feeuser状态
                $memberModel = new Members();
                $id = $memberModel->updateAll(['feeuser' => 1, 'feetime'=>time()], "openid ='{$notify['openid']}'");
                if($id){
                    return true;
                }else{
                    return false;
                }


            }

        });
        $response->send();

    }
    //redpack 红包支付
    public function actionNotifyredpack(){//红包表,列表只显示status中为1的，首页列表、论坛列表、和圈子中三个地方
        $payment = $this->wxPay();
        $response = $payment->handleNotify(function($notify, $successful){
            if($successful){
                //更新账单表
                $model = new Wxpayrecord();
                $model->updateAll(['status' => 1], "trade ={$notify['out_trade_no']}");

                //同时根据trade更新pockets表中status状态
                $pocketsModel = new Pockets();
                $id =  $pocketsModel->updateAll(['status' => 1], "trade ={$notify['out_trade_no']}");
                if($id){
                    return true;
                }else{
                    return false;
                }


            }

        });
        $response->send();

    }
    //加入圈子
    public function actionNotifycircle(){
        $payment = $this->wxPay();
        $response = $payment->handleNotify(function($notify, $successful){
            if($successful){

                //更新账单表
                $model = new Wxpayrecord();
                $model->updateAll(['status' => 1], "trade ={$notify['out_trade_no']}");

                //同时根据trade更新pockets表中status状态
                $circleMemberModel = new Circlemembers();
                $id =  $circleMemberModel->updateAll(['status' => 1], "trade ={$notify['out_trade_no']}");
                if($id){
                    return true;
                }else{
                    return false;
                }

            }

        });
        $response->send();

    }





}