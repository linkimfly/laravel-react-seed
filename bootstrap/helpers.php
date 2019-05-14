<?php

    /**
     * 获取配置值
     *
     */
    function setting($key, $default=null)
    {
        return App\Models\Setting::getSetting($key) ?: $default;
    }
