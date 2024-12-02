import { BrowserRouter as Router } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import SnowDayCalculator from './pages/SnowDayCalculator';
import VoriciCalculator from './pages/VoriciCalculator';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/snow-day-calculator" element={<SnowDayCalculator />} />
              <Route path="/vorici-calculator" element={<VoriciCalculator />} />
            </Routes>
          </Layout>
        </Router>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
