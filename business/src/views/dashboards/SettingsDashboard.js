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
import Tab from '../../components/Tab';


const SettingsDashboard = () => {
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
                pageTitle={'Settings'}
                pageSubtitle={
                <div className='col-1x3 tab-wrapper time-series-tabs'>
                    <Tab
                        initialIndex={tab}
                        tabs={[
                            {
                                title: "Company account",
                                onClick: (() => { })
                            }, {
                                title: "Billing",
                                onClick: (() => { })
                            }, {
                                title: "Contacts",
                                onClick: (() => { })
                            }]}
                        setTab={setTab}
                    />
                </div>}
                searchSpace={data}
                addons={""}
            >
                {tab === 0 && <React.Fragment>
                    <div className='col-2x2 widget full-width'>
                        <div className='col-1x2 business-form'>
                            <div className='heading'>
                                <h4>Company Details</h4>
                                <p>
                                Could you provide the location of your business registration? <br/> Including your registered address ensures that we can enhance your experience
                                </p>
                            </div>

                            <div className='form-control'>
                                <label>Company Name</label>
                                <input value={myBusiness.businessName} type={"text"} onChange={(e)=>{}} />
                            </div>

                            <div className='form-control'>
                                <label>Business Registration Address</label>
                                <input value={myBusiness.location} type={"text"} onChange={(e)=>{}} />
                            </div>

                            <div className='form-control'>
                                <label>City</label>
                                <input value={myBusiness.city||""} type={"text"} onChange={(e)=>{}} />
                            </div>

                            <div className='form-control'>
                                <label>Country</label>
                                <input value={myBusiness.country} type={"text"} onChange={(e)=>{}} />
                            </div>

                            <div className='form-control'>
                                <label>Postcode/ZIP code*</label>
                                <input value={myBusiness.zipCode||""} type={"text"} onChange={(e)=>{}} />
                            </div>

                            <div className='form-control'>
                                <label>Primary Contact*</label>
                                <input value={myBusiness.businessEmail||""} type={"text"} onChange={(e)=>{}} disabled={true} />
                            </div>
                        </div>
                        <div style={{marginTop: 55}} className='col-1x2 business-form'>
                            
                        </div>
                    </div>
                </React.Fragment>}

                {tab === 1 && <React.Fragment>
                    <div className='col-2x2 widget full-width'>
                        <div className='col-1x2 business-form'>
                            <div className='heading'>
                                <h4>Billing Details</h4>
                                <p>
                                Effortlessly streamline your billing and invoice management directly through this platform.<br/>Take control of your financial transactions
                                </p>
                            </div>

                            <div className='billing-control'>
                                <div className='col-2x2 full-width'>
                                    <div className='col-1x2 heading'>
                                        <h4>Current Plan Summary</h4>
                                    </div>
                                    <div className='col-1x2 heading'>
                                        <Button title="Manage Subscription" />
                                    </div>
                                </div>

                                <div className='col-4x4 full-width'>
                                    <div className='col-1x4 heading'>
                                        <label>PLAN NAME</label>
                                        <h4>Growth Plan</h4>
                                    </div>
                                    <div className='col-1x4 heading'>
                                        <label>BILLING PERIOD</label>
                                        <h4>Monthly</h4>
                                    </div>
                                    <div className='col-1x4 heading'>
                                        <label>PLAN COST</label>
                                        <h4>$500</h4>
                                    </div>
                                    <div className='col-1x4 heading'>
                                        <label>NEXT CHARGE</label>
                                        <h4>Feb 24, 2024</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-1x2 business-form'>
                            <div className='heading'>
                                <h4>Invoices</h4>
                                <p>
                                Efficiently oversee and organize your invoice management with ease
                                </p>
                            </div>

                            <div className='invoice-control'>
                                <table style={{marginTop: 55}} className='business-themed-table'>
                                    <thead>
                                        <tr>
                                            <td>Invoice ID</td>
                                            <td>Billing Date</td>
                                            <td>Amount</td>
                                            <td>Status</td>
                                            <td>Plan</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[1,2,3,4,5].map((e,idx)=> <tr key={idx}>
                                            <td>#0000122</td>
                                            <td>Jan 24, 2024</td>
                                            <td>$500</td>
                                            <td><div style={{border: "none",borderRadius: 5,padding: 5,width: "auto",color: "#188365"}} className='numeric-graphic good'>Paid</div></td>
                                            <td>Growth Plan</td>
                                        </tr>)}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </React.Fragment>}

                {tab === 2 && <React.Fragment>
                    <div className='col-2x2 widget full-width'>
                        <div className='col-1x2 business-form'>
                            <div className='heading'>
                                <h4>Contacts Details</h4>
                                <p>
                                The details you provide are publicly shown on your profile. <br/>Help customers get in touch with you
                                </p>
                            </div>

                            <div className='form-control'>
                                <label>Email</label>
                                <input value={myBusiness.email} type={"text"} onChange={(e)=>{}} />
                            </div>

                            <div className='form-control'>
                                <label>Phone</label>
                                <input value={myBusiness.phone} type={"text"} onChange={(e)=>{}} />
                            </div>
                        </div>
                        <div style={{marginTop: 55}} className='col-1x2 business-form'>
                            
                        </div>
                    </div>
                </React.Fragment>}

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

export default SettingsDashboard
