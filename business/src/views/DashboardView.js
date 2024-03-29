import React from 'react';
import { AppContext } from '../context/AppProvider';
import OverviewDashboard from './dashboards/OverviewDashboard';
import TeamsDashboard from './dashboards/TeamsDashboard';
import BrandControlsDashboard from './dashboards/BrandControlsDashboard';
import CustomerInvitationDashboard from './dashboards/CustomerInvitationDashboard';
import SettingsDashboard from './dashboards/SettingsDashboard';
import SmartInsightsDashboard from './dashboards/SmartInsightsDashboard';

function DashboardView() {
    const { applicationTabs } = React.useContext(AppContext)

    React.useEffect(()=>{},[applicationTabs])
    return (
        <React.Fragment>
            {applicationTabs === 0 && <OverviewDashboard />}
            {applicationTabs === 1 && <SmartInsightsDashboard />}
            {applicationTabs === 2 && <BrandControlsDashboard />}
            {applicationTabs === 3 && <TeamsDashboard />}
            {applicationTabs === 4 && <CustomerInvitationDashboard />}
            {applicationTabs === 5 && <SettingsDashboard />}
        </React.Fragment>
    )
}

export default DashboardView
