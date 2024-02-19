import React from 'react'
import MiniRightPopup from './generic/MiniRightPopup'

function Button({special, popup, disabled, title, icon, onClick, additionalClasses}) {
    const [togglePopup, setTogglePopup] = React.useState(false)

    const handleOnclick = (e) => {
        setTogglePopup(!togglePopup)
        onClick && onClick(e)
    }

    return (
        <React.Fragment>
            {!disabled && <div onClick={handleOnclick} className={`button ${additionalClasses ? additionalClasses : ''} ${special||''}`}>
                {icon} {title}
            </div>}
            {disabled && <div style={{background: 'gray'}} className={`button ${additionalClasses ? additionalClasses : ''} ${special||''}`}>
                {icon} {title}
            </div>}

            {popup && togglePopup && <MiniRightPopup onClick={handleOnclick} actions={popup} />}
        </React.Fragment>
    )
}

export default Button
