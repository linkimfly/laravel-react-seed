<?php

use Illuminate\Database\Seeder;

class NewsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
		DB::table('news')->insert([
            'title' => '测试标题',
            'type' => '新闻通知',
			'author' => '电子科技大学',
        ]);
    }
}
