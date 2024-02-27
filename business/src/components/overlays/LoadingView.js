import React from 'react'
import logo from "../../images/logo.png"

function LoadingView() {
    return (
        <center>
                <div className='loading-image'>
                    {/* <img src={loading} alt='Loading Overlay' /> */}
                </div>
                <div className='logo-overlay'>
                    <img src={logo} alt='Loading Overlay' />
                </div>
        </center>
    )
}

export default LoadingView
