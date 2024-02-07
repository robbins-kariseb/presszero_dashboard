import React from 'react'
import QuerySets from '../../controllers/dashboard.controller';
import Button from '../../components/Button';
import TextEditor from '../../components/generic/TextEditor';

function CompanyProfileEditorPopup({ item, handleClose }) {
    const [API] = React.useState(new QuerySets())
    const popupRef = React.useRef(null);
    const [transform, setTransform] = React.useState("translateX(100%)")

    // Company Profile Inputs
    const [businessName, setBusinessName] = React.useState(item.businessName)
    const [email, setEmail] = React.useState(item.email)
    const [phone, setPhone] = React.useState(item.phone)
    const [businessHoursStart, setBusinessHoursStart] = React.useState(item.businessHoursStart)
    const [businessHoursEnd, setBusinessHoursEnd] = React.useState(item.businessHoursEnd)
    const [websiteUrl, setWebsiteUrl] = React.useState(item.websiteUrl)
    const [logoUrl, setLogoUrl] = React.useState(item.logoUrl)
    const [description, setDescription] = React.useState(item.description)
    const [outOfOffice, setOutOfOffice] = React.useState(`<p>Thank you for contacting ${item.businessName}. <br/><br/>Our office is currently closed.</p><p><br/>We appreciate your inquiry and will respond to your message as soon as possible once we return on the next business day.</p><p><br/>For urgent matters, please contact us during our regular business hours.</p><p><br/>Thank you for your understanding.</p><p><br/>Best regards,<br>The ${item.businessName} Team</p>`)
    const [location, setLocation] = React.useState(item.location)
    const [hexColours, setHexColours] = React.useState(item.hexColours)
    const [rgbColours, setRgbColours] = React.useState(item.rgbColours)
    const [contactNumber, setContactNumber] = React.useState(item.rgbColours)

    const [openMonday, setOpenMonday] = React.useState(item.mondayOpeningTime)
    const [closeMonday, setCloseMonday] = React.useState(item.mondayClosingTime)
    const [mondayAvailability, setMondayAvailability] = React.useState(item.mondayAvailability)

    const [openTuesday, setOpenTuesday] = React.useState(item.tuesdayOpeningTime)
    const [closeTuesday, setCloseTuesday] = React.useState(item.tuesdayClosingTime)
    const [tuesdayAvailability, setTuesdayAvailability] = React.useState(item.tuesdayAvailability)

    const [openWednesday, setOpenWednesday] = React.useState(item.wednesdayOpeningTime)
    const [closeWednesday, setCloseWednesday] = React.useState(item.wednesdayClosingTime)
    const [wednesdayAvailability, setWednesdayAvailability] = React.useState(item.wednesdayAvailability)

    const [openThursday, setOpenThursday] = React.useState(item.thursdayOpeningTime)
    const [closeThursday, setCloseThursday] = React.useState(item.thursdayClosingTime)
    const [thursdayAvailability, setThursdayAvailability] = React.useState(item.thursdayAvailability)

    const [openFriday, setOpenFriday] = React.useState(item.fridayOpeningTime)
    const [closeFriday, setCloseFriday] = React.useState(item.fridayClosingTime)
    const [fridayAvailability, setFridayAvailability] = React.useState(item.fridayAvailability)

    const [openSaturday, setOpenSaturday] = React.useState(item.saturdayOpeningTime)
    const [closeSaturday, setCloseSaturday] = React.useState(item.saturdayClosingTime)
    const [saturdayAvailability, setSaturdayAvailability] = React.useState(item.saturdayAvailability)

    const [openSunday, setOpenSunday] = React.useState(item.sundayOpeningTime)
    const [closeSunday, setCloseSunday] = React.useState(item.sundayClosingTime)
    const [sundayAvailability, setSundayAvailability] = React.useState(item.sundayAvailability)

    const businessHours = [
        {
            title: "Monday",
            value: mondayAvailability,
            setValue: setMondayAvailability,
            start: openMonday,
            setStart: setOpenMonday,
            end: closeMonday,
            setEnd: setCloseMonday
        },{
            title: "Tuesday",
            value: tuesdayAvailability,
            setValue: setTuesdayAvailability,
            start: openTuesday,
            setStart: setOpenTuesday,
            end: closeTuesday,
            setEnd: setCloseTuesday
        },{
            title: "Wednesday",
            value: wednesdayAvailability,
            setValue: setWednesdayAvailability,
            start: openWednesday,
            setStart: setOpenWednesday,
            end: closeWednesday,
            setEnd: setCloseWednesday
        },{
            title: "Thursday",
            value: thursdayAvailability,
            setValue: setThursdayAvailability,
            start: openThursday,
            setStart: setOpenThursday,
            end: closeThursday,
            setEnd: setCloseThursday
        },{
            title: "Friday",
            value: fridayAvailability,
            setValue: setFridayAvailability,
            start: openFriday,
            setStart: setOpenFriday,
            end: closeFriday,
            setEnd: setCloseFriday
        },{
            title: "Saturday",
            value: saturdayAvailability,
            setValue: setSaturdayAvailability,
            start: openSaturday,
            setStart: setOpenSaturday,
            end: closeSaturday,
            setEnd: setCloseSaturday
        },{
            title: "Sunday",
            value: sundayAvailability,
            setValue: setSundayAvailability,
            start: openSunday,
            setStart: setOpenSunday,
            end: closeSunday,
            setEnd: setCloseSunday
        }
    ]

    const setColors = (hex) => {
        // Function to convert HEX to RGB
        const hexToRgb = (hex) => {
            // Remove the hash (#) if present
            hex = hex.replace(/^#/, '');

            // Parse the RGB components
            const bigint = parseInt(hex, 16);
            const r = (bigint >> 16) & 255;
            const g = (bigint >> 8) & 255;
            const b = bigint & 255;

            // Return the RGB values as a string
            return `${r},${g},${b}`;
        };

        // Set the HEX color
        setHexColours(hex);

        // Convert HEX to RGB and set the state
        const rgbColor = hexToRgb(hex);
        setRgbColours(rgbColor);
    };

    const onSaveChanges = async () => {
        item.email = email
        item.phone = phone
        item.businessHoursStart = businessHoursStart
        item.businessHoursEnd = businessHoursEnd
        item.description = description
        item.location = location
        item.rgbColours = rgbColours
        item.hexColours = hexColours
        item.businessName = businessName
        item.mondayOpeningTime = openMonday
        item.mondayClosingTime = closeMonday
        item.mondayAvailability = mondayAvailability
        item.tuesdayOpeningTime = openTuesday
        item.tuesdayClosingTime = closeTuesday
        item.tuesdayAvailability = tuesdayAvailability
        item.wednesdayOpeningTime = openWednesday
        item.wednesdayClosingTime = closeWednesday
        item.wednesdayAvailability = wednesdayAvailability
        item.thursdayOpeningTime = openThursday
        item.thursdayClosingTime = closeThursday
        item.thursdayAvailability = thursdayAvailability
        item.fridayOpeningTime = openFriday
        item.fridayClosingTime = closeFriday
        item.fridayAvailability = fridayAvailability
        item.saturdayOpeningTime = openSaturday
        item.saturdayClosingTime = closeSaturday
        item.saturdayAvailability = saturdayAvailability
        item.sundayOpeningTime = openSunday
        item.sundayClosingTime = closeSunday
        item.sundayAvailability = sundayAvailability

        const results = await API.updateModel({
            model: "company", fields: {
                email: email,
                phone: phone,
                businessHoursStart: businessHoursStart,
                businessHoursEnd: businessHoursEnd,
                description: description,
                location: location,
                rgbColours: rgbColours,
                hexColours: hexColours,
                businessName: businessName,
                mondayOpeningTime:openMonday,
                mondayClosingTime:closeMonday,
                mondayAvailability:mondayAvailability,
                tuesdayOpeningTime:openTuesday,
                tuesdayClosingTime:closeTuesday,
                tuesdayAvailability:tuesdayAvailability,
                wednesdayOpeningTime:openWednesday,
                wednesdayClosingTime:closeWednesday,
                wednesdayAvailability:wednesdayAvailability,
                thursdayOpeningTime:openThursday,
                thursdayClosingTime:closeThursday,
                thursdayAvailability:thursdayAvailability,
                fridayOpeningTime:openFriday,
                fridayClosingTime:closeFriday,
                fridayAvailability:fridayAvailability,
                saturdayOpeningTime:openSaturday,
                saturdayClosingTime:closeSaturday,
                saturdayAvailability:saturdayAvailability,
                sundayOpeningTime:openSunday,
                sundayClosingTime:closeSunday,
                sundayAvailability:sundayAvailability,
            }, id: item.id
        })

        handleClose()
    }

    React.useEffect(() => {
        const init = async () => {
            try {

            } catch (error) {

            }
        }

        setTransform("translateX(0%)")
        init();
    }, [API]);

    React.useEffect(() => { }, [
        openMonday,
        closeMonday,
        mondayAvailability,
        openTuesday,
        closeTuesday,
        tuesdayAvailability,
        openWednesday,
        closeWednesday,
        wednesdayAvailability,
        openThursday,
        closeThursday,
        thursdayAvailability,
        openFriday,
        closeFriday,
        fridayAvailability,
        openSaturday,
        closeSaturday,
        saturdayAvailability,
        openSunday,
        closeSunday,
        sundayAvailability,
        businessName,businessHours, email, phone, businessHoursStart, businessHoursEnd, description, location, rgbColours]);

    return (
        <div style={{ height: "70vh", transform: transform }} ref={popupRef} className="widget-2x3 company-crm-statistics popup-window">
            <div className="mini-heading flex">
                <div className="titles flex">
                    <div className='popup-controls' onClick={handleClose}>
                        <span class="material-symbols-outlined">close</span>
                    </div>
                    <div className='block'>
                        <h4>{businessName}</h4>
                        <p>Profile Editor</p>
                    </div>
                </div>
            </div>
            <div style={{ maxHeight: "65vh" }} className="scrollable chat-view">
                <div className="scrollable popup-scrollview">
                    <div className='col-2x2 flex'>
                        <div id="editor-form" className='form-classic col-1x2 editor-form'>
                            <div className='heading'>
                                <div className='col-4x4 flex'>
                                    <div style={{ width: "80%" }} className='col-1x4'>
                                        <h4>Company Profile Editor</h4>
                                    </div>
                                    <div className='col-1x4'>
                                        <div style={{ position: "relative", top: -15, left: -10 }}>
                                            <Button onClick={onSaveChanges} special={"icon-button text-align"} icon={<span class="material-symbols-outlined">save</span>} title="Save Changes" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <label>Company Description</label>
                            <TextEditor value={description} onChange={setDescription} />
                            <br/><br/>
                            <label>Out of Office Response</label>
                            <TextEditor value={outOfOffice} onChange={setOutOfOffice} />
                        </div>
                        <div className='form-classic col-1x2'>
                            <div className='col-2x2 flex'>
                                <div className='col-1x2'>
                                    <div className='form-control'>
                                        <label>Business Name</label>
                                        <input type={"text"} onChange={(e) => setBusinessName(e.target.value)} value={businessName} />
                                    </div>
                                    <div className='form-control'>
                                        <label>Business Email</label>
                                        <input type={"text"} onChange={(e) => setEmail(e.target.value)} value={email} />
                                    </div>
                                    <div className='form-control'>
                                        <label>Contact Number</label>
                                        <input type={"text"} onChange={(e) => setPhone(e.target.value)} value={phone} />
                                    </div>
                                    <div className='form-control'>
                                        <label>Website</label>
                                        <input type={"text"} onChange={(e) => setWebsiteUrl(e.target.value)} value={websiteUrl} />
                                    </div>
                                </div>
                                <div className='col-1x2'>
                                    <div className='form-control'>
                                        <label>Business Location</label>
                                        <input type={"text"} onChange={(e) => setLocation(e.target.value)} value={location} />
                                    </div>
                                    <div className='form-control'>
                                        <label>Theme Color</label>
                                        <input type={"color"} onChange={(e) => setColors(e.target.value)} value={hexColours} />
                                    </div>
                                </div>
                            </div>
                            <div className='form-control'>
                                <label>Business Hours</label>
                            </div>
                            <div className='col-2x2 flex'>
                                <div className='col-2x2 inline-render flex-box'>
                                    {businessHours.map((e,idx)=><div key={idx} className='form-control'>
                                        <h5>{e.title}</h5>
                                        <label class="switch">
                                            <input checked={e.value} onChange={(m)=>e.setValue(m.target.checked)} type="checkbox" />
                                            <span class="slider round"></span>
                                        </label>
                                        <label>Opens</label>
                                        <input type={"time"} onChange={(m)=>e.setStart(m.target.value)} value={e.start} />
                                        <label>Closes</label>
                                        <input type={"time"} onChange={(m)=>e.setEnd(m.target.value)} value={e.end} />
                                    </div>)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CompanyProfileEditorPopup
