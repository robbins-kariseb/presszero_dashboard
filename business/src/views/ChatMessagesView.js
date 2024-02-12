import React from 'react'
import SideMenu from '../components/generic/SideMenu';
import PageContainer from '../components/generic/PageContainer';
import LoadingOverlay from '../components/overlays/LoadingOverlay';
import WidgetMessageExplorer from '../components/metrics/widgets/WidgetMessageExplorer';
import QuerySets from '../controllers/dashboard.controller';

function ChatMessagesView() {
    const [API] = React.useState(new QuerySets())
    const [isLoading,setIsLoading] = React.useState(false)
    const [data, setData] = React.useState([])
    const [chatData, setChatData] = React.useState([])

    React.useEffect(()=>{
        const init = async ()=>{
            try {
                const chats = await API.getAllChatStatistics()
                chats.items.forEach((e) => {
                    e.searchName = e.businessName;
                    e.description = e.lastMessage;
                    e.searchImage = e.logoUrl;
                });
                setChatData(chats.items)
                setData(chats.items)
            } catch (ex) {
                console.warn(ex)
            }
        }
        init();
    },[API])

    React.useEffect(()=>{
        setIsLoading(data.length === 0 || chatData.length === 0)
    },[data,chatData])

    return (
        <React.Fragment>
            {isLoading && <LoadingOverlay /> }
            <SideMenu/>
            <PageContainer 
                pageTitle={'MESSAGES'}
                pageSubtitle={'Overview'}
                searchSpace={data}
                searchPlaceholder={"Search for messages here..."}
            >
                <WidgetMessageExplorer items={chatData} />
            </PageContainer>
        </React.Fragment>
    )
}

export default ChatMessagesView
