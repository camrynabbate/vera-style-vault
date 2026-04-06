import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import AppLayout from '@/components/layout/AppLayout.jsx';
import Login from '@/pages/Login';

// Eagerly start loading all tab chunks so tab switches are instant
const feedImport = import('@/pages/Feed');
const findDupesImport = import('@/pages/FindDupes');
const savedImport = import('@/pages/Saved');
const profileImport = import('@/pages/Profile');
const styleboardsImport = import('@/pages/Styleboards');
const styleboardBuilderImport = import('@/pages/StyleboardBuilder');
const adminImport = import('@/pages/Admin');

const Feed = lazy(() => feedImport);
const FindDupes = lazy(() => findDupesImport);
const Saved = lazy(() => savedImport);
const Profile = lazy(() => profileImport);
const Styleboards = lazy(() => styleboardsImport);
const StyleboardBuilder = lazy(() => styleboardBuilderImport);
const Admin = lazy(() => adminImport);

function PageLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
    </div>
  );
}

const AuthenticatedApp = () => {
  const { isLoadingAuth, isAuthenticated } = useAuth();

  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

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
