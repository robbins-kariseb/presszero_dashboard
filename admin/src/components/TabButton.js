import React from 'react'

function TabButton({title, selected, onClick}) {
    return (
        <div onClick={onClick} className={`button ${selected ? 'selected' : ''}`}>
            {title}
        </div>
    )
}

export default TabButton
