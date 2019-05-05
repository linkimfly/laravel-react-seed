<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Type;

class TypeController extends Controller
{
    public function index()
	{
		$types = Type::all();
		return response()->json([
			'types' => $types
		]);
	}
}
