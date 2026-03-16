import { useEffect } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Index from './pages/Index';
import GetStarted from './pages/GetStarted';
import ScrollToHash from './components/ScrollToHash';
import Auth from './pages/Auth';

const queryClient = new QueryClient();

const NavigationHandler = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if this is a fresh reload/load
    const hasLoadedSession = sessionStorage.getItem('hasLoadedSession');

    if (!hasLoadedSession) {
      sessionStorage.setItem('hasLoadedSession', 'true');
      // Force user back to auth page on fresh load if they aren't already there
      if (location.pathname !== '/') {
        navigate('/', { replace: true });
      }
    }
  }, [navigate, location]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      // Clear the session storage flag so the next load redirects to Auth
      sessionStorage.removeItem('hasLoadedSession');
      // Show native browser warning dialog
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <NavigationHandler>
          <ScrollToHash />
          <Routes>
            <Route path="/" element={<Auth />} />
            <Route path="/Index" element={<Index />} />
            <Route path="/get-started" element={<GetStarted />} />
          </Routes>
        </NavigationHandler>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;