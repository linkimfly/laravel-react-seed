<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Slide;
use App\Models\News;

class SlideController extends Controller
{
	public function index(Request $request)
	{
		$order = $request->order;
		$slides = Slide::where('is_delete', 0)->orderBy('priority', 'desc')->get();

		return response()->json([
			'slides' => $slides,
		]);
	}

	public function show($id)
	{
		$slide = Slide::findOrFail($id);

		if (!$slide || $slide->is_delete) {
			return response()->json([
				'status' => 1,
				'message' => '未找到相关轮播，请联系网站管理员！',
			]);
		}

		return response()->json([
			'status' => 0,
			'slide' => $slide
		]);
	}

	public function update(Request $request)
	{
		$inputs = $request->all();

		if (array_has($inputs, 'id')) {
			$slide = Slide::findOrFail($inputs['id']);
			if (!$slide || $slide->is_delete) {
				return response()->json([
					'status' => 1,
					'message' => '未找到相关轮播，请联系网站管理员！'
				]);
			}
		}else {
			$slide = new Slide;
		}

		if ($request->cover) {
			$slide->cover = $request->cover;
		}

		if ($request->priority) {
			$slide->priority = $request->priority;
		}

		$slide->type = $request->type;

		switch ($request->type) {
			case 'internal':
				$news = News::where('id', $request->news_id)->first();
				if (!$news) {
					return response()->json([
						'status' => 3,
						'message' => '未找到相关站内新闻，请检查 ID 是否正确！'
					]);
				}
				$slide->title = $news->title;
				$slide->target = '/news/' . $request->news_id;
				$slide->news_id = $request->news_id;
				break;
			case 'external':
				$slide->title = $request->title;
				$slide->target = $request->target;
				$slide->news_id = NULL;
				break;
			case 'none':
				$slide->title = $request->title;
				$slide->target = NULL;
				$slide->news_id = NULL;
				break;
			default:
				return response()->json([
					'status' => 2,
					'message' => '类型错误，请联系网站管理员！'
				]);
				break;
		}
		$slide->save();

		return response()->json([
			'status' => 0,
			'message' => '保存成功！'
		]);
	}
}
