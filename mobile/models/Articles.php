<?php

namespace mobile\models;

use Yii;
use mobile\models\Members;
use mobile\models\Dianzan;
use mobile\models\Comments;
use mobile\models\Pocketget;
use mobile\models\Pockets;
use mobile\models\Experts;


class Articles extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'bdtarticles';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [

        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [

        ];
    }
    public function getUser()
    {
        return $this->hasOne(Members::className(), ['id' => 'member_id']);
    }
    public function getExpert()
    {
        return $this->hasOne(Experts::className(), ['member_id' => 'member_id']);
    }
    public function getDianzan()
    {
        return $this->hasMany(Dianzan::className(), ['article_id' => 'id']);
    }
    public function getComment()
    {
        return $this->hasMany(Comments::className(), ['article_id' => 'id']);
    }
    public function getRedpocket()
    {
        return $this->hasMany(Pocketget::className(), ['pocket_id' => 'redid']);
    }
    public function getPockets()
    {
        return $this->hasOne(Pockets::className(), ['id' => 'redid']);
    }






}
