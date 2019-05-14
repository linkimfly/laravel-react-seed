<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\News;

class HomeController extends Controller
{
    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
		$notices = News::where('is_delete', 0)
						->where('type', 'notices')
						->orderBy('is_top', 'desc')
						->orderBy('created_at', 'desc')
						->limit(15)
						->get();
		$downloads = News::where('is_delete', 0)
						->where('type', 'downloads')
						->orderBy('is_top', 'desc')
						->orderBy('created_at', 'desc')
						->limit(5)
						->get();
		$productions = News::where('is_delete', 0)
						->where('type', 'productions')
						->orderBy('is_top', 'desc')
						->orderBy('created_at', 'desc')
						->limit(5)
						->get();
        return view(themeUrl('home'), [
			'notices' => $notices,
			'downloads' => $downloads,
			'productions' => $productions,
		]);
    }
}
