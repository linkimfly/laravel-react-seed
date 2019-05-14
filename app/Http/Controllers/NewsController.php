<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\News;
use App\Models\Type;

class NewsController extends Controller
{
    public function index(Request $request)
	{
		$type = $request->type;

		$news = News::where('is_delete', 0)->where('type', $type)->paginate(20);
		$type = Type::where('code', $type)->first();

		return view(themeUrl('news.index'), [
			'news' => $news,
			'type' => $type->name,
		]);
	}

	public function show($id)
	{
		$currentNews = News::findOrFail($id);

		if ($currentNews->is_delete) {
			session()->flash('error', '未找到新闻！');
			return back();
		}

		$currentNews->type = $currentNews->getType;

		return view(themeUrl('news.show'), [
			'currentNews' => $currentNews
		]);
	}
}
