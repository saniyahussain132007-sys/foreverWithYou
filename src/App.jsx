import { BrowserRouter as Router, Routes, Route, useSearchParams } from 'react-router-dom';
import { DataProvider } from './context/DataProvider';
import SurpriseApp from './components/SurpriseApp';
import AdminPanel from './components/AdminPanel';

// Smart home page: if ?id= is present, show the surprise; otherwise show admin
function HomePage() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');

  if (id) {
    return <SurpriseApp />;
  }

  return <AdminPanel />;
}

function App() {
  return (
    <DataProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/preview" element={<SurpriseApp />} />
        </Routes>
      </Router>
    </DataProvider>
  );
}

export default App;
