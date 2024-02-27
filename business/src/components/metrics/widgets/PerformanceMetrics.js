import React from 'react'
import Tab from '../../Tab'

function PerformanceMetrics({title, content, onTabChange}) {
    const [tab, setTab] = React.useState(0)
    
    const handleTabChange = (e) => {
        setTab(e)
        onTabChange(e)
    }

    return (
        <div className='widget col-1x4'>
            <div className='widget-fixed-section'>
                <div className='heading'>
                    <h4>{title}</h4>
                </div>

                {content}
            </div>

            <div className='widget-footer'>
                <div className='col-1x3 tab-wrapper time-series-tabs'>
                    <Tab
                        initialIndex={tab}
                        tabs={[
                            {
                                title: "Day",
                                onClick: (() => { })
                            }, {
                                title: "Week",
                                onClick: (() => { })
                            }, {
                                title: "Month",
                                onClick: (() => { })
                            }]}
                        setTab={handleTabChange}
                    />
                </div>
            </div>
        </div>
    )
}

export default PerformanceMetrics
