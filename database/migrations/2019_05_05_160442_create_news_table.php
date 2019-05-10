<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateNewsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('news', function (Blueprint $table) {
            $table->increments('id');
			$table->string('title');
			$table->string('type');
			$table->string('author');
			$table->longText('content_raw')->nullable();
			$table->longText('content_html')->nullable();
			$table->longText('attachments')->nullable();
			$table->integer('view')->default(0);
			$table->boolean('is_top')->default(0);
			$table->boolean('is_delete')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('news');
    }
}
