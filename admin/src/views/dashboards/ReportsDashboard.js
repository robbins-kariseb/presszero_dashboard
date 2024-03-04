import React from 'react';
import PageContainer from '../../components/generic/PageContainer';
import QuerySets from '../../controllers/dashboard.controller';
import LoadingOverlay from '../../components/overlays/LoadingOverlay';
import TopMenuBar from '../../components/generic/TopMenuBar';
import WidgetPlatformMetrics from '../../components/metrics/widgets/WidgetPlatformMetrics';

import Tab from '../../components/Tab';
import NewCompanyForm from '.././forms/NewCompanyForm';
import { AppContext } from '../../context/AppProvider';
import SpecifiedDomainRadarChart from '../charts/SpecifiedDomainRadarChart';
import GenericBarChart from '../charts/GenericBarChart';


const ReportsDashboard = () => {
    const {universalChangeCounter, applicationTabs} = React.useContext(AppContext)
    const [isLoading,setIsLoading] = React.useState(true)
    const [API] = React.useState(new QuerySets())
    const [unfilteredData,setUnfilteredData] = React.useState([])
    const [data,setData] = React.useState([])
    const [chatData,setChatData] = React.useState([])
    const [bussinesses,setBusinesses] = React.useState([])
    const [preview, setPreview] = React.useState(null)
    const [searchPhrase, setSearchPhrase] = React.useState("")
    const [tab, setTab] = React.useState(0)
    const [menuTab, setMenuTab] = React.useState(0)
    const [timeSeriesTab, setTimeSeriesTab] = React.useState(0)
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [tabMetrics, setTabMetrics] = React.useState({});

    const hidePreview = () => setPreview(null)

    let searchResults = searchPhrase.length < 2 ? [] : data.filter((e) => {
        const keywords = searchPhrase.split(' ');
        const itemText = `${e.searchName} ${e.searchCategory}`.toLowerCase();
    
        return keywords.every((word) => itemText.includes(word.toLowerCase()));
    });

    if (searchResults.length === 0) searchResults = data;

    React.useEffect(()=>{
        const init = async ()=>{
            const dataset = await API.getCompanyStatistics()
    
            try {
                setBusinesses(dataset.items.sort((a,b)=> {
                    return a.totalChats - b.totalChats
                }).slice().reverse().slice(0, 3));

                const companies = await API.getAllCompanies()
                companies.items.forEach((e) => {
                    e.searchName = e.businessName;
                    e.searchCategory = e.categoryDefault;
                    e.searchImage = e.logoUrl;
                });
                setUnfilteredData(companies.items)
                setData(companies.items.filter((a)=>{
                    return a.verified === true;
                }))

                setTabMetrics({verified: companies.items.filter((a)=>{
                    return a.verified === true;
                }).length,
                unverified: companies.items.filter((a)=>{
                    return a.verified === false;
                }).length,
                requested: companies.items.filter((a)=>{
                    return a.requested === false;
                }).length})

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
    },[API,universalChangeCounter])

    React.useEffect(()=>{
        if (tab === 0) {
            const dataset = unfilteredData.filter((a)=>{
                return a.verified === true;
            })

            setData(dataset)
        } else if (tab === 1) {
            const dataset = unfilteredData.filter((a)=>{
                return a.verified === false;
            })

            setData(dataset)
        } else if (tab === 2) {
            const dataset = unfilteredData.filter((a)=>{
                return a.unsubscribed === true;
            })

            setData(dataset)
        }
    },[tab,universalChangeCounter])

    React.useEffect(()=>{},[bussinesses])

    React.useEffect(()=>{
        setIsLoading(data.length === 0 ||chatData.length === 0 ||bussinesses.length === 0)
        if (!isLoaded) {
            setIsLoaded(!(data.length === 0 ||chatData.length === 0 ||bussinesses.length === 0));
        }
    },[data,chatData,bussinesses,universalChangeCounter])

    return (
        <React.Fragment>
            {isLoading && !isLoaded && <LoadingOverlay /> }
            <TopMenuBar setTab={setMenuTab} />
            
            <PageContainer 
                pageTitle={'Platform Main KPIs'}
                pageSubtitle={<div className='col-1x3 tab-wrapper time-series-tabs'>
                        <Tab 
                        initialIndex={applicationTabs}
                        tabs={[
                            {
                                title: "Day", 
                                onClick: (()=>{})
                            },{
                                title: "Week", 
                                onClick: (()=>{})
                            },{
                                title: "All Time", 
                                onClick: (()=>{})
                            }]} 
                            setTab={setTimeSeriesTab}
                        />
                </div>}
                searchSpace={data}
                addons={<WidgetPlatformMetrics timeseriesIndex={timeSeriesTab} metrics={tabMetrics} />}
            >
                <div className='col-4x4'>
                    <div style={{width: "100%"}} className='widget-container db-v-2 col-3x4'>
                        <div className='report-heading'>
                            <h4>Press Zero Campaign Overview</h4>
                        </div>
                        <div className='col-2x2 chart-container'>
                            <div className='col-1x2 chart-wrapper'>
                                <SpecifiedDomainRadarChart heading={"Distribution of Subscribed Companies"} />
                            </div>
                            <div className='col-1x2 chart-wrapper'>
                                <SpecifiedDomainRadarChart heading={"High Volume Categories"} />
                            </div>
                        </div>
                        <div className='col-2x2 chart-container'>
                            <div style={{width: "100%"}} className='col-1x2 chart-wrapper'>
                                <GenericBarChart heading={"Subscriptions by Month"} />
                            </div>
                        </div>
                    </div>
                </div>
            </PageContainer>
            {preview && <NewCompanyForm handleClose={hidePreview} popupType={preview.type} item={preview.item} />}
        </React.Fragment> 
    )
}

export default ReportsDashboard
