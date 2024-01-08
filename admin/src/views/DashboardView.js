import React from 'react'
import SideMenu from '../components/generic/SideMenu';
import PageContainer from '../components/generic/PageContainer';
import WidgetCompanyStats from '../components/metrics/widgets/WidgetCompanyStats';
import WidgetPlatformReviews from '../components/metrics/widgets/WidgetPlatformReviews';
import WidgetPlatformChats from '../components/metrics/widgets/WidgetPlatformChats';
import QuerySets from '../controllers/dashboard.controller';
import LoadingOverlay from '../components/overlays/LoadingOverlay';
import CompanyStatisticsPopup from './popups/CompanyStatisticsPopup';

function DashboardView() {
    const [isLoading,setIsLoading] = React.useState(true)
    const [API] = React.useState(new QuerySets())
    const [data,setData] = React.useState([])
    const [chatData,setChatData] = React.useState([])
    const [bussinesses,setBusinesses] = React.useState([])
    const [preview, setPreview] = React.useState(null)

    const handleStatisticsPreview = ({type, item}) => {
        setPreview({type, item})
    }

    const hidePreview = () => setPreview(null)

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
                setData(companies.items)

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
    },[API])

    React.useEffect(()=>{},[bussinesses])

    React.useEffect(()=>{
        setIsLoading(data.length === 0 ||chatData.length === 0 ||bussinesses.length === 0)
    },[data,chatData,bussinesses])

    return (
        <React.Fragment>
            {isLoading && <LoadingOverlay /> }
            <SideMenu/>
            <PageContainer 
                pageTitle={'APPLICATION DASHBOARD'}
                pageSubtitle={'Here are your insights'}
                searchSpace={data}
            >
                <div className='mini-3x3'>
                    {bussinesses.map((e,idx)=><WidgetCompanyStats onPreview={handleStatisticsPreview} item={e} key={idx} />)}
                </div>
                <div className='mini-3x3'>
                    <WidgetPlatformReviews onPreview={handleStatisticsPreview}  />
                    <WidgetPlatformChats onPreview={handleStatisticsPreview} items={chatData} />
                </div>
            </PageContainer>
            {preview && <CompanyStatisticsPopup handleClose={hidePreview} popupType={preview.type} item={preview.item} />}
        </React.Fragment> 
    )
}

export default DashboardView
