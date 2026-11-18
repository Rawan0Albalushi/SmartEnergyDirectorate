<?php

namespace Database\Seeders;

use App\Enums\ContentOrigin;
use App\Enums\NewsScope;
use App\Enums\NewsStatus;
use App\Enums\ProjectStatus;
use App\Enums\StaffRoster;
use App\Models\Achievement;
use App\Models\Department;
use App\Models\Indicator;
use App\Models\NewsArticle;
use App\Models\NewsSource;
use App\Models\Project;
use App\Models\Sector;
use App\Models\StaffMember;
use App\Models\User;
use Illuminate\Database\Seeder;

class DirectorateSeeder extends Seeder
{
    public function run(): void
    {
        $this->admin();

        $sectors = $this->sectors();
        $this->indicators($sectors);
        $this->projects($sectors);
        $this->achievements($sectors);
        $this->news($sectors);
        $this->sources($sectors);
        $this->departments();
    }

    private function admin(): void
    {
        $email = config('directorate.admin_email');
        $password = config('directorate.admin_password');

        if (! is_string($email) || $email === '' || ! is_string($password) || $password === '') {
            return;
        }

        $user = User::query()->updateOrCreate(
            ['email' => $email],
            [
                'name' => 'System administrator',
                'password' => $password,
            ],
        );

        if ($user->email_verified_at === null) {
            $user->forceFill(['email_verified_at' => now()])->save();
        }
    }

    /**
     * @return array<string, Sector>
     */
    private function sectors(): array
    {
        $rows = [
            [
                'slug' => 'renewable',
                'name_ar' => 'الطاقة المتجددة',
                'name_en' => 'Renewable energy',
                'summary_ar' => 'القدرة المركبة ومساهمة المصادر المتجددة في التوليد.',
                'summary_en' => 'Installed capacity and the share of renewable generation.',
                'body_ar' => 'يتابع هذا القطاع محطات الشمس والرياح والطاقة الحيوية، ويعرض القدرة المركبة ونسبة المساهمة في الكهرباء المولدة. الأرقام تُدخل من الإدارة وتُحدَّث عند صدور قراءة جديدة.',
                'body_en' => 'This sector follows solar, wind, and bioenergy plants. It publishes installed capacity and the share of generated electricity. Figures are entered by the directorate when a new reading is released.',
                'sort_order' => 1,
            ],
            [
                'slug' => 'hydrogen',
                'name_ar' => 'الهيدروجين',
                'name_en' => 'Hydrogen',
                'summary_ar' => 'المشاريع التجريبية والطاقة الإنتاجية للهيدروجين منخفض الكربون.',
                'summary_en' => 'Pilot projects and production capacity for low-carbon hydrogen.',
                'body_ar' => 'يعرض القطاع مشاريع الهيدروجين التجريبي والتجاري، والطاقة الإنتاجية السنوية، وارتباطها بمصادر الكهرباء المتجددة.',
                'body_en' => 'The sector lists pilot and commercial hydrogen projects, annual production capacity, and the link to renewable electricity.',
                'sort_order' => 2,
            ],
            [
                'slug' => 'electricity',
                'name_ar' => 'الكهرباء',
                'name_en' => 'Electricity',
                'summary_ar' => 'الحمل الأقصى وفاقد الشبكة ومشاريع تقوية المنظومة.',
                'summary_en' => 'Peak load, network losses, and grid reinforcement projects.',
                'body_ar' => 'يجمع القطاع مؤشرات التشغيل الأساسية: الحمل الأقصى، فاقد الشبكة، ومشاريع محطات التحويل وخطوط النقل.',
                'body_en' => 'The sector gathers the main operating indicators: peak load, network losses, and substation and transmission projects.',
                'sort_order' => 3,
            ],
            [
                'slug' => 'efficiency',
                'name_ar' => 'كفاءة الطاقة',
                'name_en' => 'Energy efficiency',
                'summary_ar' => 'الطاقة الموفرة والمباني التي أُعيد تأهيلها.',
                'summary_en' => 'Energy saved and buildings that have been retrofitted.',
                'body_ar' => 'يتابع القطاع برامج الترشيد في المباني العامة والخاصة، وكمية الطاقة التي تم تجنب استهلاكها.',
                'body_en' => 'The sector follows efficiency programmes in public and private buildings, and the energy consumption that was avoided.',
                'sort_order' => 4,
            ],
        ];

        $sectors = [];

        foreach ($rows as $row) {
            $sectors[$row['slug']] = Sector::query()->updateOrCreate(['slug' => $row['slug']], $row);
        }

        return $sectors;
    }

    /**
     * @param  array<string, Sector>  $sectors
     */
    private function indicators(array $sectors): void
    {
        $rows = [
            ['renewable', 'القدرة المركبة', 'Installed capacity', 650, 'ميغاواط', 'MW', '2025', '2025-12-01', 0],
            ['renewable', 'مساهمة التوليد', 'Share of generation', 18, '٪', '%', '2025', '2025-06-01', 1],
            ['hydrogen', 'الطاقة الإنتاجية السنوية', 'Annual production capacity', 800, 'طن', 'tonnes', '2025', '2025-12-01', 0],
            ['hydrogen', 'مشاريع تجريبية', 'Pilot projects', 12, 'مشروع', 'projects', '2025', '2025-06-01', 1],
            ['electricity', 'الحمل الأقصى', 'Peak load', 7.4, 'غيغاواط', 'GW', '2025', '2025-12-01', 0],
            ['electricity', 'فاقد الشبكة', 'Network losses', 6.2, '٪', '%', '2025', '2025-06-01', 1],
            ['efficiency', 'الطاقة الموفرة', 'Energy saved', 420, 'غيغاواط ساعة', 'GWh', '2025', '2025-12-01', 0],
            ['efficiency', 'مبانٍ أعيد تأهيلها', 'Retrofitted buildings', 35, 'مبنى', 'buildings', '2025', '2025-06-01', 1],
        ];

        foreach ($rows as [$slug, $nameAr, $nameEn, $value, $unitAr, $unitEn, $period, $date, $sort]) {
            Indicator::query()->updateOrCreate(
                ['sector_id' => $sectors[$slug]->id, 'name_en' => $nameEn],
                [
                    'name_ar' => $nameAr,
                    'value' => $value,
                    'unit_ar' => $unitAr,
                    'unit_en' => $unitEn,
                    'period_label' => $period,
                    'recorded_on' => $date,
                    'is_published' => true,
                    'sort_order' => $sort,
                ],
            );
        }
    }

    /**
     * @param  array<string, Sector>  $sectors
     */
    private function projects(array $sectors): void
    {
        $rows = [
            [
                'slug' => 'solar-plant-phase-one',
                'sector' => 'renewable',
                'title_ar' => 'محطة شمسية — المرحلة الأولى',
                'title_en' => 'Solar plant, phase one',
                'summary_ar' => 'محطة بقدرة 200 ميغاواط قيد التنفيذ، وترتبط بشبكة النقل الحالية.',
                'summary_en' => 'A 200 MW plant under construction, connected to the existing transmission network.',
                'body_ar' => 'تشمل المرحلة أعمال الموقع وربط المحطة. موعد التشغيل المستهدف خلال عام 2026، وتُحدَّث الحالة من لوحة الإدارة.',
                'body_en' => 'This phase covers the site works and the grid connection. Commissioning is targeted during 2026, and the status is updated from the admin desk.',
                'status' => ProjectStatus::Ongoing,
                'location_ar' => 'المنطقة الداخلية',
                'location_en' => 'Interior region',
                'year' => 2026,
            ],
            [
                'slug' => 'hydrogen-pilot',
                'sector' => 'hydrogen',
                'title_ar' => 'برنامج الهيدروجين التجريبي',
                'title_en' => 'Hydrogen pilot programme',
                'summary_ar' => 'وحدة تحليل كهربائي مرتبطة بمحطة طاقة متجددة، بطاقة مبدئية محدودة.',
                'summary_en' => 'An electrolysis unit tied to a renewable plant, with a limited first capacity.',
                'body_ar' => 'البرنامج ما زال في التخطيط. يقيس استهلاك الكهرباء لكل طن، ويحدد موقع التخزين قبل الانتقال إلى مرحلة التنفيذ.',
                'body_en' => 'The programme is still being planned. It measures electricity used per tonne and fixes the storage site before construction starts.',
                'status' => ProjectStatus::Planned,
                'location_ar' => 'المنطقة الساحلية',
                'location_en' => 'Coastal region',
                'year' => 2027,
            ],
            [
                'slug' => 'substation-upgrade',
                'sector' => 'electricity',
                'title_ar' => 'تحديث محطات التحويل',
                'title_en' => 'Substation modernisation',
                'summary_ar' => 'استبدال محولات ورفع سعة أربع محطات لخفض الاختناق في أوقات الذروة.',
                'summary_en' => 'Replacing transformers and raising the capacity of four substations to ease peak congestion.',
                'body_ar' => 'يجري العمل على محطتين، واثنتان في جدول العام نفسه. المؤشر المرتبط هو الحمل الأقصى وفاقد الشبكة.',
                'body_en' => 'Work is underway at two sites, with two more scheduled in the same year. The related indicators are peak load and network losses.',
                'status' => ProjectStatus::Ongoing,
                'location_ar' => 'عدة مواقع',
                'location_en' => 'Several sites',
                'year' => 2025,
            ],
            [
                'slug' => 'public-building-retrofit',
                'sector' => 'efficiency',
                'title_ar' => 'إعادة تأهيل المباني العامة',
                'title_en' => 'Public building retrofit',
                'summary_ar' => 'اكتمل تأهيل عشرين مبنى عبر الإضاءة والعزل وأنظمة التحكم.',
                'summary_en' => 'Twenty buildings were retrofitted through lighting, insulation, and controls.',
                'body_ar' => 'أُغلق البرنامج للدفعة الأولى. الطاقة الموفرة تُحسب سنويًا وتظهر في مؤشر كفاءة الطاقة.',
                'body_en' => 'The first batch is closed. Avoided energy is calculated each year and appears in the efficiency indicator.',
                'status' => ProjectStatus::Completed,
                'location_ar' => 'المباني الحكومية',
                'location_en' => 'Government buildings',
                'year' => 2024,
            ],
        ];

        foreach ($rows as $row) {
            $sector = $row['sector'];
            unset($row['sector']);
            Project::query()->updateOrCreate(
                ['slug' => $row['slug']],
                [...$row, 'sector_id' => $sectors[$sector]->id, 'is_published' => true],
            );
        }
    }

    /**
     * @param  array<string, Sector>  $sectors
     */
    private function achievements(array $sectors): void
    {
        $rows = [
            ['نشر أول حزمة مؤشرات موحدة', 'First unified indicator release', 'أصبحت قراءات القطاعات الأربعة متاحة للجمهور في صفحة واحدة.', 'Readings for the four sectors are available to the public on one page.', 2025, 'renewable'],
            ['اعتماد مصادر الأخبار', 'News sources approved', 'حُددت مصادر المتابعة، وتصل المواد الجديدة إلى المراجعة قبل ظهورها للزوار.', 'Monitoring sources were selected. New items reach review before visitors can see them.', 2025, null],
            ['إغلاق دفعة التأهيل الأولى', 'First retrofit batch closed', 'اكتمل العمل في عشرين مبنى عامًا، وسُجلت الطاقة الموفرة في المؤشرات.', 'Work finished in twenty public buildings, and the energy saved was recorded.', 2024, 'efficiency'],
        ];

        foreach ($rows as [$titleAr, $titleEn, $summaryAr, $summaryEn, $year, $sector]) {
            Achievement::query()->updateOrCreate(
                ['title_en' => $titleEn],
                [
                    'title_ar' => $titleAr,
                    'summary_ar' => $summaryAr,
                    'summary_en' => $summaryEn,
                    'year' => $year,
                    'sector_id' => $sector === null ? null : $sectors[$sector]->id,
                    'is_published' => true,
                ],
            );
        }
    }

    /**
     * @param  array<string, Sector>  $sectors
     */
    private function news(array $sectors): void
    {
        $rows = [
            [
                'slug' => 'indicator-release-2025',
                'title_ar' => 'صدور قراءات عام 2025',
                'title_en' => '2025 readings published',
                'summary_ar' => 'نُشرت القدرة المركبة للطاقة المتجددة والحمل الأقصى وكمية الطاقة الموفرة.',
                'summary_en' => 'Renewable capacity, peak load, and energy saved were published for 2025.',
                'body_ar' => 'يمكن الاطلاع على التفاصيل داخل كل قطاع. القراءة التالية تُضاف من لوحة الإدارة عند اعتمادها.',
                'body_en' => 'Details sit inside each sector. The next reading is added from the admin desk once it is approved.',
                'scope' => NewsScope::Local,
                'status' => NewsStatus::Published,
                'sector' => 'renewable',
                'published_at' => '2025-12-15 08:00:00',
            ],
            [
                'slug' => 'hydrogen-pilot-note',
                'title_ar' => 'تحديد موقع البرنامج التجريبي للهيدروجين',
                'title_en' => 'Hydrogen pilot site selected',
                'summary_ar' => 'اختير موقع ساحلي للوحدة التجريبية، وما زال البرنامج في مرحلة التخطيط.',
                'summary_en' => 'A coastal site was selected for the pilot unit. The programme remains in planning.',
                'body_ar' => 'لا يبدأ التنفيذ قبل اكتمال دراسة الربط الكهربائي. صفحة المشروع تعرض الحالة الحالية.',
                'body_en' => 'Construction does not start before the grid-connection study is complete. The project page shows the current state.',
                'scope' => NewsScope::Local,
                'status' => NewsStatus::Published,
                'sector' => 'hydrogen',
                'published_at' => '2026-02-02 08:00:00',
            ],
            [
                'slug' => 'international-grid-note',
                'title_ar' => 'متابعة دولية لتخزين الكهرباء',
                'title_en' => 'International note on electricity storage',
                'summary_ar' => 'ترصد المديرية تجارب التخزين المرتبطة بالمصادر المتجددة، وتنشر الخلاصة بعد المراجعة.',
                'summary_en' => 'The directorate follows storage trials linked to renewable generation and publishes a summary after review.',
                'body_ar' => 'هذه مادة تحرير يدوي. الأخبار المجلوبة آليًا تبقى في قائمة المراجعة حتى يعتمدها المسؤول.',
                'body_en' => 'This item was written by hand. Automatically fetched news stays in the review list until an editor publishes it.',
                'scope' => NewsScope::International,
                'status' => NewsStatus::Published,
                'sector' => 'electricity',
                'published_at' => '2026-03-11 08:00:00',
            ],
            [
                'slug' => 'solar-connection-batch',
                'title_ar' => 'ربط دفعة جديدة من المحطات الشمسية',
                'title_en' => 'New solar plants connected',
                'summary_ar' => 'أُضيفت قدرة شمسية جديدة إلى سجل الربط، وستظهر في مؤشر القدرة المركبة بعد اعتماد القراءة.',
                'summary_en' => 'New solar capacity was added to the connection register and will appear in installed capacity after the reading is approved.',
                'body_ar' => 'الدفعة تشمل محطات موزعة على أكثر من موقع. التفاصيل التشغيلية تبقى داخل قطاع الطاقة المتجددة.',
                'body_en' => 'The batch covers plants at more than one site. Operating detail stays inside the renewable energy sector.',
                'scope' => NewsScope::Local,
                'status' => NewsStatus::Published,
                'sector' => 'renewable',
                'published_at' => '2026-09-04 08:00:00',
            ],
            [
                'slug' => 'coastal-wind-reading',
                'title_ar' => 'تحديث قراءة الرياح على الساحل',
                'title_en' => 'Coastal wind reading updated',
                'summary_ar' => 'نُشرت قراءة محدّثة لإنتاج الرياح الساحلي ضمن سلسلة مؤشرات عام 2026.',
                'summary_en' => 'An updated coastal wind reading was published in the 2026 indicator series.',
                'body_ar' => 'القراءة لا تغيّر حالة المشاريع القائمة. صفحة القطاع تعرض الرقم بعد المراجعة.',
                'body_en' => 'The reading does not change the status of existing projects. The sector page shows the figure after review.',
                'scope' => NewsScope::Local,
                'status' => NewsStatus::Published,
                'sector' => 'renewable',
                'published_at' => '2026-08-18 08:00:00',
            ],
            [
                'slug' => 'building-retrofit-round',
                'title_ar' => 'انطلاق دفعة جديدة لتأهيل المباني',
                'title_en' => 'New building retrofit round starts',
                'summary_ar' => 'بدأت دفعة تأهيل للمباني العامة، وتُحتسب الطاقة المتجنَّبة عند إغلاق الأعمال.',
                'summary_en' => 'A new retrofit round for public buildings has started. Avoided energy is counted when the work closes.',
                'body_ar' => 'القائمة تشمل مبانٍ إدارية ومدارس. الرقم النهائي يُضاف إلى مؤشر كفاءة الطاقة.',
                'body_en' => 'The list includes administrative buildings and schools. The final figure is added to the efficiency indicator.',
                'scope' => NewsScope::Local,
                'status' => NewsStatus::Published,
                'sector' => 'efficiency',
                'published_at' => '2026-07-22 08:00:00',
            ],
            [
                'slug' => 'substation-reinforcement',
                'title_ar' => 'أعمال تقوية في محطة تحويل',
                'title_en' => 'Reinforcement work at a substation',
                'summary_ar' => 'بدأت أعمال تقوية في محطة تحويل لرفع قدرة الاستيعاب قبل موسم الحمل الأعلى.',
                'summary_en' => 'Reinforcement work started at a substation to raise capacity ahead of the peak-load season.',
                'body_ar' => 'العمل لا يغيّر رقم الحمل الأقصى المنشور. التحديث التالي يصدر بعد القياس.',
                'body_en' => 'The work does not change the published peak-load figure. The next update follows measurement.',
                'scope' => NewsScope::Local,
                'status' => NewsStatus::Published,
                'sector' => 'electricity',
                'published_at' => '2026-06-09 08:00:00',
            ],
            [
                'slug' => 'school-efficiency-note',
                'title_ar' => 'ملاحظة عن ترشيد الاستهلاك في المدارس',
                'title_en' => 'Note on efficiency in schools',
                'summary_ar' => 'رُصدت دفعة قياس للاستهلاك في مدارس مختارة ضمن برنامج كفاءة الطاقة.',
                'summary_en' => 'A measurement batch recorded consumption in selected schools under the efficiency programme.',
                'body_ar' => 'النتائج الأولية للمراجعة الداخلية، ولا تُنشر كمؤشر إلا بعد الاعتماد.',
                'body_en' => 'Early results stay in internal review and are not published as an indicator until approved.',
                'scope' => NewsScope::Local,
                'status' => NewsStatus::Published,
                'sector' => 'efficiency',
                'published_at' => '2026-05-14 08:00:00',
            ],
            [
                'slug' => 'hydrogen-study-update',
                'title_ar' => 'تحديث دراسة الربط لبرنامج الهيدروجين',
                'title_en' => 'Hydrogen connection study updated',
                'summary_ar' => 'اكتملت مراجعة أولية لدراسة الربط الكهربائي، والبرنامج ما زال في التخطيط.',
                'summary_en' => 'A first review of the grid-connection study is complete. The programme remains in planning.',
                'body_ar' => 'لا يوجد قرار تنفيذ بعد هذه المراجعة. صفحة المشروع تبقى مصدر الحالة.',
                'body_en' => 'This review is not a construction decision. The project page remains the source of status.',
                'scope' => NewsScope::Local,
                'status' => NewsStatus::Published,
                'sector' => 'hydrogen',
                'published_at' => '2026-04-20 08:00:00',
            ],
            [
                'slug' => 'storage-trial-summary',
                'title_ar' => 'خلاصة متابعة لتجارب تخزين الكهرباء',
                'title_en' => 'Summary of electricity storage trials',
                'summary_ar' => 'نُشرت خلاصة قصيرة عن تجارب تخزين مرتبطة بالتوليد المتجدد بعد مراجعة التحرير.',
                'summary_en' => 'A short summary of storage trials linked to renewable generation was published after editorial review.',
                'body_ar' => 'المادة للمتابعة العامة ولا تمثّل اعتماد تقنية للشبكة المحلية.',
                'body_en' => 'The note is for general follow-up and does not adopt a technology for the local grid.',
                'scope' => NewsScope::International,
                'status' => NewsStatus::Published,
                'sector' => 'electricity',
                'published_at' => '2026-04-08 08:00:00',
            ],
            [
                'slug' => 'awaiting-review-sample',
                'title_ar' => null,
                'title_en' => 'Sample item waiting for review',
                'summary_ar' => null,
                'summary_en' => 'This item is not visible to visitors until it is published.',
                'body_ar' => null,
                'body_en' => null,
                'scope' => NewsScope::International,
                'status' => NewsStatus::Pending,
                'sector' => null,
                'published_at' => '2026-04-01 08:00:00',
            ],
        ];

        foreach ($rows as $row) {
            $sector = $row['sector'];
            unset($row['sector']);
            NewsArticle::query()->updateOrCreate(
                ['slug' => $row['slug']],
                [
                    ...$row,
                    'sector_id' => $sector === null ? null : $sectors[$sector]->id,
                    'origin' => ContentOrigin::Manual,
                    'source_name' => 'Directorate desk',
                ],
            );
        }
    }

    /**
     * @param  array<string, Sector>  $sectors
     */
    private function sources(array $sectors): void
    {
        $rows = [
            [
                'name_ar' => 'متابعة عربية للطاقة المتجددة',
                'name_en' => 'Arabic renewable energy coverage',
                'feed_url' => 'https://news.google.com/rss/search?q='.rawurlencode('الطاقة المتجددة').'&hl=ar&gl=AE&ceid=AE:ar',
                'locale' => 'ar',
                'scope' => NewsScope::Local,
                'sector_id' => $sectors['renewable']->id,
            ],
            [
                'name_ar' => 'تغطية دولية للطاقة المتجددة',
                'name_en' => 'International renewable energy coverage',
                'feed_url' => 'https://news.google.com/rss/search?q=renewable+energy&hl=en-US&gl=US&ceid=US:en',
                'locale' => 'en',
                'scope' => NewsScope::International,
                'sector_id' => $sectors['renewable']->id,
            ],
        ];

        foreach ($rows as $row) {
            NewsSource::query()->updateOrCreate(
                ['feed_url' => $row['feed_url']],
                [...$row, 'is_active' => true],
            );
        }
    }

    private function departments(): void
    {
        $rows = [
            ['planning', 'التخطيط والدراسات', 'Planning and studies', 'إعداد المؤشرات ومتابعة المنهجية.', 'Prepares indicators and looks after the method.', 'يعتمد القراءات قبل نشرها ويتابع اتساق السلاسل الزمنية.', 'Approves readings before publication and keeps the time series consistent.', 'planning@energy.local', '0000 0000', 1],
            ['renewables', 'الطاقة المتجددة', 'Renewable energy', 'متابعة الشمس والرياح والطاقة الحيوية.', 'Follows solar, wind, and bioenergy.', 'يمسك سجل القدرة المركبة ومشاريع الربط.', 'Keeps the installed-capacity register and connection projects.', 'renewables@energy.local', '0000 0001', 2],
            ['hydrogen', 'الهيدروجين', 'Hydrogen', 'متابعة البرامج التجريبية والإنتاج.', 'Follows pilot programmes and production.', 'يراجع أرقام الطاقة الإنتاجية وربطها بالكهرباء.', 'Reviews production figures and their link to electricity.', 'hydrogen@energy.local', '0000 0002', 3],
            ['power', 'الكهرباء', 'Electricity', 'الحمل والفاقد ومشاريع الشبكة.', 'Load, losses, and network projects.', 'ينسق مع تشغيل الشبكة على القراءات الدورية.', 'Coordinates periodic readings with network operations.', 'power@energy.local', '0000 0003', 4],
            ['efficiency', 'كفاءة الطاقة', 'Energy efficiency', 'برامج الترشيد في المباني.', 'Efficiency programmes in buildings.', 'يحسب الطاقة الموفرة لكل دفعة تأهيل.', 'Calculates energy saved for each retrofit batch.', 'efficiency@energy.local', '0000 0004', 5],
            ['communications', 'الاتصال المؤسسي', 'Communications', 'الأخبار المحلية والدولية.', 'Local and international news.', 'يراجع المواد المجلوبة وينشر ما يُعتمد منها.', 'Reviews fetched items and publishes what is approved.', 'news@energy.local', '0000 0005', 6],
        ];

        $staff = [
            'planning' => [['ليلى الحسن', 'Layla Al Hasan', 'رئيسة القسم', 'Head of section'], ['يوسف كريم', 'Yousef Kareem', 'محلل مؤشرات', 'Indicator analyst']],
            'renewables' => [['مريم سعيد', 'Maryam Saeed', 'أخصائية شمس ورياح', 'Solar and wind specialist'], ['حسن البلوشي', 'Hassan Al Balushi', 'مهندس ربط', 'Connection engineer']],
            'hydrogen' => [['سارة ناصر', 'Sara Nasser', 'أخصائية هيدروجين', 'Hydrogen specialist']],
            'power' => [['خالد محمود', 'Khalid Mahmoud', 'مهندس شبكة', 'Network engineer']],
            'efficiency' => [['نورة فهد', 'Noura Fahad', 'أخصائية ترشيد', 'Efficiency specialist']],
            'communications' => [['هدى سالم', 'Huda Salem', 'محررة أخبار', 'News editor']],
        ];

        foreach ($rows as [$slug, $nameAr, $nameEn, $summaryAr, $summaryEn, $mandateAr, $mandateEn, $email, $phone, $sort]) {
            $department = Department::query()->updateOrCreate(
                ['slug' => $slug],
                [
                    'name_ar' => $nameAr,
                    'name_en' => $nameEn,
                    'summary_ar' => $summaryAr,
                    'summary_en' => $summaryEn,
                    'mandate_ar' => $mandateAr,
                    'mandate_en' => $mandateEn,
                    'email' => $email,
                    'phone' => $phone,
                    'sort_order' => $sort,
                ],
            );

            foreach ($staff[$slug] as $index => [$staffAr, $staffEn, $titleAr, $titleEn]) {
                $profile = $this->profiles()[$staffEn];

                StaffMember::query()->updateOrCreate(
                    ['department_id' => $department->id, 'name_en' => $staffEn],
                    [
                        'name_ar' => $staffAr,
                        'title_ar' => $titleAr,
                        'title_en' => $titleEn,
                        'bio_ar' => $profile['ar'],
                        'bio_en' => $profile['en'],
                        'roster' => StaffRoster::Staff,
                        'email' => $this->staffEmail($staffEn, $slug),
                        'is_published' => true,
                        'sort_order' => $index + 1,
                    ],
                );
            }
        }

        $planning = Department::query()->where('slug', 'planning')->firstOrFail();
        $board = [
            ['أحمد الرواحي', 'Ahmed Al Rawahi', 'رئيس مجلس الإدارة', 'Chair'],
            ['فاطمة المعمرية', 'Fatima Al Maamari', 'عضو مجلس الإدارة', 'Board member'],
            ['سالم الحارثي', 'Salem Al Harthi', 'عضو مجلس الإدارة', 'Board member'],
        ];

        foreach ($board as $index => [$nameAr, $nameEn, $titleAr, $titleEn]) {
            $profile = $this->profiles()[$nameEn];

            StaffMember::query()->updateOrCreate(
                ['department_id' => $planning->id, 'name_en' => $nameEn],
                [
                    'name_ar' => $nameAr,
                    'title_ar' => $titleAr,
                    'title_en' => $titleEn,
                    'bio_ar' => $profile['ar'],
                    'bio_en' => $profile['en'],
                    'roster' => StaffRoster::Board,
                    'email' => $this->staffEmail($nameEn, 'board'),
                    'is_published' => true,
                    'sort_order' => $index + 1,
                ],
            );
        }
    }

    /**
     * @return array<string, array{ar: string, en: string}>
     */
    private function profiles(): array
    {
        return [
            'Layla Al Hasan' => [
                'ar' => 'ترأس قسم التخطيط والدراسات، وتتابع منهجية المؤشرات قبل اعتماد القراءات للنشر.',
                'en' => 'Heads planning and studies, and checks the indicator method before readings are published.',
            ],
            'Yousef Kareem' => [
                'ar' => 'يراجع السلاسل الزمنية ويتابع اتساق الأرقام المنشورة في مؤشرات القطاع.',
                'en' => 'Reviews the time series and keeps published sector indicators consistent.',
            ],
            'Maryam Saeed' => [
                'ar' => 'تتابع القدرة المركبة لمشاريع الشمس والرياح والطاقة الحيوية.',
                'en' => 'Follows installed capacity for solar, wind, and bioenergy projects.',
            ],
            'Hassan Al Balushi' => [
                'ar' => 'يتابع ربط مشاريع الطاقة المتجددة بالشبكة الكهربائية.',
                'en' => 'Follows the connection of renewable projects to the electricity network.',
            ],
            'Sara Nasser' => [
                'ar' => 'تراجع أرقام الطاقة الإنتاجية في برامج الهيدروجين التجريبية.',
                'en' => 'Reviews production figures for hydrogen pilot programmes.',
            ],
            'Khalid Mahmoud' => [
                'ar' => 'ينسق القراءات الدورية للحمل والفاقد مع تشغيل الشبكة.',
                'en' => 'Coordinates periodic load and loss readings with network operations.',
            ],
            'Noura Fahad' => [
                'ar' => 'تحسب الطاقة الموفرة في برامج الترشيد داخل المباني.',
                'en' => 'Calculates energy saved by efficiency programmes in buildings.',
            ],
            'Huda Salem' => [
                'ar' => 'تراجع الأخبار المحلية والدولية قبل اعتمادها للنشر.',
                'en' => 'Reviews local and international news before it is approved for publication.',
            ],
            'Ahmed Al Rawahi' => [
                'ar' => 'يرأس مجلس الإدارة ويتابع توجه المديرية وارتباطه بأهداف قطاع الطاقة.',
                'en' => 'Chairs the board and follows how the directorate lines up with energy-sector goals.',
            ],
            'Fatima Al Maamari' => [
                'ar' => 'تتابع وضوح البيانات المنشورة وحوكمة اعتمادها قبل أن تصل إلى الزوار.',
                'en' => 'Follows how clearly published data is governed before visitors see it.',
            ],
            'Salem Al Harthi' => [
                'ar' => 'يتابع أولويات الأقسام ومواءمتها مع خطة القطاع.',
                'en' => 'Follows section priorities and how they match the sector plan.',
            ],
        ];
    }

    private function staffEmail(string $name, string $department): string
    {
        $local = strtolower((string) preg_replace('/[^a-z]+/i', '.', $name));
        $local = trim($local, '.');

        return $local.'@'.$department.'.energy.local';
    }
}
