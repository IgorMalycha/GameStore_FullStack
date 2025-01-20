import React from 'react';
import {Link, useRouteError} from 'react-router-dom';

const ErrorComponent: React.FC = () => {
    const error: any = useRouteError();

    return (
        <div className="error-div">
            <h1>Oops! Something went wrong.</h1>
            <p>{error.statusText || 'An unexpected error occurred.'}</p>
            <Link className="MainPageLink" to="/login">Go back to Login Page</Link>
        </div>
    );
};

export default ErrorComponent;