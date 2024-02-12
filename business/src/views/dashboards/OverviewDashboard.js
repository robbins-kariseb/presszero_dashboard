import React from 'react';
import PageContainer from '../../components/generic/PageContainer';
import QuerySets from '../../controllers/dashboard.controller';
import LoadingOverlay from '../../components/overlays/LoadingOverlay';
import TopMenuBar from '../../components/generic/TopMenuBar';
import NewCompanyForm from '.././forms/NewCompanyForm';
import sentiment_5 from "../../images/sentiment-5.png"
import sentiment_3 from "../../images/sentiment-3.png"
import sentiment_1 from "../../images/sentiment-1.png"
import mock_graph from "../../images/mock-graph.png"
import { AppContext } from '../../context/AppProvider';
import PerformanceMetrics from '../../components/metrics/widgets/PerformanceMetrics';

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
                pageTitle={'Performance'}
                pageSubtitle={""}
                searchSpace={data}
            >
                <div className='col-4x4'>
                    <div className='col-4x4 flex'>
                        <PerformanceMetrics 
                            title={"Customer Satisfaction Score"} 
                            content={
                                <div className='metric score-large'>
                                    <div className='score-large'>4.8/5</div>
                                    <div className='score-small positive'>+0.1</div>
                                </div>
                            } 
                        />

                        <PerformanceMetrics 
                            title={"Customer Sentiment"} 
                            content={
                                <div className='metric score-large flex'>
                                    <div className='sentiment-image'>
                                        <img src={sentiment_5} alt={"Good Sentiment"} />
                                        <div className='score'>243</div>
                                    </div>
                                    <div className='sentiment-image'>
                                        <img src={sentiment_3} alt={"Neutral Sentiment"} />
                                        <div className='score'>47</div>
                                    </div>
                                    <div className='sentiment-image'>
                                        <img src={sentiment_1} alt={"Bad Sentiment"} />
                                        <div className='score'>14</div>
                                    </div>
                                </div>
                            } 
                        />
                        
                        <PerformanceMetrics 
                            title={"Average First Response Time"} 
                            content={
                                <div className='metric score-large'>
                                    <div className='score-large'>1 min 46 sec</div>
                                    <div className='score-small positive'>-0,4 sec</div>
                                </div>
                            } 
                        />

                        <PerformanceMetrics 
                            title={"Average Time To Close"} 
                            content={
                                <div className='metric score-large'>
                                    <div className='score-large'>6 min 51 sec</div>
                                    <div className='score-small negative'>+1,4 min</div>
                                </div>
                            } 
                        />
                    </div>
                </div>
                <div className='col-4x4'>
                    <div className='col-4x4 flex'>
                        <PerformanceMetrics 
                            title={"Customer Satisfaction Trend"} 
                            content={
                                <div className='metric score-large'>
                                    <div className='full-width flex'>
                                        <img src={mock_graph} alt="Mock Graph" style={{width:"100%"}} />
                                    </div>
                                </div>
                            } 
                        />

                        <PerformanceMetrics 
                            title={"Inbound Chats Received"} 
                            content={
                                <div className='metric score-large'>
                                    <div className='score-large'>845</div>
                                    <div className='score-small positive'>+41</div>
                                </div>
                            } 
                        />
                        
                        <PerformanceMetrics 
                            title={"Inbound Chats Received by Time"} 
                            content={
                                <div className='minify flex'>
                                    <div className='metric score-large'>
                                        <div className='small-heading'>Online Hours</div>
                                        <div className='score-large'>680<small>chats</small></div>
                                    </div>
                                    <div className='metric score-large'>
                                        <div className='small-heading'>Offline Hours</div>
                                        <div className='score-large'>165<small>chats</small></div>
                                    </div>
                                </div>
                            } 
                        />

                        <PerformanceMetrics 
                            title={"Customers At Risk of Churn"} 
                            content={
                                <div className='metric score-large'>
                                    <div className='score-large'>27</div>
                                    <div className='score-small negative'>+8</div>
                                </div>
                            } 
                        />
                    </div>
                </div>
            </PageContainer>
            {preview && <NewCompanyForm handleClose={hidePreview} popupType={preview.type} item={preview.item} />}
        </React.Fragment> 
    )
}

export default OverviewDashboard