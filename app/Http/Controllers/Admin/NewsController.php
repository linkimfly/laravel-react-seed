<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\News;

class NewsController extends Controller
{
	public function index()
	{
		$news = News::all();
		return response()->json([
			'news' => $news
		]);
	}

	public function update(Request $request)
	{
		$inputs = $request->all();

		if (array_has($inputs, 'id')) {
			$news = News::findOrFail($receivedNews->id);
			if (!$news) {
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
}
