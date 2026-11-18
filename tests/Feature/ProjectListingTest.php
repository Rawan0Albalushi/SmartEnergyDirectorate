<?php

namespace Tests\Feature;

use App\Enums\ProjectStatus;
use App\Models\Project;
use App\Models\Sector;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProjectListingTest extends TestCase
{
    use RefreshDatabase;

    public function test_home_and_the_archive_show_published_projects_by_sector(): void
    {
        $renewable = $this->sector('renewable', 'Renewable energy', 'الطاقة المتجددة');
        $power = $this->sector('electricity', 'Electricity', 'الكهرباء');

        $this->project($renewable, 'solar-plant', 'Solar plant', 'محطة شمسية', true);
        $this->project($power, 'substation-work', 'Substation work', 'تحديث المحطات', true);
        $this->project($renewable, 'hidden-plant', 'Hidden plant', 'محطة مخفية', false);

        $this->get('/en')
            ->assertOk()
            ->assertSee('Solar plant')
            ->assertSee('Substation work')
            ->assertDontSee('Hidden plant');

        $this->get('/en/projects?sector=renewable')
            ->assertOk()
            ->assertSee('Solar plant')
            ->assertDontSee('Substation work')
            ->assertDontSee('Hidden plant');

        $this->get('/en/projects?sector=missing')
            ->assertOk()
            ->assertSee('Solar plant')
            ->assertSee('Substation work');
    }

    private function sector(string $slug, string $nameEn, string $nameAr): Sector
    {
        return Sector::query()->create([
            'slug' => $slug,
            'name_ar' => $nameAr,
            'name_en' => $nameEn,
            'summary_ar' => 'ملخص',
            'summary_en' => 'Summary',
        ]);
    }

    private function project(Sector $sector, string $slug, string $titleEn, string $titleAr, bool $published): void
    {
        Project::query()->create([
            'sector_id' => $sector->id,
            'slug' => $slug,
            'title_ar' => $titleAr,
            'title_en' => $titleEn,
            'summary_ar' => 'ملخص المشروع',
            'summary_en' => 'Project summary',
            'status' => ProjectStatus::Ongoing,
            'location_en' => 'Interior region',
            'location_ar' => 'المنطقة الداخلية',
            'year' => 2026,
            'is_published' => $published,
        ]);
    }
}
