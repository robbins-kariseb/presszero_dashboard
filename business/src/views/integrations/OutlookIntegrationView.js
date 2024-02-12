import React from 'react'
import Button from '../../components/Button';
import outlookLogo from "../../images/outlook.png";
import blurLoadingBackground from "../../images/blurred-loading-control.png"
import { isValidEmail } from '../../utilities/helpers';

function OutlookIntegrationView({processing,handleIntegration,outlookEmail, setOutlookEmail, metadata}) {
    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(metadata.userCode)
          .then(() => {
            console.log('Text copied to clipboard:', metadata.userCode);
          })
          .catch((error) => {
            console.error('Unable to copy to clipboard', error);
          });
    };
    
    return (
        <div className='col-3x3 flex'>
            <div className='col-1x3 connector'>
                <div className="logo-wrapper">
                    <img src={outlookLogo} alt="zendesk" />
                </div>
                <div className='form-control'>
                    <label>Outlook Email</label>
                    <input type={"text"} value={outlookEmail||""} onChange={(e) => setOutlookEmail(e.target.value)} />
                </div>
                <Button disabled={!isValidEmail(outlookEmail||"")} onClick={handleIntegration} title={"Connect"} />
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
                        <img src={outlookLogo} alt="zendesk" />
                    </div>
                    {metadata && <div className='form-control integration-info'>
                        <h4>Please Follow This Link</h4>
                        <h4>Your Code is: <strong style={{color:"blue"}} onClick={handleCopyToClipboard}>{metadata.userCode}</strong></h4>
                        <a target="_blank" href={`${metadata.verificationUrl}`}>{metadata.verificationUrl}</a>
                    </div>}
                </div>
            </React.Fragment>}
        </div>
    )
}

export default OutlookIntegrationView
