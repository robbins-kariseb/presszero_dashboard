import React from 'react'
import 'quill/dist/quill.snow.css'
import Button from '../../components/Button';
import { convertTimeToUTC, countryCodes, generateRandomHex, isValidEmail, timezoneList } from '../../utilities/helpers';
import { AppContext } from '../../context/AppProvider';
import Users from '../../controllers/user.controller';

function NewUserForm ({ item, handleClose }) {
    const {onUniversalChange, handleWarning, handleAlert} = React.useContext(AppContext)
    const [USERS] = React.useState(new Users())
    const popupRef = React.useRef(null);
    const [transform, setTransform] = React.useState("translateX(100%)")
    const editorRef = React.useRef(null);

    // User Inputs
    const [accessGroup, setAccessGroup] = React.useState("")
    const [name, setName] = React.useState("")
    const [surname, setSurname] = React.useState("")
    const [dob, setDob] = React.useState("")
    const [gender, setGender] = React.useState("")
    const [email, setEmail] = React.useState("")
    const [phoneNumber, setPhoneNumber] = React.useState("")
    const [country, setCountry] = React.useState("")
    const [timezone, setTimezone] = React.useState("")
    const [delta, setDelta] = React.useState("")
    
    const onSaveChanges = async () => {
        if (logoUrl.length === 0) {
            handleWarning("You need to upload the company logo with the following dimensions in order to continue! Minimum Requirement: 256x256 or 512x512.")
            return;
        }

        if (!isValidEmail(email)) {
            handleWarning("Please enter a valid email!")
            return;
        }

        if (businessHoursStart.length === 0 || businessHoursEnd.length === 0) {
            handleWarning("Please ensure that the business hours are valid!")
            return;
        }

        if (description.length === 0 || businessName.length === 0) {
            handleWarning("Please ensure that the company description and business name are filled out!")
            return;
        }

        const password = generateRandomHex(5)

        USERS.createAdminUser({
            companyId: item.id,
            name: name,
            surname: surname,
            dob: dob,
            gender: gender,
            email: email,
            password: password,
            phoneNumber: phoneNumber,
            country: country,
            timezone: timezone,
            country: "02:00",
        }).then((res)=>{
            if (res.response === "successful") {
                handleAlert(`The user account for ${name} has been created successfully!`)
                onUniversalChange()
                handleClose()
            } else {
                handleWarning(`The user account for ${name} could not be created because there is another user registered with this information!`)
            }
        })
    }
    
    React.useEffect(() => {
        isTriggered = false
        const init = async () => {
            try {
                
            } catch (error) {
                
            }
        }

        setTransform("translateX(0%)")
        init();
    },[API]);

    return (
        <div style={{ height: "70vh", transform: transform }} ref={popupRef} className="widget-2x3 company-crm-statistics popup-window">
            <div className="mini-heading flex">
                <div className="titles flex">
                    <div className='popup-controls' onClick={handleClose}>
                        <span class="material-symbols-outlined">close</span>
                    </div>
                    <div className='block'>
                        <h4>{businessName}</h4>
                        <p>Company Form</p>
                    </div>
                </div>
            </div>
            <div style={{ maxHeight: "65vh" }} className="scrollable chat-view">
                <div className="scrollable popup-scrollview">
                    <div className='col-2x2 flex'>
                        <div id="editor-form" className='form-classic col-1x2 editor-form'>
                            <div className='heading'>
                                <div className='col-4x4 flex'>
                                    <div style={{width:"80%"}} className='col-1x4'>
                                        <h4>Create User Account</h4>
                                    </div>
                                    <div className='col-1x4'>
                                        <div style={{position:"relative", top:-15, left: -10}}>
                                            <Button onClick={onSaveChanges} special={"icon-button text-align"} icon={<span class="material-symbols-outlined">save</span>} title="Save Changes" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <label>New User</label>
                            <div ref={editorRef}></div>
                        </div>
                        <div className='form-classic col-1x2'>
                            <div className='col-2x2 flex'>
                                <div className='col-1x2'>
                                    <div className='form-control'>
                                        <label>Access</label>
                                        <select value={accessGroup} onChange={(e) => setAccessGroup(e.target.value)}>
                                            {["Admin","Owner","Agent"].map((m, idx) => <option key={idx} value={m.toLowerCase()}>{m} User</option>)}
                                        </select>
                                    </div>
                                    <div className='form-control'>
                                        <label>First Name</label>
                                        <input value={name} type={"text"} onChange={(e)=>setName(e.target.value)} />
                                    </div>
                                    <div className='form-control'>
                                        <label>Last Name</label>
                                        <input value={name} type={"text"} onChange={(e)=>setSurname(e.target.value)} />
                                    </div>
                                    <div className='form-control'>
                                        <label>Gender</label>
                                        <select value={gender} onChange={(e) => setAccessGroup(e.target.value)}>
                                            {["Male","Female","Other"].map((m, idx) => <option key={idx} value={m.toLowerCase()}>{m} User</option>)}
                                        </select>
                                    </div>
                                    <div className='form-control'>
                                        <label>Email</label>
                                        <input value={email} type={"text"} onChange={(e)=>setEmail(e.target.value)} />
                                    </div>
                                </div>
                                <div className='col-1x2'>
                                    <div className='form-control'>
                                        <label>Phone Number</label>
                                        <input type={"text"} onChange={(e)=>setPhoneNumber(e.target.value)} value={phoneNumber} />
                                    </div>
                                    <div className='form-control'>
                                        <label>Country</label>
                                        <select value={gender} onChange={(e) => setCountry(e.target.value)}>
                                            {countryCodes.map((m, idx) => <option key={idx} value={m.code}>{m.name}</option>)}
                                        </select>
                                    </div>
                                    <div className='form-control'>
                                        <label>Time-Zone</label>
                                        <select value={gender} onChange={(e) => setTimezone(e.target.value)}>
                                            {timezoneList.map((m, idx) => <option key={idx} value={m.code}>{m.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NewUserForm