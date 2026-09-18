import MainLayout from './(main)/layout';
import HomeFeedPage from './(main)/page';

// The main feed is the application's root after login. The welcome screen is
// available at /onboarding.
export default function HomePage() {
    return (
        <MainLayout>
            <HomeFeedPage />
        </MainLayout>
    );
}
