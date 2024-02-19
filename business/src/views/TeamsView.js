import React from 'react';
import { AppContext } from '../context/AppProvider';
import TeamsDashboard from './dashboards/TeamsDashboard';

function DashboardView() {
    const { applicationTabs } = React.useContext(AppContext)

    React.useEffect(()=>{},[applicationTabs])
    return (
        <React.Fragment>
            {applicationTabs === 0 && <TeamsDashboard />}
            {applicationTabs === 1 && <TeamsDashboard />}
            {applicationTabs === 2 && <TeamsDashboard />}
            {applicationTabs === 3 && <TeamsDashboard />}
        </React.Fragment>
    )
}

export default DashboardView
