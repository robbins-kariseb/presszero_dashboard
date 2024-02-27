import React from 'react';
import PageContainer from '../../components/generic/PageContainer';
import QuerySets from '../../controllers/dashboard.controller';
import LoadingOverlay from '../../components/overlays/LoadingOverlay';
import TopMenuBar from '../../components/generic/TopMenuBar';
import NewCompanyForm from '.././forms/NewCompanyForm';
import { AppContext } from '../../context/AppProvider';

// Import Icons:
import grid from '../../images/insight/smart-insight-grid.png';
import SearchBar from '../../components/generic/SearchBar';
import SmartInsights from '../../controllers/insights.controller';
import { formatSmartInsightMessage } from '../../utilities/helpers';
import LoadingView from '../../components/overlays/LoadingView';


const SmartInsightsDashboard = () => {
    const {universalChangeCounter,userData,setConfirmation,handleAlert,handleWarning} = React.useContext(AppContext)
    const [isLoading,setIsLoading] = React.useState(true)
    const [isResponding,setIsResponding] = React.useState(false)
    const [API] = React.useState(new QuerySets())
    const [INSIGHTS] = React.useState(new SmartInsights())
    const [myBusiness] = React.useState(userData ? userData.companyData : {})
    const [data,setData] = React.useState([])
    const [smartInsights,setSmartInsights] = React.useState([])
    const [preview, setPreview] = React.useState(null)
    const [tab, setTab] = React.useState(0)
    const [menuTab, setMenuTab] = React.useState(0)
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [searchPhrase, setSearchPhrase] = React.useState("");
    const [companyId] = React.useState(userData ? userData.userData.companyId : null)
    const [topic, setTopic] = React.useState(null)
    const scrollableRef = React.useRef(null);

    const containerStyle = {
        backgroundImage: grid,
        backgroundColor: 'white',
        marginLeft: 10,
        width: '70%',
        backgroundRepeat: 'repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    };

    const hidePreview = () => setPreview(null)

    const handleSearchInsight = async () => {
        const message = searchPhrase;
        setSearchPhrase("")
        setIsResponding(true)

        const dataset = await INSIGHTS.queryModel({message: message, companyId: companyId, topicId: topic ? topic.id : null})
        let insights = smartInsights;

        // Check if the search is associated with a topic
        if (topic && topic.id) {
            insights.forEach((e)=>{
                if (e.id === topic.id) {
                    e = dataset.item
                }
            })
        } else {
            let insights = smartInsights;
            insights.push(dataset.item)
        }

        setSmartInsights(insights)
        setTopic(dataset.item)
        setIsResponding(false)
    }
  
    const scrollToBottom = () => {
      if (scrollableRef.current) {
        scrollableRef.current.scrollTop = scrollableRef.current.scrollHeight;
      }
    };

    React.useEffect(()=>{
        setIsLoaded(true);
        setIsLoading(false)
    },[data,universalChangeCounter])

    React.useEffect(()=>{
        const init = async ()=>{
            const insights = await INSIGHTS.listInsights({companyId: companyId})

            setSmartInsights(insights.items)
        }
        
        init();
    },[API,universalChangeCounter])

    React.useEffect(()=>{
        scrollToBottom();
    },[universalChangeCounter, topic, smartInsights])


    return (
        <React.Fragment>
            {isLoading && !isLoaded && <LoadingOverlay /> }
            <TopMenuBar setTab={setMenuTab} />
            
            <PageContainer 
                pageTitle={'Smart Insights'}
                pageSubtitle={""}
                searchSpace={data}
                addons={""}
            >
                <div style={{background: "#f8f8f8"}} className='col-2x2 widget full-width'>
                    <div style={{backgroundImage: grid, backgroundColor: "white", marginRight: 10, width: "30%"}} className='col-1x2 business-form scrollable-container'>
                        {smartInsights.length === 0 && <div className='empty-text'>
                            <div className='text-container'>
                                <p>Start searching. Your requests will be here.</p>
                            </div>
                        </div>}
                        {smartInsights.map((e, idx)=><div key={idx} onClick={()=>setTopic(e)} className='insight-wrapper'>
                            <div className='heading'>{e.title}</div>
                        </div>)}
                    </div>

                    <div style={containerStyle} className='col-1x2 business-form'>
                        {!isResponding && <React.Fragment>
                            {!topic && <div className='empty-text'>
                                <div className='image-container'>
                                    <span className="material-symbols-outlined">search</span>
                                </div>
                                <div className='text-container'>
                                    <p>Please enter your request, we will analyze chats with your users and provide up-to-date information!</p>
                                </div>
                            </div>}
                            {topic && <div ref={scrollableRef} className='scrollable scroll-control'>
                                {topic.messages.map((e,idx)=><div key={idx} className={`insight-message-wrapper ${e.createdBy}-message-type`}>
                                    <div className='heading' dangerouslySetInnerHTML={{ __html: formatSmartInsightMessage(e.messageBody) }}></div>
                                </div>)}
                            </div>}
                        </React.Fragment>}
                        {isResponding && <React.Fragment>
                            <div className='empty-text'>
                                <LoadingView />
                            </div>
                        </React.Fragment>}
                        <div className='smart-search'>
                            <SearchBar onSearch={handleSearchInsight} searchPhrase={searchPhrase} placeholder={"Smart Insights Search"} onChange={setSearchPhrase} />
                        </div>
                    </div>
                </div>
            </PageContainer>
            {preview && <NewCompanyForm handleClose={hidePreview} popupType={preview.type} item={preview.item} />}
        </React.Fragment> 
    )
}

export default SmartInsightsDashboard
