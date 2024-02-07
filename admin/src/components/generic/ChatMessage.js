import React from 'react'
import messageBubble from "../../images/message-bubble.png"
import messageBubbleOutgoing from "../../images/message-bubble-outgoing.png"
import { calculateTime } from '../../controllers/message.controller'

function ChatMessage({item}) {
    return (
        <React.Fragment>
            {item.createdBy === "system" && <div className="incomming-message">
                <div className="message-controls">
                    <div className="message-bubble">
                        <img src={messageBubble} alt="back-icon" />
                    </div>
                </div>
                <p>{item.messageBody}</p>
                <h6 className="time-display">{calculateTime(item.createdDate, "T")}</h6>
            </div>}
            {item.createdBy !== "system" && <div className="outgoing-message">
                <div className="message-controls">
                    <div className="message-bubble">
                        <img src={messageBubbleOutgoing} alt="back-icon" />
                    </div>
                </div>
                <p>{item.messageBody}</p>
                <h6 className="time-display">{calculateTime(item.createdDate, "T")}</h6>
            </div>}
        </React.Fragment>
    )
}

export default ChatMessage
