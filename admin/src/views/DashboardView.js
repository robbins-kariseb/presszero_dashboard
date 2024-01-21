import React from 'react';
import { AppContext } from '../context/AppProvider';
import OverviewDashboard from './dashboards/OverviewDashboard';
import ReportsDashboard from './dashboards/ReportsDashboard';
import UsersDashboard from './dashboards/UsersDashboard';
import SubscriptionsDashboard from './dashboards/SubscriptionsDashboard';

function DashboardView() {
    const { applicationTabs } = React.useContext(AppContext)

    React.useEffect(()=>{},[applicationTabs])
    return (
        <React.Fragment>
            {applicationTabs === 0 && <OverviewDashboard />}
            {applicationTabs === 1 && <ReportsDashboard />}
            {applicationTabs === 2 && <UsersDashboard />}
            {applicationTabs === 3 && <SubscriptionsDashboard />}
        </React.Fragment>
    )
}

export default DashboardView
