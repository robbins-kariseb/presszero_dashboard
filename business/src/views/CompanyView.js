import React from 'react';
import { AppContext } from '../context/AppProvider';
import CompanyOverView from './company/CompanyOverView';
import CompanyReportsView from './company/CompanyReportsView';
import CompanyUserView from './company/CompanyUserView';
import TeamsDashboard from './dashboards/TeamsDashboard';

function CompanyView() {
    const { applicationTabs } = React.useContext(AppContext)

    React.useEffect(()=>{},[applicationTabs])
    return (
        <React.Fragment>
            {applicationTabs === 0 && <CompanyOverView />}
            {applicationTabs === 1 && <CompanyReportsView />}
            {applicationTabs === 2 && <CompanyUserView />}
            {applicationTabs === 3 && <TeamsDashboard />}
        </React.Fragment>
    )
}

export default CompanyView
