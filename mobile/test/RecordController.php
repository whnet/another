<?php

namespace mobile\controllers;

use Yii;
use mobile\models\Members;
use mobile\models\Articles;
use mobile\models\Questions;
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
use common\tools\Uploadfile;

use Qiniu\Auth;
use Qiniu\Storage\UploadManager;
use Qiniu\Storage\BucketManager;
use Qiniu\Processing\PersistentFop;
use Qiniu\Processing\Operation;
use Qiniu\base64_urlSafeEncode;
/**
 * MembersController implements the CRUD actions for Members model.
 */
class RecordController extends BaseController
{
    public $enableCsrfValidation = false;

    /*
     * 接受语音
     */
    public function actionVoice(){
        if($_POST){
                $member_id = Yii::$app->session['member_id'];
                $serverId = $_POST['url'];
                $access_token = $this->accessToken();
                $mediaIds = explode(',',$serverId);
                $nums = count($mediaIds);
                for($i=0;$i<$nums;$i++){
                        $url = "http://file.api.weixin.qq.com/cgi-bin/media/get?access_token={$access_token}&media_id={$mediaIds[$i]}";
                        $fileInfo = $this->downloadWeixinFile($url);
                        $base = Yii::getAlias("@public");
                        $directory = '/voices/';
                        $path = $base.$directory;
                        $filename = $path.$mediaIds[$i].'.amr';
                        if (!file_exists($path) && !mkdir($path, 0777, true)) {
                            return;
                        }

                        $this->saveWeixinFile($filename, $fileInfo['body']);
                        $info = $this->upchange($filename,$mediaIds[$i]);

                }
                  $msg = $this->upcombine($serverId,$path);
                die(json_encode(['result'=>'success']));





        }
    }


    /*
     * arm->mp3
     */
    private function upchange($filePath,$mediaid){

        $accessKey = Yii::$app->params['qiniu']['accessKey'];
        $secretKey = Yii::$app->params['qiniu']['secretKey'];
        $bucket = Yii::$app->params['qiniu']['bucket'];
        $pipeline = Yii::$app->params['qiniu']['pipeline'];
        $auth = new Auth($accessKey, $secretKey);
        $uploadMgr = new UploadManager();
        $savekey = \Qiniu\base64_urlSafeEncode($bucket.':'.$mediaid.'.mp3');
        $key = $mediaid.'.amr';
        //转码完成后通知到你的业务服务器。（公网可以访问，并相应200 OK）
        //$notifyUrl = 'http://shequ.211ic.com/record/change_notify.html';
        ////设置转码参数
        //$fops = "avthumb/mp3/ab/320k/ar/44100/acodec/libmp3lame";
        //$fops = $fops.'|saveas/'.$savekey;
        //$policy = array(
        //    'persistentOps' => $fops,
        //    'persistentPipeline' => $pipeline,
        //    'persistentNotifyUrl'=>$notifyUrl,
        //);

        //指定上传转码命令
        //$uptoken = $auth->uploadToken($bucket, null, 3600, $policy);
        $uptoken = $auth->uploadToken($bucket);//只上传
        list($ret, $err) = $uploadMgr->putFile($uptoken, $key, $filePath);


        if ($err !== null) {
            return false;
        }else {
            //$bucketMgr = new BucketManager($auth);
            //$bucketMgr->delete($bucket, $key);
            //return $ret['key'];
        }
    }
    /*
     * 多个音频进行合并
     */
    private function upcombine($serverId,$path){

        $accessKey = Yii::$app->params['qiniu']['accessKey'];
        $secretKey = Yii::$app->params['qiniu']['secretKey'];
        $bucket = Yii::$app->params['qiniu']['bucket'];
        $pipeline = Yii::$app->params['qiniu']['pipeline'];
        $auth = new Auth($accessKey, $secretKey);

        $member_id = Yii::$app->session['member_id'];
        $names = explode(',',$serverId);
        $nums = count($names);
        for($i=0;$i<$nums;$i++) {
            $arr[$i] = $names[$i];
        }

        //得到所有的amr文件,组成一个字符串
        $key = $arr[0].'.amr';
        $voices = '';
        for($i=1;$i<$nums;$i++) {
            if($i != $nums-1){$end = '/';}else{$end = '';}
            $voices .= \Qiniu\base64_urlSafeEncode("http://7xvkxv.com1.z0.glb.clouddn.com/{$arr[$i]}.amr").$end;
        }
        //拼接后的语音名字
        $userVoice = 'user_'.$member_id.'_'.time().rand(100,999);
        $finalName = \Qiniu\base64_urlSafeEncode($bucket.':'.$userVoice.'.mp3');
        $notifyUrl = 'http://shequ.211ic.com/record/combine_notify.html';
       if($nums > 1){
           $fops = "avconcat/2/format/mp3/".$voices;
           $fops = $fops.'|saveas/'.$finalName;
       }else{
           $fops = "avthumb/mp3/ab/320k/ar/44100/acodec/libmp3lame";
           $fops = $fops.'|saveas/'.$finalName;
       }

        $policy = array(
            'persistentOps' => $fops,
            'persistentPipeline' => $pipeline,
            'persistentNotifyUrl'=>$notifyUrl,
        );

        //指定上传转码命令
        $token = $auth->uploadToken($bucket, null, 3600, $policy);
        $pfop = new PersistentFop($auth, $bucket, $pipeline, $notifyUrl);
        list($id, $err) = $pfop->execute($key, $fops);
        if ($err !== null) {
              return false;
         }else {
            //删除合并前的数据
            $names = explode(',',$serverId);
            $nums = count($names);
            if($nums > 1){
                for($i=0;$i<$nums;$i++){
                   unlink($path.$names[$i].'.amr');
                }
            }else{
                unlink($path.$names[0].'.amr');
            }


            //合并完成之后,写入数据库
            //$model = new Comments();
            //$model -> member_id = $member_id;
            //$model->to_member_id = 1;
            //$model->content = $userVoice.'.mp3';
            //$model->save();




            return true;
          }
    }
    /*
     * 微信多媒体下载
     */

    function downloadWeixinFile($url){
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_NOBODY, 0);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE);
        $package = curl_exec($ch);
        $httpinfo = curl_getinfo($ch);
        curl_close($ch);
        $media = array_merge(array('header' => $httpinfo), array('body' => $package));
        return $media;
    }
    /*
     * 保存微信文件
     */
    function saveWeixinFile($filename, $filecontent){
        $local_file = fopen($filename, 'w');
        if(false !== $local_file){
            if(false !==fwrite($local_file, $filecontent)){
                fclose($local_file);
            }
        }
    }
    /*
     * 接受七牛云的异步转码处理结果
     */
    public function actionChange_notify(){
        $notifyBody = file_get_contents('php://input');
        $info = json_decode($notifyBody,true);
        $media = $info['items'][0]['key'];

    }
    /*
     * 接受七牛云的异步合并处理结果
     */
    public function actionCombine_notify(){
        $member_id = Yii::$app->session['member_id'];
        $notifyBody = file_get_contents('php://input');
        $info = json_decode($notifyBody,true);
        $base = Yii::getAlias("@public");
        $directory = '/voices/';
        $path = $base.$directory;
        $media = $info['items'][0]['key'];
        $url = 'http://7xvkxv.com1.z0.glb.clouddn.com/'.$media;
        $fp_output = fopen($path.$media, 'w');
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_FILE, $fp_output);
        curl_exec($ch);
        curl_close($ch);



    }



}














