import React from 'react';
import logo from '../../images/logo.png'
import Tab from '../Tab';
import defaultProfile from "../../images/default-profile.png"
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppProvider';

function TopMenuBar({setTab}) {
    const {setApplicationTabs, applicationTabs, userData} = React.useContext(AppContext)
    const [dropdown,setDropdown] = React.useState(false)
    
    const navigate = useNavigate();

    const handleNavigate = (uri) => {
        if (uri==='/') window.localStorage.clear();

        navigate(uri);
    }

    /** 
     * TODO: Implement a mechnanism that will check if the cursor has entered profile-container and setDropdown = true if so
     * Also, if the cursor exits content-container the setDropdown = false should be triggered
    */

    React.useEffect(()=>{},[userData])

    return (
        <div className='menu-top-bar full-width'>
            <div className="col-3x3">
                <div onClick={()=>handleNavigate(`/dashboard`)} className='col-1x3 logo-wrapper'>
                    <div className='logo-image'>
                        <img src={logo} alt={''} />
                    </div>
                    <h4>PZ Dashboard</h4>
                </div>
                <div className='col-1x3 tab-wrapper menu-tabs'>
                    <center>
                        <Tab 
                        initialIndex={applicationTabs}
                        tabs={[
                            {
                                title: "Overview", 
                                onClick: (e)=>{
                                    setApplicationTabs(e);
                                }
                            },{
                                title: "Reports", 
                                onClick: (e)=>{
                                    setApplicationTabs(e);
                                }
                            },{
                                title: "Users", 
                                onClick: (e)=>{
                                    setApplicationTabs(e);
                                }
                            },{
                                title: "Subscriptions", 
                                onClick: (e)=>{
                                    setApplicationTabs(e);
                                }
                            }]} 
                            setTab={setTab}
                        />
                    </center>
                </div>
                <div className='col-1x3 profile-wrapper'>
                    <div className="flex">
                        <div className='form-control notifications-wrapper'>
                            <span className="material-symbols-outlined">notifications</span>
                        </div>
                        <div className='form-control profile-control-wrapper' onClick={()=>setDropdown(!dropdown)}>
                            <div id="profile-container" className="profile">
                                {userData && <div className="profile-image-wrapper">
                                    <img src={`${userData.userData.imageUrl[0]==='/' ? 'https://presszero-testing.eastus.cloudapp.azure.com' : ''}${userData.userData.imageUrl}`} alt={'Profile Image'} />
                                </div>}
                                {userData && <div className="profile-info-wrapper">
                                    <h4>{userData.userData.name} {userData.userData.surname}</h4>
                                    <h6>{userData.userData.accessGroup === 'ghost-user' ? 'SUPER-USER' : userData.userData.accessGroup.toString().toUpperCase()}</h6>
                                    <div className='form-control'>
                                        <span className="material-symbols-outlined">arrow_drop_down</span>
                                    </div>
                                </div>}
                            </div>
                            {dropdown && <div id="content-container"  className='profile-content-wrapper'>
                                <div className='content-wrapper'>
                                    <ul>
                                        <li onClick={()=>handleNavigate(`/`)}>Sign Out</li>
                                    </ul>
                                </div>
                            </div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TopMenuBar
