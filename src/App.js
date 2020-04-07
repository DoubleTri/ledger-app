import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Switch,
} from "react-router-dom";
import { auth } from './firebase';
import { AuthProvider } from './context/UserContext';
import { PrivateRoute, NoUserRoute, AdminRoute } from './routes/Routes';
import './App.css';

import Header from './components/header/Header';
import Login from './components/login/Login'
import Home from './components/home/Home'
import EditProfile from './components/editProfile/EditProfile';
import TeamMemberTable from './components/teamMembers/TeamMemberTable';
import TrainingCalender from './components/trainingCalender/TrainingClaender';
import AdminOptions from './components/adminOptions/AdminOptions';
import FourZeroFour from './components/fourZeroFour/FourZeroFour';

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
                    <Header />
                    {loading ? "Loading...." :
                        <Switch >
                            <PrivateRoute exact path="/" component={Home} />
                            <PrivateRoute exact path="/edit-profile" component={EditProfile} />
                            <PrivateRoute exact path="/team-members" component={TeamMemberTable} />
                            <PrivateRoute exact path="/calender" component={TrainingCalender} />
                            <NoUserRoute path="/login" component={Login} />
                            <PrivateRoute path="/admin-options" component={AdminOptions} />
                            <Route render={(props) => <FourZeroFour {...props} />} />
                        </Switch>
                    }
                </Router>
            </AuthProvider>
        </div>
    );
}

export default App;
