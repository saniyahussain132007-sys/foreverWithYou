import { BrowserRouter as Router, Routes, Route, useSearchParams } from 'react-router-dom';
import { DataProvider } from './context/DataProvider';
import SurpriseApp from './components/SurpriseApp';
import AdminPanel from './components/AdminPanel';

// Smart home page: ?id= (shared link) or ?preview=1 (local draft) → surprise; else admin
function HomePage() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const preview = searchParams.get('preview');

  if (id || preview) {
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
