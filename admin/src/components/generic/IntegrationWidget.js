import React from 'react'

function IntegrationWidget({logo, item}) {
    return (
        <div className="col-1x3 integration-item">
            <div className="logo-wrapper">
                <img src={logo} alt="integration logo" />
            </div>
            <div className="heading metric-heading">
                <div className='heading'>
                    <h4>Queries: {item.queryCount}</h4>
                    <h4>Last Sync: {item.lastSyncDate}</h4>
                </div>
                <div className="hint"><center>{(item.companyData.businessName || "System").split(" ")[0]}/{item.domain}</center></div>
            </div>
        </div>
    )
}

export default IntegrationWidget
