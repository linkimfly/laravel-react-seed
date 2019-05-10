<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\News;
use App\Models\Type;

class NewsController extends Controller
{
	public function index(Request $request)
	{
		$order = $request->order;
        $isTop = $request->is_top;
        $search = $request->search;
		$news = News::where('is_delete', 0)
					->when(isset($isTop), function ($query) use ($isTop) {
                        return $query->where('is_top', $isTop);
                    })->when(isset($search), function ($query) use ($search) {
                        return $query->where('title', 'like', '%'.$search.'%');
                    })->when(isset($order), function ($query) use ($order) {
						$arr = explode('_', $order);
						$isDesc = end($arr) == 'desc';
						if ($isDesc == 'desc') {
							array_pop($arr);
							return $query->orderBy(join('_', $arr), 'desc');
						}else {
							return $query->orderBy($order);
						}
                    })->paginate($request->page_size);
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

		$news->attachments = json_encode($request->attachments);
		$inputs = array_except($inputs, ['id', 'created_at', 'updated_at', 'attachments']);
		foreach ($inputs as $key => $value) {
			$news->$key = $value;
		}
		$news->save();

		return response()->json([
			'status' => 0,
			'message' => '保存成功！'
		]);
	}

	public function top($id)
	{
		$currentNews = News::findOrFail($id);
		if (!$currentNews) {
			return response()->json([
				'status' => 1,
				'message' => '未找到相关新闻，请联系网站管理员！'
			]);
		}

		if ($currentNews->is_top) {
			$currentNews->is_top = 0;
			$currentNews->save();
			return response()->json([
				'status' => 0,
				'message' => '已取消置顶！'
			]);
		}else {
			$currentNews->is_top = 1;
			$currentNews->save();
			return response()->json([
				'status' => 0,
				'message' => '已置顶！'
			]);
		}
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
