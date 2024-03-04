import React from 'react';
import PageContainer from '../../components/generic/PageContainer';
import QuerySets from '../../controllers/dashboard.controller';
import LoadingOverlay from '../../components/overlays/LoadingOverlay';
import TopMenuBar from '../../components/generic/TopMenuBar';
import deviceBrandControl from '../../images/pz-mobile-branding-display.png';
import NewCompanyForm from '.././forms/NewCompanyForm';
import { AppContext } from '../../context/AppProvider';
import Button from '../../components/Button';

// Import Icons:
import facebook from '../../images/social/facebook.png';
import linkedin from '../../images/social/linkedin.png';
import spaceX from '../../images/social/spacex.png';
import instagram from '../../images/social/instagram.png';


const BrandControlsDashboard = () => {
    const {universalChangeCounter,userData,setConfirmation,handleAlert,handleWarning} = React.useContext(AppContext)
    const [isLoading,setIsLoading] = React.useState(true)
    const [API] = React.useState(new QuerySets())
    const [myBusiness] = React.useState(userData ? userData.companyData : {})
    const [data,setData] = React.useState([])
    const [preview, setPreview] = React.useState(null)
    const [tab, setTab] = React.useState(0)
    const [menuTab, setMenuTab] = React.useState(0)
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [socialLinks, setSocialLinks] = React.useState(null)
    const [companyId] = React.useState(userData ? userData.userData.companyId : null)

    const [businessNameField, setBusinessName] = React.useState(myBusiness.businessName)
    const [descriptionField, setDescription] = React.useState(myBusiness.description)
    const [businessHighlightsField, setBusinessHighlights] = React.useState(myBusiness.highlights)
    const [phoneField, setPhoneField] = React.useState(myBusiness.phone)
    const [websiteUrlField, setWebsiteUrl] = React.useState(myBusiness.websiteUrl)
    const [logoUrl, setLogoUrl] = React.useState(myBusiness.logoUrl)

    const [rgbColours, setRgbColours] = React.useState(myBusiness.rgbColours)
    const [hexColours, setHexColours] = React.useState(myBusiness.hexColours)

    const [twitterField, setTwitter] = React.useState("")
    const [facebookField, setFacebook] = React.useState("")
    const [linkedinField, setLinkedin] = React.useState("")
    const [instagramField, setInstagram] = React.useState("")
    const [appleStoreLinkField, setAppleStoreLink] = React.useState("")
    const [googlePlayLinkField, setGooglePlayLink] = React.useState("")
    const [isUploadingLogo, setIsUploadingLogo] = React.useState(false)
    const inputFile = React.useRef(null)

    const saveChanges = async () => {
        await API.updateModel({model: "socialLinks", fields: {
            twitter: twitterField,
            facebook: facebookField,
            linkedin: linkedinField,
            instagram: instagramField,
            googlePlayLink: appleStoreLinkField,
            appleStoreLink: googlePlayLinkField,
        }, id: socialLinks.id})

        await API.updateModel({model: "company", fields: {
            businessName: businessNameField,
            description: descriptionField,
            highlights: businessHighlightsField,
            phone: phoneField,
            websiteUrl: websiteUrlField,
            logoUrl: logoUrl,
            rgbColours: rgbColours,
            hexColours: hexColours,
        }, id: myBusiness.id})

        if (userData.companyData) {
            userData.companyData.businessName = businessNameField;
            userData.companyData.description = descriptionField;
            userData.companyData.highlights = businessHighlightsField;
            userData.companyData.phone = phoneField;
            userData.companyData.websiteUrl = websiteUrlField;
            userData.companyData.rgbColours = rgbColours;
            userData.companyData.hexColours = hexColours;
            userData.companyData.logoUrl = logoUrl;

            localStorage.setItem('user_data', JSON.stringify(userData))
        }

        handleAlert("Your changes have been updated successfully!")
    }

    const handleColorChange = (hex) => {
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

    const handleImageUpload = () => {
        // Programmatically trigger click on the file input element
        inputFile.current.click();
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

    const hidePreview = () => setPreview(null)

    React.useEffect(()=>{
        setIsLoaded(true);
        setIsLoading(false)
    },[data,universalChangeCounter])

    React.useEffect(()=>{
        const init = async ()=>{
            const sl = await API.getSocialLinks({companyId: companyId})

            if (sl && sl.response) {
                const item = sl.response[0];
                setSocialLinks(item)

                setTwitter(item.twitter)
                setFacebook(item.facebook)
                setLinkedin(item.linkedin)
                setInstagram(item.instagram)
                setAppleStoreLink(item.googlePlayLink)
                setGooglePlayLink(item.appleStoreLink)
            }
        }
        
        init();
    },[API,universalChangeCounter])

    React.useEffect(()=>{
        
    },[universalChangeCounter, socialLinks])

    return (
        <React.Fragment>
            {isLoading && !isLoaded && <LoadingOverlay /> }
            <TopMenuBar setTab={setMenuTab} />
            
            <PageContainer 
                pageTitle={'Brand Controls'}
                pageSubtitle={""}
                searchSpace={data}
                addons={""}
            >
                <div className='col-2x2 widget full-width'>
                    <div className='col-1x2 business-form'>
                        <div className='heading'>
                            <h4>Details</h4>
                            <p>
                            Add information about your company: <br/>write company description, highlights, contacts and social networks
                            </p>
                        </div>

                        <div className='form-control'>
                            <label>Company Name</label>
                            <input value={businessNameField} type={"text"} onChange={(e)=>{setBusinessName(e.target.value)}} />
                        </div>

                        <div className='form-control'>
                            <label>Company Description</label>
                            <input value={descriptionField} type={"text"} onChange={(e)=>{setBusinessName(e.target.value)}} />
                        </div>

                        <div className='form-control'>
                            <label>Company Highlights</label>
                            <input value={businessHighlightsField} type={"text"} onChange={(e)=>{setBusinessHighlights(e.target.value)}} />
                        </div>

                        <div className='form-control'>
                            <label>Phone Number</label>
                            <input value={phoneField} type={"text"} onChange={(e)=>{setPhoneField(e.target.value)}} />
                        </div>

                        <div className='form-control'>
                            <label>URL</label>
                            <input value={websiteUrlField} type={"text"} onChange={(e)=>{setWebsiteUrl(e.target.value)}} />
                        </div>
                    </div>
                    <div style={{marginTop: 55}} className='col-1x2 business-form'>
                        <div className='form-control'>
                            <label><div className='labeled-icon'><img src={instagram} alt='icon' /></div><div className='labeled-text'>Instagram</div></label>
                            <input value={instagramField} type={"text"} onChange={(e)=>{setInstagram(e.target.value)}} />
                        </div>

                        <div className='form-control'>
                            <label><div className='labeled-icon'><img src={facebook} alt='icon' /></div><div className='labeled-text'>Facebook</div></label>
                            <input value={facebookField} type={"text"} onChange={(e)=>{setFacebook(e.target.value)}} />
                        </div>

                        <div className='form-control'>
                            <label><div className='labeled-icon'><img src={linkedin} alt='icon' /></div><div className='labeled-text'>LinkedIn</div></label>
                            <input value={linkedinField} type={"text"} onChange={(e)=>{setLinkedin(e.target.value)}} />
                        </div>

                        <div className='form-control'>
                            <label><div className='labeled-icon'><img src={spaceX} alt='icon' /></div><div className='labeled-text'>Space X (ex. Twitter)</div></label>
                            <input value={twitterField} type={"text"} onChange={(e)=>{setTwitter(e.target.value)}} />
                        </div>

                        <div className='form-control'>
                            <label>App Store link</label>
                            <input value={appleStoreLinkField} type={"text"} onChange={(e)=>{setAppleStoreLink(e.target.value)}} />
                        </div>

                        <div className='form-control'>
                            <label>Google Play link</label>
                            <input value={googlePlayLinkField} type={"text"} onChange={(e)=>{setGooglePlayLink(e.target.value)}} />
                        </div>
                    </div>
                </div>
                <div className='col-2x2 widget full-width'>
                    <div className='col-1x2 business-form'>
                        <div className='heading'>
                            <h4>Personalize</h4>
                            <p>
                            Personalize your chat: add a company logo and brand colour.
                            </p>
                        </div>

                        <div className='form-control'>
                            <label>Select company logo</label>
                            <div className='col-2x2 company-logo-control'>
                                <div className='col-1x2 logo-wrapper'>
                                    <img src={logoUrl} alt={myBusiness.businessName} />
                                </div>
                                <div className='col-1x2 logo-control-wrapper'>
                                    <div className='heading'>
                                        {!isUploadingLogo && <React.Fragment>
                                            <input style={{display: "none"}} ref={inputFile} type="file" accept="image/*" onChange={handleFileChange} />
                                            <Button onClick={handleImageUpload} title={"Choose logo"} />
                                        </React.Fragment>}
                                        {isUploadingLogo && <img style={{width: 30}} src={"https://media.tenor.com/t5DMW5PI8mgAAAAi/loading-green-loading.gif"} alt="Logo Preview" />}
                                    </div>
                                    <div className='heading'>
                                        <p>Recommended dimensions of 256x256 or 512x512</p>
                                        <p>.png, .jpeg, .jpg up to 5 MB</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='form-control'>
                            <label>Select colour for background of chat</label>
                            <input value={hexColours||"white"} type={"color"} onChange={(e)=>{handleColorChange(e.target.value)}} />
                        </div>
                    </div>
                    <div style={{marginTop: 55}} className='col-1x2 business-form'>
                        {/* <div className='brand-controls-ui'>
                            <div className='brand-controls-ui'>
                                <h4>{businessNameField}</h4>
                            </div>

                            <div className='brand-controls-image'>
                                <img src={myBusiness.logoUrl} alt='PZ Brand Image' />
                            </div>
                        </div> */}
                        <div className='brand-identity-controls'>
                            <div className='device-wrapper'>
                                <img style={{backgroundColor: hexColours}} src={deviceBrandControl} alt='PZ Brand Control Device' />
                            </div>
                        </div>
                    </div>
                </div>

                <div className='persistance-controls'>
                    <div className='form-control'>
                        <Button title={"Save Changes"} special={"special"} onClick={saveChanges} />
                        <Button title={"Cancel"} />
                    </div>
                </div>
            </PageContainer>
            {preview && <NewCompanyForm handleClose={hidePreview} popupType={preview.type} item={preview.item} />}
        </React.Fragment> 
    )
}

export default BrandControlsDashboard
