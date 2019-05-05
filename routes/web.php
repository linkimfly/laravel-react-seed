<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Auth::routes();

Route::get('/', 'HomeController@index')->name('home');


//需要管理员权限
Route::middleware(['auth', 'admin'])->group(function () {
	Route::get('/admin', 'Admin\AdminController@index')->name('admin');
});

//需要开发者权限
Route::middleware(['auth', 'dev'])->group(function () {
	//api
	Route::namespace('Admin')->prefix('admin-api')->group(function (){
		Route::get('news', 'NewsController@index');
		Route::post('news', 'NewsController@update');
		Route::get('types', 'TypeController@index');
	});
});
