import React from 'react'
import Tab from '../../Tab'

function PerformanceMetrics({title, content}) {
    const [tab, setTab] = React.useState(0)
    return (
        <div className='widget col-1x4'>
            <div className='heading'>
                <h4>{title}</h4>
            </div>

            {content}

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
                        setTab={setTab}
                    />
                </div>
            </div>
        </div>
    )
}

export default PerformanceMetrics
