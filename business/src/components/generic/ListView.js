import React from 'react'
import zendeskIcon from "../../images/zendesk.png"

function ListView({item}) {
    return (
        <React.Fragment>
            <div className={`widget col-1x3 list-view`}>
                <div className='zero-wrapper'>
                    <div className='widget-glass'></div>
                </div>
                <div className='heading'>
                    <div className='col-2x2 metric-wrapper flex-box end-to-end'>
                        <div className='logo-wrapper metric'>
                            {!item.logoUrl && <img
                                src={item.logoUrl||zendeskIcon}
                                alt="logo"
                            />}
                            {item.logoUrl && <img
                                src={`${item.logoUrl[0]==='/' ? 'https://presszero-testing.eastus.cloudapp.azure.com' : ''}${item.logoUrl}`}
                                alt="logo"
                            />}
                        </div>
                        <div className='title-wrapper metric'>
                            <h4>{item.title}</h4>
                        </div>
                        <p className='metric'>{item.subtitle}</p>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default ListView
