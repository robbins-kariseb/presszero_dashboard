import React from "react";
import logo from '../../../images/mock/company_0.png'

const max_char = 15;

function WidgetCompanyStats({item, onPreview}) {

  const [friendlyName] = React.useState(item.businessName.length > max_char ? `${item.businessName.slice(0,max_char)}...` : item.businessName)
  
  return (
    <div onClick={()=>onPreview({type:"company-stats", item:item})} className="widget-1x3 company-crm-statistics">
      <div className="mini-heading">
        <div className="logo-wrapper">
          <img src={item.businessLogoUrl||logo} alt="company-0" />
        </div>
        <div className="title-wrapper">
          <h4>{friendlyName}</h4>
        </div>
      </div>
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
  );
}

export default WidgetCompanyStats;
