<div id="downloadBar" class="downloadBar" style="display:none">
    <span onclick="window.location.href='/members/myhomepage.html?read=1'">您有新的问题要回答</span>
    <div class="closebtn bar-item downloadbar-close"  onclick="$('#downloadBar').hide()">
        <img src="../bdt/images/nav_icon_close3.png"/></div>
    <div class="bar-item downloadbar-open" onclick="window.location.href='/members/myhomepage.html?read=0'">点击查看</div>
</div>

<div class="tab-con">
    <?php
      $c = Yii::$app->controller->id;
    ?>
        <a href="/site/index.html" class="<?php if($c == 'site'):?>tabbtn-on<?endif;?>">
            <i class="default"></i>
            <span class="<?php if($c == 'site'):?>fc-blue<?php else:?>fc-greyabc<?endif;?>">首页</span>
        </a>
        <a href="/circle/circle_my.html" class="<?php if($c == 'circle'):?>tabbtn-on<?endif;?>">
            <i class="circle"></i>
            <span class="<?php if($c == 'circle'):?>fc-blue<?php else:?>fc-greyabc<?endif;?>">圈子</span>
        </a>
        <a href="/expert/found_expert.html" class="<?php if($c == 'expert'):?>tabbtn-on<?endif;?>" id="question-expert">
            <i class="qanda"></i>
            <span class="<?php if($c == 'questions'):?>fc-blue<?php else:?>fc-greyabc<?endif;?>" >问</span>
        </a>
        <a href="/articles/square.html" class="<?php if($c == 'articles'):?>tabbtn-on<?endif;?>">
            <i class="dynamic"></i>
            <span class="<?php if($c == 'articles'):?>fc-blue<?php else:?>fc-greyabc<?endif;?>">领域</span>
        </a>
        <a href="/members/index.html" class="<?php if($c == 'members'):?>tabbtn-on<?endif;?>">
            <i class="mine"></i>
            <span class="<?php if($c == 'members'):?>fc-blue<?php else:?>fc-greyabc<?endif;?>">我的</span>
            <!--<em class="bg-red"></em>-->
        </a>
</div>





