import React from 'react'
import logo from "../../images/logo.png"

function BusinessImage({ item }) {
    return (
        <div className='logo-wrapper metric'>
            {item.logoUrl && <img
                src={item.logoUrl}
                alt="logo"
                onError={(e) => {
                    e.target.src = logo;
                }}
            />}
            {!item.logoUrl && <div className='initials'>
                <div className='initial-wrapper'>{(item.businessName || "Untitled Company").split(' ').map((e) => e[0]).join('').toUpperCase()}</div>
            </div>}
        </div>
    )
}

export default BusinessImage
