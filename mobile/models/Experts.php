<?php

namespace mobile\models;

use Yii;
use mobile\models\Members;


class Experts extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'bdtexperts';
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
    public function getQue()
    {
        return $this->hasMany(Members::className(), ['id' => 'member_id']);
    }
}
