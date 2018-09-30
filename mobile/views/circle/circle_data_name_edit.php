<body class="bg-white">
<script type="text/javascript" src="../bdt/js/circle_data_name_edit.js"></script>
<link type="text/css" rel="stylesheet" href="../bdt/css/user.min.css">
<div id="container" class="container personaldata-container">
    <div id="page">
        <!--页面导航栏-->
        <div class="page__hd bg-white fc-black b-b-grey scrollhd">
            <div class="statebar">
                <a class="nav-act left-act" onclick="goBack();"><img src="../bdt/images/nav_icon_back1.png"></a>
                <h2 id="title" class="fs34">编辑圈子昵称</h2>
                <a class="but_save fs28 fc-black" id="saveModify">保存</a>
            </div>
        </div>
        <!--页面主体-->
        <div class="page__bd scrollbd">
            <!--占位空间-->
            <div class="top-space1"></div>
            <!--编辑区域-->
            <div class="text-edit-box bg-white mt20">
                <input id="textValue" type="text" class="text-edit-input b-b-greyabc fc-black fs28" onblur="$(this).removeClass('b-b-blue').addClass('b-b-greyabc');" maxlength="10" onfocus="$(this).removeClass('b-b-greyabc').addClass('b-b-blue');" placeholder="请输入您的圈子昵称">
                <p class="text-edit-tips fs24 fc-greyabc mt5">有昵称显得您很有品味(不得超过10个字)</p>
            </div>
        </div>
    </div>
</div>



</body>