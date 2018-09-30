<!--237行是qanda_ecrtify.js-->


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
                    <h2 class="fs34">行家认证</h2>
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
                        <input id="masterTitle" onkeyup="masterTitle(this)" class="fc-black456 fs30"  placeholder="请输入您的头衔" value="<?=$apply['honor']?>" style="border:none;width:90%;"/>
                        <span class="fs30 fc-greyabc"><i id="masterTitleCount">0</i>/<span id="masterTitle_maxInputLength">100</span></span>
                    </div>
                    <div class="qanda-certify-item bg-white mt10">
                        <h3 class="fs32 fc-grey666">简介</h3>
                        <textarea id="masterInfo" onkeyup="masterInfo(this)"
                                  class="fc-black456 fs30" rows="4" placeholder="请输入您的简介"><?=$apply['des']?></textarea>
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
                            <?php if($apply['type'] == $v['id']):?>
                            <a class="publishtype bg-grey publishcolor" data-type="<?=$v['id'];?>"><?=$v['name'];?></a>
                            <?php else:?>
                            <a class="publishtype bg-grey" data-type="<?=$v['id'];?>"><?=$v['name'];?></a>
                            <?php endif;?>
                            <?php else: ?>
                            <a class="publishtype bg-grey"
                               data-type="<?=$v['id'];?>"><?=$v['name'];?></a>
                            <?php endif;?>
                            <?php endforeach;?>
                        </div>
                        <input type="hidden" name="mid" value="<?=$apply['member_id']?>">
                    </div>
                    <!--名片上传-->
                    <div class="qanda-certify-item bg-white mt10">
                        <h3 class="fs32 fc-grey999" id="certifiedPicTips">申请专家认证<span class="fs28 fc-orange">（专家文章更容易通过审核）</span></h3>
                        <!--未上传-->
                        <?php if(isset($apply)):?>
                        <div class="upload-card bc-grey" id="uploadCertifiedPic" style="display:none">
                            <?php else:?>
                            <div class="upload-card bc-grey" id="uploadCertifiedPic">
                                <?php endif;?>
                                <a class="uploadCertifiedPic cardUpload"  id="cardUpload">
                                    <span class="bg-greyf1"></span>
                                    <span class="bg-greyf1"></span>
                                </a>
                                <p class="fs30 fc-greyabc mt10">上传名片</p>
                            </div>

                            <?php if(isset($apply)):?>
                            <input type="hidden" name="uploadCertifiedPic" value="<?=$apply['card']?>"/>
                            <?php else:?>
                            <input type="hidden" name="uploadCertifiedPic" value=""/>
                            <?php endif;?>

                            <?php if(!empty($apply['card'])):?>
                            <div class="upload-card bc-grey upload-card-ok cardUpload" id="certifiedPic">
                                <img src="<?=Yii::$app->params['public'].'/attachment'.$apply['card']?>">
                            </div>
                            <?php else:?>

                            <?php endif;?>

                        </div>
                        <a class="qanda-certify-postbtn bg-orange fc-white fs30" onclick="applyMasterMethods()">申请成为行家</a>
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
                <p class="fs28 fc-black mt10">完成手机验证即可成为行家！</p>
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
                    <div class="appui-helptext-bd-con">
                        <?=$this->params['site']['guize'];?>
                    </div>
                </div>
                <h2 class="appui-helptext-fd fs32 fc-orange">知道了</h2>
            </div>
            <div class="appui-helptext bg-white" id="helptext5" style="display:none;">
                <h2 class="appui-helptext-hd fs32 fc-black b-b-grey">认证用户管理条例</h2>
                <div class="appui-helptext-bd fc-black456 b-b-grey">
                    <div class="appui-helptext-bd-con"><?=$this->params['site']['guanli'];?></div>
                </div>
                <h2 class="appui-helptext-fd fs32 fc-orange">知道了</h2>
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



        <!--qanda_certify.js-->


        // qanda_certify.js
        var indexID = 0;
        var targetId = "";
        var currentPage = 1;
        var totalPage = "";
        var isMaster = 0;
        var jiaodu=0;
        var fromIndex = null;
        var imgConverData = '';
        var InterValObj; //timer变量，控制时间
        var count = 60; //间隔函数，1秒执行
        var curCount;//当前剩余秒数

        var isBackBool = 0;
        $(document).ready(function() {
        //判断是否认证了手机号
        ifBindMobile();
        $('body').height($(window).height());
        var csrf = $('input[name="csrf"]').val();
        targetId = request("id");
        $('.cardUpload').click(function(e) {
        chooseImage();
        })
        });
        //微信上传接口

        function chooseImage(){
        wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
        localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
        if(localIds.length==0){
        return false;
        }else if(localIds.length>1){
        alert('只允许选择一张图片！')
        }else{
        wx.uploadImage({
        localId: localIds[0], // 需要上传的图片的本地ID，由chooseImage接口获得
        isShowProgressTips: 1, // 默认为1，显示进度提示
        success: function (res) {
        WxDownload(res.serverId);
        }
        });
        }

        }
        });
        }
        //下载图片
        function WxDownload(serverId){
        var csrf = $('input[name="csrf"]').val();
        $.ajax({
        type: "POST", //用POST方式传输
        dataType: "JSON", //数据格式:JSON
        data:{
        serverId:serverId,
        _csrf:csrf
        },
        async : false,
        url: '/members/downlodimg.html', //目标地址 Download
        success:function(msg){
        $("#certifiedPicTips").html("当前名片<span class='fs28 fc-orange'>（点击可重新上传名片）</span>");
        $("#uploadCertifiedPic").hide();
        $("#certifiedPic").show();
        $("#certifiedPic img").attr("src",msg.url+msg.filename);
        $('input[name="uploadCertifiedPic"]').val(msg.filename);

        }
        })
        }

        //不从服务器上下载，直接在本地显示的方法。下载localId,这个图片存放在手机上但是看不到，需要从微信服务器下载
        function MlocalId(serverId) {
        wx.downloadImage({
        serverId: serverId, // 需要下载的图片的服务器端ID，由uploadImage接口获得
        isShowProgressTips: 0, // 默认为1，显示进度提示
        success: function (res) {
        var localId = res.localId; // 返回图片下载后的本地ID
        getLocalImgData(localId);
        }
        });
        }
        //获取本地的图片数据
        function getLocalImgData(localId) {
        wx.getLocalImgData({
        localId: localId, // 图片的localID
        success: function (res) {
        var localData = res.localData; // localData是图片的base64数据，可以用img标签显示
        $('.upload_img img').attr('src',"");
        }
        });

        }

        //微信上传接口END

        //查看是否绑定了手机
        function ifBindMobile(){
        var csrf = $('input[name="csrf"]').val();
        $.ajax({
        url: '/members/ifbindmobile.html',
        type: 'post',
        dataType: 'json',
        data: {"_csrf":csrf},
        success: function (data){
        if(data.result == 'success'){
        if(!data.info.phone){
        dataLoading("请绑定手机");
        setTimeout("goBindPhone()",3000);
        }
        }
        }
        })
        }
        function goBindPhone(){
        window.location.href="/members/myset_bind_phone.html?type=expert";
        }
        function backToPrePage(){
        $('.upload-container').css({'visibility':'hidden','z-index':'0'},500);
        $("#sure-btn").hide();
        $("#modifyPicPage").hide();
        $("#certifyHome").show();
        }

        function configqa(config) {
        var placeholderText = "￥0-"+config.maxQaPrice;
        var freeListenText = "回答"+parseInt(config.answerFreeTime)/60+"分钟内免费听";
        $('#askPrice').attr("placeholder",placeholderText);
        // $('#freeListen').text(freeListenText);
        $('#freeListen').text("回答前10次免费听");
        }
        function configUserDataUI(user) {
        isMaster = user.masterLvl;
        var lableStr2 = "";
        var lableStr = "";
        var lableArr = new Array();
        if (isMaster>=1) {
        $('#protocolLabel').hide();
        $('.qanda-certify-postbtn').text("保存资料");
        };
        if (user.headPic.length>0&&user.headPic!=null){
        $('#headPic img').attr("src",user.headPic);
        };
        $('.qanda-certify-info span').text(user.nickname);
        if (user.lable!=null&&user.lable!=0) {
        lableArr = user.lable.split(',');
        for (var i = 0; i < lableArr.length; i++) {
        lableStr +=  '<i>'+lableArr[i]+'</i>&nbsp;';
        };
        $('#label').html(lableStr);
        }
        if (user.locationLable!=null&&user.locationLable!=0) {
        var lableArr2 = user.locationLable.split(',');
        for (var i = 0; i < lableArr2.length; i++) {
        lableStr2 += '<span>'+lableArr2[i]+'</span>&nbsp;'
        }
        $('#label').append(lableStr2);
        $('#labelCount').text(lableArr.length+lableArr2.length);
        }
        $('#label').click(function(){
        saveDataSession();
        setElementClickStyle($(this).parents(".qanda-certify-item")[0]);
        window.location.href = "personal_data_label_edit.html?nid="+1;
        });

        if(user.certifiedPic == null || user.certifiedPic.length==0){
        $("#uploadCertifiedPic").show();
        $("#certifiedPic").hide();
        }else{
        $("#certifiedPicTips").html("当前名片<span class='fs28 fc-orange'>（点击可重新上传名片）</span>");
        $("#uploadCertifiedPic").hide();
        $("#certifiedPic").show();
        $("#certifiedPic img").attr("src",user.certifiedPic);
        }

        var sessionUser = readClientSession("sessionUser");
        if (sessionUser!=null) {
        user = sessionUser;
        }
        var masterTitle = user.title;
        $("#masterTitle").val(masterTitle);
        $("#masterTitleCount").text(masterTitle.length);
        var masterInfo = user.masterInfo;
        $('#masterInfo').text(masterInfo);
        $('#masterInfoCount').text(masterInfo.length);

        if (isMaster>0) {
        $('#askPrice').val(user.askPrice);
        };


        }



        function configBindPhoneUI(){
        $('.phone_dialog').show();
        $("#btnSendCode").click(function(){
        var phoneNumber = $("#phoneInput").val();
        if (isPhone(phoneNumber)==true) {
        getPhoneCode(phoneNumber);
        }else{
        dataLoadedError("请输入正确的电话格式");
        }
        });
        $("#closeID").click(function(){
        $('.phone_dialog').hide();
        });
        $("#verify").click(function(){
        var codeStr = $("#codeInput").val();
        var phoneNumber = $("#phoneInput").val();
        if (isPhone(phoneNumber)!=true) {
        dataLoadedError(isPhone(phoneNumber));
        return;
        }
        if (codeStr.length!=6||codeStr=="") {
        dataLoadedError("请输入正确的验证码");
        return;
        }

        $.ajax({
        url: bindPhoneCode,
        type: 'post',
        dataType: 'json',
        data: {"phone": phoneNumber,"code":$("#codeInput").val()},
        success: function (result){
        if (result.result == "success") {
        $('.phone_dialog').hide();
        qrcodeDialogOfPhone('images/qrcodebg1.png' , '申请成功' , '关注律乎后，系统会通过公众号向您<br />推送收到新提问的微信消息。' , 'success-apply' );
        // successBack();
        }else{
        dataLoadedError(result.message);
        }
        }
        });

        });
        }

        function gotoUser_center_html(){
        $('#qrcodeDialog').remove();
        window.location.href = "user_center.html";
        }

        function callBack(){
        gotoUser_center_html();
        }

        function successBack(){

        }


        //绑定手机号
        function getPhoneCode(phoneNumber) {
        curCount = count;
        //设置button效果，开始计时
        $("#btnSendCode").attr("disabled", "true");
        $("#btnSendCode").val("重新发送(" + curCount + ")");
        InterValObj = window.setInterval(SetRemainTime, 1000); //启动计时器，1秒执行一次
        //向后台发送处理数据
        // data:{"phone":"手机号","type":"1-注册，2-登录，3-找回密码，4-绑定手机，5-解绑手机"}
        $.ajax({
        type: "post",
        url: sendPhoneCode,
        dataType: "json",
        async: true,
        data:{"phone":phoneNumber,"type":4},
        success: function(result) {
        }
        });
        }
        //timer处理函数
        function SetRemainTime() {
        if (curCount == 0) {
        window.clearInterval(InterValObj);//停止计时器
        $("#btnSendCode").removeAttr("disabled");//启用按钮
        $("#btnSendCode").val("重新发送验证码");
        }
        else {
        curCount--;
        $("#btnSendCode").val("重新发送(" + curCount + ")");
        }
        }

        function num(obj){
        obj.value = obj.value.replace(/[^\d.]/g,""); //清除"数字"和"."以外的字符
        obj.value = obj.value.replace(/^\./g,""); //验证第一个字符是数字
        obj.value = obj.value.replace(/\.{2,}/g,"."); //只保留第一个, 清除多余的
        obj.value = obj.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
        obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3'); //只能输入两个小数
        }

        var reg = /^[0-9]+.?[0-9]*$/;//用来验证数字，包括小数的正则
        function applyMasterMethods(){
        var type = '';
        var length = $(".publishcolor").length;
        $(".publishcolor").each(function(i){
        if(i != (length - 1)){
        type += $(this).data('type')+',';
        }else{
        type += $(this).data('type');
        }
        });
        var realName   = $('#masterRealName').val();
        var askPrice   = $('#askPrice').val();
        var masterInfo = $('#masterInfo').val();
        var masterTitle = $('#masterTitle').val();
        var aggreStatus = $('#aggre').prop("checked");
        if(realName==null||realName.length==0 || realName.trim()==""){
        dataLoadedError("请输入您的真实姓名！");
        }else if (masterTitle==null||masterTitle.length==0 || masterTitle.trim()=="") {
        dataLoadedError("名片头衔不能为空");
        }else if (masterInfo==null||masterInfo.length==0 || masterInfo.trim()=="") {
        dataLoadedError("行家描述不能为空");
        }else if (!reg.test(askPrice)) {
        dataLoadedError("请输入正确的金额数字格式！");
        }else if (parseFloat(askPrice)<0||parseFloat(askPrice)>1000) {
        dataLoadedError("您输入的金额应该在0-1000之间");
        }else if (isMaster==0 && aggreStatus==false) {
        dataLoadedError("您需要同意本平台的使用协议");
        }else if (askPrice > 2000){
        dataLoadedError("您的金额应0-2000");
        }else if(type==''){
        dataLoadedError("请选择类别");
        return;
        }else{
        //提交资料
        sendInfosForExpert(realName, askPrice, masterInfo, masterTitle, type);
        }
        }
        //提交资料审核
        function sendInfosForExpert(realName, askPrice, masterInfo, masterTitle, type){

        var mid = $('input[name="mid"]').val();
        if(mid){
        url = "/members/changeapply.html"
        }else{
        url = "/members/apply.html"
        }
        var csrf = $('input[name="csrf"]').val();
        var certifiedPic = $('input[name="uploadCertifiedPic"]').val();
        dataLoading("正在提交...");
        $.ajax({
        type: "POST",
        url: url,
        data: {
        mid:mid,
        realname:realName,
        honor:masterTitle,
        des:masterInfo,
        price:askPrice,
        type:type,
        card:certifiedPic,
        _csrf:csrf
        },
        dataType: "json",
        success: function(data){
        if(data.result == 'success'){
        dataLoadedSuccess("提交成功,请等待审核");
        window.location.href = "/members/index.html";
        }
        }
        });

        }
        function hasSwitchOnClass(cell){
        var hasSwitchOn = "";
        if ($('#'+cell+' span').attr("class").indexOf("appui_cell__switch-on")>0) {
        hasSwitchOn = 1;
        }else{
        hasSwitchOn = 0;
        }
        return hasSwitchOn;
        }
        function monitorCount(){
        $('#masterInfo').bind('onpropertychange textarea', function () {
        alert("1")
        var counter = $('#masterInfo').val().length;
        $('#masterInfoCount').text(counter);   //每次减去字符长度
        if (counter>300) {
        $('#masterInfoCount').text(300);
        this.value = this.value.substring(0, 300);
        if ($('.toastDialog').length<=0) {
        dataLoadedError("您已经超过最大输入个数");
        }
        return false;
        };
        });
        $('#masterTitle').bind('onpropertychange textarea', function () {
        alert("1")
        var counter = $('#masterTitle').val().length;
        $('#masterTitleCount').text(counter);   //每次减去字符长度
        if (counter>18) {
        $('#masterTitleCount').text(18);
        this.value = this.value.substring(0, 18);
        if ($('.toastDialog').length<=0) {
        dataLoadedError("您已经超过最大输入个数");
        }
        return false;
        };
        });
        }


        function doInitCropper(ids){
        $image = $(ids);
        //image.crossOrigin = "anonymous";

        var options = {
        cropBoxMovable: false,
        // Enable to resize the crop box
        cropBoxResizable: false,
        dragMode: 'move',
        aspectRatio: 43/ 27,
        background: false,
        /**
        movable: false,
        resizable: false,
        dragCrop: false,
        aspectRatio: 1,
        background: false,
        aspectRatio: 43/ 27,
        //minCropBoxWidth: 215,
        //minCropBoxHeight: 129,
        strict: false,
        autoCropArea: 0.9,*/
        crop: function (e) {

        }
        };

        // Cropper
        $image.cropper(options);
        }


        function dataURLtoBlob(dataurl) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
        u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {type:mime});
        }

        function cardChange(inputFileId){
        var file=$("#"+inputFileId).get(0).files[0];
        if (file.type.indexOf("image") == 0) {
        if (file.size >= 5120000) {
        alert('您这张"'+ file.name +'"图片大小过大，应小于5000k');
        } else {
        //$('.waitLoad').show();
        var URL = window.URL || window.webkitURL;
        var blobURL;
        blobURL = URL.createObjectURL(file);
        $image.one('built.cropper', function () {
        URL.revokeObjectURL(blobURL);
        $('.upload-container').css({'visibility':'visible','z-index':'1'},500);
        $('.upload-container .row').css({'height':$('.upload-container .row').width(),'margin-top':-$('.upload-container .row').width()/2});
        $("#sure-btn").show();
        $("#certifyHome").hide();
        $("#modifyPicPage").show();
        }).cropper('reset', true).cropper('replace', blobURL);
        }
        } else {
        alert('文件"' + file.name + '"不是图片。');
        }

        }

        function myClose(){
        if (isBackBool==1) {
        removeClientSession("sessionUser");
        };
        }
        // 真实名字数限制
        function masterRealName(){
        $('#masterRealName').bind('propertychange input', function () {
        var counter = $('#masterRealName').val().length;
        var maxInputLength = $('#masterRealName_maxInputLength').text();
        $('#masterRealNameCount').text(counter);   //每次减去字符长度
        if (counter>maxInputLength) {
        $('#masterTitleCount').text(maxInputLength);
        this.value = this.value.substring(0, maxInputLength);
        if ($('.toastDialog').length<=0) {
        dataLoadedError("您已经超过最大输入个数");
        }
        return false;
        };
        });
        }
        //头衔
        function masterTitle(){
        $('#masterTitle').bind('propertychange input', function () {
        var counter = $('#masterTitle').val().length;
        var maxInputLength = $('#masterTitle_maxInputLength').text();
        $('#masterTitleCount').text(counter);
        if (counter>maxInputLength) {
        $('#masterTitleCount').text(maxInputLength);
        this.value = this.value.substring(0, maxInputLength);
        if ($('.toastDialog').length<=0) {
        dataLoadedError("您已经超过最大输入个数");
        }
        return false;
        };
        });
        }
        //简介
        function masterInfo(){
        $('#masterInfo').bind('propertychange input', function () {
        var counter = $('#masterInfo').val().length;
        var maxInputLength = $('#masterInfo_maxInputLength').text();
        $('#masterInfoCount').text(counter);
        if (counter>maxInputLength) {
        $('#masterInfoCount').text(maxInputLength);
        this.value = this.value.substring(0, maxInputLength);
        if ($('.toastDialog').length<=0) {
        dataLoadedError("您已经超过最大输入个数");
        }
        return false;
        };
        });
        }


















