<?php

namespace Tests\Feature;

use App\Models\Achievement;
use App\Models\Department;
use App\Models\NewsArticle;
use App\Models\Project;
use App\Models\Sector;
use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class SiteImageTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_change_site_images(): void
    {
        $this->get('/en/admin/media')->assertRedirect(route('login'));
    }

    public function test_an_editor_can_replace_and_remove_the_homepage_image(): void
    {
        Storage::fake('public');
        $editor = User::factory()->create();

        $this->actingAs($editor)
            ->put(route('admin.media.update', ['locale' => 'en']), [
                'image' => UploadedFile::fake()->image('hero.jpg', 1600, 900),
            ])
            ->assertRedirect();

        $path = SiteSetting::value(SiteSetting::HERO);
        $this->assertIsString($path);
        Storage::disk('public')->assertExists($path);

        $this->get('/en')
            ->assertOk()
            ->assertSee('storage\\/site\\/', false);

        $this->actingAs($editor)
            ->put(route('admin.media.update', ['locale' => 'en']), [
                'remove_image' => '1',
            ])
            ->assertRedirect();

        $this->assertNull(SiteSetting::value(SiteSetting::HERO));
        Storage::disk('public')->assertMissing($path);
    }

    public function test_replacing_a_photo_removes_the_previous_file(): void
    {
        Storage::fake('public');
        $editor = User::factory()->create();
        $sector = $this->sector();

        $this->actingAs($editor)->put(
            route('admin.sectors.update', ['locale' => 'en', 'sector' => $sector]),
            [...$this->sectorFields(), 'image' => UploadedFile::fake()->image('first.jpg')],
        )->assertRedirect();

        $first = $sector->refresh()->image_path;
        $this->assertIsString($first);

        $this->actingAs($editor)->put(
            route('admin.sectors.update', ['locale' => 'en', 'sector' => $sector]),
            [...$this->sectorFields(), 'image' => UploadedFile::fake()->image('second.jpg')],
        )->assertRedirect();

        $sector->refresh();
        $this->assertIsString($sector->image_path);
        $this->assertNotSame($first, $sector->image_path);
        Storage::disk('public')->assertMissing($first);
        Storage::disk('public')->assertExists($sector->image_path);
    }

    public function test_an_editor_can_publish_photos_for_each_public_record(): void
    {
        Storage::fake('public');
        $editor = User::factory()->create();
        $sector = $this->sector();

        $this->actingAs($editor)->put(
            route('admin.sectors.update', ['locale' => 'en', 'sector' => $sector]),
            [...$this->sectorFields(), 'image' => UploadedFile::fake()->image('sector.jpg')],
        )->assertRedirect();

        $this->actingAs($editor)->post(route('admin.projects.store', ['locale' => 'en']), [
            'sector_id' => $sector->id,
            'title_ar' => 'مشروع مصور',
            'title_en' => 'Photographed project',
            'summary_ar' => 'ملخص',
            'summary_en' => 'A project with a photo.',
            'status' => 'ongoing',
            'year' => 2026,
            'is_published' => '1',
            'image' => UploadedFile::fake()->image('project.jpg'),
        ])->assertRedirect();

        $this->actingAs($editor)->post(route('admin.news.store', ['locale' => 'en']), [
            'title_ar' => 'خبر بصورة',
            'title_en' => 'News with a photo',
            'scope' => 'local',
            'status' => 'published',
            'image' => UploadedFile::fake()->image('news.jpg'),
        ])->assertRedirect();

        $this->actingAs($editor)->post(route('admin.achievements.store', ['locale' => 'en']), [
            'sector_id' => $sector->id,
            'title_ar' => 'إنجاز مصور',
            'title_en' => 'Photographed achievement',
            'summary_ar' => 'ملخص',
            'summary_en' => 'A result with a photo.',
            'year' => 2026,
            'is_published' => '1',
            'image' => UploadedFile::fake()->image('achievement.jpg'),
        ])->assertRedirect();

        $this->actingAs($editor)->post(route('admin.departments.store', ['locale' => 'en']), [
            'name_ar' => 'قسم مصور',
            'name_en' => 'Photographed department',
            'summary_ar' => 'ملخص',
            'summary_en' => 'A department with a photo.',
            'image' => UploadedFile::fake()->image('department.jpg'),
        ])->assertRedirect();

        $this->assertNotNull(Project::query()->where('title_en', 'Photographed project')->value('image_path'));
        $this->assertNotNull(NewsArticle::query()->where('title_en', 'News with a photo')->value('image_path'));
        $this->assertNotNull(Achievement::query()->where('title_en', 'Photographed achievement')->value('image_path'));
        $this->assertNotNull(Department::query()->where('name_en', 'Photographed department')->value('image_path'));

        $this->actingAs($editor)->post(route('admin.staff.store', ['locale' => 'en']), [
            'department_id' => Department::query()->where('name_en', 'Photographed department')->value('id'),
            'roster' => 'staff',
            'name_ar' => 'موظف مصور',
            'name_en' => 'Photographed staff',
            'title_ar' => 'مسمى',
            'title_en' => 'Specialist',
            'is_published' => '1',
            'photo' => UploadedFile::fake()->image('staff.jpg'),
        ])->assertRedirect();

        $this->actingAs($editor)->get('/en/admin/sectors')->assertOk()->assertSee('storage\\/sectors\\/', false);
        $this->actingAs($editor)->get('/en/admin/departments')->assertOk()->assertSee('storage\\/departments\\/', false);
        $this->actingAs($editor)->get('/en/admin/projects')->assertOk()->assertSee('storage\\/projects\\/', false);
        $this->actingAs($editor)->get('/en/admin/news')->assertOk()->assertSee('storage\\/news\\/', false);
        $this->actingAs($editor)->get('/en/admin/achievements')->assertOk()->assertSee('storage\\/achievements\\/', false);
        $this->actingAs($editor)->get('/en/admin/staff')->assertOk()->assertSee('storage\\/staff\\/', false);

        $this->get('/en/sectors')->assertOk()->assertSee('storage\\/sectors\\/', false);
        $this->get('/en/projects')->assertOk()->assertSee('storage\\/projects\\/', false);
        $this->get('/en/news')->assertOk()->assertSee('storage\\/news\\/', false);
        $this->get('/en/achievements')->assertOk()->assertSee('storage\\/achievements\\/', false);
        $this->get('/en/departments')->assertOk()->assertSee('storage\\/departments\\/', false);
    }

    public function test_a_file_that_is_not_an_image_is_rejected(): void
    {
        Storage::fake('public');
        $editor = User::factory()->create();

        $this->actingAs($editor)
            ->put(route('admin.media.update', ['locale' => 'en']), [
                'image' => UploadedFile::fake()->create('notes.txt', 20, 'text/plain'),
            ])
            ->assertSessionHasErrors('image');

        $this->assertNull(SiteSetting::value(SiteSetting::HERO));
    }

    private function sector(): Sector
    {
        return Sector::query()->create([
            'slug' => 'renewable',
            'name_ar' => 'المتجددة',
            'name_en' => 'Renewable',
            'summary_ar' => 'ملخص',
            'summary_en' => 'Summary',
            'sort_order' => 1,
        ]);
    }

    /**
     * @return array<string, string>
     */
    private function sectorFields(): array
    {
        return [
            'name_ar' => 'المتجددة',
            'name_en' => 'Renewable',
            'summary_ar' => 'ملخص',
            'summary_en' => 'Summary',
            'sort_order' => '1',
        ];
    }
}
