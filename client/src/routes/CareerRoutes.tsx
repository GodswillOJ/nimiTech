// Career routes configuration
import { Routes, Route } from 'react-router-dom';
import Careers from '../pages/careers';
import JobDetail from '../pages/careers/JobDetail';
import ApplicationPage from '../pages/careers/ApplicationPage';

const CareerRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Careers />} />
      <Route path="/:id" element={<JobDetail />} />
      <Route path="/:id/apply" element={<ApplicationPage />} />
    </Routes>
  );
};

export default CareerRoutes;
