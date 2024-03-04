import React from 'react';
import PageContainer from '../../components/generic/PageContainer';
import QuerySets from '../../controllers/dashboard.controller';
import LoadingOverlay from '../../components/overlays/LoadingOverlay';
import TopMenuBar from '../../components/generic/TopMenuBar';
import Button from '../../components/Button';
import NewCompanyForm from '.././forms/NewCompanyForm';
import { AppContext } from '../../context/AppProvider';
import Users from '../../controllers/user.controller';
import TeamBanner from "../../images/invite-team-banner.png"
import { isValidEmail } from '../../utilities/helpers';
import CustomerInvitationForm from '../forms/CustomerInvitationForm';


const CustomerInvitationDashboard = () => {
    const {universalChangeCounter,userData,setConfirmation,handleAlert,handleWarning, onUniversalChange} = React.useContext(AppContext)
    const [isLoading,setIsLoading] = React.useState(true)
    const [USERS] = React.useState(new Users())
    const [API] = React.useState(new QuerySets())
    const [selection,setSelection] = React.useState([])
    const [activeUserList,setActiveUserList] = React.useState([])
    const [invitationEmail,setInvitationEmail] = React.useState("")
    const [preview, setPreview] = React.useState(null)
    const [menuTab, setMenuTab] = React.useState(0)
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [checkAll, setCheckAll] = React.useState(false);
    const [companyId] = React.useState(userData ? userData.userData.companyId : null)

    const hidePreview = () => setPreview(null)

    const handleBulkSelection = (event) => {
        if ((activeUserList||[]).length === 0) return;
        if (!checkAll) {
            if(setSelection) setSelection((activeUserList||[]))

            (activeUserList||[]).forEach((item)=>{
                item.checked = true;
            })
            setCheckAll(true)
        } else {
            if(setSelection) setSelection([])

            (activeUserList||[]).forEach((item)=>{
                item.checked = false;
            })
            setCheckAll(false)
        }
    }

    const handleSelectionToggle = (event, item) => {
        let list = [];
        let selected = false;

        (selection||[]).forEach((e)=>{
            if (e.id === item.id) {
                selected = true;
            } else {
                list.push(e)
            }
        })
        
        item.checked = !selected
        
        if (!selected) {
            list.push(item);
        }
        if(setSelection) setSelection(list)
    }

    React.useEffect(()=>{
        const init = async ()=>{
            const users = await USERS.listCompanyInvitations({companyId: companyId})
            try {
                setActiveUserList(users.items)
            } catch (ex) {
                console.warn(ex)
            }
        }
        
        init();
    },[API,universalChangeCounter])

    React.useEffect(()=>{
        setIsLoading(false)
        if (!isLoaded) {
            setIsLoaded(!(false));
        }
    },[activeUserList,universalChangeCounter])

    return (
        <React.Fragment>
            {isLoading && !isLoaded && <LoadingOverlay /> }
            <TopMenuBar setTab={setMenuTab} />
            
            <PageContainer 
                pageTitle={'Invite Customers'}
                pageSubtitle={"Here is a list of your customers: you can easily find the right user using a filter, or invite new ones"}
                searchSpace={[]}
                addons={<div className='col-1x3 tab-wrapper time-series-tabs float-right'>
                    <Button 
                        special={"special"} 
                        title="Invite Users" 
                        onClick={()=>{
                            setConfirmation({
                                heading: ``,
                                content: <CustomerInvitationForm />,
                                cancel: ()=>{},
                                confirm: ()=>{},
                            })
                        }} 
                    />
                    {(selection||[]).length > 0 && <React.Fragment>
                        <Button 
                            special={"dropdown"} 
                            title={<React.Fragment><span  className="material-symbols-outlined">expand_more</span> <span className='text'>Actions</span></React.Fragment>} 
                            onClick={()=>{}} 
                            popup={[
                                {
                                    name: "Send Again",
                                    onClick: ()=>{},
                                },{
                                    name: "Revoke Invite",
                                    onClick: ()=>{
                                        
                                    },
                                },{
                                    name: "Remove",
                                    onClick: ()=>{
                                        setConfirmation({
                                            heading: `Delete Accounts`,
                                            content: <p>This action will remove the user account from our system! Are you sure you want to continue?</p>,
                                            cancel: ()=>{},
                                            confirm: ()=>{},
                                        })
                                    },
                                }
                            ]} 
                        />
                        <Button 
                            special={"info"} 
                            title={<React.Fragment>Selected <small>{(selection||[]).length}</small></React.Fragment>} 
                        />
                        </React.Fragment>}
                </div>}
            >
                <div className='col-4x4'>
                    <div style={{height: "60vh", maxHeight: "60vh"}} className="scrollable full-width">
                        <table className='business-themed-table'>
                            <thead>
                                <tr>
                                    <td style={{width:30}}><input checked={checkAll} onChange={(event)=>handleBulkSelection(event)} type='checkbox' /></td>
                                    <td>Name</td>
                                    <td>Email</td>
                                    <td>Status</td>
                                    <td>Actions</td>
                                </tr>
                            </thead>
                            <tbody>
                                {(activeUserList||[]).map((e,idx)=> <tr key={idx}>
                                    <td><input checked={e.checked||false} onChange={(event)=>handleSelectionToggle(event, e)} type='checkbox' /></td>
                                    <td>{e.name} {e.surname}</td>
                                    <td>{e.email}</td>
                                    <td>
                                        {e.last_login != null && <div className='inference-control'>
                                            <div className='positive-icon'></div>
                                            <div className='text'>Joined</div>
                                        </div>}
                                        {e.last_login == null && <div className='inference-control'>
                                            <div className='neutral-icon'></div>
                                            <div className='text'>Pending</div>
                                        </div>}
                                    </td>
                                    <td>
                                        <Button 
                                            special={"icon-special"} 
                                            title={<span  className="material-symbols-outlined">more_vert</span>} 
                                            popup={[
                                                {
                                                    name: "Send Again",
                                                    onClick: ()=>{},
                                                },{
                                                    name: "Revoke Invite",
                                                    onClick: ()=>{
                                                        
                                                    },
                                                },{
                                                    name: "Remove",
                                                    onClick: ()=>{
                                                        setConfirmation({
                                                            heading: `Delete ${e.name}'s Account`,
                                                            content: <p>This action will remove the user account from our system! Are you sure you want to continue?</p>,
                                                            cancel: ()=>{},
                                                            confirm: ()=>{
                                                                API.deleteModel({model: "adminUser", id: e.id}).then((res)=>{
                                                                    if (res.response === "deleted") {
                                                                        handleAlert(`User ${e.name}'s account has been deleted!`)
                                                                    } else {
                                                                        handleWarning("We could not delete this object! Please try again.")
                                                                    }
                                                                })
                                                            },
                                                        })
                                                    },
                                                }
                                            ]} 
                                        />
                                    </td>
                                </tr>)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </PageContainer>
            {preview && <NewCompanyForm handleClose={hidePreview} popupType={preview.type} item={preview.item} />}
        </React.Fragment> 
    )
}

export default CustomerInvitationDashboard