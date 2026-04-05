import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import AppLayout from '@/components/layout/AppLayout.jsx';

const Feed = lazy(() => import('@/pages/Feed'));
const FindDupes = lazy(() => import('@/pages/FindDupes'));
const Saved = lazy(() => import('@/pages/Saved'));
const Profile = lazy(() => import('@/pages/Profile'));
const Styleboards = lazy(() => import('@/pages/Styleboards'));
const StyleboardBuilder = lazy(() => import('@/pages/StyleboardBuilder'));
const Admin = lazy(() => import('@/pages/Admin'));

function PageLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
    </div>
  );
}

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin, checkAppState } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    } else {
      // Unknown/network error — retry instead of showing blank screen
      return (
        <div className="fixed inset-0 flex flex-col items-center justify-center gap-4">
          <p className="text-sm text-muted-foreground">Something went wrong loading the app.</p>
          <button
            onClick={checkAppState}
            className="text-sm font-medium underline underline-offset-4 text-foreground"
          >
            Retry
          </button>
        </div>
      );
    }
  }

  // Render the main app
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Feed />} />
          <Route path="/find-dupes" element={<FindDupes />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/styleboards" element={<Styleboards />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="/styleboards/:id" element={<StyleboardBuilder />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Suspense>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App