<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Slide;

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
}
