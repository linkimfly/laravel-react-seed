<?php

use Illuminate\Database\Seeder;

class TypesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
		DB::table('types')->insert([ 'code' => 'notices', 'name' => '新闻通知']);
		DB::table('types')->insert([ 'code' => 'downloads', 'name' => '资料下载']);
		DB::table('types')->insert([ 'code' => 'productions', 'name' => '往届作品展示']);
    }
}
