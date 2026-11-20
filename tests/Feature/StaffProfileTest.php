<?php

namespace Tests\Feature;

use App\Enums\StaffRoster;
use App\Models\Department;
use App\Models\StaffMember;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class StaffProfileTest extends TestCase
{
    use RefreshDatabase;

    public function test_visitors_open_staff_and_board_as_separate_rosters(): void
    {
        $department = $this->department();

        $this->member($department, StaffRoster::Staff, 'Layla Public', 'ليلى ظاهرة', 'Checks the readings.');
        $this->member($department, StaffRoster::Board, 'Chair Public', 'رئيس ظاهر', 'Chairs the board.');
        $this->member($department, StaffRoster::Staff, 'Hidden Person', 'شخص مخفي', 'Stays hidden.', false);

        $this->get('/en/departments/planning')
            ->assertOk()
            ->assertSee('Layla Public')
            ->assertSee('Checks the readings.')
            ->assertDontSee('Chair Public')
            ->assertDontSee('Hidden Person');

        $this->get('/en/departments?roster=staff')
            ->assertOk()
            ->assertSee('Layla Public')
            ->assertDontSee('Chair Public')
            ->assertDontSee('Hidden Person');

        $this->get('/en/departments?roster=board')
            ->assertOk()
            ->assertSee('Chair Public')
            ->assertSee('Chairs the board.')
            ->assertDontSee('Layla Public');
    }

    public function test_an_editor_can_publish_a_portrait_with_a_biography(): void
    {
        Storage::fake('public');
        $department = $this->department();
        $editor = User::factory()->create();

        $this->actingAs($editor)
            ->post(route('admin.staff.store', ['locale' => 'en']), [
                'department_id' => $department->id,
                'roster' => 'board',
                'name_ar' => 'فاطمة',
                'name_en' => 'Fatima Portrait',
                'title_ar' => 'عضو',
                'title_en' => 'Member',
                'bio_ar' => 'تتابع النشر.',
                'bio_en' => 'Follows publication.',
                'email' => 'fatima@energy.local',
                'photo' => UploadedFile::fake()->image('portrait.jpg', 600, 800),
                'is_published' => '1',
                'sort_order' => 1,
            ])
            ->assertRedirect();

        $member = StaffMember::query()->where('name_en', 'Fatima Portrait')->first();
        $this->assertNotNull($member);
        $this->assertSame(StaffRoster::Board, $member->roster);
        $this->assertIsString($member->photo_path);
        Storage::disk('public')->assertExists($member->photo_path);

        $this->get('/en/departments?roster=board')
            ->assertOk()
            ->assertSee('Fatima Portrait')
            ->assertSee('Follows publication.')
            ->assertSee('storage\\/staff\\/', false);
    }

    public function test_an_editor_can_update_a_profile_with_a_file_field_present(): void
    {
        Storage::fake('public');
        $department = $this->department();
        $editor = User::factory()->create();
        $member = StaffMember::query()->create([
            'department_id' => $department->id,
            'roster' => StaffRoster::Staff,
            'name_ar' => 'ليلى الحسن',
            'name_en' => 'Layla Al Hasan',
            'title_ar' => 'رئيسة القسم',
            'title_en' => 'Head of section',
            'is_published' => true,
            'sort_order' => 1,
        ]);

        $this->actingAs($editor)
            ->post(route('admin.staff.update', ['locale' => 'ar', 'staffMember' => $member]), [
                '_method' => 'put',
                'department_id' => $department->id,
                'roster' => 'staff',
                'name_ar' => 'ليلى الحسن',
                'name_en' => 'Layla Al Hasan',
                'title_ar' => 'رئيسة القسم',
                'title_en' => 'Head of section',
                'bio_ar' => '',
                'bio_en' => '',
                'email' => '',
                'photo' => '',
                'remove_photo' => '0',
                'is_published' => '1',
                'sort_order' => '1',
            ])
            ->assertRedirect(route('admin.staff.index', ['locale' => 'ar']));

        $member->refresh();
        $this->assertSame('Layla Al Hasan', $member->name_en);
        $this->assertNull($member->photo_path);
    }

    private function department(): Department
    {
        return Department::query()->create([
            'slug' => 'planning',
            'name_ar' => 'التخطيط',
            'name_en' => 'Planning',
            'summary_ar' => 'ملخص',
            'summary_en' => 'Summary',
            'sort_order' => 1,
        ]);
    }

    private function member(
        Department $department,
        StaffRoster $roster,
        string $nameEn,
        string $nameAr,
        string $bioEn,
        bool $published = true,
    ): void {
        StaffMember::query()->create([
            'department_id' => $department->id,
            'roster' => $roster,
            'name_ar' => $nameAr,
            'name_en' => $nameEn,
            'title_ar' => 'مسمى',
            'title_en' => 'Title',
            'bio_en' => $bioEn,
            'is_published' => $published,
            'sort_order' => 1,
        ]);
    }
}
