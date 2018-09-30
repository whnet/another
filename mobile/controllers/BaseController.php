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

class BaseController extends Controller{
	
    public function actions()
    {
        if(stripos($_SERVER['HTTP_USER_AGENT'], 'MicroMessenger')) {
            $view = Yii::$app->view;
            $view->params['js'] = $this->setJs();
        }
    }

    /*
     * @网页授权，配置文件在params.php中
     * 使用了session保存访问的URL，之后获取信息后跳转到这个地址。
     */
	
    public function startWx(){
        $session = Yii::$app->session;
        $app = new Application(Yii::$app->params['wechat']);
        $oauth = $app->oauth;
	    $cookie = Yii::$app->request->cookies;
	    $cookies_openid = $cookie->getValue('openid')?$cookie->getValue('openid'):'';
	    if(empty($cookies_openid)){
	        if(empty(Yii::$app->session['profile'])) {
		        Yii::$app->session['profile'] = 'profile';
		        $oauth->redirect()->send();//发起授权
	        }else{
		        if (!isset($_GET['code'])) {
			        $cookie = Yii::$app->request->cookies->get('openid');
			        Yii::$app->response->getCookies()->remove($cookie);
			        Yii::$app->session['profile'] = '';
			        $oauth->redirect()->send();
			        exit();
		        }
		        $user = $app->oauth->user();//获取已授权用户
		        $setCookies = Yii::$app->response->cookies;
		        $setCookies->add(new \yii\web\Cookie([
			        'name' => 'openid',
			        'value' => $user["id"],
			        'expire' => time() + 3600*30,
		        ]));
		        //考虑在这里获取图片,避免保存cookie,在这里直接写入微信的相关信息
		        $model = new Members();
		        $info = $model->find()->asarray()->where(['openid'=>$user['id']])->one();
		        if(!$info){
			        $model->photo = $user['avatar'];
			        $model->nickname = $user['nickname'];
			        $model->openid = $user['id'];
			        $model->save();
		        }else{ //update ，这里判断是否更新过头像
			        $if_edit_photo = strstr($info['photo'],'wxhead');
			        if($if_edit_photo){ // 只更新昵称，保留原来的上传头像
				        $model->updateAll([
					        'nickname' => $user['nickname'],
				        ], 'id ='.$info['id']);
			        }else{
				        $model->updateAll([
					        'nickname' => $user['nickname'],
					        'photo' => $user['avatar'],
				        ], 'id ='.$info['id']);
			        }
		        }
		        return $this->redirect(Yii::$app->session['tryinto']);
				//return $this->redirect(Yii::$app->params['wechat']['oauth']['callback']);
	        }
	    }
    }

    /*
     * @网页分享设置，配置文件在params.php中
     * 使用了session保存访问的URL，之后获取信息后跳转到这个地址。
     */
    public function setJs(){
        $app = new Application(Yii::$app->params['wechat']);
        $js = $app->js;
        $ticket = $js->ticket();
        return $js;

    }
    /*
     * 这个单独获得token,在上面就可以获得token
     */
    public function accessToken(){
        $app = new Application(Yii::$app->params['wechat']);
        $accessToken = $app->access_token;
        $token = $accessToken->getToken();
        return $token;

    }
    /*
     *微信支付
     */
    public function wxPay(){
        $app = new Application(Yii::$app->params['wechat']);
        $payment = $app->payment;
        return $payment;
    }
    /*
     * 下载微信头像到本地
     */
    public function toSaveWechatInfo($openid,$nickname,$headimgurl){
        //如果是微信,就下载头像到本地,并保存到数据库中
        $model = new Members();
        $base = Yii::getAlias("@public");
        $directory = '/wxhead/';
        $path = $base.$directory;
        $saveName = time().rand(100,999).rand(100,999).'.png';
        $filename = $path.$saveName;

        if (!file_exists($path) && !mkdir($path, 0777, true)) {
            return false;
        }
         $info = $model->find()->asarray()->where(['openid'=>$openid])->one();
        if(!$info){
            $this->saveWeixinFilecompress($headimgurl, $filename, $path, $saveName);
            $model->photo = $directory.$saveName;
            $model->nickname = $nickname;
            $model->openid = $openid;
            $model->save();
        }else{ //update
            $model->updateAll([
                'nickname' => $nickname,
            ], 'id ='.$info['id']);
        }
    }


    /*
    * 下载微信远程头像到本地,这样避免做判断
    */
    function saveWeixinFile($img, $filename, $path, $saveName){
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_POST, 0);
        curl_setopt($ch,CURLOPT_URL,$img);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $file_content = curl_exec($ch);
        curl_close($ch);
        $downloaded_file = fopen($path.$saveName, 'w');
        fwrite($downloaded_file, $file_content);

        $compress = new Imagecompress($filename, 0.4);
        $compress->compressImg($filename);

        fclose($downloaded_file);
        return true;
    }
    function saveWeixinFilecompress($img, $filename, $path, $saveName){
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_POST, 0);
        curl_setopt($ch,CURLOPT_URL,$img);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $file_content = curl_exec($ch);
        curl_close($ch);
        $downloaded_file = fopen($saveName, 'w');
        fwrite($downloaded_file, $file_content);
        fclose($downloaded_file);
        return true;
    }
    /*
     * 验证短信验证码
     */
    public function Verify($code){
        $model = new Codes();
        $info = $model->find()->where(['code'=>$code])->one();
        $time = time() - $info['created'];
        if($info['created']){
            if( $time > 180){
                return false;
            }else{
                $model->updateAll(['status'=>1], "code ='{$code}'");
                return true;
            }
        }else{
            return false;
        }


    }
    //从微信上下载图片

    public function actionDownlodimg(){
        //从服务端获取access_token 和 openid
        $serverId = Yii::$app->request->post('serverId');
        if($serverId){
            $app = new Application(Yii::$app->params['wechat']);
            $accessToken = $app->access_token;
            $access_token = $accessToken->getToken();

            $url = "http://file.api.weixin.qq.com/cgi-bin/media/get?access_token={$access_token}&media_id={$serverId}";
            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_HEADER, 0);
            curl_setopt($ch, CURLOPT_NOBODY, 0);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            $package = curl_exec($ch);
            $httpinfo = curl_getinfo($ch);

            curl_close($ch);
            $media = array_merge(array('mediaBody' => $package), $httpinfo);

            //求出文件格式
            preg_match('/\w\/(\w+)/i', $media["content_type"], $extmatches);
            $fileExt = $extmatches[1];
            $filename = time().rand(100,999).".{$fileExt}";

            $base = Yii::getAlias("@public");
            $directory = '/expert/';
            $path = $base.$directory;
            if(!file_exists($path)){
                mkdir($path,0777,true);
            }
            file_put_contents($path.$filename,$media['mediaBody']);
            $downloadImg =  $directory.$filename;
            //完整的路径
            $fullUrl = Yii::$app->params['public'].'/attachment';

            die(json_encode([
                'status'=>'success',
                'filename'=>$downloadImg,
                'url'=>$fullUrl,
            ]));
        }
    }
    //从微信上下载图片END















}