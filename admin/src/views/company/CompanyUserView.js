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

function CompanyUserView() {
    const { indexedViewData, setIndexedViewData } = React.useContext(AppContext);
    const [isLoading, setIsLoading] = React.useState(true)
    const [API] = React.useState(new QuerySets())
    const [unfilteredData, setUnfilteredData] = React.useState([])
    const [data, setData] = React.useState([])
    const [tickets, setTickets] = React.useState([])
    const [chatData, setChatData] = React.useState([])
    const [preview, setPreview] = React.useState(null)
    const [searchPhrase, setSearchPhrase] = React.useState("")
    const [tab, setTab] = React.useState(0)
    const [menuTab, setMenuTab] = React.useState(0)
    const [timeSeriesTab, setTimeSeriesTab] = React.useState(0)
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [tabMetrics, setTabMetrics] = React.useState({});

    const navigate = useNavigate();
    const handleNavigate = (uri) => navigate(uri);

    const hidePreview = () => setPreview(null)

    let searchResults = searchPhrase.length < 2 ? [] : data.filter((e) => {
        const keywords = searchPhrase.split(' ');
        const itemText = `${e.searchName} ${e.searchCategory}`.toLowerCase();

        return keywords.every((word) => itemText.includes(word.toLowerCase()));
    });

    if (searchResults.length === 0) searchResults = data;

    const handleDelete = () => {
        if (window.confirm("This will remove the company from the system completely! Would you like to proceed?")) {
            API.deleteModel({model: "company", id: indexedViewData.id}).then((res)=>{
                if (res.response === "deleted") {
                    handleNavigate("/dashboard")
                }
            })
        }
    }

    React.useEffect(() => {
        const init = async () => {
            try {

                const companies = await API.getAllCompanies()
                companies.items.forEach((e) => {
                    e.searchName = e.businessName;
                    e.searchCategory = e.categoryDefault;
                    e.searchImage = e.logoUrl;
                });
                setUnfilteredData(companies.items)
                setData(companies.items.filter((a) => {
                    return a.verified === true;
                }))

                setTabMetrics({
                    verified: companies.items.filter((a) => {
                        return a.verified === true;
                    }).length,
                    unverified: companies.items.filter((a) => {
                        return a.verified === false;
                    }).length,
                    requested: companies.items.filter((a) => {
                        return a.requested === false;
                    }).length
                })

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
    }, [API])

    React.useEffect(() => {
        if (tab === 0) {
            const dataset = unfilteredData.filter((a) => {
                return a.verified === true;
            })

            setData(dataset)
        } else if (tab === 1) {
            const dataset = unfilteredData.filter((a) => {
                return a.verified === false;
            })

            setData(dataset)
        } else if (tab === 2) {
            const dataset = unfilteredData.filter((a) => {
                return a.unsubscribed === true;
            })

            setData(dataset)
        }
    }, [tab])

    React.useEffect(() => {
        const init = async () => {
            let companyDataset = null;
            if (!indexedViewData.id) {
                // Query API to get environment data.
                try {
                    const company = await API.getSingleCompany(window.location.href.split("/")[4]);
                    setIndexedViewData(company.response[0])
                    companyDataset = company.response[0];

                    const tickets = await API.getCompanyTickets({ companyId: companyDataset.id })
                    setTickets(tickets.response)
                } catch (error) {

                }
            }
        }
        init();
    }, [indexedViewData])

    React.useEffect(() => {
        setIsLoading(data.length === 0 || chatData.length === 0)
        if (!isLoaded) {
            setIsLoaded(!(data.length === 0 || chatData.length === 0));
        }
    }, [data, chatData])

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
                searchSpace={data}
                addons={<WidgetCompanyMetrics item={indexedViewData} timeseriesIndex={timeSeriesTab} metrics={tabMetrics} />}
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
                                    <p style={{ width: "70%" }} className='metric'>14 employees</p>
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
                            <h3>Users</h3>
                        </div>
                        <div className='list block'>
                            <Button onClick={()=>setPreview({item:indexedViewData, type:"edit"})} special={"icon-button"} icon={<span class="material-symbols-outlined">edit</span>} title="Edit Profile" />
                        </div>
                    </div>
                </div>
            </PageContainer>
            {preview && <CompanyProfileEditorPopup handleClose={hidePreview} popupType={preview.type} item={preview.item} />}
        </React.Fragment>
    )
}

export default CompanyUserView
