import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import SnowDayCalculator from './pages/SnowDayCalculator';
import VoriciCalculator from './pages/VoriciCalculator';

const AppRoutes = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/snow-day-calculator" element={<SnowDayCalculator />} />
        <Route path="/vorici-calculator" element={<VoriciCalculator />} />
      </Routes>
    </Layout>
  );
};

export default AppRoutes;
