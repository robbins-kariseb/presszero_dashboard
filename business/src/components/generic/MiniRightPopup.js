import React from 'react'

function MiniRightPopup({actions, onClick}) {
    const handleOnclick = (e) => {
        onClick && onClick(e)
        e.onClick && e.onClick(e)
    }
    return (
        <div className='popup-control'>
            <div className='mini-right-popup'>
                {actions.map((e,idx)=><div key={idx} onClick={()=>handleOnclick(e)} className='action-control'>{e.name}</div>)}
            </div>
        </div>
    )
}

export default MiniRightPopup
