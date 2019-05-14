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

	//api
	Route::namespace('Admin')->prefix('admin-api')->group(function (){
		Route::get('news', 'NewsController@index');
		Route::get('news/{id}', 'NewsController@show');
		Route::get('news/{id}/top', 'NewsController@top');
		Route::get('news/{id}/delete', 'NewsController@delete');
		Route::post('news', 'NewsController@update');
		Route::get('slides', 'SlideController@index');
		Route::get('slides/{id}', 'SlideController@show');
		Route::get('slides/{id}/delete', 'SlideController@delete');
		Route::post('slides', 'SlideController@update');
		Route::get('types', 'TypeController@index');
		Route::get('/settings', 'SettingController@index');
	    Route::post('/settings', 'SettingController@update');
		Route::post('upload/file', 'UploadController@uploadFile');
	});
});

//需要开发者权限
Route::middleware(['auth', 'dev'])->group(function () {

});
