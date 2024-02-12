import React from 'react'

function IntegrationWidget({logo, item}) {
    return (
        <div class="col-1x3 integration-item">
            <div class="logo-wrapper">
                <img src={logo} alt="integration logo" />
            </div>
            <div class="heading metric-heading">
                <div className='heading'>
                    <h4>Queries: {item.queryCount}</h4>
                    <h4>Last Sync: {item.lastSyncDate}</h4>
                </div>
                <div class="hint"><center>{(item.companyData.businessName || "System").split(" ")[0]}/{item.domain}</center></div>
            </div>
        </div>
    )
}

export default IntegrationWidget
