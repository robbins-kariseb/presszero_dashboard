import React from 'react'
import QuerySets from '../../controllers/dashboard.controller';
import 'quill/dist/quill.snow.css'
import Quill from 'quill';
import Button from '../../components/Button';
import { convertTimeToUTC, isValidEmail } from '../../utilities/helpers';
import { AppContext } from '../../context/AppProvider';
let isTriggered = false

function NewCompanyForm ({ item, handleClose }) {
    const {onUniversalChange, handleWarning, handleAlert} = React.useContext(AppContext)
    const [API] = React.useState(new QuerySets())
    const popupRef = React.useRef(null);
    const [transform, setTransform] = React.useState("translateX(100%)")
    const editorRef = React.useRef(null);

    // Company Profile Inputs
    const [businessName, setBusinessName] = React.useState("New Company")
    const [email, setEmail] = React.useState("")
    const [phone, setPhone] = React.useState("")
    const [businessHoursStart, setBusinessHoursStart] = React.useState("")
    const [businessHoursEnd, setBusinessHoursEnd] = React.useState("")
    const [websiteUrl, setWebsiteUrl] = React.useState("")
    const [logoUrl, setLogoUrl] = React.useState("")
    const [description, setDescription] = React.useState("")
    const [location, setLocation] = React.useState("")
    const [hexColours, setHexColours] = React.useState("")
    const [rgbColours, setRgbColours] = React.useState("")
    const [contactNumber, setContactNumber] = React.useState("")
    const [isUploadingLogo, setIsUploadingLogo] = React.useState(false)

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
                API.uploadFile({base64: reader.result}).then((res)=>{
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
        item.email = email
        item.phone = phone
        item.businessHoursStart = businessHoursStart
        item.businessHoursEnd = businessHoursEnd
        item.description = description
        item.location = location
        item.rgbColours = rgbColours
        item.hexColours = hexColours
        item.businessName = businessName

        const results = await API.createModel({model: "company", object:{
            email: email,
            phone: phone,
            mondayOpeningTime: convertTimeToUTC(businessHoursStart),
            mondayClosingTime: convertTimeToUTC(businessHoursEnd),
            mondayAvailability: true,
            tuesdayOpeningTime: convertTimeToUTC(businessHoursStart),
            tuesdayClosingTime: convertTimeToUTC(businessHoursEnd),
            tuesdayAvailability: true,
            wednesdayOpeningTime: convertTimeToUTC(businessHoursStart),
            wednesdayClosingTime: convertTimeToUTC(businessHoursEnd),
            wednesdayAvailability: true,
            thursdayOpeningTime: convertTimeToUTC(businessHoursStart),
            thursdayClosingTime: convertTimeToUTC(businessHoursEnd),
            thursdayAvailability: true,
            fridayOpeningTime: convertTimeToUTC(businessHoursStart),
            fridayClosingTime: convertTimeToUTC(businessHoursEnd),
            fridayAvailability: true,
            description: description,
            location: location,
            rgbColours: rgbColours,
            hexColours: hexColours,
            businessName: businessName,
            online: false,
            verified: false,
            logoUrl: logoUrl,
            websiteUrl: websiteUrl,
        }})

        onUniversalChange()
        handleClose()
    }

    React.useEffect(() => {
        if (isTriggered) return;

        const quill = new Quill(editorRef.current, {
            theme: 'snow',
            placeholder: 'Write your content here...',
        });

        quill.clipboard.dangerouslyPasteHTML(description);

        quill.on('text-change', () => {
            setDescription(quill.root.innerText)
        });

        // Cleanup the Quill instance when the component is unmounted
        return () => {
            isTriggered = true
            try {quill.destroy();} catch(ex){}
        };
    }, []);
    
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

    React.useEffect(() => {}, [businessName,email,phone,businessHoursStart,businessHoursEnd,description,location,rgbColours]);

    return (
        <div style={{ height: "70vh", transform: transform }} ref={popupRef} className="widget-2x3 company-crm-statistics popup-window">
            <div className="mini-heading flex">
                <div className="titles flex">
                    <div className='popup-controls' onClick={handleClose}>
                        <span className="material-symbols-outlined">close</span>
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
                                        <h4>New Company Registration</h4>
                                    </div>
                                    <div className='col-1x4'>
                                        <div style={{position:"relative", top:-15, left: -10}}>
                                            <Button onClick={onSaveChanges} special={"icon-button text-align"} icon={<span className="material-symbols-outlined">save</span>} title="Save Changes" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <label>Company Description</label>
                            <div ref={editorRef}></div>
                        </div>
                        <div className='form-classic col-1x2'>
                            <div className='col-2x2 flex'>
                                <div className='col-1x2'>
                                    <div className='form-control'>
                                        <label>Business Logo</label>
                                        <input type="file" accept="image/*" onChange={handleFileChange} />
                                        <div className='image-display-wrapper'>
                                            {logoUrl && <img src={logoUrl} alt="Logo Preview" />}
                                            {isUploadingLogo && <img style={{width: 30}} src={"https://media.tenor.com/t5DMW5PI8mgAAAAi/loading-green-loading.gif"} alt="Logo Preview" />}
                                        </div>
                                    </div>
                                    <div className='form-control'>
                                        <label>Business Name</label>
                                        <input type={"text"} onChange={(e)=>setBusinessName(e.target.value)} value={businessName} />
                                    </div>
                                    <div className='form-control'>
                                        <label>Business Email</label>
                                        <input type={"text"} onChange={(e)=>setEmail(e.target.value)} value={email} />
                                    </div>
                                    <div className='form-control'>
                                        <label>Contact Number</label>
                                        <input type={"text"} onChange={(e)=>setPhone(e.target.value)} value={phone} />
                                    </div>
                                    <div className='form-control'>
                                        <label>Website</label>
                                        <input type={"text"} onChange={(e)=>setWebsiteUrl(e.target.value)} value={websiteUrl} />
                                    </div>
                                </div>
                                <div className='col-1x2'>
                                    <div className='form-control'>
                                        <label>Business Location</label>
                                        <input type={"text"} onChange={(e)=>setLocation(e.target.value)} value={location} />
                                    </div>
                                    <div className='form-control'>
                                        <label>Business Hours Starts</label>
                                        <input type={"time"} onChange={(e)=>setBusinessHoursStart(e.target.value)} value={businessHoursStart} />
                                        <label>Business Hours Starts</label>
                                        <input type={"time"} onChange={(e)=>setBusinessHoursEnd(e.target.value)} value={businessHoursEnd} />
                                    </div>
                                    <div className='form-control'>
                                        <label>Theme Color</label>
                                        <input type={"color"} onChange={(e)=>setColors(e.target.value)} value={hexColours} />
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

export default NewCompanyForm