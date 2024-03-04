import React, { useState, useEffect, useContext } from 'react';
import TeamBanner from "../../images/invite-team-banner.png";
import { AppContext } from '../../context/AppProvider';
import { isValidEmail } from '../../utilities/helpers';

function CustomerInvitationForm({ }) {
    const {onUniversalChange,handleWarning} = React.useContext(AppContext);
    const [counter,setInvitationListChangeCounter] = React.useState(0);
    const [invitationEmail,setInvitationEmail] = React.useState("");
    const [invitationList,setInvitationList] = React.useState([]);
    
    const handleEmailInvitation = (event) => {
        // Check if the key down is Enter or Tab
        if (event.key === 'Enter' || event.key === 'Tab') {
            onUniversalChange()
            const list = invitationList || [];
            const email = event.target.value.trim();
    
            // Check if the entered email is valid
            if (email && isValidEmail(email)) {
                list.push(email);
                // Save invitation
                setInvitationList(list);
                // Clear the input field after processing the email
                setInvitationEmail('');
                event.target.value = '';
            } else {
                handleWarning("Invalid email! Please enter a valid email to continue!")
            }
        }
    };

    useEffect(() => {
        // Update the change counter whenever invitationList changes
        setInvitationListChangeCounter(prevCounter => prevCounter + 1);
    }, [invitationList]);

    return (
        <div className='mini-form'>
            <div className='mini-form-banner full-width'>
                <img src={TeamBanner} alt='PZ Teams Banner' />
            </div>
            <div className='heading'>
                <h4>Invite customers to your project</h4>
                <p>You’ve created a new project! Invite colleagues to collaborate on this project.</p>
            </div>
            <div className='mini-form'>
                <div className='form-control'>
                    <label>Email</label>
                    <input onChange={(event) => setInvitationEmail(event.target.value)} 
                           onKeyDown={(event) => handleEmailInvitation(event)} 
                           type={"email"} />
                </div>
                <div className='heading'>
                    {/* Render invitationList */}
                    {(invitationList||[]).map((e, idx) => <strong key={idx}>{e}</strong>)}
                </div>
            </div>
        </div>
    );
}

export default CustomerInvitationForm;
