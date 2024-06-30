import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import { BrowserRouter, Route, Routes, useParams } from 'react-router-dom';
import PerijoveSelector from './PerijoveSelector';
import Nav from './Nav';
import Perijove from './Perijove';

function PerijoveApp() {
    const params = useParams();

    return <Perijove perijove={params.perijoveid} />
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <article id='main' className='container box-border mx-auto'>
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route exact path='/' element={<PerijoveSelector />} />
          <Route exact path='/perijove/:perijoveid/' element={<PerijoveApp />} />
        </Routes>
      </BrowserRouter>
    </article>
  </React.StrictMode>
);