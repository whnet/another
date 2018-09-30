<?php

namespace mobile\models;

use Yii;
use mobile\models\Members;


class Concerns extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'bdtconcerns';
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
    public function getFans(){
        return $this->hasOne(Members::className(), ['id' => 'to_mid']);
    }
    public function getConcerns(){
        return $this->hasOne(Members::className(), ['id' => 'mid']);
    }






}
