import React from 'react'

function StatusWidget({status, text}) {
    return (
        <div style={{color:"white"}} className={`status-toggle ${status}`}>
            {text || status.toUpperCase()}
        </div>
    )
}

export default StatusWidget
