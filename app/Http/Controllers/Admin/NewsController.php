<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\News;
use App\Models\Type;

class NewsController extends Controller
{
	public function index()
	{
		$news = News::where('is_delete', 0)->get();
		foreach ($news as $currentNews) {
			$currentNews->type = $currentNews->getType;
		}
		$types = Type::all();

		return response()->json([
			'news' => $news,
			'types' => $types
		]);
	}

	public function show($id)
	{
		$currentNews = News::findOrFail($id);

		if (!$currentNews || $currentNews->is_delete) {
			return response()->json([
				'status' => 1,
				'message' => '未找到相关新闻，请联系网站管理员！',
			]);
		}

		return response()->json([
			'status' => 0,
			'current_news' => $currentNews
		]);
	}

	public function update(Request $request)
	{
		$inputs = $request->all();

		if (array_has($inputs, 'id')) {
			$news = News::findOrFail($inputs['id']);
			if (!$news || $news->is_delete) {
				return response()->json([
					'status' => 1,
					'message' => '未找到相关新闻，请联系网站管理员！'
				]);
			}
		}else {
			$news = new News;
		}

		$inputs = array_except($inputs, ['id', 'created_at', 'updated_at']);
		foreach ($inputs as $key => $value) {
			$news->$key = $value;
		}
		$news->save();

		return response()->json([
			'status' => 0,
			'message' => '保存成功！'
		]);
	}

	public function delete($id)
	{
		$currentNews = News::findOrFail($id);
		if (!$currentNews) {
			return response()->json([
				'status' => 1,
				'message' => '未找到相关新闻，请联系网站管理员！'
			]);
		}

		$currentNews->is_delete = 1;
		$currentNews->save();
		return response()->json([
			'status' => 0,
			'message' => '删除成功！'
		]);
	}
}
