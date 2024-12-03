import { BrowserRouter as Router } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import SnowDayCalculator from './pages/SnowDayCalculator';
import VoriciCalculator from './pages/VoriciCalculator';
import EmbedGenerator from './pages/EmbedGenerator';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <Router basename="/">
          <Layout>
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route path="/snow-day-calculator" element={<SnowDayCalculator />} />
              <Route path="/vorici-calculator" element={<VoriciCalculator />} />
              <Route path="/embed-generator" element={<EmbedGenerator />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </Layout>
        </Router>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
