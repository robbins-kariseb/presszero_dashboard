import React from 'react'
import QuerySets from '../../controllers/dashboard.controller';
import Button from '../../components/Button';
import TextEditor from '../../components/generic/TextEditor';
import Subscriptions from '../../controllers/subscription.controller';
import { AppContext } from '../../context/AppProvider';
import { isValidEmail } from '../../utilities/helpers';

function CompanyProfileEditorPopup({ item, popupType, handleClose }) {
    const { handleWarning, handleAlert } = React.useContext(AppContext)
    const [API] = React.useState(new QuerySets())
    const [SUBS] = React.useState(new Subscriptions())
    const popupRef = React.useRef(null);
    const [transform, setTransform] = React.useState("translateX(100%)")

    // Company Profile Inputs
    const [isUploadingLogo, setIsUploadingLogo] = React.useState(false)
    const [businessName, setBusinessName] = React.useState(item.businessName)
    const [email, setEmail] = React.useState(item.email)
    const [phone, setPhone] = React.useState(item.phone)
    const [businessHoursStart, setBusinessHoursStart] = React.useState(item.businessHoursStart)
    const [businessHoursEnd, setBusinessHoursEnd] = React.useState(item.businessHoursEnd)
    const [websiteUrl, setWebsiteUrl] = React.useState(item.websiteUrl)
    const [logoUrl, setLogoUrl] = React.useState(item.logoUrl)
    const [description, setDescription] = React.useState(item.description)
    const [autoReplyMessage, setAutoReplyMessage] = React.useState(item.autoReplyMessage || `<p>Thank you for contacting ${item.businessName}. <br/><br/>Our office is currently closed.</p><p><br/>We appreciate your inquiry and will respond to your message as soon as possible once we return on the next business day.</p><p><br/>For urgent matters, please contact us during our regular business hours.</p><p><br/>Thank you for your understanding.</p><p><br/>Best regards,<br>The ${item.businessName} Team</p>`)
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
    const [product, setProduct] = React.useState(null)
    const [products, setProducts] = React.useState([])
    const [trialPeriodStartDate, setTrialPeriodStartDate] = React.useState("")
    const [trialPeriodEndDate, setTrialPeriodEndDate] = React.useState("")
    const [companySizeEstimate, setCompanySizeEstimate] = React.useState(item.companySizeEstimate)
    const [offerStartDate, setOfferStartDate] = React.useState("")
    const [offerEndDate, setOfferEndDate] = React.useState("")
    const [startDate, setStartDate] = React.useState("")
    const [endDate, setEndDate] = React.useState("")

    const businessHours = [
        {
            title: "Monday",
            value: mondayAvailability,
            setValue: setMondayAvailability,
            start: openMonday,
            setStart: setOpenMonday,
            end: closeMonday,
            setEnd: setCloseMonday
        }, {
            title: "Tuesday",
            value: tuesdayAvailability,
            setValue: setTuesdayAvailability,
            start: openTuesday,
            setStart: setOpenTuesday,
            end: closeTuesday,
            setEnd: setCloseTuesday
        }, {
            title: "Wednesday",
            value: wednesdayAvailability,
            setValue: setWednesdayAvailability,
            start: openWednesday,
            setStart: setOpenWednesday,
            end: closeWednesday,
            setEnd: setCloseWednesday
        }, {
            title: "Thursday",
            value: thursdayAvailability,
            setValue: setThursdayAvailability,
            start: openThursday,
            setStart: setOpenThursday,
            end: closeThursday,
            setEnd: setCloseThursday
        }, {
            title: "Friday",
            value: fridayAvailability,
            setValue: setFridayAvailability,
            start: openFriday,
            setStart: setOpenFriday,
            end: closeFriday,
            setEnd: setCloseFriday
        }, {
            title: "Saturday",
            value: saturdayAvailability,
            setValue: setSaturdayAvailability,
            start: openSaturday,
            setStart: setOpenSaturday,
            end: closeSaturday,
            setEnd: setCloseSaturday
        }, {
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
        if (logoUrl.length === 0) {
            handleWarning("You need to upload the company logo with the following dimensions in order to continue! Minimum Requirement: 256x256 or 512x512.")
            return;
        }

        if (!isValidEmail(email)) {
            handleWarning("Please enter a valid email!")
            return;
        }

        if (description.length === 0 || businessName.length === 0) {
            handleWarning("Please ensure that the company description and business name are filled out!")
            return;
        }

        item.email = email
        item.phone = phone
        item.logoUrl = logoUrl
        item.businessHoursStart = businessHoursStart
        item.businessHoursEnd = businessHoursEnd
        item.description = description
        item.location = location
        item.autoReplyMessage = autoReplyMessage
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
        item.companySizeEstimate = companySizeEstimate 
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
                logoUrl: logoUrl,
                businessHoursStart: businessHoursStart,
                businessHoursEnd: businessHoursEnd,
                description: description,
                location: location,
                rgbColours: rgbColours,
                hexColours: hexColours,
                companySizeEstimate: companySizeEstimate,
                businessName: businessName,
                mondayOpeningTime: openMonday,
                mondayClosingTime: closeMonday,
                autoReplyMessage: autoReplyMessage,
                mondayAvailability: mondayAvailability,
                tuesdayOpeningTime: openTuesday,
                tuesdayClosingTime: closeTuesday,
                tuesdayAvailability: tuesdayAvailability,
                wednesdayOpeningTime: openWednesday,
                wednesdayClosingTime: closeWednesday,
                wednesdayAvailability: wednesdayAvailability,
                thursdayOpeningTime: openThursday,
                thursdayClosingTime: closeThursday,
                thursdayAvailability: thursdayAvailability,
                fridayOpeningTime: openFriday,
                fridayClosingTime: closeFriday,
                fridayAvailability: fridayAvailability,
                saturdayOpeningTime: openSaturday,
                saturdayClosingTime: closeSaturday,
                saturdayAvailability: saturdayAvailability,
                sundayOpeningTime: openSunday,
                sundayClosingTime: closeSunday,
                sundayAvailability: sundayAvailability,
            }, id: item.id
        })

        handleClose()
    }

    const onVerifyCompany = async (p) => {
        const company = await API.updateModel({
            model: "company", fields: {
                verified: true,
            }, id: item.id
        })
        console.log(company)

        const subscription = await API.createModel({
            model: "subscription", object: {
                "companyId": item.id,
                "productsId": p ? p.id : products[0].id,
                "offerId": null,
                "trialPeriodStartDate": trialPeriodStartDate,
                "trialPeriodEndDate": trialPeriodEndDate,
                "subscribedAfterTrial": false,
                "offerStartDate": null,
                "offerEndDate": null,
                "unsubscribed": false,
            }
        })
        console.log(subscription)
        handleClose()
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        // Check if a file is selected
        if (!file) {
            return;
        }

        // Check if the selected file is an image
        if (!file.type.startsWith('image/')) {
            handleWarning('Please select an image file.');
            return;
        }

        // Create an HTML Image element to check the image dimensions
        const img = new Image();
        img.src = URL.createObjectURL(file);

        img.onload = () => {
            // Check if the image dimensions are 256x256 or 512x512
            if (img.width === 256 && img.height === 256 || img.width === 512 && img.height === 512) {
                setIsUploadingLogo(true)
                // Convert the image to a base64 string with dataURL
                const reader = new FileReader();
                reader.onloadend = () => {
                    API.uploadFile({ base64: reader.result }).then((res) => {
                        setLogoUrl(res.fileUri)
                        setIsUploadingLogo(false)
                        handleAlert('The company Logo has been attached successfully!');
                    })
                };
                reader.readAsDataURL(file);
            } else {
                handleWarning('Please select an image with dimensions 256x256 or 512x512.');
            }
        };
    };


    React.useEffect(() => {
        const init = async () => {
            try {
                const lst = await SUBS.listSubscriptionModels()
                setProducts(lst.items)


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
        businessName, businessHours, email, phone, businessHoursStart, businessHoursEnd, description, location, rgbColours]);

    return (
        <div style={{ height: "70vh", transform: transform }} ref={popupRef} className="widget-2x3 company-crm-statistics popup-window">
            <div className="mini-heading flex">
                <div className="titles flex">
                    <div className='popup-controls' onClick={handleClose}>
                        <span class="material-symbols-outlined">close</span>
                    </div>
                    <div className='block'>
                        <h4>{businessName}</h4>
                        {popupType === "edit" && <p>Profile Editor</p>}
                        {popupType === "verify" && <p>Profile Verification</p>}
                        {popupType === "unverify" && <p>Profile Verification</p>}
                    </div>
                </div>
            </div>
            <div style={{ maxHeight: "65vh" }} className="scrollable chat-view">
                <div className="scrollable popup-scrollview">
                    <div className='col-2x2 flex'>
                        {popupType === "edit" &&
                            <div id="editor-form" className='form-classic col-1x2 editor-form'>
                                <div className='heading'>
                                    <div className='col-4x4 flex'>
                                        <div style={{ width: "70%" }} className='col-1x4'>
                                            {popupType === "edit" && <h4>Company Profile Editor</h4>}
                                            {popupType === "verify" && <h4>Company Profile Verification</h4>}
                                            {popupType === "unverify" && <h4>Company Profile Verification</h4>}
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
                                <br /><br />
                                <label>Auto Reply</label>
                                <TextEditor value={autoReplyMessage} onChange={setAutoReplyMessage} />
                            </div>}
                        {popupType === "edit" &&
                            <div className='form-classic col-1x2'>
                                <div className='col-2x2 flex'>
                                    <div className='col-1x2'>
                                        <div className='form-control'>
                                            <label>Business Logo</label>
                                            <input type="file" accept="image/*" onChange={handleFileChange} />
                                            <div className='image-display-wrapper'>
                                                {logoUrl && <img src={logoUrl} alt="Logo Preview" />}
                                                {isUploadingLogo && <img style={{ width: 30 }} src={"https://media.tenor.com/t5DMW5PI8mgAAAAi/loading-green-loading.gif"} alt="Logo Preview" />}
                                            </div>
                                        </div>
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
                                        <div className='form-control'>
                                            <label>Company Size</label>
                                            <select value={companySizeEstimate} onChange={(e) => setCompanySizeEstimate(e.target.value)}>
                                                {["0-10","11-50","51-100","101-250","251-500","501-1000","1001-5000", "5001+"].map((m, idx) => <option key={idx} value={m}>{m} Employees</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className='form-control'>
                                    <label>Business Hours</label>
                                </div>
                                <div className='col-2x2 flex'>
                                    <div className='col-2x2 inline-render flex-box'>
                                        {businessHours.map((e, idx) => <div key={idx} className='form-control'>
                                            <h5>{e.title}</h5>
                                            <label class="switch">
                                                <input checked={e.value} onChange={(m) => e.setValue(m.target.checked)} type="checkbox" />
                                                <span class="slider round"></span>
                                            </label>
                                            <label>Opens</label>
                                            <input type={"time"} onChange={(m) => e.setStart(m.target.value)} value={e.start} />
                                            <label>Closes</label>
                                            <input type={"time"} onChange={(m) => e.setEnd(m.target.value)} value={e.end} />
                                        </div>)}
                                    </div>
                                </div>
                            </div>}

                        {popupType === "verify" &&
                            <div style={{ width: "95%" }} className='form-classic col-1x2'>
                                <div className='heading'>
                                    <div className='col-4x4 flex'>
                                        <div style={{ width: "70%" }} className='col-1x4'>
                                            <h4>Company Verification</h4>
                                        </div>
                                        <div className='col-1x4'>
                                            <div style={{ position: "relative", top: -15, left: -10 }}>
                                                <Button onClick={onVerifyCompany} special={"icon-button text-align"} icon={<span class="material-symbols-outlined">save</span>} title="Save Changes" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-2x2 flex'>
                                    <div className='grid-view list block'>
                                        {!product && <React.Fragment>
                                            {products && products.length > 0 && products.map((e,idx)=><div onClick={()=>onVerifyCompany(e)} key={idx} className='widget col-1x3 large-button'>
                                                <div className={"subscription-widget"}>
                                                    <h4>{e.name}</h4>
                                                    <h4>${e.currentPrice}</h4>
                                                    <h5>Add Subscription</h5>
                                                </div>
                                            </div>)}
                                        </React.Fragment>}
                                    </div>
                                </div>
                            </div>}
                        {popupType === "unverify" &&
                            <div className='form-classic col-1x2'>
                                <div className='heading'>
                                    <div className='col-4x4 flex'>
                                        <div style={{ width: "80%" }} className='col-1x4'>
                                            <h4>Company Profile Un-verify</h4>
                                        </div>
                                        <div className='col-1x4'>
                                            <div style={{ position: "relative", top: -15, left: -10 }}>
                                                <Button onClick={onSaveChanges} special={"icon-button text-align"} icon={<span class="material-symbols-outlined">save</span>} title="Save Changes" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-2x2 flex'>
                                    <div className='col-1x2'>
                                        <div className='form-control'>
                                            <label>Subscription</label>
                                            <select onChange={(e) => setProduct(e.target.value)}>
                                                {products.map((m, idx) => <option key={idx} value={m.id}>{m.name} Subscription</option>)}
                                            </select>
                                        </div>
                                        <div className='form-control'>
                                            <label>Trial Starts</label>
                                            <input type={"date"} value={trialPeriodStartDate} onChange={(e) => setTrialPeriodStartDate(e.target.value)} />
                                        </div>
                                        <div className='form-control'>
                                            <label>Trial Ends</label>
                                            <input type={"date"} value={trialPeriodEndDate} onChange={(e) => setTrialPeriodEndDate(e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                            </div>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CompanyProfileEditorPopup
