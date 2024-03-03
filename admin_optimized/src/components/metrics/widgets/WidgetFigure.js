import React from 'react'
import downIcon from "../../../images/metric-down-negative.png"
import upIcon from "../../../images/metric-up.png"

function WidgetFigure({value}) {
    return (
        <React.Fragment>
            {(value||0) <= 0 && <div className='metric-controls'><p className='metric-negative'>{value||0}</p><div className='metric-icon'><img src={downIcon} alt='up-icon' /> </div></div>}
            {(value||0) > 0 && <div className='metric-controls'><p className='metric-positive'>{value||0}</p><div className='metric-icon'><img src={upIcon} alt='up-icon' /> </div></div>}
        </React.Fragment>
    )
}

export default WidgetFigure
