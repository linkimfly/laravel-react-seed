let mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.js('resources/assets/js/app.js', 'public/js')
		.react('resources/assets/js/admin.js', 'public/js')
		.sass('resources/assets/sass/app.scss', 'public/css');

mix.webpackConfig({
	module: {
		rules: [{
	    test: /\.less$/,
	    use: [{
	      loader: 'less-loader', // compiles Less to CSS
	      options: {
	        modifyVars: {
	          'primary-color': '#13c2c2',
						'@link-color': '#1890ff',
	        },
	        javascriptEnabled: true,
	      },
	    }],
	  }],
	}
})
