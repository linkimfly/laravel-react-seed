<?php

    /**
     * 获取配置值
     *
     */
    function setting($key, $default=null)
    {
        return App\Models\Setting::getSetting($key) ?: $default;
    }

	/**
     * 获取配置值
     *
     */
	 function themeUrl($url)
	 {
		 $theme = setting('web_theme');
		 if ($theme) {
		 	return 'theme-' . $theme . '/' . $url;
		}else {
			return $url;
		}
	 }
