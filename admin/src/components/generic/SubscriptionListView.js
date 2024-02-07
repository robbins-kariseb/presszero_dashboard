import React from 'react'
import verifiedIcon from "../../images/verified.png"
import logo from "../../images/logo.png"
import { AppContext } from '../../context/AppProvider';
import { useNavigate } from 'react-router-dom';

function SubscriptionListView({item, pageBreak}) {
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

    React.useEffect(()=>{},[item])

    return (
        <React.Fragment>
            <div onClick={()=>handleCompanyPreview(item)} className={`widget col-1x3 ${pageBreak}`}>
                <div className='zero-wrapper'>
                    <div className='widget-glass'></div>
                </div>
                <div className='heading'>
                    <div className='col-2x2 metric-wrapper flex-box end-to-end'>
                        <div className='logo-wrapper metric'>
                            <img
                                src={item.logoUrl}
                                alt="logo"
                                onError={(e) => {
                                    e.target.src = logo;
                                }}
                            />
                        </div>
                        <p className='metric'>{websiteUrl.replaceAll('https://','').replaceAll('http://','').length > 30 ? `${websiteUrl.replaceAll('https://','').replaceAll('http://','').slice(0,30)}...` : websiteUrl.replaceAll('https://','').replaceAll('http://','')}</p>
                    </div>
                    <div className='title-wrapper'>
                        <h4>{item.searchName.length > 30 ? `${item.searchName.slice(0,30)}...` : item.searchName}</h4>
                        {item.verified && <div className='verified-icon'>
                            <img src={verifiedIcon} alt="verified" />
                        </div>}
                    </div>
                    <div className='metric-wrapper flex-box'>
                        <p style={{ textAlign: "left", color: "#1A4136", fontWeight: "bold" }} className='metric'>{item.name||"No Matching"} Subscription</p>
                        <p style={{ textAlign: "right", color: "#1A4136", fontWeight: "bold" }} className='metric'>$ {item.currentPrice} Per month</p>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default SubscriptionListView

