import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Switch,
} from "react-router-dom";
import { auth } from './firebase';
import { PrivateRoute, NoUserRoute } from './routes/Routes';
import Login from './components/login/Login'
import Home from './components/home/Home'
import { AuthProvider } from './context/UserContext';
import './App.css';

function App() {

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        auth.onAuthStateChanged((newUser) => {
          setLoading(false)
        })
      }, [])

    return (
        <div className="App">
            <AuthProvider>
                <Router>
                {loading ? "Loading...." :
                    <Switch >
                        <PrivateRoute exact path="/" component={Home} />
                        <NoUserRoute path="/login" component={Login} />
                    </Switch>
                }
                </Router>
            </AuthProvider>
        </div>
    );
}

export default App;
