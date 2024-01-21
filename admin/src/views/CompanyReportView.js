import React from 'react'
import SideMenu from '../components/generic/SideMenu';
import PageContainer from '../components/generic/PageContainer';
import QuerySets from '../controllers/dashboard.controller';
import presszeroLogo from "../images/presszero.png"
import zendeskLogo from "../images/zendesk.png"
import outlookLogo from "../images/outlook.png"

function CompanyReportView() {
    const [API] = React.useState(new QuerySets())
    const [data,setData] = React.useState([])
    const [item,setItem] = React.useState(null)

    React.useEffect(() => {
        const init = async () => {
            try {
                const companies = await API.getAllCompanies()
                setData(companies.items)
                console.warn(companies.items)
            } catch (error) {
                console.warn(error)
            }
        }
        init();
    }, [API]);

    return (
        <React.Fragment>
            <SideMenu/>
            <PageContainer 
                pageTitle={'COMPANY REPORT'}
                pageSubtitle={'Here are your insights'}
                searchSpace={data}
            >
                {item && <React.Fragment>
                    <div className="mini-heading">
                        <div className="titles">
                        <h4>Metrics ~ {item.businessName}</h4>
                        <p>Press Zero Statistics</p>
                        </div>
                    </div>
                    <div style={{maxHeight: "50vh"}} className="scrollable chat-view">
                        <div className='mini-3x3'>
                            <div className="col-1x2 widget-1x3 company-crm-statistics">
                                <div className="mini-statistics">
                                    <div className="figure-wrapper">
                                    <h4>{item.totalChats||"0"}</h4>
                                    <p>Total Chats</p>
                                    </div>
                                    <div className="figure-wrapper middle">
                                    <h4>{item.activeChats||"0"}</h4>
                                    <p>Active</p>
                                    </div>
                                    <div className="figure-wrapper">
                                    <h4>{item.pendingChats||"0"}</h4>
                                    <p>Pending</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-1x2 widget-1x3 company-crm-statistics">
                                <div className="mini-statistics integrations">
                                    <div className="figure-wrapper">
                                        <div className="logo-wrapper">
                                            <img src={zendeskLogo} alt="zendesk" />
                                        </div>
                                        <div className="hint disabled"><center>DISABLED</center></div>
                                    </div>
                                    <div className="figure-wrapper middle">
                                        <div className="logo-wrapper">
                                            <img src={outlookLogo} alt="zendesk" />
                                        </div>
                                        <div className="hint disabled"><center>DISABLED</center></div>
                                    </div>
                                    <div className="figure-wrapper">
                                        <div className="logo-wrapper">
                                            <img src={presszeroLogo} alt="zendesk" />
                                        </div>
                                        <div className="hint"><center>ENABLED</center></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="scrollable">
                            <table className="classic-table">
                                <thead>
                                    <tr>
                                        <td style={{width:150}}><div title="The Press Zero ticket number assigned to the chat." className="hint"><center>@Tocket Number</center></div></td>
                                        <td style={{width:150}}><div title="The user who sent the message on Press Zero." className="hint"><center>@FROM</center></div></td>
                                        <td>Title</td>
                                        <td>Contact</td>
                                        <td>Status</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data && data.length > 0 &&
                                        data.map((e,idx)=><tr key={idx}>
                                            <td style={{width:150}}># {e.id+10000}</td>
                                            <td style={{width:150}}>#####</td>
                                            <td>Support Ticket</td>
                                            <td>#####</td>
                                            <td><div style={{width:100}} className="hint"><center>{e.status}</center></div></td>
                                        </tr>)
                                    } 
                                </tbody>
                            </table>
                            {(!data || data.length === 0) && <div className="loading-widget"><center><img style={{width:40}} src="https://media.tenor.com/kMCwoAD4RNAAAAAi/loading-gif-loading.gif" alt="loading" /></center></div>}
                        </div>
                    </div>
                    </React.Fragment>}
                {!item && <React.Fragment>
                    <div className='search-controls'>
                        {data.slice(0,100).map((e,idx)=>{
                            return (<div onClick={()=>setItem(e)} key={idx} className='search-result'>
                                <div className="mini-heading">
                                    <div className="logo-wrapper">
                                        <img src={e.logoUrl} alt="company-0" />
                                    </div>
                                    <div className="title-wrapper">
                                        <h4 className='title'>{e.searchName}</h4>
                                        <p className='description'>{e.description.slice(0,80)}...</p>
                                    </div>
                                    {e.searchCategory && <div className="title-wrapper">
                                        <h4 className='subTitle'>{e.searchCategory}</h4>
                                    </div>}
                                </div>
                            </div>)
                        })}
                        {data.length === 0 && <div className='search-result'>
                                <div className="mini-heading">
                                    <div className="title-wrapper">
                                        <h4 className='title'>Nothing found for this search!</h4>
                                    </div>
                                </div>
                            </div>}
                    </div>
                    </React.Fragment>}                    
            </PageContainer>
        </React.Fragment>
    )
}

export default CompanyReportView
