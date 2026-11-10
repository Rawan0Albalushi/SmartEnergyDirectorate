<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sectors', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name_ar');
            $table->string('name_en');
            $table->string('summary_ar');
            $table->string('summary_en');
            $table->text('body_ar')->nullable();
            $table->text('body_en')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('departments', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name_ar');
            $table->string('name_en');
            $table->string('summary_ar');
            $table->string('summary_en');
            $table->text('mandate_ar')->nullable();
            $table->text('mandate_en')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('news_sources', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sector_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name_ar');
            $table->string('name_en');
            $table->string('feed_url', 2048);
            $table->string('locale', 2);
            $table->string('scope');
            $table->boolean('is_active')->default(true);
            $table->timestamp('last_fetched_at')->nullable();
            $table->text('last_error')->nullable();
            $table->timestamps();

            $table->index(['is_active', 'id']);
        });

        Schema::create('indicators', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sector_id')->constrained();
            $table->string('name_ar');
            $table->string('name_en');
            $table->decimal('value', 14, 3);
            $table->string('unit_ar', 50);
            $table->string('unit_en', 50);
            $table->string('period_label', 50);
            $table->date('recorded_on');
            $table->text('notes_ar')->nullable();
            $table->text('notes_en')->nullable();
            $table->boolean('is_published')->default(false);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index(['is_published', 'sector_id', 'recorded_on']);
        });

        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sector_id')->constrained();
            $table->string('slug')->unique();
            $table->string('title_ar');
            $table->string('title_en');
            $table->text('summary_ar');
            $table->text('summary_en');
            $table->text('body_ar')->nullable();
            $table->text('body_en')->nullable();
            $table->string('status');
            $table->string('location_ar')->nullable();
            $table->string('location_en')->nullable();
            $table->unsignedSmallInteger('year');
            $table->boolean('is_published')->default(false);
            $table->timestamps();

            $table->index(['is_published', 'year', 'id']);
        });

        Schema::create('achievements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sector_id')->nullable()->constrained()->nullOnDelete();
            $table->string('title_ar');
            $table->string('title_en');
            $table->text('summary_ar');
            $table->text('summary_en');
            $table->unsignedSmallInteger('year');
            $table->boolean('is_published')->default(false);
            $table->timestamps();

            $table->index(['is_published', 'year', 'id']);
        });

        Schema::create('news_articles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sector_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('news_source_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('slug')->unique();
            $table->string('title_ar')->nullable();
            $table->string('title_en')->nullable();
            $table->text('summary_ar')->nullable();
            $table->text('summary_en')->nullable();
            $table->text('body_ar')->nullable();
            $table->text('body_en')->nullable();
            $table->string('scope');
            $table->string('origin');
            $table->string('status');
            $table->string('source_name')->nullable();
            $table->string('original_url', 2048)->nullable();
            $table->string('external_guid', 512)->nullable()->unique();
            $table->timestamp('published_at')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();

            $table->index(['status', 'published_at', 'id']);
        });

        Schema::create('staff_members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('department_id')->constrained()->cascadeOnDelete();
            $table->string('name_ar');
            $table->string('name_en');
            $table->string('title_ar');
            $table->string('title_en');
            $table->string('email')->nullable();
            $table->boolean('is_published')->default(false);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index(['department_id', 'is_published', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('staff_members');
        Schema::dropIfExists('news_articles');
        Schema::dropIfExists('achievements');
        Schema::dropIfExists('projects');
        Schema::dropIfExists('indicators');
        Schema::dropIfExists('news_sources');
        Schema::dropIfExists('departments');
        Schema::dropIfExists('sectors');
    }
};
