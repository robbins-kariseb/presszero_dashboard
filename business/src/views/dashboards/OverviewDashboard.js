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
import Reports from '../../controllers/reports.controller';
import GenericBarChart from '../charts/GenericBarChart';
import WidgetFigure from '../../components/metrics/widgets/WidgetFigure';
import WidgetCompanyMetrics from '../../components/metrics/widgets/WidgetCompanyMetrics';

const ReportKeys = {
    0: "day",
    1: "week",
    2: "month",
}

const OverviewDashboard = () => {
    const {universalChangeCounter, userData} = React.useContext(AppContext)
    const [isLoading,setIsLoading] = React.useState(true)
    const [API] = React.useState(new QuerySets())
    const [REPORTS] = React.useState(new Reports())
    const [unfilteredData,setUnfilteredData] = React.useState([])
    const [data,setData] = React.useState([])
    const [chatData,setChatData] = React.useState([])
    const [surveyData,setSurveyData] = React.useState([])
    const [sentiment,setSentiment] = React.useState([])
    const [averageFirstResponse,setAverageFirstResponse] = React.useState([])
    const [inboundChatsReceived,setInboundChatsReceived] = React.useState([])
    const [customersAtRiskOfChurn,setCustomersAtRiskOfChurn] = React.useState([])
    const [inboundChatsReceivedByTime,setInboundChatsReceivedByTime] = React.useState([])
    const [CustomerSatisfactionTrend,setCustomerSatisfactionTrend] = React.useState([])
    const [AverageTimeToClose,setAverageTimeToClose] = React.useState([])
    const [CustomerSatisfactionScores,setCustomerSatisfactionScores] = React.useState([])
    const [requestedCompanies,setRequestedCompanies] = React.useState([])
    const [preview, setPreview] = React.useState(null)
    const [searchPhrase, setSearchPhrase] = React.useState("")
    const [tab, setTab] = React.useState(0)
    const [menuTab, setMenuTab] = React.useState(0)
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [timeSeriesTab, setTimeSeriesTab] = React.useState(0)
    const [tabMetrics, setTabMetrics] = React.useState({});

    const [tab1x1, setTab1x1] = React.useState(0)
    const [tab1x2, setTab1x2] = React.useState(0)
    const [tab1x3, setTab1x3] = React.useState(0)
    const [tab1x4, setTab1x4] = React.useState(0)
    const [tab1x5, setTab1x5] = React.useState(0)
    const [tab1x6, setTab1x6] = React.useState(0)
    const [tab1x7, setTab1x7] = React.useState(0)
    const [tab1x8, setTab1x8] = React.useState(0)

    const hidePreview = () => setPreview(null)

    let searchResults = searchPhrase.length < 2 ? [] : data.filter((e) => {
        const keywords = searchPhrase.split(' ');
        const itemText = `${e.searchName} ${e.searchCategory}`.toLowerCase();
    
        return keywords.every((word) => itemText.includes(word.toLowerCase()));
    });

    if (searchResults.length === 0) searchResults = data;

    React.useEffect(()=>{
        const init = async ()=>{
            if (userData && userData.companyData)
            {
                const dataset = await API.getCompanyChatMessages({companyId: userData.companyData.id})
                const survey = await API.getFilteredModels({model: "surveyAfterChat", filters: {companyId: userData.companyData.id}})

                try {
                    setChatData(dataset.response)
                    setSurveyData(survey.response)
                } catch (ex) {
                    console.warn(ex)
                }
            }
        }
        
        init();
    },[API,userData,universalChangeCounter])

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

    React.useEffect(()=>{
        if (chatData && chatData.length > 0) {
            setSentiment(REPORTS.CustomerSentimentReport({dataset: chatData}))
            setAverageFirstResponse(REPORTS.AverageFirstResponseTimeReport({dataset: chatData}))
            setInboundChatsReceived(REPORTS.InboundChatsReceivedReport({dataset: chatData}))
            setInboundChatsReceivedByTime(REPORTS.InboundChatsReceivedByTimeReport({dataset: chatData, companyData: userData.companyData}))
            setCustomersAtRiskOfChurn(REPORTS.CustomersAtRiskOfChurnReport({dataset: chatData}))
            setCustomersAtRiskOfChurn(REPORTS.CustomersAtRiskOfChurnReport({dataset: chatData}))
            setCustomerSatisfactionScores(REPORTS.CustomerSatisfactionScoreReport({dataset: surveyData}))
            setCustomerSatisfactionTrend(REPORTS.CustomerSatisfactionTrendReport({dataset: chatData}))
            setAverageTimeToClose(REPORTS.AverageTimeToCloseReport({dataset: chatData}))
        }
    },[chatData])

    React.useEffect(()=>{
        setIsLoading((chatData||[{}]).length === 0)
        if (!isLoaded) {
            setIsLoaded((chatData||[{}]).length !== 0);
        }
    },[data,chatData,universalChangeCounter])

    return (
        <React.Fragment>
            {isLoading && !isLoaded && <LoadingOverlay /> }
            <TopMenuBar setTab={setMenuTab} />
            
            <PageContainer 
                pageTitle={'Performance'}
                pageSubtitle={""}
                searchSpace={data}
                addons={<WidgetCompanyMetrics item={userData ? userData.companyData:{}} timeseriesIndex={timeSeriesTab} metrics={tabMetrics} />}
            >
                <div className='col-4x4'>
                    <div className='col-4x4 flex'>
                        <PerformanceMetrics 
                            title={"Customer Satisfaction Score"} 
                            onTabChange={setTab1x1}
                            content={
                                <div className='metric score-large'>
                                    <div className='score-large'>{CustomerSatisfactionScores[ReportKeys[tab1x1]] ? CustomerSatisfactionScores[ReportKeys[tab1x1]].current : 0}/5</div>
                                    <WidgetFigure value={CustomerSatisfactionScores[ReportKeys[tab1x1]] ? CustomerSatisfactionScores[ReportKeys[tab1x1]].total : 0} />
                                    {/* <div className='score-small positive'>{CustomerSatisfactionScores[ReportKeys[tab1x1]] ? CustomerSatisfactionScores[ReportKeys[tab1x1]].total : 0}</div> */}
                                </div>
                            } 
                        />

                        <PerformanceMetrics 
                            title={"Customer Sentiment"} 
                            onTabChange={setTab1x2}
                            content={
                                <div className='metric score-large flex'>
                                    <div className='sentiment-image'>
                                        <img src={sentiment_5} alt={"Good Sentiment"} />
                                        <div className='score'>{sentiment[ReportKeys[tab1x2]] ? sentiment[ReportKeys[tab1x2]].positive : 0}</div>
                                    </div>
                                    <div className='sentiment-image'>
                                        <img src={sentiment_3} alt={"Neutral Sentiment"} />
                                        <div className='score'>{sentiment[ReportKeys[tab1x2]] ? sentiment[ReportKeys[tab1x2]].neutral : 0}</div>
                                    </div>
                                    <div className='sentiment-image'>
                                        <img src={sentiment_1} alt={"Bad Sentiment"} />
                                        <div className='score'>{sentiment[ReportKeys[tab1x2]] ? sentiment[ReportKeys[tab1x2]].negative : 0}</div>
                                    </div>
                                </div>
                            } 
                        />
                        
                        <PerformanceMetrics 
                            title={"Average First Response Time"} 
                            onTabChange={setTab1x3}
                            content={
                                <div className='metric score-large'>
                                    <div className='score-large'>{averageFirstResponse[ReportKeys[tab1x3]] ? averageFirstResponse[ReportKeys[tab1x3]].time : 0}</div>
                                    <WidgetFigure value={averageFirstResponse[ReportKeys[tab1x3]] ? averageFirstResponse[ReportKeys[tab1x3]].total : 0} />
                                    {/* <div className='score-small positive'>{averageFirstResponse[ReportKeys[tab1x3]] ? averageFirstResponse[ReportKeys[tab1x3]].total : 0}</div> */}
                                </div>
                            } 
                        />

                        <PerformanceMetrics 
                            title={"Average Time To Close"} 
                            onTabChange={setTab1x4}
                            content={
                                <div className='metric score-large'>
                                    <div className='score-large'>{AverageTimeToClose[ReportKeys[tab1x4]] ? AverageTimeToClose[ReportKeys[tab1x4]].time : 0}</div>
                                    <WidgetFigure value={AverageTimeToClose[ReportKeys[tab1x4]] ? AverageTimeToClose[ReportKeys[tab1x4]].time : 0} />
                                    {/* <div className='score-small negative'>{AverageTimeToClose[ReportKeys[tab1x4]] ? AverageTimeToClose[ReportKeys[tab1x4]].time : 0}</div> */}
                                </div>
                            } 
                        />
                    </div>
                </div>
                <div className='col-4x4'>
                    <div className='col-4x4 flex'>
                        <PerformanceMetrics 
                            title={"Customer Satisfaction Trend"} 
                            onTabChange={setTab1x5}
                            content={
                                <div className='metric score-large'>
                                    <div style={{minHeight: 160}} className='full-width flex'>
                                        <GenericBarChart keyName='Average Sentiment' data={CustomerSatisfactionTrend[ReportKeys[tab1x5]] ? CustomerSatisfactionTrend[ReportKeys[tab1x5]] : null} />
                                    </div>
                                </div>
                            } 
                        />

                        <PerformanceMetrics 
                            title={"Inbound Chats Received"} 
                            onTabChange={setTab1x6}
                            content={
                                <div className='metric score-large'>
                                    <div className='score-large'>{inboundChatsReceived[ReportKeys[tab1x6]] ? inboundChatsReceived[ReportKeys[tab1x6]].current : 0}</div>
                                    <WidgetFigure value={inboundChatsReceived[ReportKeys[tab1x6]] ? inboundChatsReceived[ReportKeys[tab1x6]].total : 0} />
                                    {/* <div className='score-small positive'>{inboundChatsReceived[ReportKeys[tab1x6]] ? inboundChatsReceived[ReportKeys[tab1x6]].total : 0}</div> */}
                                </div>
                            } 
                        />
                        
                        <PerformanceMetrics 
                            title={"Inbound Chats Received by Time"} 
                            onTabChange={setTab1x7}
                            content={
                                <div className='minify flex'>
                                    <div style={{display: "grid"}} className='metric score-large'>
                                        <div className='small-heading'>Online Hours</div>
                                        <div className='score-large'>{inboundChatsReceivedByTime[ReportKeys[tab1x7]] ? inboundChatsReceivedByTime[ReportKeys[tab1x7]].open : 0}<small>chats</small></div>
                                    </div>
                                    <div style={{display: "grid"}}  className='metric score-large'>
                                        <div className='small-heading'>Offline Hours</div>
                                        <div className='score-large'>{inboundChatsReceivedByTime[ReportKeys[tab1x7]] ? inboundChatsReceivedByTime[ReportKeys[tab1x7]].closed : 0}<small>chats</small></div>
                                    </div>
                                </div>
                            } 
                        />

                        <PerformanceMetrics 
                            title={"Customers At Risk of Churn"} 
                            onTabChange={setTab1x8}
                            content={
                                <div className='metric score-large'>
                                    <div className='score-large'>{customersAtRiskOfChurn[ReportKeys[tab1x8]] ? customersAtRiskOfChurn[ReportKeys[tab1x8]].current : 0}</div>
                                    <WidgetFigure inverted={true} value={customersAtRiskOfChurn[ReportKeys[tab1x8]] ? customersAtRiskOfChurn[ReportKeys[tab1x8]].total : 0} />
                                    {/* <div className='score-small negative'>{customersAtRiskOfChurn[ReportKeys[tab1x8]] ? customersAtRiskOfChurn[ReportKeys[tab1x8]].total : 0}</div> */}
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