import React from "react";
import logo from "../../../images/mock/company_0.png";
import WSSPressZeroChatPopup from "../../../views/popups/WSSPressZeroChatPopup";

const max_char = 25;

function WidgetMessageExplorer({ items }) {
  const [indexedChat,setIndexedChat] = React.useState(null)

  const handleClose = () => {
    setIndexedChat(null)
  }

  React.useEffect(()=>{},[indexedChat])
  return (
    <div style={{width: "90%"}} className="widget-2x3 company-crm-statistics">
      <div className="mini-heading">
        <div className="titles">
          <h4>Active Press Zero Tickets</h4>
          <p>Across PressZero</p>
        </div>
      </div>
      <div className="scrollable">
        {items.slice().reverse().map((e, idx) => {
          return <MessagePreview onClick={(e)=>{
            setIndexedChat(e);
          }} key={idx} item={e} />;
        })}
      </div>
      {indexedChat && <WSSPressZeroChatPopup handleClose={handleClose} item={indexedChat} />}
    </div>
  );
}

export default WidgetMessageExplorer;

function MessagePreview({ item, onClick }) {
  const [friendlyName] = React.useState(
    item.businessName.length > max_char
      ? `${item.businessName.slice(0, max_char)}...`
      : item.businessName
  );
  const [friendlyCaption] = React.useState(
    item.lastMessage.length > max_char
      ? `${item.lastMessage.slice(0, max_char)}...`
      : item.lastMessage
  );

  // Function to calculate the estimated time the message was received
  const calculateTime = (lastMessageTime) => {
    const currentTime = new Date();
    const messageTime = new Date(lastMessageTime);

    // Calculate the time difference in milliseconds
    const timeDifference = currentTime - messageTime;
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) {
      return "less than a minute ago";
    } else if (minutes < 60) {
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else if (hours < 24) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (days === 1) {
      return "yesterday";
    } else if (days <= 2) {
      return "today";
    } else {
      return lastMessageTime.split(" ")[0]; // Return the date if older than two days
    }
  };

  return (
    <div onClick={()=>onClick(item)} className="message-preview">
      <div className="logo-wrapper">
        <img
          style={{ width: 50, padding: 0, margin: 0 }}
          src={item.logoUrl || logo}
          alt="company-0"
        />
      </div>
      <div className="content-wrapper">
        <div className="headings">
          <div className="mini-2x3">
            <h3><div className="special-sender">{friendlyName}</div>Message from {item.userName}</h3>
          </div>
          <div className="mini-1x3">
            <h3>{calculateTime(item.lastMessageTime)}</h3>
          </div>
        </div>
        <div className="headings">
          <div className="mini-3x3">
            <p>{item.lastMessage}</p>
          </div>
        </div>
      </div>
      <div className="status-wrapper">
          <div className={`status-preview-${item.status}`}>
            
          </div>
        </div>
    </div>
  );
}
