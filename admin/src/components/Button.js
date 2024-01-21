import React from 'react'

function Button({special, disabled, title, icon, onClick, additionalClasses}) {
    return (
        <React.Fragment>
            {!disabled && <div onClick={onClick} className={`button ${additionalClasses ? additionalClasses : ''} ${special||''}`}>
                {icon} {title}
            </div>}
            {disabled && <div style={{background: 'gray'}} className={`button ${additionalClasses ? additionalClasses : ''} ${special||''}`}>
                {icon} {title}
            </div>}
        </React.Fragment>
    )
}

export default Button
