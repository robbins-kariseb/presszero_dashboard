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
import { queryCurrentDayOfWeek, queryOnlineStatus } from '../../utilities/helpers';
import { useNavigate } from 'react-router-dom';
import BusinessImage from '../../components/generic/BusinessImage';
import CategoryManager from '../../components/CategoryManager';
import CompanyVerificationWorkflow from '../workflows/CompanyVerificationWorkflow';

function CompanyOverView() {
    const { indexedViewData, setIndexedViewData, handleAlert, handleWarning, setConfirmation, onUniversalChange, universalChangeCounter } = React.useContext(AppContext);
    const [isLoading, setIsLoading] = React.useState(true)
    const [API] = React.useState(new QuerySets())
    const [chatData, setChatData] = React.useState([])
    const [preview, setPreview] = React.useState(null)
    const [menuTab, setMenuTab] = React.useState(0)
    const [timeSeriesTab, setTimeSeriesTab] = React.useState(0)
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [tabMetrics, setTabMetrics] = React.useState({});

    const navigate = useNavigate();
    const handleNavigate = (uri) => navigate(uri);

    const hidePreview = () => setPreview(null)

    const handleDelete = () => {
        setConfirmation({
            heading: `Delete ${indexedViewData.businessName}`,
            content: <p>This will remove the company from the system completely! Would you like to proceed?</p>,
            cancel: ()=>{},
            confirm: ()=>{
                API.deleteModel({model: "company", id: indexedViewData.id}).then((res)=>{
                    if (res.response === "deleted") {
                        handleNavigate("/dashboard")
                    } else {
                        handleAlert("We could not delete this object! Please try again.")
                    }
                })
            },
        })
    }

    const handleVerify = () => {
        setConfirmation({
            buttons: ["Add Subscription", "Cancel"],
            heading: `Verify ${indexedViewData.businessName}`,
            content: <CompanyVerificationWorkflow item={indexedViewData} />,
            cancel: ()=>{},
            confirm: ()=>{
                API.updateModel({
                    model: "company", 
                    id: indexedViewData.id,
                    fields: {
                        verified: true
                    }
                }).then((res)=>{
                    indexedViewData.verified = true;
                    onUniversalChange()
                })
            },
        })
    }

    const handleUnverify = () => {
        setConfirmation({
            buttons: ["Un-verify","Cancel"],
            heading: `Unverify ${indexedViewData.businessName}`,
            content: <p>You are about to unverify <strong>{indexedViewData.businessName}</strong>. This action will remove the company from Press Zero Chat and customers will not be able to chat with the company. Are you sure you want to continue?</p>,
            cancel: ()=>{},
            confirm: ()=>{
                API.updateModel({
                    model: "company", 
                    id: indexedViewData.id,
                    fields: {
                        verified: false
                    }
                }).then((res)=>{
                    indexedViewData.verified = false;
                    onUniversalChange()
                })
            },
        })
    }

    const handleAddCategories = async () => {
        setConfirmation({
            buttons: ["Save Changes","Cancel"],
            heading: `Manage Categories ${indexedViewData.businessName}`,
            content: <CategoryManager item={indexedViewData} />,
            cancel: ()=>{},
            confirm: ()=>{},
        })
    }

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
            } catch (ex) {
                console.warn(ex)
            }
        }

        init();
    }, [API, universalChangeCounter])

    React.useEffect(() => {}, [universalChangeCounter])

    React.useEffect(() => {
        const init = async () => {
            let companyDataset = null;
            // Query API to get environment data.
            if (indexedViewData.companyDefaultCategory === undefined){
                try {
                    const company = await API.getSingleCompany(window.location.href.split("/")[4]);
                    setIndexedViewData(company.response[0])
                    companyDataset = company.response[0];
                } catch (error) {
                    handleWarning("A network related error has occurred while getting data for this company!")
                }
            }
        }
        init();
    }, [universalChangeCounter])

    React.useEffect(() => {
        setIsLoading(false)
        if (!isLoaded) {
            setIsLoaded(true);
        }
    }, [chatData, universalChangeCounter])

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
                            onClick: (() => {})
                        }, {
                            title: "Week",
                            onClick: (() => {})
                        }, {
                            title: "All Time",
                            onClick: (() => {})
                        }]}
                        setTab={setTimeSeriesTab}
                    />
                </div>}
                searchSpace={[]}
                addons={<WidgetCompanyMetrics item={indexedViewData} timeseriesIndex={timeSeriesTab} metrics={tabMetrics} />}
            >
                <div className='col-4x4'>
                    <div style={{ width: "86%", borderBottom: `10px solid ${indexedViewData.hexColours||"white"}` }} className='widget col-1x4'>
                        <div className='col-2x2'>
                            <div className='widget col-1x2'>
                                <div className='col-2x2 metric-wrapper flex-box end-to-end'>
                                    <BusinessImage item={indexedViewData} />
                                    <p style={{ width: "70%" }} className='metric'>{(indexedViewData.companySizeEstimate||"Unknown ").replaceAll(' ','')} employees</p>
                                </div>
                                <div className='group heading'>
                                    <h3>Company Profile</h3>
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
                                    <label>Default Category</label>
                                    <h3 className='category-item'>{indexedViewData.categoryDefault}</h3>
                                </div>
                                <div className='information heading'>
                                    <label>Date Created</label>
                                    <h3 className='category-item'>{indexedViewData.createdDate}</h3>
                                </div>
                                <div className='information heading'>
                                    <label>Contact Number</label>
                                    <h3 className='category-item'>{indexedViewData.phone || "+(___) ___ ___ ___"}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='col-4x4'>
                    <div className='widget col-1x4'>
                        <div className='group heading'>
                            <h3>Company Management</h3>
                        </div>
                        <div className='list block'>
                            {!indexedViewData.verified && <Button onClick={handleVerify}  special={"icon-button"} icon={<span  className="material-symbols-outlined">verified</span>} title="Verify Company" />}
                            {indexedViewData.verified && <Button onClick={handleUnverify} special={"icon-button"} icon={<span  className="material-symbols-outlined">verified</span>} title="Unverify Company" />}

                            <Button onClick={handleDelete} special={"icon-button"} icon={<span  className="material-symbols-outlined">delete</span>} title="Remove Company" />
                            <Button onClick={handleAddCategories} special={"icon-button"} icon={<span  className="material-symbols-outlined">view_cozy</span>}  title="Manage Category" />
                        </div>
                    </div>
                    <div className='widget col-1x4'>
                        <div className='group heading'>
                            <h3>Profile Management</h3>
                        </div>
                        <div className='list block'>
                            <Button onClick={()=>setPreview({item:indexedViewData, type:"edit"})} special={"icon-button"} icon={<span  className="material-symbols-outlined">edit</span>} title="Edit Profile" />
                        </div>
                    </div>
                </div>
            </PageContainer>
            {preview && <CompanyProfileEditorPopup handleClose={hidePreview} popupType={preview.type} item={preview.item} />}
        </React.Fragment>
    )
}

export default CompanyOverView
