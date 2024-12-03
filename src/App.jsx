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
import BodyFatCalculator from './pages/BodyFatCalculator';
import BMRCalculator from './pages/BMRCalculator';
import DateCalculator from './pages/DateCalculator';
import ProductivityCalculator from './pages/ProductivityCalculator';
import PersonalProductivityCalculator from './pages/PersonalProductivityCalculator';
import EducationSavingsCalculator from './pages/EducationSavingsCalculator';
import GPACalculator from './pages/GPACalculator';
import { ThemeProvider } from './context/ThemeContext';
import { Navigate } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
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
                <Route path="/body-fat-calculator" element={<BodyFatCalculator />} />
                <Route path="/bmr-calculator" element={<BMRCalculator />} />
                <Route path="/date-calculator" element={<DateCalculator />} />
                <Route path="/productivity-calculator" element={<ProductivityCalculator />} />
                <Route path="/personal-productivity-calculator" element={<PersonalProductivityCalculator />} />
                <Route path="/education-savings-calculator" element={<EducationSavingsCalculator />} />
                <Route path="/gpa-calculator" element={<GPACalculator />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          </Router>
        </LocalizationProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
