import React from 'react';
import PageContainer from '../../components/generic/PageContainer';
import QuerySets from '../../controllers/dashboard.controller';
import LoadingOverlay from '../../components/overlays/LoadingOverlay';
import TopMenuBar from '../../components/generic/TopMenuBar';

import CompanyGridView from '../../components/generic/CompanyGridView';
import SearchBar from '../../components/generic/SearchBar';
import Button from '../../components/Button';
import Tab from '../../components/Tab';
import ListView from '../../components/generic/ListView';
import NewCompanyForm from '.././forms/NewCompanyForm';
import { AppContext } from '../../context/AppProvider';
import WidgetSubscriptionMetrics from '../../components/metrics/widgets/WidgetSubscriptionMetrics';
import SubscriptionListView from '../../components/generic/SubscriptionListView';


const SubscriptionsDashboard = () => {
    const {universalChangeCounter,applicationTabs} = React.useContext(AppContext)
    const [isLoading,setIsLoading] = React.useState(true)
    const [processed,setProcessed] = React.useState(false)
    const [API] = React.useState(new QuerySets())
    const [unfilteredData,setUnfilteredData] = React.useState([])
    const [data,setData] = React.useState([])
    const [chatData,setChatData] = React.useState([])
    const [subscribedCompanies,setSubscribedCompanies] = React.useState([])
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
            const dataset = await API.getSubscriptions()
    
            try {
                // setBusinesses(dataset.items.sort((a,b)=> {
                //     return a.totalChats - b.totalChats
                // }).slice().reverse().slice(0, 3));

                const companies = dataset.items.map((e)=>{
                    return {
                        ...e.company,
                        ...e.product,
                        ...e
                    }
                })
                
                companies.forEach((e) => {
                    e.id = e.companyId;
                    e.searchName = e.businessName;
                    e.searchCategory = e.categoryDefault;
                    e.searchImage = e.logoUrl;
                });
                
                setUnfilteredData(companies)
                setData(companies.filter((a)=>{
                    return a.name === "Trail";
                }))

                setProcessed(true)

                setTabMetrics({demo: companies.filter((a)=>{
                    return a.name === "Demo";
                }).length,
                trail: companies.filter((a)=>{
                    return a.name === "Trail";
                }).length,
                basic: companies.filter((a)=>{
                    return a.name === "Basic";
                }).length,
                premium: companies.filter((a)=>{
                    return a.name === "Premium";
                }).length})
            } catch (ex) {
                console.warn(ex)
            }
        }
        
        init();
    },[API,universalChangeCounter])

    React.useEffect(()=>{
        if (tab === 3) {
            const dataset = unfilteredData.filter((a)=>{
                return a.name === "Demo";
            })

            setData(dataset)
        } else if (tab === 0) {
            const dataset = unfilteredData.filter((a)=>{
                return a.name === "Trail";
            })

            setData(dataset)
        } else if (tab === 1) {
            const dataset = unfilteredData.filter((a)=>{
                return a.name === "Basic";
            })

            setData(dataset)
        } else if (tab === 2) {
            const dataset = unfilteredData.filter((a)=>{
                return a.name === "Premium";
            })

            setData(dataset)
        }
    },[tab,universalChangeCounter])

    React.useEffect(()=>{
        setIsLoading(data.length === 0)
        if (!isLoaded) {
            setIsLoaded(!(data.length === 0 && !processed));
        }
    },[data,chatData,universalChangeCounter,processed])

    return (
        <React.Fragment>
            {isLoading && !isLoaded && <LoadingOverlay /> }
            <TopMenuBar setTab={setMenuTab} />
            
            <PageContainer 
                pageTitle={'Subscription Main KPIs'}
                pageSubtitle={<div className='col-1x3 tab-wrapper time-series-tabs'>
                        <Tab
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
                addons={<WidgetSubscriptionMetrics timeseriesIndex={timeSeriesTab} metrics={tabMetrics} />}
            >
                <div className='col-4x4'>
                    <div className='widget-container db-v-2 col-3x4'>
                        <div className='tool-bar col-3x3'>
                            <div className='col-1x3 widget-tabs'>
                                <div className='flex widget-menu'>
                                    <div className='heading' style={{width: 100, position: "relative", top: 20}}>
                                        <h4>Subscriptions</h4>
                                    </div>
                                    <Tab 
                                        setTab={setTab}
                                        tabs={[
                                            {
                                                title:`Trial (${tabMetrics.trail||0})`,
                                                onClick:()=>{}
                                            },{
                                                title:`Basic (${tabMetrics.basic||0})`,
                                                onClick:()=>{}
                                            },{
                                                title:`Premium (${tabMetrics.premium||0})`,
                                                onClick:()=>{}
                                            },{
                                                title:`Demo (${tabMetrics.demo||0})`,
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
                            return <SubscriptionListView pageBreak={`${(idx + 1) % 3 === 2 ? 'last-in-row' : ''}`} item={e} key={idx} />
                        })}
                    </div>
                    <div className='widget-container db-v-2 col-1x4'>
                    <div className='tool-bar col-3x3'>
                            <div className='col-1x3' style={{width: "100%"}}>
                                <div className='flex'>
                                    <div className='heading' style={{paddingTop: 20}}>
                                        <h4>Zendesk Requests</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {[1,2,3,4,5,6,7].map((e,idx)=><ListView key={idx} item={{title: `Zendesk Request Item ${e+134}`, subtitle: "Nustream"}} />)}
                    </div>
                </div>
            </PageContainer>
            {preview && <NewCompanyForm handleClose={hidePreview} popupType={preview.type} item={preview.item} />}
        </React.Fragment> 
    )
}

export default SubscriptionsDashboard