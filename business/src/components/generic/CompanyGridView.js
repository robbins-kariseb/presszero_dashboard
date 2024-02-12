import React from 'react'
import verifiedIcon from "../../images/verified.png"
import logo from "../../images/logo.png"
import { AppContext } from '../../context/AppProvider';
import { useNavigate } from 'react-router-dom';
import BusinessImage from './BusinessImage';

function CompanyGridView({item, pageBreak, style}) {
    const {setIndexedViewData} = React.useContext(AppContext);
    const [websiteUrl] = React.useState(item.websiteUrl||"https://presszerochat.com")

    const navigate = useNavigate();

    const handleNavigate = (uri) => {
        navigate(uri);
    }

    const handleCompanyPreview = (item) => {
        setIndexedViewData(item);

        handleNavigate(`/company/${item.id}`)
    }

    return (
        <React.Fragment>
            <div onClick={()=>handleCompanyPreview(item)} className={`widget col-1x3 ${pageBreak} ${style||""}`}>
                <div className='zero-wrapper'>
                    <div className='widget-glass'></div>
                </div>
                <div className='heading'>
                    <div className='col-2x2 metric-wrapper flex-box end-to-end'>
                        <BusinessImage item={item} />
                        <p className='metric'>{websiteUrl.replaceAll('https://','').replaceAll('http://','').length > 30 ? `${websiteUrl.replaceAll('https://','').replaceAll('http://','').slice(0,30)}...` : websiteUrl.replaceAll('https://','').replaceAll('http://','')}</p>
                    </div>
                    <div className='title-wrapper'>
                        <h4>{item.businessName}</h4>
                        {item.verified && <div className='verified-icon'>
                            <img src={verifiedIcon} alt="verified" />
                        </div>}
                    </div>
                    <div className='metric-wrapper flex-box'>
                        <p style={{ textAlign: "left" }} className='metric'>{(item.companySizeEstimate||"Unknown ").replaceAll(' ','')} employees</p>
                        <p style={{ textAlign: "right" }} className='metric'>{item.activeChats||0} active chats</p>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default CompanyGridView
