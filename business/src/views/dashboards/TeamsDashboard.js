import React from 'react';
import PageContainer from '../../components/generic/PageContainer';
import QuerySets from '../../controllers/dashboard.controller';
import LoadingOverlay from '../../components/overlays/LoadingOverlay';
import TopMenuBar from '../../components/generic/TopMenuBar';
import Button from '../../components/Button';
import NewCompanyForm from '.././forms/NewCompanyForm';
import { AppContext } from '../../context/AppProvider';
import Users from '../../controllers/user.controller';


const TeamsDashboard = () => {
    const {universalChangeCounter,userData,setConfirmation,handleAlert,handleWarning} = React.useContext(AppContext)
    const [isLoading,setIsLoading] = React.useState(true)
    const [USERS] = React.useState(new Users())
    const [API] = React.useState(new QuerySets())
    const [unfilteredData,setUnfilteredData] = React.useState([])
    const [data,setData] = React.useState([])
    const [chatData,setChatData] = React.useState([])
    const [businesses,setBusinesses] = React.useState([])
    const [activeUserList,setActiveUserList] = React.useState([])
    const [preview, setPreview] = React.useState(null)
    const [searchPhrase, setSearchPhrase] = React.useState("")
    const [tab, setTab] = React.useState(0)
    const [menuTab, setMenuTab] = React.useState(0)
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [tabMetrics, setTabMetrics] = React.useState({});
    const [companyId] = React.useState(userData ? userData.userData.companyId : null)

    const hidePreview = () => setPreview(null)

    let searchResults = searchPhrase.length < 2 ? [] : data.filter((e) => {
        const keywords = searchPhrase.split(' ');
        const itemText = `${e.searchName} ${e.searchCategory}`.toLowerCase();
    
        return keywords.every((word) => itemText.includes(word.toLowerCase()));
    });

    if (searchResults.length === 0) searchResults = data;

    React.useEffect(()=>{
        const init = async ()=>{
            const dataset = await API.getCompanyStatistics()
            const users = await USERS.listCompanyUsers({companyId: companyId})
    
            try {
                setBusinesses(dataset.items.sort((a,b)=> {
                    return a.totalChats - b.totalChats
                }).slice().reverse().slice(0, 3));

                const companies = await API.getAllCompanies()
                companies.items.forEach((e) => {
                    e.searchName = e.businessName;
                    e.searchCategory = e.categoryDefault;
                    e.searchImage = e.logoUrl;
                });
                console.log(users)
                setActiveUserList(users.items)
                setUnfilteredData(companies.items)
                setData(companies.items.filter((a)=>{
                    return a.verified === true;
                }))

                setTabMetrics({verified: companies.items.filter((a)=>{
                    return a.verified === true;
                }).length,
                unverified: companies.items.filter((a)=>{
                    return a.verified === false;
                }).length,
                requested: companies.items.filter((a)=>{
                    return a.requested === false;
                }).length})

                const chats = await API.getAllChatStatistics()
                chats.items.forEach((e) => {
                    e.searchName = e.businessName;
                    e.searchCategory = e.categoryDefault;
                    e.searchImage = e.logoUrl;
                });
                setChatData(chats.items)
            } catch (ex) {
                console.warn(ex)
            }
        }
        
        init();
    },[API,universalChangeCounter])

    React.useEffect(()=>{
        if (tab === 0) {
            const dataset = unfilteredData.filter((a)=>{
                return a.verified === true;
            })

            setData(dataset)
        } else if (tab === 1) {
            const dataset = unfilteredData.filter((a)=>{
                return a.verified === false;
            })

            setData(dataset)
        } else if (tab === 2) {
            const dataset = unfilteredData.filter((a)=>{
                return a.unsubscribed === true;
            })

            setData(dataset)
        }
    },[tab,universalChangeCounter])

    React.useEffect(()=>{},[businesses])

    React.useEffect(()=>{
        setIsLoading(data.length === 0 ||chatData.length === 0 ||businesses.length === 0)
        if (!isLoaded) {
            setIsLoaded(!(data.length === 0 ||chatData.length === 0 ||businesses.length === 0));
        }
    },[data,chatData,businesses,universalChangeCounter])

    return (
        <React.Fragment>
            {isLoading && !isLoaded && <LoadingOverlay /> }
            <TopMenuBar setTab={setMenuTab} />
            
            <PageContainer 
                pageTitle={'Team'}
                pageSubtitle={""}
                searchSpace={data}
                addons={<div className='col-1x3 tab-wrapper time-series-tabs float-right'>
                    <Button 
                        special={"special"} 
                        title="Invite Users" 
                        onClick={()=>{}} 
                    />
                    <Button 
                        special={"dropdown"} 
                        title={<React.Fragment><span class="material-symbols-outlined">expand_more</span> <span className='text'>Actions</span></React.Fragment>} 
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
                        title={<React.Fragment>Selected <small>3</small></React.Fragment>} 
                    />
                </div>}
            >
                <div className='col-4x4'>
                    <div className="scrollable full-width">
                        <table className='business-themed-table'>
                            <thead>
                                <tr>
                                    <td style={{width:30}}><input type='checkbox' /></td>
                                    <td>Name</td>
                                    <td>Email</td>
                                    <td>Status</td>
                                    <td>Actions</td>
                                </tr>
                            </thead>
                            <tbody>
                                {activeUserList.map((e,idx)=> <tr>
                                    <td><input type='checkbox' /></td>
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
                                            title={<span class="material-symbols-outlined">more_vert</span>} 
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

export default TeamsDashboard