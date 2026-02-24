import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import ScrollToHash from './components/ScrollToHash';

const queryClient = new QueryClient();

const App = () => <QueryClientProvider client={queryClient}>
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <ScrollToHash />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/" />
        <Route path="/" />
        <Route path="/" />
        <Route path="/" />
        <Route path="/" />
        <Route path="/" />
        <Route path="/" />
      </Routes>
    </BrowserRouter>
  </TooltipProvider>
</QueryClientProvider>;
export default App;