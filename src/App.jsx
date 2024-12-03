import { BrowserRouter as Router } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import SnowDayCalculator from './pages/SnowDayCalculator';
import VoriciCalculator from './pages/VoriciCalculator';
import EmbedGenerator from './pages/EmbedGenerator';
import BMICalculator from './pages/BMICalculator';
import CalorieCalculator from './pages/CalorieCalculator';
import GradeCalculator from './pages/GradeCalculator';
import { ThemeProvider } from './context/ThemeContext';
import { Navigate } from 'react-router-dom';

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <Router basename="/">
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/snow-day-calculator" element={<SnowDayCalculator />} />
              <Route path="/vorici-calculator" element={<VoriciCalculator />} />
              <Route path="/embed-generator" element={<EmbedGenerator />} />
              <Route path="/bmi-calculator" element={<BMICalculator />} />
              <Route path="/calorie-calculator" element={<CalorieCalculator />} />
              <Route path="/grade-calculator" element={<GradeCalculator />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </Router>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
