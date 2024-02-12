import React from 'react';
import PageContainer from '../../components/generic/PageContainer';
import QuerySets from '../../controllers/dashboard.controller';
import LoadingOverlay from '../../components/overlays/LoadingOverlay';
import TopMenuBar from '../../components/generic/TopMenuBar';

import verifiedIcon from "../../images/verified.png"
import logo from "../../images/logo.png"
import Tab from '../../components/Tab';
import { AppContext } from '../../context/AppProvider';
import WidgetCompanyMetrics from '../../components/metrics/widgets/WidgetCompanyMetrics';
import StatusWidget from '../../components/generic/StatusWidget';
import Button from '../../components/Button';
import CompanyProfileEditorPopup from '../popups/CompanyProfileEditorPopup';
import { formattedDate, queryCurrentDayOfWeek, queryOnlineStatus } from '../../utilities/helpers';
import { useNavigate } from 'react-router-dom';
import Subscriptions from '../../controllers/subscription.controller';

function CompanySubscriptionsView() {
    const { indexedViewData, setIndexedViewData } = React.useContext(AppContext);
    const [isLoading, setIsLoading] = React.useState(true)
    const [API] = React.useState(new QuerySets())
    const [SUBS] = React.useState(new Subscriptions())
    const [products, setProducts] = React.useState([])
    const [chatData, setChatData] = React.useState([])
    const [preview, setPreview] = React.useState(null)
    const [searchPhrase, setSearchPhrase] = React.useState("")
    const [tab, setTab] = React.useState(0)
    const [menuTab, setMenuTab] = React.useState(0)
    const [timeSeriesTab, setTimeSeriesTab] = React.useState(0)
    const [isLoaded, setIsLoaded] = React.useState(false);

    const navigate = useNavigate();
    const handleNavigate = (uri) => navigate(uri);

    const hidePreview = () => setPreview(null)

    React.useEffect(() => {
        const init = async () => {
            try {
                const chats = await API.getAllChatStatistics()
                chats.items.forEach((e) => {
                    e.searchName = e.businessName;
                    e.searchCategory = e.categoryDefault;
                    e.searchImage = e.logoUrl;
                });
                setChatData(chats.items)
                setIsLoaded(true)
            } catch (ex) {
                console.warn(ex)
            }
        }

        init();
    }, [API])

    React.useEffect(() => {
        const init = async () => {
            let companyDataset = null;
            try {
                const res = await API.getSingleSubscription(window.location.href.split("/")[4]);
                
                let company = {
                    ...res.items[0],
                    ...res.items[0].company,
                    ...res.items[0].product,
                }

                company.id = company.companyId
                
                setIndexedViewData(company)
                companyDataset = company;
            } catch (error) {
                console.warn(error)
            }

            const lst = await SUBS.listSubscriptionModels()
            setProducts(lst.items)
        }
        init();
    }, [])

    React.useEffect(() => {
        setIsLoading(chatData.length === 0 || !isLoading)
        if (!isLoaded) {
            setIsLoaded(chatData.length === 0);
        }
    }, [])

    React.useEffect(()=>{},[preview])

    return (
        <React.Fragment>
            {isLoading && !isLoaded && <LoadingOverlay />}
            <TopMenuBar setTab={setMenuTab} />

            <PageContainer
                pageTitle={indexedViewData.businessName || "Loading.."}
                pageSubtitle={<div className='col-1x3 tab-wrapper time-series-tabs'>
                    <Tab tabs={[
                        {
                            title: "Day",
                            onClick: (() => { })
                        }, {
                            title: "Week",
                            onClick: (() => { })
                        }, {
                            title: "All Time",
                            onClick: (() => { })
                        }]}
                        setTab={setTimeSeriesTab}
                    />
                </div>}
                addons={<WidgetCompanyMetrics item={indexedViewData} timeseriesIndex={timeSeriesTab} />}
            >
                <div className='col-4x4'>
                    <div style={{ width: "86%", borderBottom: `10px solid ${indexedViewData.hexColours||"white"}` }} className='widget col-1x4'>
                        <div className='col-2x2'>
                            <div className='widget col-1x2'>
                                <div className='col-2x2 metric-wrapper flex-box end-to-end'>
                                    <div className='logo-wrapper metric'>
                                        <img
                                            src={indexedViewData.logoUrl}
                                            alt="logo"
                                            onError={(e) => {
                                                e.target.src = logo;
                                            }}
                                        />
                                    </div>
                                    <p style={{ width: "70%" }} className='metric'>{(indexedViewData.companySizeEstimate||"Unknown ").replaceAll(' ','')} employees</p>
                                </div>
                                <div className='group heading'>
                                    <h3>Company Subscription</h3>
                                </div>

                                <div className='info-wrapper'>
                                    <div className='title-wrapper'>
                                        <h4>{indexedViewData.businessName}</h4>
                                        {indexedViewData.verified && <div className='verified-icon'>
                                            <img src={verifiedIcon} alt="verified" />
                                        </div>}
                                    </div>
                                    <p>{indexedViewData.description}</p>
                                </div>
                            </div>

                            <div className='widget col-1x2'>
                                <div className='category heading'>
                                    {indexedViewData && indexedViewData.categoryList && indexedViewData.categoryList.map((e, idx) =>
                                        <h3 key={idx} className='category-item'>{e}</h3>
                                    )}
                                </div>
                                <div className='information heading'>
                                    <StatusWidget text={queryOnlineStatus({company: indexedViewData}) ? "ONLINE" : "OFFLINE"} status={queryOnlineStatus({company: indexedViewData}) ? "new" : "pending"} />
                                    <div className='business-hours-grid'>
                                        <div className='heading'>
                                            <h4>{queryCurrentDayOfWeek()}</h4>
                                            <h4>Online {indexedViewData[`${queryCurrentDayOfWeek().toLowerCase()}OpeningTime`]}</h4>
                                            <h4>Offline {indexedViewData[`${queryCurrentDayOfWeek().toLowerCase()}ClosingTime`]}</h4>
                                        </div>
                                    </div>
                                </div>
                                <div className='information heading'>
                                    <label>Customer Nr.</label>
                                    <h3 className='category-item'>{`CR-${indexedViewData.id+10000}`}</h3>
                                </div>
                                <div className='information heading'>
                                    <label>Website</label>
                                    <h3 className='category-item'><a target='_blank' href={indexedViewData.websiteUrl}>{indexedViewData.websiteUrl}</a></h3>
                                </div>
                                <div className='information heading'>
                                    <label>Subscription</label>
                                    <h3 className='category-item'>{indexedViewData.name||"No Subscription"}</h3>
                                </div>
                                <div className='information heading'>
                                    <label>Subscription Started</label>
                                    <h3 className='category-item'>{formattedDate(indexedViewData.startDate ? new Date(indexedViewData.startDate) : new Date())}</h3>
                                </div>
                                <div className='information heading'>
                                    <label>Subscription Ending</label>
                                    <h3 className='category-item'>{formattedDate(indexedViewData.endDate ? new Date(indexedViewData.endDate) : new Date())}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='col-4x4'>
                    <div className='widget special-box-view'>
                        <div className='group heading status-tool-bar'>
                            <h3>Subscription Details: {indexedViewData.name||"No Subscription"}</h3>
                            <div className={`${indexedViewData.product ? 'active' : 'inactive'}-subscription`}>
                                <div className={"inner-control"}></div>
                            </div>
                        </div>
                        <div className='col-3x3 list block'>
                            {indexedViewData.product && <React.Fragment>
                                <div className='widget col-1x3'>
                                    <div className={"subscription-widget"}>
                                        <h4>${indexedViewData.currentPrice}</h4>
                                        <h5>Revenue per month</h5>
                                    </div>
                                </div>
                                <div className='widget col-1x3'>
                                    <div className={"subscription-widget"}>
                                        <h4>{indexedViewData.currentPrice === 0 ? 0 : Math.floor(Math.abs(((indexedViewData.currentPrice-(indexedViewData.currentCost||0)) / (indexedViewData.currentPrice)) * 100))}%</h4>
                                        <h5>Margin</h5>
                                    </div>
                                </div>
                                <div className='widget col-1x3'>
                                    <div className={"subscription-widget"}>
                                        <h4>${(indexedViewData.currentCost||0)}</h4>
                                        <h5>Cost per month</h5>
                                    </div>
                                </div>
                                </React.Fragment>}
                            {!indexedViewData.product && <React.Fragment>
                                {products && products.length > 0 && products.map((e,idx)=><div key={idx} className='widget col-1x3 large-button'>
                                    <div className={"subscription-widget"}>
                                        <h4>{e.name}</h4>
                                        <h4>${e.currentPrice}</h4>
                                        <h5>Add Subscription</h5>
                                    </div>
                                </div>)}
                                </React.Fragment>}
                        </div>
                        <p className='info-message-wrapper'>
                            {indexedViewData && indexedViewData.product && indexedViewData.product.description||"This company does not have any subscriptions associated with it at the moment!"}
                        </p>
                        {indexedViewData.product && <p className='info-message-wrapper'>
                            Prepaid, billed <strong>per month</strong>, next billing date is {formattedDate(indexedViewData.startDate ? new Date(indexedViewData.startDate) : new Date())}.
                            <br/>
                            <br/>
                            Started on {formattedDate(indexedViewData.startDate ? new Date(indexedViewData.startDate) : new Date())} | Renews on {formattedDate(indexedViewData.startDate ? new Date(indexedViewData.startDate) : new Date())}.
                        </p>}
                    </div>
                </div>
            </PageContainer>
            {preview && <CompanyProfileEditorPopup handleClose={hidePreview} popupType={preview.type} item={preview.item} />}
        </React.Fragment>
    )
}

export default CompanySubscriptionsView
