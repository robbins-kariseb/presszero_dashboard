import React from "react";
import backIcon from "../../images/back-icon.png"
import QuerySets from "../../controllers/dashboard.controller";
import presszeroLogo from "../../images/presszero.png"
import zendeskLogo from "../../images/zendesk.png"
import outlookLogo from "../../images/outlook.png"

function CompanyStatisticsPopup({ item, handleClose }) {
  const [API] = React.useState(new QuerySets())
  const popupRef = React.useRef(null);
  const [transform, setTransform] = React.useState("translateX(100%)")
  const [companyId] = React.useState(item.companyId)
  const [data,setData] = React.useState([])

  React.useEffect(() => {
    const init = async () => {
        try {
            const tickets = await API.getCompanyTickets({companyId: companyId})
            tickets.response.forEach(async (e) => {
                const chats = await API.getChatMessages({id: e.id})
                e.chats = chats.items
            });
            setData(tickets.response)
        } catch (error) {
            console.warn(error)
        }
    }

    setTransform("translateX(0%)")
    init();
  }, [API,companyId]);

  return (
    <div style={{height:"60vh", transform: transform}} ref={popupRef} className="widget-2x3 company-crm-statistics popup-window">
      <div className="popup-controls">
        <div className="back-button" onClick={handleClose||(()=>{})}>
            <img src={backIcon} alt="back-icon" />
        </div>
      </div>
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
            <table className="clasic-table">
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
    </div>
  );
}

export default CompanyStatisticsPopup;
