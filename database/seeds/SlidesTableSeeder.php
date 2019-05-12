<?php

use Illuminate\Database\Seeder;

class SlidesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
		DB::table('slides')->insert([
            'cover' => '/images/default-cover.jpeg',
            'type' => 'internal',
			'title' => '测试标题',
			'target' => '/news/1',
			'news_id' => 1,
        ]);
		DB::table('slides')->insert([
            'cover' => '/images/default-cover.jpeg',
            'type' => 'external',
			'title' => '测试标题',
			'target' => 'http://www.baidu.com',
        ]);
		DB::table('slides')->insert([
            'cover' => '/images/default-cover.jpeg',
            'type' => 'none',
			'title' => '测试标题',
        ]);
    }
}
