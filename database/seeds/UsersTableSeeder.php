<?php

use Illuminate\Database\Seeder;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->insert([
            'name' => 'dev',
            'email' => 'dev@qq.com',
			'level' => 'dev',
            'password' => bcrypt('dev')
        ]);
		DB::table('users')->insert([
            'name' => 'admin',
            'email' => 'admin@qq.com',
			'level' => 'admin',
            'password' => bcrypt('admin')
        ]);
    }
}
