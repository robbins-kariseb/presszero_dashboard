import React from 'react';
import PageContainer from '../../components/generic/PageContainer';
import QuerySets from '../../controllers/dashboard.controller';
import LoadingOverlay from '../../components/overlays/LoadingOverlay';
import TopMenuBar from '../../components/generic/TopMenuBar';
import WidgetPlatformMetrics from '../../components/metrics/widgets/WidgetPlatformMetrics';

import CompanyGridView from '../../components/generic/CompanyGridView';
import SearchBar from '../../components/generic/SearchBar';
import Button from '../../components/Button';
import Tab from '../../components/Tab';
import NewCompanyForm from '.././forms/NewCompanyForm';
import zendeskLogo from "../../images/zendesk.png"
import { AppContext } from '../../context/AppProvider';
import IntegrationWidget from '../../components/generic/IntegrationWidget';

const OverviewDashboard = () => {
    const {universalChangeCounter, applicationTabs} = React.useContext(AppContext)
    const [isLoading,setIsLoading] = React.useState(true)
    const [API] = React.useState(new QuerySets())
    const [unfilteredData,setUnfilteredData] = React.useState([])
    const [data,setData] = React.useState([])
    const [chatData,setChatData] = React.useState([])
    const [bussinesses,setBusinesses] = React.useState([])
    const [integrationList,setIntegrationList] = React.useState([])
    const [requestedCompanies,setRequestedCompanies] = React.useState([])
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
            const requested = await API.getRequestedCompanies()
            const integrations = await API.getZendeskIntegrations()
    
            try {
                setBusinesses(dataset.items.sort((a,b)=> {
                    return a.totalChats - b.totalChats
                }).slice().reverse().slice(0, 3));

                setIntegrationList(integrations.items)

                setRequestedCompanies(requested.items||[])

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

                setTabMetrics({
                verified: companies.items.filter((a)=>{
                    return a.verified === true;
                }).length,
                unverified: companies.items.filter((a)=>{
                    return a.verified === false;
                }).length,
                requested: requested.items.length})

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
            setData(requestedCompanies.sort((a,b)=>b.requestCount - a.requestCount))
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
                pageTitle={'Company Main KPIs'}
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
                    <div className='widget-container db-v-2 col-3x4'>
                        <div className='tool-bar col-3x3'>
                            <div className='col-1x3 widget-tabs'>
                                <div className='flex widget-menu'>
                                    <div className='heading' style={{width: 100, position: "relative", top: 20}}>
                                        <h4>Companies</h4>
                                    </div>
                                    <Tab 
                                        setTab={setTab}
                                        tabs={[
                                            {
                                                title:`Verified (${tabMetrics.verified||0})`,
                                                onClick:()=>{}
                                            },{
                                                title:`Unsubscribed (${tabMetrics.unverified||0})`,
                                                onClick:()=>{}
                                            },{
                                                title:`Requested (${tabMetrics.requested||0})`,
                                                onClick:()=>{}
                                        },]} 
                                    />
                                </div>
                            </div>
                            <div className='col-1x3 widget-search'>
                                <SearchBar placeholder={"Search for Companies here..."} searchPhrase={searchPhrase} onChange={setSearchPhrase} />
                            </div>
                            <div className='col-1x3 widget-actions'>
                                <Button onClick={()=>setPreview({item:{}, type:"new"})} additionalClasses={'special'} title={`Add Company`} />
                            </div>
                        </div>
                        {searchResults.sort((a,b)=>(a.verified ? 1 : 0) - (b.verified ? 1 : 0)).reverse().map((e,idx)=>{
                            return <CompanyGridView pageBreak={`${(idx + 1) % 3 === 2 ? 'last-in-row' : ''}`} item={e} key={idx} />
                        })}
                    </div>
                    <div className='widget-container db-v-2 col-1x4'>
                    <div className='tool-bar col-3x3'>
                            <div className='col-1x3' style={{width: "100%"}}>
                                <div className='flex'>
                                    <div className='heading' style={{paddingTop: 20}}>
                                        <h4>Zendesk Integrations</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {integrationList.map((e, idx) => <IntegrationWidget key={idx} item={e} logo={zendeskLogo} />)}
                    </div>
                </div>
            </PageContainer>
            {preview && <NewCompanyForm handleClose={hidePreview} popupType={preview.type} item={preview.item} />}
        </React.Fragment> 
    )
}

export default OverviewDashboard