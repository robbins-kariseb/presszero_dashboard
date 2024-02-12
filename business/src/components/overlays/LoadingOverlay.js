import React from 'react'
import logo from "../../images/logo.png"
import loading from "../../images/loading.webp"

function LoadingOverlay() {
    return (
        <div className='loading-overlay'>
            <center>
                <div className='loading-image'>
                    {/* <img src={loading} alt='Loading Overlay' /> */}
                </div>
                <div className='logo-overlay'>
                    <img src={logo} alt='Loading Overlay' />
                </div>
            </center>
        </div>
    )
}

export default LoadingOverlay
