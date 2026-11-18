<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('staff_members', function (Blueprint $table) {
            $table->string('roster')->default('staff')->after('department_id');
            $table->text('bio_ar')->nullable()->after('title_en');
            $table->text('bio_en')->nullable()->after('bio_ar');
            $table->string('photo_path')->nullable()->after('email');
            $table->index(['roster', 'is_published', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::table('staff_members', function (Blueprint $table) {
            $table->dropIndex(['roster', 'is_published', 'sort_order']);
            $table->dropColumn(['roster', 'bio_ar', 'bio_en', 'photo_path']);
        });
    }
};
