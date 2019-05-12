<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class UploadController extends Controller
{
    public function uploadFile(Request $request)
	{
		$file = $request->file;
		$fileName = $file->getClientOriginalName();
		$fileNameMD5 = md5_file($file) . '.' . $file->extension();
		$fileUrl = '/storage/files/' . $fileNameMD5;
		$file->storeAs('public/files', $fileNameMD5);

		return response()->json([
			'url' => $fileUrl
		]);
	}
}
