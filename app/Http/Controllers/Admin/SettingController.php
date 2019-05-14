<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Setting;

class SettingController extends Controller
{
	public function index(Request $request)
    {
        $settings = Setting::getSettings($request->keys);
        return response()->json([
            'settings' => $settings
        ]);
    }

    public function update(Request $request)
    {
        $settings = $request->all();
        foreach ($settings as $key => $value) {
            $setting = Setting::where('key', $key)->first();
            if ($setting) {
                $setting->value = $value;
                $setting->save();
            }else {
                $setting = new Setting();
                $setting->key = $key;
                $setting->value = $value;
                $setting->save();
            }
        }
        return response()->json([
            'message' => '保存成功！'
        ]);
    }
}
