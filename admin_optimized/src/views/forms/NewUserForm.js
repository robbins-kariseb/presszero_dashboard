import React from 'react'
import 'quill/dist/quill.snow.css'
import Button from '../../components/Button';
import { convertTimeToUTC, countryCodes, generateRandomHex, isValidEmail, timezoneList } from '../../utilities/helpers';
import { AppContext } from '../../context/AppProvider';
import Users from '../../controllers/user.controller';
import QuerySets from '../../controllers/dashboard.controller';

import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import Integrations from '../../controllers/integration.controller';


let isTriggered = false;
function NewUserForm({ item, handleClose }) {
    const [API] = React.useState(new QuerySets())
    const { onUniversalChange, handleWarning, handleAlert } = React.useContext(AppContext)
    const [USERS] = React.useState(new Users())
    const popupRef = React.useRef(null);
    const [transform, setTransform] = React.useState("translateX(100%)")
    const editorRef = React.useRef(null);

    // User Inputs
    const [accessGroup, setAccessGroup] = React.useState("admin")
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
        if (!isValidEmail(email)) {
            handleWarning("Please enter a valid email!")
            return;
        }

        if (name.length === 0 || surname.length === 0) {
            handleWarning("Please ensure that the name fields are completed!")
            return;
        }

        if (phoneNumber.length === 0) {
            handleWarning("The phone number field is required!")
            return;
        }

        const password = generateRandomHex(5)

        USERS.createAdminUser({
            companyId: item.id,
            name: name,
            accessGroup: accessGroup,
            surname: surname,
            dob: dob || "1970-01-01",
            gender: gender,
            email: email,
            password: password,
            phoneNumber: phoneNumber,
            country: country,
            timezone: timezone,
            delta: delta | "02:00",
        }).then((res) => {
            const notify = async () => {
                if (res.response === "successful") {
                    handleAlert(`The user account for ${name} has been created successfully!`)
                    onUniversalChange()
                    handleClose()
                    const controller = new Integrations()
                    const access_code = generateRandomHex(10)
    
                    const magicLink = await controller.createMagicLink({ email: email, password: access_code })
                    controller.updateAccessKeys({
                        userId: res.item.id,
                        access_key: access_code
                    })
                    if (accessGroup === 'owner') {
                        controller.sendSystemEmail({
                            email: email,
                            subject: `Press Zero Business Onboarding`,
                            message: `
                            <h4>Hello, ${name}</h4>
                            <p>This is an invitation for <strong>${item.businessName||"Your Business"}</strong> to collaborate on Press Zero! Do follow the link below in order to access your account!</p>
                            `,
                            action: {
                                title: 'Login with Magic Link',
                                url: magicLink
                            }
                        })
                    } else if (accessGroup === 'agent') {
                        controller.sendSystemEmail({
                            email: email,
                            subject: `Invitation to Collaborate on Press Zero!`,
                            message: `
                            <h4>Hello, ${name}</h4>
                            <p>This is an invitation from <strong>${item.businessName||"Your Business"}</strong> to collaborate on Press Zero! Do follow the link below in order to access your account!</p>

                            <p>Please download the Press Zero app from App Store or Play Store, and use the following credentials to login!</p>
                            <br/>
                            <br/>
                            <p><strong>User Name:</strong><br/>${email}</p>
                            <p><strong>Password:</strong><br/>${password}</p>
                            `
                        })
                    } else {
                        controller.sendSystemEmail({
                            email: email,
                            subject: `Invitation to Collaborate on Press Zero!`,
                            message: `
                            <h4>Hello, ${name}</h4>
                            <p>This is an invitation to collaborate on Press Zero! Do follow the link below in order to access your account!</p>
                            `,
                            action: {
                                title: 'Login with Magic Link',
                                url: magicLink
                            }
                        })
                    }
                } else {
                    handleWarning(`The user account for ${name} could not be created because there is another user registered with this information!`)
                }
            }
            notify()
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
    }, [API]);

    return (
        <div style={{ height: "70vh", transform: transform }} ref={popupRef} className="widget-2x3 company-crm-statistics popup-window">
            <div className="mini-heading flex">
                <div className="titles flex">
                    <div className='popup-controls' onClick={handleClose}>
                        <span className="material-symbols-outlined">close</span>
                    </div>
                    <div className='block'>
                        <h4>{name || "New User"}</h4>
                        <p>New User Account</p>
                    </div>
                </div>
            </div>
            <div style={{ maxHeight: "65vh" }} className="scrollable chat-view">
                <div className="scrollable popup-scrollview">
                    <div className='col-2x2 flex'>
                        <div className='form-classic col-1x2'>
                            <div className='heading'>
                                <div className='col-4x4 flex'>
                                    <div style={{ width: "80%" }} className='col-1x4'>
                                        <h4>User Account</h4>
                                    </div>
                                    <div className='col-1x4'>
                                        <div style={{ position: "relative", top: -15, left: -10 }}>
                                            <Button onClick={onSaveChanges} special={"icon-button text-align"} icon={<span className="material-symbols-outlined">save</span>} title="Save Changes" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='col-2x2 flex'>
                                <div className='col-1x2'>
                                    <div className='form-control'>
                                        <label>Access</label>
                                        <select value={accessGroup} onChange={(e) => setAccessGroup(e.target.value)}>
                                            {["owner", "admin", "agent", "super-user"].map((m, idx) => <option key={idx} value={m}>{m}</option>)}
                                        </select>
                                    </div>
                                    <div className='form-control'>
                                        <label>First Name</label>
                                        <input value={name} type={"text"} onChange={(e) => setName(e.target.value)} />
                                    </div>
                                    <div className='form-control'>
                                        <label>Last Name</label>
                                        <input value={surname} type={"text"} onChange={(e) => setSurname(e.target.value)} />
                                    </div>
                                    <div className='form-control'>
                                        <label>Gender</label>
                                        <select value={gender} onChange={(e) => setGender(e.target.value)}>
                                            {["male", "female", "other"].map((m, idx) => <option key={idx} value={m.toLowerCase()}>{m}</option>)}
                                        </select>
                                    </div>
                                    <div className='form-control'>
                                        <label>Email</label>
                                        <input value={email} type={"text"} onChange={(e) => setEmail(e.target.value)} />
                                    </div>
                                </div>
                                <div className='col-1x2'>
                                    <div className='form-control'>
                                        <label>Phone Number</label>
                                        <PhoneInput
                                            country={'us'}
                                            value={phoneNumber}
                                            onChange={setPhoneNumber}
                                        />
                                    </div>
                                    <div className='form-control'>
                                        <label>Country</label>
                                        <select value={country} onChange={(e) => setCountry(e.target.value)}>
                                            {countryCodes.map((m, idx) => <option key={idx} value={m.code}>{m.name}</option>)}
                                        </select>
                                    </div>
                                    <div className='form-control'>
                                        <label>Time-Zone</label>
                                        <select value={timezone} onChange={(e) => setTimezone(e.target.value)}>
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