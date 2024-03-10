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

function CompanyReportsView() {
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
    }, [])

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
                    <h4 className='info-message-wrapper'>
                        Company Report View has not been implemented as of yet! Changes to the view will reflect here as project progresses!<br/>
                        Should you like to see the dashboard, please click <a href="/dashboard">here</a>.
                    </h4>
                </div>

                <div className='col-4x4'>
                    
                </div>
            </PageContainer>
            {preview && <CompanyProfileEditorPopup handleClose={hidePreview} popupType={preview.type} item={preview.item} />}
        </React.Fragment>
    )
}

export default CompanyReportsView
