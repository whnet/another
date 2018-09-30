<?php

use yii\helpers\Html;
use yii\grid\GridView;
use common\tools\htmls;

$this->params['breadcrumbs'][] = $this->title;
?>
<style>
	.fs30{
		line-height: 1rem;
	}
	.zhui{
		color:red;
		font-size:20px;
		margin-left:0.3rem;
	}
	/*.fc-blue,.statebar .tab-btn.tab-btn-two>a{width:32%!important;}*/
	.fc-white{color:white!important}
</style>
<script type="text/javascript" src="../bdt/js/myhomepage.js"></script>
<body class="bg-white">
<div id="container" class="container myhomepage-container bg-white">
	<div id="page">
		<div class="page__hd bg-white fc-red b-b-grey has-tab scrollhd">
			<div class="statebar">
				<a class="nav-act left-act" onclick="goBack();">
					<img src="../bdt/images/nav_icon_back1.png"></a>
				<h2 class="fs34" style="color:black;height:2.7rem;line-height:2.7rem;">追答</h2>
			</div>
		</div>
		<div class="clear"></div>
		<div class="page__bd mb10 bg-greyfa scrollhd">
			<div class="top-space4"></div>
			<div class="homepagelist" id="homepage0">
				<div class="my-qanda">
					<div class="my-qanda-list" id="answerList">
						<?php foreach($answer as $k=>$v):?>
							<div class="my-qanda-item bg-white mb10">
								<div class="my-qanda-item-hd">
									<a><i>
											<img src="<?=$v['user']['photo']?>">
											<?php if($v['user']['vip'] == 1):?>
												<i><img src="../bdt/images/v2.png"></i>
											<?php endif;?>
										</i></i>
										<span class="fc-navy fs30 ml5"><?=$v['user']['nickname']?></span></a>
									<span class="fc-blue fs30 ml5">
                                    <?php if($v['status'] == 2):?>已回答<?php elseif($v['status'] == 1):?>待回答
                                    <?php elseif($v['status'] == 3):?>已失效<?php elseif($v['status'] == 0):?>付款确认中
                                    <?php endif;?>
                                </span>
									<div><i class="bg-orange"></i>
										<?php if($v['askprice'] == "0.00"):?>
											<span class="fc-orange fs30">免费</span>
										<?php else:?>
											<span class="fc-orange fs30">￥<?=$v['askprice']?></span>
										<?php endif;?>
									</div>
								</div>
								<?php if($v['status'] == 2):?>
								<p class="my-qanda-item-bd fs30 fc-black mt5 face_tag" onclick="goDetail(<?=$v['qaid']?>)">
								<?php else:?>
								<p class="my-qanda-item-bd fs30 fc-black mt5 face_tag" onclick="recordHtml(<?=$v['id']?>,<?=$v['qaid']?>)">
								<?php endif;?>
									<?=$v['question']?>
								</p>
								<div class="my-qanda-item-fd" style="margin-top:20px;">
									<i class="fs28 fc-greyabc"><?=date('Y-m-d H:i:s',$v['created'])?></i>
									<span class="fs28 fc-greyabc">
                                </span>
								</div>
							</div>
						<?php endforeach;?>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<script>
    function recordHtml(listId, qaid){
        window.location.href = "/questions/yiwen_record.html?id="+listId+"&qaid="+qaid;
    }
    function goDetail(qaid){
        window.location.href = "/questions/qanda_detail.html?id="+qaid;
    }
</script>
</body>
