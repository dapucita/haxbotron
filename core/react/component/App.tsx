import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Admin from './Admin';
import Install from './Install/Install';
import Main from './Main';
import NotFound from './NotFound';

function App() {
    return (
        <Routes>
            <Route path='/' element={<Main />} />
            <Route path='/install' element={<Install />} />
            <Route path='/admin' element={<Admin />} />
            <Route element={<NotFound />} />
        </Routes>
    );
}

export default App;
