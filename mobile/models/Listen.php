<?php

namespace mobile\models;

use Yii;
use mobile\models\Members;
use mobile\models\Dianzan;
use mobile\models\Comments;
use mobile\models\Pocketget;
use mobile\models\Pockets;


class Listen extends \yii\db\ActiveRecord
{
	/**
	 * @inheritdoc
	 */
	public static function tableName()
	{
		return 'bdtlistens';
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
}
