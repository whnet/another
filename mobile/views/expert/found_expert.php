<link type="text/css" rel="stylesheet" href="../bdt/css/professList.css">
<link type="text/css" rel="stylesheet" href="../bdt/css/found_expert.css">
<script type="text/javascript" src="../bdt/js/commonExpert.js"></script>
<script type="text/javascript" src="../bdt/js/found_expert.js"></script>

    <!--<script type="text/javascript" src="../layui/layui.js"></script>-->
<body class="bg-grey">
<div id="container">
    <div id="page">
        <div class="page__hd page__hd-search fc-black bg-white scrollhd" id="topBigDiv">
            <div class="search-head b-b-grey">
                <a class="left-icon" href="index.html">
                    <img src="../bdt/images/back80.png">
                    <span class="fs28 fc-white"></span>
                </a>
                <div class="search-module" id="searchID">
                    <p class="fs28 fc-greyabc">搜索专家</p>
                </div>
                <a class="right-icon" id="searchID1">
                    <img src="../bdt/images/search80.png">
                    <span class="fs28 fc-white"></span>
                </a>
            </div>

            <div id="smallNav" class="expert" style="top: 2.55rem;">
                <div style="height:6rem;">
                    <p>
                        <span class="fs28 fc-grey666 active" onclick="judgeIndex1(0,0,'推荐',1)">推荐</span>
                        <?php foreach($type as $k=>$v):?>
                        <span class="fs28 fc-grey666 <?php if($k==0):?><?php endif;?>" onclick="judgeIndex1(<?=$v['id'];?>,<?=$k+1;?>,'<?=$v['name']?>',1)">
                            <?=$v['name']?></span>
                        <?php endforeach;?>
                    </p>
                    <img id="showMoreBtn" src="../bdt/images/nav_more.png">
                </div>
            </div>

        </div>
        <div class="page__bd scrollbd" id="page__bd" style="padding-top: 6rem;">
            <div id="noneCouponSpace" class="top-space1 notop" style="display:block;"></div>
            <div id="hasCouponSpace" class="top-space6 notop" style="display:none;"></div>
            <div id="professList" class="professList">
                <a id="downloadMoreData" class="appui_loadmore fs32 fc-greyabc">拼命加载中<i class="loadmore"></i></a>
            </div>
            <div class="bottom-space4"></div>
        </div>
        <div class="page__fd bg-white fs22 bc-grey scrollfdt" >
            <div class="tab-con">
                <?=$this->render('/_footer')?>
            </div>
        </div>
    </div>
</div>

</body>