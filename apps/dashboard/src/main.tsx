import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { configureApi } from '@bubbly/api-client';
import { tokenCss } from '@bubbly/ui-web';
import '@bubbly/ui-web/styles.css';
import './index.css';
import { App } from './App';
import { Overview } from './screens/Overview';
import { Bookings } from './screens/Bookings';
import { Drivers } from './screens/Drivers';
import { Services } from './screens/Services';

configureApi({ baseUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:8787' });

const tokenStyle = document.createElement('style');
tokenStyle.textContent = tokenCss;
document.head.prepend(tokenStyle);

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Overview /> },
      { path: 'bookings', element: <Bookings /> },
      { path: 'drivers', element: <Drivers /> },
      { path: 'services', element: <Services /> },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);
