import { createInertiaApp } from '@inertiajs/react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AdminLayout from '@/layouts/admin-layout';
import AuthLayout from '@/layouts/auth-layout';
import PublicLayout from '@/layouts/public-layout';
import SettingsLayout from '@/layouts/settings/layout';

void createInertiaApp({
    title: (title) => {
        if (!title) {
            return document.documentElement.lang.startsWith('en')
                ? 'Smart Energy Directorate'
                : 'المديرية الذكية للطاقة';
        }

        if (title.includes('—')) {
            return title;
        }

        const site = document.documentElement.lang.startsWith('en')
            ? 'Smart Energy Directorate'
            : 'المديرية الذكية للطاقة';

        return `${title} — ${site}`;
    },
    layout: (name) => {
        switch (true) {
            case name.startsWith('public/'):
                return PublicLayout;
            case name.startsWith('admin/'):
                return AdminLayout;
            case name === 'welcome':
                return null;
            case name.startsWith('auth/'):
                return AuthLayout;
            case name.startsWith('settings/'):
                return [AppLayout, SettingsLayout];
            default:
                return AppLayout;
        }
    },
    strictMode: true,
    withApp(app) {
        return (
            <TooltipProvider delayDuration={0}>
                {app}
                <Toaster />
            </TooltipProvider>
        );
    },
    progress: {
        color: '#0E6B62',
    },
});

// This will set light / dark mode on load...
initializeTheme();
