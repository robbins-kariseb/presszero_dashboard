import React from 'react';
import './index.css';
import './animations.scss';
import DashboardView from './views/DashboardView';
import LoginView from './views/LoginView';
import { BrowserRouter as Router, Route, Routes as Switch } from 'react-router-dom';
import ChatMessagesView from './views/ChatMessagesView';
import CompanyReportView from './views/CompanyReportView';
import AppProvider, { AppContext } from "./context/AppProvider";
import CompanyView from './views/CompanyView';
import ConfirmationPopup from './views/popups/ConfirmationPopup';

function RouteControl () {
  const {notification, warning, confirmation, setConfirmation} = React.useContext(AppContext)

  return (
      <Router>
        <div className="App">
          {notification&& notification.length > 0 && <div className='notifications-wrapper group heading status-tool-bar'>
              <p className="notification-message">{notification}</p>
              <div className="active-subscription">
                <div className="inner-control"></div>
              </div>
            </div>}
          {warning&& warning.length > 0 && <div className='warning-wrapper group heading status-tool-bar'>
              <p className="warning-message">{warning}</p>
              <div className="active-subscription">
                <div className="inner-control"></div>
              </div>
            </div>}
          {confirmation && <div className='confirmation-popup'>
            <ConfirmationPopup 
              buttons={confirmation.buttons||null}
              heading={confirmation.heading} 
              content={confirmation.content} 
              onCancel={()=>{
                confirmation.cancel()
                setConfirmation(null)
              }} onConfirmed={()=>{
                confirmation.confirm()
                setConfirmation(null)
              }} 
            />
          </div>}
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
  );
}

function App() {
  return (
    <AppProvider>
      <RouteControl />
    </AppProvider>
  );
}

export default App;
