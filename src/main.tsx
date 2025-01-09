import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);


// import { StrictMode } from 'react';
// import { createRoot } from 'react-dom/client';
// import { RouterProvider } from 'react-router-dom';
// import { ThemeProvider } from '@/components/theme-provider';
// import { Toaster } from '@/components/ui/toaster';
// import router from './routes';
// import './index.css';

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
//       <RouterProvider router={router} />
//       <Toaster />
//     </ThemeProvider>
//   </StrictMode>
// );