<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Auth;

class AdminController extends Controller
{
    /**
     * 后台入口
     */
    public function index()
    {
		$user = Auth::user();
        return view('admin', ['user' => $user]);
    }
}
