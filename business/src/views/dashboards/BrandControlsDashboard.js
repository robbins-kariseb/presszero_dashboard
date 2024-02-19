import React from 'react';
import PageContainer from '../../components/generic/PageContainer';
import QuerySets from '../../controllers/dashboard.controller';
import LoadingOverlay from '../../components/overlays/LoadingOverlay';
import TopMenuBar from '../../components/generic/TopMenuBar';
import deviceBrandControl from '../../images/pz-mobile-branding-display.png';
import NewCompanyForm from '.././forms/NewCompanyForm';
import { AppContext } from '../../context/AppProvider';
import Button from '../../components/Button';

// Import Icons:
import facebook from '../../images/social/facebook.png';
import linkedin from '../../images/social/linkedin.png';
import spaceX from '../../images/social/spacex.png';
import instagram from '../../images/social/instagram.png';


const BrandControlsDashboard = () => {
    const {universalChangeCounter,userData,setConfirmation,handleAlert,handleWarning} = React.useContext(AppContext)
    const [isLoading,setIsLoading] = React.useState(true)
    const [API] = React.useState(new QuerySets())
    const [myBusiness] = React.useState(userData ? userData.companyData : {})
    const [data,setData] = React.useState([])
    const [preview, setPreview] = React.useState(null)
    const [tab, setTab] = React.useState(0)
    const [menuTab, setMenuTab] = React.useState(0)
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [companyId] = React.useState(userData ? userData.userData.companyId : null)

    const hidePreview = () => setPreview(null)

    React.useEffect(()=>{
        setIsLoaded(true);
        setIsLoading(false)
    },[data,universalChangeCounter])

    React.useEffect(()=>{
        const init = async ()=>{
            
        }
        
        init();
    },[API,universalChangeCounter])

    React.useEffect(()=>{
        
    },[universalChangeCounter])

    return (
        <React.Fragment>
            {isLoading && !isLoaded && <LoadingOverlay /> }
            <TopMenuBar setTab={setMenuTab} />
            
            <PageContainer 
                pageTitle={'Brand Controls'}
                pageSubtitle={""}
                searchSpace={data}
                addons={""}
            >
                <div className='col-2x2 widget full-width'>
                    <div className='col-1x2 business-form'>
                        <div className='heading'>
                            <h4>Details</h4>
                            <p>
                            Add information about your company: <br/>write company description, highlights, contacts and social networks
                            </p>
                        </div>

                        <div className='form-control'>
                            <label>Company Name</label>
                            <input value={myBusiness.businessName} type={"text"} onChange={(e)=>{}} />
                        </div>

                        <div className='form-control'>
                            <label>Company Description</label>
                            <input value={myBusiness.description} type={"text"} onChange={(e)=>{}} />
                        </div>

                        <div className='form-control'>
                            <label>Company Highlights</label>
                            <input value={myBusiness.highlights||""} type={"text"} onChange={(e)=>{}} />
                        </div>

                        <div className='form-control'>
                            <label>Phone Number</label>
                            <input value={myBusiness.phone} type={"text"} onChange={(e)=>{}} />
                        </div>

                        <div className='form-control'>
                            <label>URL</label>
                            <input value={myBusiness.websiteUrl} type={"text"} onChange={(e)=>{}} />
                        </div>
                    </div>
                    <div style={{marginTop: 55}} className='col-1x2 business-form'>
                        <div className='form-control'>
                            <label><div className='labeled-icon'><img src={instagram} alt='icon' /></div><div className='labeled-text'>Instagram</div></label>
                            <input value={""} type={"text"} onChange={(e)=>{}} />
                        </div>

                        <div className='form-control'>
                            <label><div className='labeled-icon'><img src={facebook} alt='icon' /></div><div className='labeled-text'>Facebook</div></label>
                            <input value={""} type={"text"} onChange={(e)=>{}} />
                        </div>

                        <div className='form-control'>
                            <label><div className='labeled-icon'><img src={linkedin} alt='icon' /></div><div className='labeled-text'>LinkedIn</div></label>
                            <input value={""} type={"text"} onChange={(e)=>{}} />
                        </div>

                        <div className='form-control'>
                            <label><div className='labeled-icon'><img src={spaceX} alt='icon' /></div><div className='labeled-text'>Space X (ex. Twitter)</div></label>
                            <input value={""} type={"text"} onChange={(e)=>{}} />
                        </div>

                        <div className='form-control'>
                            <label>App Store link</label>
                            <input value={""} type={"text"} onChange={(e)=>{}} />
                        </div>

                        <div className='form-control'>
                            <label>Google Play link</label>
                            <input value={""} type={"text"} onChange={(e)=>{}} />
                        </div>
                    </div>
                </div>
                <div className='col-2x2 widget full-width'>
                    <div className='col-1x2 business-form'>
                        <div className='heading'>
                            <h4>Personalize</h4>
                            <p>
                            Personalize your chat: add a company logo and brand colour.
                            </p>
                        </div>

                        <div className='form-control'>
                            <label>Select company logo</label>
                            <div className='col-2x2 company-logo-control'>
                                <div className='col-1x2 logo-wrapper'>
                                    <img src={myBusiness.logoUrl} alt={myBusiness.businessName} />
                                </div>
                                <div className='col-1x2 logo-control-wrapper'>
                                    <div className='heading'>
                                        <Button title={"Choose logo"} />
                                    </div>
                                    <div className='heading'>
                                        <p>Recommended dimensions of 256x256 or 512x512</p>
                                        <p>.png, .jpeg, .jpg up to 5 MB</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='form-control'>
                            <label>Select colour for background of chat</label>
                            <input value={myBusiness.hexColours||"white"} type={"color"} onChange={(e)=>{}} />
                        </div>
                    </div>
                    <div style={{marginTop: 55}} className='col-1x2 business-form'>
                        <div className='brand-identity-controls'>
                            <div className='device-wrapper'>
                                <img  style={{backgroundColor: userData ? userData.companyData.hexColours : "black"}} src={deviceBrandControl} alt='PZ Brand Control Device' />
                            </div>
                        </div>
                    </div>
                </div>

                <div className='persistance-controls'>
                    <div className='form-control'>
                        <Button title={"Save Changes"} special={"special"} />
                        <Button title={"Cancel"} />
                    </div>
                </div>
            </PageContainer>
            {preview && <NewCompanyForm handleClose={hidePreview} popupType={preview.type} item={preview.item} />}
        </React.Fragment> 
    )
}

export default BrandControlsDashboard
