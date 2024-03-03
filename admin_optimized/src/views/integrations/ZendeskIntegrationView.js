import React from 'react'
import Button from '../../components/Button';
import zendeskLogo from "../../images/zendesk.png";
import blurLoadingBackground from "../../images/blurred-loading-control.png"
import { isValidEmail } from '../../utilities/helpers';

function ZendeskIntegrationView({processing,handleIntegration,setZendeskDomain, setZendeskUser,setZendeskToken,zendeskDomain,zendeskUser,zendeskToken}) {
    return (
        <div className='col-3x3 flex'>
            <div className='col-1x3 connector'>
                <div className="logo-wrapper">
                    <img src={zendeskLogo} alt="zendesk" />
                </div>
                <div className='form-control'>
                    <label>Zendesk Domain</label>
                    <input type={"text"} value={zendeskDomain||""} onChange={(e) => setZendeskDomain(e.target.value.replaceAll("https://", "").replaceAll("http://", "").split(".")[0])} />
                </div>
                <div className='form-control'>
                    <label>Zendesk User</label>
                    <input type={"text"} value={zendeskUser||""} onChange={(e) => setZendeskUser(e.target.value)} />
                </div>
                <div className='form-control'>
                    <label>Zendesk Token</label>
                    <input type={"text"} value={zendeskToken||""} onChange={(e) => setZendeskToken(e.target.value)} />
                </div>
                <Button disabled={((zendeskDomain||"").length < 2 ||!isValidEmail(zendeskUser||"")||(zendeskToken||"").length < 2)} onClick={handleIntegration} title={"Connect"} />
            </div>

            {processing && <React.Fragment>
                <div style={{ overflow: "hidden" }} className='col-1x3'>
                    <div className={"blur-control"}>
                        <div className='loading-animation'>
                        </div>
                        <div className='image-controller'>
                            <img src={blurLoadingBackground} alt="blur" />
                        </div>
                    </div>
                </div>

                <div className='col-1x3 connector minimal-integration-widget'>
                    <div className="logo-wrapper">
                        <img src={zendeskLogo} alt="zendesk" />
                    </div>
                </div>
            </React.Fragment>}
        </div>
    )
}

export default ZendeskIntegrationView
