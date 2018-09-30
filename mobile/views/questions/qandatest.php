<?php

use yii\helpers\Html;
use yii\grid\GridView;

$this->params['breadcrumbs'][] = $this->title;
?>
<link type="text/css" rel="stylesheet" href="../bdt/css/qanda.css">
<script type="text/javascript" src="../bdt/js/searchCommon.js"></script>
<script type="text/javascript" src="../bdt/js/qanda.js"></script>
<script type="text/javascript" src="../bdt/js/commonQaList.js"></script>
<body>
<div class="new_q_and_a" id="container">
	<div id="page">
		<!--页面导航栏-->
		<div class="page__hd page__hd-search bg-white fc-balck b-b-grey scrollhd" id="topBigDiv">
			<div class="search-head b-b-grey">
				<div class="search-module noleftbtn" id="searchID">
					<p class="fs28 fc-greyabc">搜索问答</p>
				</div>
				<a class="right-icon" id="searchID1">
					<img src="../bdt/images/search80.png">
					<span class="fs28 fc-white"></span>
				</a>
			</div>
			<div id="smallNav" style="height: 2.5rem; top: 2.55rem;">
				<div>
					<p>
						<span class="fs28 fc-grey666 active" onclick="judgeIndex1(0,0,'推荐',1)">推荐</span>
						<?php foreach($type as $k=>$v):?>
							<span class="fs28 fc-grey666"
							      onclick="judgeIndex1(<?=$v['id'];?>,<?=$k+1;?>,'<?=$v['name']?>',1)">
                            <?=$v['name']?></span>
						<?php endforeach;?>
					</p>
					<img id="showMoreBtn" src="../bdt/images/nav_more.png" >
				</div>
			</div>
		</div>
		<div class="page__bd scrollbd" style="padding-top:2.5rem;">
			<div id="hasCouponSpace" class="top-space1 notop" style="display:block;"></div>
			<div id="professList" class="professList" style="height:2.5rem;"></div>
			<div class="qa_recommend" id="questions">
				<a id="downloadMoreData" class="appui_loadmore fs32 fc-greyabc">拼命加载中<i class="loadmore"></i></a>
			</div>
			<div class="page__fd bg-white fs22 bc-grey scrollfdt" id="footer_tabbar">
				<div class="tab-con">
					<?=$this->render('/_footer')?>
				</div>
			</div>
			<audio id="audio-mc" style="display:none;" preload="preload" src=""></audio>
		</div>
</body>
