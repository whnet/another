<?php

namespace mobile\models;

use Yii;
use mobile\models\Members;
use mobile\models\Experts;
use mobile\models\Circlemembers;


class Circles extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'bdtcircles';
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

    public function getIncircle()
    {
        return $this->hasMany(Circlemembers::className(), ['cid' => 'id']);
    }
	public function getExpert()
	{
		return $this->hasOne(Experts::className(), ['member_id' => 'member_id']);
	}
}
