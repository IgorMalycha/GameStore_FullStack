import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import Games from './pages/Games';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import ErrorComponent from './pages/ErrorComponent';
import EditGames from './pages/EditGames';
import './index.css';
import AuthLayout from "./AuthLayout";
import {UserContextProvider} from "./context/UserContext";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        errorElement: <ErrorComponent />,
        children: [
            { path: '/home', element: <Home /> },
            { path: '/games', element: <Games /> },
            { path: '/cart', element: <Cart /> },
            { path: '/editGames', element: <EditGames /> },
        ],
    },
    {
        path: '/auth',
        element: <AuthLayout />,
        errorElement: <ErrorComponent />,
        children: [
            { path: 'login', element: <Login /> },
            { path: 'register', element: <Register /> },
        ],
    },
]);

root.render(
    <React.StrictMode>
        <UserContextProvider>
            <RouterProvider router={router} />
        </UserContextProvider>
    </React.StrictMode>
);

