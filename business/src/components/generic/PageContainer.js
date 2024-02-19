import React from 'react'

function PageContainer({pageTitle, pageSubtitle, children, addons}) {

    return (
        <div className='page-container full-width'>
            <div className='page-heading'>
                <div style={{width: "30%"}} className='wrapper col-1x4'>
                    <h2>{pageTitle}</h2>
                    <div>{pageSubtitle}</div>
                </div>
                <div className='wrapper col-3x4'>
                    {addons||""}
                </div>
            </div>
            <br/>
            <div className='scrollable-container'>
                {children}
            </div>
        </div>
    )
}

export default PageContainer
