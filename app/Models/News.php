<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class News extends Model
{
	/**
     * 获得此新闻所属的类别
     */
    public function getType()
    {
        return $this->belongsTo('App\Models\Type', 'type', 'code');
    }
}
