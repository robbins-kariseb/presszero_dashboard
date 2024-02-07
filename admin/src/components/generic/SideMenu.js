import React from 'react'
import logo from '../../images/logo.png'
import MenuIcon from './MenuIcon'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';

function SideMenu() {
    const navigate = useNavigate();

    const handleNavigate = (uri) => {
        navigate(uri);
    }

    return (
        <div className="menu-wrapper">
            <div className="menu-item info-bar">
                <div className='logo-wrapper'>
                    <img src={logo} alt='Press-Zero Logo'/>
                </div>
                <div className='content-wrapper'>
                    <h4>Georgie Fitzpatrick</h4>
                    <p>Admin</p>
                </div>
            </div>

            <div onClick={()=>handleNavigate("/dashboard")} className="menu-item info-bar options">
                <div className='logo-wrapper'>
                    <MenuIcon icon={'apps'} />
                </div>
                <div className='content-wrapper'>
                <Link to="/dashboard"><h4>Dashboard</h4></Link>
                </div>
            </div>
            <div onClick={()=>handleNavigate("/company/report")} className="menu-item info-bar options">
                <div className='logo-wrapper'>
                    <MenuIcon icon={'report'} />
                </div>
                <div className='content-wrapper'>
                    <Link to="/company/report"><h4>Company Report</h4></Link>
                </div>
            </div>
            <div onClick={()=>handleNavigate("/messages")} className="menu-item info-bar options">
                <div className='logo-wrapper'>
                    <MenuIcon icon={'message'} />
                </div>
                <div className='content-wrapper'>
                    <Link to="/messages"><h4>Messages</h4></Link>
                </div>
            </div>
        </div>
    )
}

export default SideMenu
