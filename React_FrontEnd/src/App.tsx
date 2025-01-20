import React from 'react';
import Navbar from './components/NavBar';
import Footer from './components/Footer';
import { Outlet } from 'react-router-dom';
import './App.css'
const App: React.FC = () => {
    return (
        <>
            <Navbar />
            <main>
                <Outlet />
            </main>
            <Footer />
        </>
    );
};

export default App;
