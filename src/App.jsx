import { Routes, Route } from 'react-router-dom';
import MarkdownEditor from './pages/BasePage';
import './index.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MarkdownEditor />} />
    </Routes>
  );
}

export default App;
