import React from 'react'
import downIcon from "../../../images/metric-down-negative.png"
import upIcon from "../../../images/metric-up.png"

function WidgetFigure({value, inverted}) {
    const numeric = !isNaN(value) ? value : 
    (value.toString().includes('-') || value.toString().includes('24h+')) ? -1 : 1;

    const isPositive = inverted||false ? (numeric||0) > 0 : (numeric||0) <= 0;
    return (
        <React.Fragment>
            {isPositive && <div className='metric-controls score-small negative'><p className='metric-negative'>{value||0}</p><div className='metric-icon'><img src={downIcon} alt='up-icon' /> </div></div>}
            {!isPositive && <div className='metric-controls score-small positive'><p className='metric-positive'>{value||0}</p><div className='metric-icon'><img src={upIcon} alt='up-icon' /> </div></div>}
        </React.Fragment>
    )
}

export default WidgetFigure
