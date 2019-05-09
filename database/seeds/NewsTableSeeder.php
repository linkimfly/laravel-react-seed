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
            'type' => 'notices',
			'author' => '电子科技大学',
        ]);
    }
}
