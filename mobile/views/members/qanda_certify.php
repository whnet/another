<?php

use yii\helpers\Html;
use yii\grid\GridView;

$this->params['breadcrumbs'][] = $this->title;
?>
<link type="text/css" rel="stylesheet" href="../bdt/css/user.min.css">
<link type="text/css" rel="stylesheet" href="../bdt/css/cropper.css">
<script type="text/javascript" src="../bdt/js/qanda_certify.js"></script>
<body class=" bg-greyfa" >
<div id="container" class="container">
    <div id="page">
        <!--页面导航栏-->
        <div class="page__hd bg-white b-b-grey fc-black">
            <div class="statebar">
                <a class="nav-act left-act" onclick="goBack();"><img src="../bdt/images/nav_icon_back1.png"></a>
                <a class="nav-act left-act" id="modifyPicPage" onclick="goBack();" style="display:none;"><img src="../bdt/images/nav_icon_back1.png"></a>
                <h2 class="fs34">专家认证</h2>
                <a class="but_save fs28 fc-black sure-btn" id="sure-btn" style="display:none;">保存</a>
            </div>
        </div>
        <div class="page__bd">
            <div class="top-space1"></div>
            <div class="qanda-certify">
                <!--头像姓名-->
                <div class="qanda-certify-info bg-white">
                    <em class="mt20 bc-grey"><i class="bg-greyf1" id="headPic">
                            <img src="<?=$info['photo']?>"></i></em>
                    <span class="fs30 fc-greyabc mb10"><?=$info['nickname']?></span>
                </div>
                    <!--第一次申请时的方法-->
                    <div class="qanda-certify-item bg-white mt10">
                        <h3 class="fs32 fc-grey666">真实姓名</h3>
                        <input id="masterRealName" onkeyup="masterRealName(this)" class="fc-black456 fs30"  placeholder="请输入您的真实姓名" value="<?=$apply['realname']?>" style="border:none;width:90%;"/>
                        <span class="fs30 fc-greyabc"><i id="masterRealNameCount">0</i>/<span id="masterRealName_maxInputLength">10</span></span>
                    </div>
                    <div class="qanda-certify-item bg-white mt10">
                        <h3 class="fs32 fc-grey666">头衔</h3>
                        <input id="masterTitle" onkeyup="masterTitle(this)" class="fc-black456 fs30"  placeholder="请输入您的头衔" value="<?=$apply['honor']?>" style="border:none;width:85%;"/>
                        <span class="fs30 fc-greyabc"><i id="masterTitleCount">0</i>/<span id="masterTitle_maxInputLength">100</span></span>
                    </div>
                    <div class="qanda-certify-item bg-white mt10">
                        <h3 class="fs32 fc-grey666">简介</h3>
                        <textarea id="masterInfo" onkeyup="masterInfo(this)"
                                  class="fc-black456 fs30" rows="4" placeholder="请输入您的简介"><?=str_replace("<br/>","\n",$apply['des'])?></textarea>
                        <span class="fs30 fc-greyabc"><i id="masterInfoCount">0</i>/<span id="masterInfo_maxInputLength">1000</span></span>
                    </div>
                    <div class="qanda-certify-rights bg-white mt10">
                        <div class="fs30 fc-grey999">
                            向我提问需要支付
                            <input id="askPrice" onkeyup="num(this)" type="text"
                                   class="bg-greyf1 fc-orange fs30 ml10 mr10" placeholder="￥0-1000" value="<?=$apply['price']?>"> 元
                            <a class="fc-orange">收费规则</a>
                        </div>
                    </div>
                    <!--第一次申请时的方法END-->
                <div class="qanda-certify-item bg-white mt10" style="border:none">
                    <h3 class="fs32 fc-grey666">类别<span class="fs28 fc-orange">（请选择认证类别）</span></h3>
                    <div class="fs28 select-type">
			            <?php foreach($type as $k=>$v):?>
				            <?php if(isset($apply)):?>
					            <?php if(in_array($v['id'],$type_id)):?>
                                    <a class="publishtype bg-grey publishcolor" data-type="<?=$v['id'];?>"><?=$v['name'];?></a>
					            <?php else:?>
                                    <a class="publishtype bg-grey " data-type="<?=$v['id'];?>"><?=$v['name'];?></a>
					            <?php endif;?>
				            <?php else: ?>
                                <a class="publishtype bg-grey" data-type="<?=$v['id'];?>"><?=$v['name'];?></a>
				            <?php endif;?>
			            <?php endforeach;?>
                    </div>
                    <input type="hidden" name="mid" value="<?=$apply['member_id']?>">
                </div>
                <!--名片上传-->
                <div class="qanda-certify-item bg-white mt10">
                    <?php if(isset($apply['card'])):?>
                        <h3 class="fs32 fc-grey999" id="certifiedPicTips">当前名片<span class='fs28 fc-orange'>（点击可重新上传名片）</span></h3>
                        <div class="upload-card bc-grey upload-card-ok cardUpload" id="certifiedPic" style="display:block;">
                            <img src="<?=Yii::$app->params['public'].'/attachment'.$apply['card']?>">
                        </div>
                    <?php else:?>
                        <h3 class="fs32 fc-grey999" id="certifiedPicTips">申请专家认证<span class="fs28 fc-orange">（清晰的名片更容易通过审核）</span></h3>
                        <div class="upload-card bc-grey" id="uploadCertifiedPic" style="display:block;">
                            <a class="uploadCertifiedPic cardUpload"  id="cardUpload">
                                <span class="bg-greyf1"></span>
                                <span class="bg-greyf1"></span>
                            </a>
                            <p class="fs30 fc-greyabc mt10">上传名片</p>
                        </div>
                        <div class="upload-card bc-grey upload-card-ok cardUpload" id="certifiedPic" style="display:none;">
                            <img src="<?=Yii::$app->params['public'].'/attachment'.$apply['card']?>">
                        </div>
                    <?php endif;?>
                    <input type="hidden" name="uploadCertifiedPic" value="<?=$apply['card']?>"/>
                </div>
                <?php if($apply['realname']):?>
                    <a class="qanda-certify-postbtn bg-orange fc-white fs30" onclick="applyMasterMethods()">确认修改</a>
                <?php else:?>
                    <a class="qanda-certify-postbtn bg-orange fc-white fs30" onclick="applyMasterMethods()">申请成为专家</a>
                <?php endif;?>
                <p>
                    <label id="protocolLabel" class="fs24">
                        <input id="aggre" type="checkbox" class="bg-greyf1 mr5" checked="true">我已阅读并同意
                    </label>
                    <a class="fc-orange fs24" id="manage-text" style="margin-top:0">《律乎认证用户管理条例》</a>
                </p>
            </div>
            <div class="bottom-space1"></div>
        </div>
    </div>
</div>
<!--弹出手机号验证-->
<div class="phone_dialog" style="display:none;">
    <div class="appui-mask"></div>
    <div class="phone-dialog-con bg-white">
        <h2 class="fs36 fwb fc-red mt5">手机验证</h2>
        <p class="fs28 fc-black mt10">完成手机验证即可成为专家！</p>
        <form>
            <input type="number" class="mt20 fs30 fc-black bg-white bc-grey" id="phoneInput" placeholder="请输入手机号">
            <input type="number" class="mt10 fs30 fc-black bg-white bc-grey" id="codeInput" placeholder="请输入验证码">
            <input type="button" id="btnSendCode" class="mt10 fs30 fc-black bg-grey" value="发送验证码">
            <a id="verify" class="mt20 fs30 fc-white bg-red">立刻验证</a>
        </form>
        <a class="phone_dialog_close bg-white" id="closeID"><img src="../bdt/images/nav_icon_close1.png"></a>
    </div>
</div>
<div class="waitLoad" style="display:none;">
    <img src="../bdt/images/uploading1.gif">
</div>
<div class="waitUpload" style="display:none;">
    <img src="../bdt/images/uploading.gif">
</div>
<div class="upload-container bg-black123">
    <div class="row">
        <div class="col-md-9">
            <div class="img-container" id="img-container">
                <img src="" alt="Picture" id="image" class="cropper-hidden">
                <div class="cropper-container"><div class="cropper-wrap-box">
                        <div class="cropper-canvas" >
                            <img src="">
                        </div></div>
                    <div class="cropper-drag-box cropper-modal cropper-move"></div>
                    <div class="cropper-crop-box">
                        <span class="cropper-view-box">
                            <img src=""></span>
                        <span class="cropper-dashed dashed-h"></span>
                        <span class="cropper-dashed dashed-v"></span>
                        <span class="cropper-center"></span>
                        <span class="cropper-face cropper-move"></span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!--弹出的解释说明-->
<div class="js_dialog" style="display:none;">
    <div class="appui-mask"></div>
    <div class="appui-helptext bg-white" id="helptext1" style="display:none;">
        <h2 class="appui-helptext-hd fs32 fc-black b-b-grey">收费规则</h2>
        <div class="appui-helptext-bd fc-black456 b-b-grey">
            <div class="appui-helptext-bd-con" style="font-size:16px;text-align:center;">
                <?=$this->params['site']['guize'];?>
            </div>
        </div>
        <h2 class="appui-helptext-fd fs32">知道了</h2>
    </div>
    <div class="appui-helptext bg-white" id="helptext5" style="display:none;">
        <h2 class="appui-helptext-hd fs32 fc-black b-b-grey">认证用户管理条例</h2>
        <div class="appui-helptext-bd fc-black456 b-b-grey">
            <div class="appui-helptext-bd-con"><?=$this->params['site']['guanli'];?></div>
        </div>
        <h2 class="appui-helptext-fd fs32">知道了</h2>
    </div>
</div>
<script>
    $('.qanda-certify-rights div a').each(function(index, element) {
        $(this).click(function(e) {
            var id = index + 1;
            setTimeout(function() {
                $('.js_dialog').show();
                $('#helptext' + id).show();
                $('#helptext' + id).css('margin-top', -$('#helptext' + id).height() / 2);
                if ($('#helptext' + id).height() >= Math.floor($('body').height() * 0.70)) {
                    $('#helptext' + id).find('.appui-helptext-bd').height($('#helptext' + id).height() - $('.appui-helptext-hd').height() - $('.appui-helptext-fd').height());
                }
            }, 1000);

        });
    });

    $('#manage-text').click(function(e) {
        var id = 5;
        setTimeout(function() {
            $('.js_dialog').show();
            $('#helptext' + id).show();
            $('#helptext' + id).css('margin-top', -$('#helptext' + id).height() / 2);
            if ($('#helptext' + id).height() >= Math.floor($('body').height() * 0.70)) {
                $('#helptext' + id).find('.appui-helptext-bd').height($('#helptext' + id).height() - $('.appui-helptext-hd').height() - $('.appui-helptext-fd').height());
            }
        }, 1000);
    });

    $('.appui-helptext-fd').each(function(index, element) {
        $(this).click(function(e) {
            var id = index + 1;
            $('.js_dialog').hide();
            $('#helptext' + id).hide();
            $('#helptext' + id).css({
                'margin-top': '0',
                'height': 'auto'
            });
        });
    });
</script>
<script>
    $('.publishtype').click(function(){
        $(this).toggleClass('publishcolor');
    });
</script>


</body>
