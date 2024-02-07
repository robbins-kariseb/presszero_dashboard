import React from 'react';
import './index.css';
import './animations.scss';
import DashboardView from './views/DashboardView';
import LoginView from './views/LoginView';
import { BrowserRouter as Router, Route, Routes as Switch } from 'react-router-dom';
import ChatMessagesView from './views/ChatMessagesView';
import CompanyReportView from './views/CompanyReportView';
import AppProvider from "./context/AppProvider";
import CompanyView from './views/CompanyView';

function RouteControl () {
  return (
    <AppProvider>
      <Router>
        <div className="App">
          <div className='container'>
            <Switch>
              <Route exact path="/dashboard" Component={DashboardView} />
              <Route exact path="/company/*" Component={CompanyView} />
              <Route exact path="/messages" Component={ChatMessagesView} />
              <Route exact path="/company/report" Component={CompanyReportView} />
              <Route exact path="/login" Component={LoginView} />
              <Route exact path="/" Component={LoginView} />
            </Switch>
          </div>
        </div>
      </Router>
    </AppProvider>
  );
}

function App() {
  return (
    <RouteControl />
  );
}

export default App;
