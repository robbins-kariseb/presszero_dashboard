import React from "react";
import backIcon from "../../images/back-icon.png"
import QuerySets from "../../controllers/dashboard.controller";
import ChatMessage from "../../components/generic/ChatMessage";

function WSSPressZeroChatPopup({ item, handleClose }) {
  const [API] = React.useState(new QuerySets())
  const [chats, setChats] = React.useState([])
  const popupRef = React.useRef(null);
  const [transform, setTransform] = React.useState("translateX(100%)")

  React.useEffect(()=>{
    const init = async () => {
        const dataset = await API.getCompanyUserChats({userId: item.userId, companyId: item.companyId})

        try {
            setChats(dataset.response)
        } catch (error) {
            console.warn(error)
        }
    }

    init()
  },[API, item.userId, item.companyId])


  React.useEffect(() => {
    setTransform("translateX(0%)")
  }, []);

  return (
    <div style={{transform: transform}} ref={popupRef} className="widget-2x3 company-crm-statistics popup-window">
 
      <div className="popup-controls">
        <div className="back-button" onClick={handleClose||(()=>{})}>
            <img src={backIcon} alt="back-icon" />
        </div>
      </div>
      <div className="mini-heading">
        <div className="titles">
          <h4>{item.searchName}</h4>
          <p>Press Zero Chat</p>
        </div>
      </div>
      <div className="scrollable chat-view">
        {chats.map((e,idx)=><ChatMessage key={idx} item={e} />)}
      </div>
    </div>
  );
}

export default WSSPressZeroChatPopup;
