<?php

namespace mobile\models;

use Yii;
use mobile\models\Members;
use mobile\models\Dianzan;
use mobile\models\Comments;
use mobile\models\Experts;

class Zhuiquestions extends \yii\db\ActiveRecord
{
	/**
	 * @inheritdoc
	 */
	public static function tableName()
	{
		return 'bdtzhuiquestions';
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
		return $this->hasOne(Experts::className(), ['member_id' => 'expert_id']);
	}
	public function getMember()
	{
		return $this->hasOne(Members::className(), ['id' => 'expert_id']);
	}
	public function getDianzan()
	{
		return $this->hasMany(Dianzan::className(), ['question_id' => 'id']);
	}
	public function getComment()
	{
		return $this->hasMany(Comments::className(), ['article_id' => 'id']);
	}
}
