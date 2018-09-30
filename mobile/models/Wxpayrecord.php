<?php

namespace mobile\models;

use Yii;
use mobile\models\Members;


class Wxpayrecord extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'wxpayrecord';
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
    public function getUsers()
    {
        return $this->hasOne(Members::className(), ['id' => 'mid']);
    }







}
