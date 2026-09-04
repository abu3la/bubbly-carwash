import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { App } from './App';
import { Plans } from './screens/Plans';
import { Services } from './screens/Services';
import { Bookings } from './screens/Bookings';
import { Teams } from './screens/Teams';
import { Drivers } from './screens/Drivers';
import { Dispatch } from './screens/Dispatch';
import { Operations } from './screens/Operations';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          <Route index element={<Bookings />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="plans" element={<Plans />} />
          <Route path="services" element={<Services />} />
          <Route path="teams" element={<Teams />} />
          <Route path="drivers" element={<Drivers />} />
          <Route path="dispatch" element={<Dispatch />} />
          <Route path="operations" element={<Operations />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
