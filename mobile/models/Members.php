<?php

namespace mobile\models;

use Yii;
use mobile\models\Experts;
use mobile\models\Wxpayrecord;

/**
 * This is the model class for table "bdtmembers".
 *
 * @property int $id ID
 * @property string $nickname 昵称
 * @property string $photo 头像
 * @property string $account 账号
 * @property int $sex 性别
 * @property string $slogan 个性签名
 * @property string $industry 行业
 * @property string $areas 所属地区
 * @property string $pwd  密码
 * @property string $phone 电话
 * @property int $vip 是否专家
 * @property string $tags 标签
 * @property string $created 注册时间
 * @property string $updated  修改时间
 */
class Members extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'bdtmembers';
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
            'id' => 'ID',
            'nickname' => '昵称',
            'photo' => '头像',
            'account' => '账号',
            'sex' => '性别',
            'slogan' => '个性签名',
            'industry' => '行业',
            'areas' => '所属地区',
            'pwd' => ' 密码',
            'phone' => '电话',
            'vip' => '是否专家',
            'tags' => '标签',
            'created' => '注册时间',
            'updated' => ' 修改时间',
            'allowed' => ' 是否禁言',
        ];
    }
    public function getExpert()
    {
        //id 对应 experts
        return $this->hasOne(Experts::className(), ['member_id' => 'id']);
    }
    public function getFeeuser()
    {
        return $this->hasMany(Wxpayrecord::className(), ['mid' => 'id']);
    }






}
