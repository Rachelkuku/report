import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import DocPage from './pages/DocPage';
import ReportPage from './pages/ReportPage';

import ExamplesPage from './pages/ExamplesPage';
import RetentionPage from './pages/RetentionPage';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/doc" element={<DocPage />} />
            <Route path="/report" element={<ReportPage />} />

            <Route path="/examples" element={<ExamplesPage />} />
            <Route path="/retention" element={<RetentionPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
