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
import CreateRoster from './components/rosters/CreateRoster';
import ParticipationTable from './components/participation/ParticipationTable';
import GroupEmail from './components/groupEmail/GroupEmail';
import EquipmentLog from './components/equipmentLog/EquipmentLog';
import Reports from './components/reportWriting/Reports';
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
                            <PrivateRoute exact path="/equipment-log" component={EquipmentLog} />
                            <PrivateRoute exact path="/rosters" component={CreateRoster} />
                            <PrivateRoute exact path="/member-participation" component={ParticipationTable} />
                            <PrivateRoute exact path="/group-email" component={GroupEmail} />
                            <PrivateRoute exact path="/reports" component={Reports} />

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
