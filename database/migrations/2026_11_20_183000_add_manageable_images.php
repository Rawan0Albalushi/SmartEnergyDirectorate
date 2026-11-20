<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('site_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->timestamps();
        });

        foreach (['sectors', 'departments', 'projects', 'news_articles', 'achievements'] as $table) {
            Schema::table($table, function (Blueprint $blueprint) {
                $blueprint->string('image_path')->nullable();
            });
        }
    }

    public function down(): void
    {
        foreach (['sectors', 'departments', 'projects', 'news_articles', 'achievements'] as $table) {
            Schema::table($table, function (Blueprint $blueprint) {
                $blueprint->dropColumn('image_path');
            });
        }

        Schema::dropIfExists('site_settings');
    }
};
