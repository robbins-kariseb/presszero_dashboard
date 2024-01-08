import React from "react";
import logo from "../../../images/mock/company_0.png";
import { calculateTime } from "../../../controllers/message.controller";

const max_char = 10;

function WidgetPlatformChats({items}) {
  return (
    <div className="widget-2x3 company-crm-statistics">
      <div className="mini-heading">
        <div className="titles">
          <h4>Messages</h4>
          <p>Across PressZero</p>
        </div>
      </div>
      <div className="scrollable">
        <table style={{ width: "100%" }}>
          <thead>
            <tr>
              <td>Company</td>
              <td>Location</td>
              <td>Last Contacted</td>
              <td>Last Message</td>
            </tr>
          </thead>
          <tbody>
            {items.slice().reverse().map((e, idx) => {
              return <MessagePreview key={idx} item={e} />;
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default WidgetPlatformChats;

function MessagePreview({ item }) {
    const [friendlyName] = React.useState(item.businessName.length > max_char ? `${item.businessName.slice(0, max_char)}...` : item.businessName);
    const [friendlyCaption] = React.useState(item.lastMessage.length > max_char ? `${item.lastMessage.slice(0, max_char)}...` : item.lastMessage);
  
    // Function to calculate the estimated time the message was received
  
    return (
      <tr>
        <td>
          <div className="mini-heading">
            <div className="logo-wrapper">
              <img
                style={{ width: 50, padding: 0, margin: 0 }}
                src={item.logoUrl || logo}
                alt="company-0"
              />
            </div>
            <div className="title-wrapper">
              <h4 style={{ fontSize: 15, padding: 0, margin: 0 }}>
                {friendlyName}
              </h4>
              <div style={{ fontSize: 12, padding: 0, margin: 0 }}>
                <div className={`chat-status-${item.chatStatus}`}>{item.chatStatus}</div>
              </div>
            </div>
          </div>
        </td>
        <td>Londo</td>
        <td>{calculateTime(item.lastMessageTime)}</td>
        <td>{friendlyCaption}</td>
      </tr>
    );
  }