import React from 'react';
import PageContainer from '../../components/generic/PageContainer';
import QuerySets from '../../controllers/dashboard.controller';
import LoadingOverlay from '../../components/overlays/LoadingOverlay';
import TopMenuBar from '../../components/generic/TopMenuBar';

import verifiedIcon from "../../images/verified.png"
import logo from "../../images/logo.png"
import Tab from '../../components/Tab';
import { AppContext } from '../../context/AppProvider';
import WidgetCompanyMetrics from '../../components/metrics/widgets/WidgetCompanyMetrics';
import StatusWidget from '../../components/generic/StatusWidget';
import CompanyProfileEditorPopup from '../popups/CompanyProfileEditorPopup';
import NewUserForm from '../forms/NewUserForm';
import { formattedDate, generateRandomHex, queryCurrentDayOfWeek, queryOnlineStatus } from '../../utilities/helpers';
import { useNavigate } from 'react-router-dom';
import Users from '../../controllers/user.controller';
import Button from '../../components/Button';
import Integrations from '../../controllers/integration.controller';

function CompanyUserView() {
    const {
        indexedViewData,
        setIndexedViewData,
        universalChangeCounter,
        setConfirmation,
        onUniversalChange,
        handleWarning,
        handleAlert
    } = React.useContext(AppContext);
    const [isLoading, setIsLoading] = React.useState(true)
    const [API] = React.useState(new QuerySets())
    const [USERS] = React.useState(new Users())
    const [companyUsers, setCompanyUsers] = React.useState([])
    const [chatData, setChatData] = React.useState([])
    const [preview, setPreview] = React.useState(null)
    const [userPreview, setUserPreview] = React.useState(null)
    const [searchPhrase, setSearchPhrase] = React.useState("")
    const [tab, setTab] = React.useState(0)
    const [menuTab, setMenuTab] = React.useState(0)
    const [timeSeriesTab, setTimeSeriesTab] = React.useState(0)
    const [isLoaded, setIsLoaded] = React.useState(false);

    const navigate = useNavigate();
    const handleNavigate = (uri) => navigate(uri);

    const hidePreview = () => setPreview(null)
    const hideUserPreview = () => setUserPreview(null)

    React.useEffect(() => {
        const init = async () => {
            try {
                const chats = await API.getAllChatStatistics()
                chats.items.forEach((e) => {
                    e.searchName = e.businessName;
                    e.searchCategory = e.categoryDefault;
                    e.searchImage = e.logoUrl;
                });
                setChatData(chats.items)
                setIsLoaded(true)
            } catch (ex) {
                console.warn(ex)
            }
        }

        init();
    }, [API, universalChangeCounter])

    React.useEffect(() => {
        const init = async () => {
            let companyDataset = null;
            const companyId = window.location.href.split("/")[4]
            try {
                const res = await API.getSingleSubscription(companyId);
                let company = {
                    ...res.items[0],
                    ...res.items[0].company,
                    ...res.items[0].product,
                }
                company.id = company.companyId
                setIndexedViewData(company)
                companyDataset = company;
            } catch (error) {
                console.warn(error)
            }

            const users = await USERS.listCompanyUsers({ companyId: companyId })
            setCompanyUsers(users.items)
        }
        init();
    }, [universalChangeCounter])

    React.useEffect(() => {
        setIsLoading(chatData.length === 0 || !isLoading)
        if (!isLoaded) {
            setIsLoaded(chatData.length === 0);
        }
    }, [])

    React.useEffect(() => { }, [preview])

    return (
        <React.Fragment>
            {isLoading && !isLoaded && <LoadingOverlay />}
            <TopMenuBar setTab={setMenuTab} />

            <PageContainer
                pageTitle={indexedViewData.businessName || "No Company Found"}
                pageSubtitle={<div className='col-1x3 tab-wrapper time-series-tabs'>
                    <Tab tabs={[
                        {
                            title: "Day",
                            onClick: (() => { })
                        }, {
                            title: "Week",
                            onClick: (() => { })
                        }, {
                            title: "All Time",
                            onClick: (() => { })
                        }]}
                        setTab={setTimeSeriesTab}
                    />
                </div>}
                addons={<WidgetCompanyMetrics item={indexedViewData} timeseriesIndex={timeSeriesTab} />}
            >
                <div className='col-4x4'>
                    <div style={{ width: "86%", borderBottom: `10px solid ${indexedViewData.hexColours || "white"}` }} className='widget col-1x4'>
                        <div className='col-2x2'>
                            <div className='widget col-1x2'>
                                <div className='col-2x2 metric-wrapper flex-box end-to-end'>
                                    <div className='logo-wrapper metric'>
                                        <img
                                            src={indexedViewData.logoUrl}
                                            alt="logo"
                                            onError={(e) => {
                                                e.target.src = logo;
                                            }}
                                        />
                                    </div>
                                    <p style={{ width: "70%" }} className='metric'>{(indexedViewData.companySizeEstimate || "Unknown ").replaceAll(' ', '')} employees</p>
                                </div>
                                <div className='group heading'>
                                    <h3>Company Users</h3>
                                </div>

                                <div className='info-wrapper'>
                                    <div className='title-wrapper'>
                                        <h4>{indexedViewData.businessName}</h4>
                                        {indexedViewData.verified && <div className='verified-icon'>
                                            <img src={verifiedIcon} alt="verified" />
                                        </div>}
                                    </div>
                                    <p>{indexedViewData.description}</p>
                                </div>
                            </div>

                            <div className='widget col-1x2'>
                                <div className='category heading'>
                                    {indexedViewData && indexedViewData.categoryList && indexedViewData.categoryList.map((e, idx) =>
                                        <h3 key={idx} className='category-item'>{e}</h3>
                                    )}
                                </div>
                                <div className='information heading'>
                                    <StatusWidget text={queryOnlineStatus({ company: indexedViewData }) ? "ONLINE" : "OFFLINE"} status={queryOnlineStatus({ company: indexedViewData }) ? "new" : "pending"} />
                                    <div className='business-hours-grid'>
                                        <div className='heading'>
                                            <h4>{queryCurrentDayOfWeek()}</h4>
                                            <h4>Online {indexedViewData[`${queryCurrentDayOfWeek().toLowerCase()}OpeningTime`]}</h4>
                                            <h4>Offline {indexedViewData[`${queryCurrentDayOfWeek().toLowerCase()}ClosingTime`]}</h4>
                                        </div>
                                    </div>
                                </div>
                                <div className='information heading'>
                                    <label>Customer Nr.</label>
                                    <h3 className='category-item'>{`CR-${indexedViewData.id + 10000}`}</h3>
                                </div>
                                <div className='information heading'>
                                    <label>Website</label>
                                    <h3 className='category-item'><a target='_blank' href={indexedViewData.websiteUrl}>{indexedViewData.websiteUrl}</a></h3>
                                </div>
                                <div className='information heading'>
                                    <label>Subscription</label>
                                    <h3 className='category-item'>{indexedViewData.name}</h3>
                                </div>
                                <div className='information heading'>
                                    <label>Subscription Started</label>
                                    <h3 className='category-item'>{formattedDate(indexedViewData.startDate ? new Date(indexedViewData.startDate) : new Date())}</h3>
                                </div>
                                <div className='information heading'>
                                    <label>Subscription Ending</label>
                                    <h3 className='category-item'>{formattedDate(indexedViewData.endDate ? new Date(indexedViewData.endDate) : new Date())}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='col-4x4'>
                    <div className='widget special-box-view'>
                        <div className='group heading status-tool-bar'>
                            <h3>Users: {indexedViewData.name || "No Matching Subscription"}</h3>
                            <div className={"active-subscription"}>
                                <div className={"inner-control"}></div>
                            </div>
                        </div>
                        <div className='col-3x3 list block'>
                            <div className='widget col-1x3'>
                                <div className={"subscription-widget"}>
                                    <h4>{indexedViewData.maxAdmins || 0}</h4>
                                    <h5>Maximum Admin Users</h5>
                                </div>
                            </div>
                            <div className='widget col-1x3'>
                                <div className={"subscription-widget"}>
                                    <h4>{indexedViewData.maxAgents || 0}</h4>
                                    <h5>Maximum Agents</h5>
                                </div>
                            </div>
                            <div className='widget col-1x3'>
                                <div className={"subscription-widget"}>
                                    <h4>{(companyUsers && companyUsers.length || 0) || 0}</h4>
                                    <h5>All Users</h5>
                                </div>
                            </div>
                        </div>
                        <div className='widget full-width'>
                            <div className='widget col-2x2'>
                                <div style={{ width: "100%" }} className='col-1x2'>
                                    <div className='col-1x4 mini-toolbar'>
                                        <div className="col-2x2">
                                            <div className='col-1x2'>
                                                <h4>Active Users</h4>
                                            </div>
                                            <div className='col-1x2'>
                                                <Button onClick={() => setUserPreview({ type: "new-user", item: indexedViewData })} title="Add User" />
                                            </div>
                                        </div>
                                    </div>
                                    <br />
                                    <br />
                                    <table className="classic-table">
                                        <thead>
                                            <tr>
                                                <td style={{ width: 150 }}><div title="Number of positive messages received from the user." className="hint"><center>@Country</center></div></td>
                                                <td>User Name</td>
                                                <td>Phone</td>
                                                <td>Role</td>
                                                <td>Email</td>
                                                <td>-</td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {companyUsers && companyUsers.length > 0 && companyUsers.sort((a, b) => a.id - b.id).map((e, idx) => <tr key={idx} style={{ color: !e.is_active ? "red" : "black" }}>
                                                <td><div className='numeric-graphic good'>{e.country}</div></td>
                                                <td style={{ width: 150 }}>{e.name} {e.surname}</td>
                                                <td>{e.phoneNumber}</td>
                                                <td><div style={{ width: "auto", background: "gray" }} className="hint"><center>{e.accessGroup.toString().toUpperCase()}</center></div></td>
                                                <td><div style={{ width: "auto", background: "gray" }} className="hint"><center>{e.email}</center></div></td>
                                                <td>
                                                    <div className='table-action-buttons'>
                                                        <Button
                                                            title="Delete"
                                                            onClick={() => {
                                                                setConfirmation({
                                                                    heading: "Delete User Account",
                                                                    content: <p>You are about to delete this user account! This action cannot be reverted. Are you sure you want to continue?</p>,
                                                                    cancel: () => { },
                                                                    confirm: () => {
                                                                        API.deleteModel({ model: "adminUser", id: e.id }).then((res) => {
                                                                            onUniversalChange();
                                                                        })
                                                                    },
                                                                })
                                                            }}
                                                        />
                                                        {e.is_active && <Button
                                                            title="Block"
                                                            onClick={() => {
                                                                setConfirmation({
                                                                    heading: "Deactivate Account",
                                                                    content: <p>You are about to Deactivate this user account! Are you sure you want to continue?</p>,
                                                                    cancel: () => { },
                                                                    confirm: () => {
                                                                        API.updateModel({ model: "adminUser", fields: { is_active: false }, id: e.id }).then((res) => {
                                                                            onUniversalChange();
                                                                        })
                                                                    },
                                                                })
                                                            }}
                                                        />}
                                                        {e.is_active && <Button
                                                            title="Send Invite"
                                                            onClick={() => {
                                                                setConfirmation({
                                                                    heading: "Re-send Invitation",
                                                                    content: <p>You are about to Deactivate this user account! Are you sure you want to continue?</p>,
                                                                    cancel: () => { },
                                                                    confirm: () => {
                                                                        const notify = async () => {
                                                                            handleAlert(`Invitation was successfully send to ${e.name}!`)
                                                                            onUniversalChange()
                                                                            const controller = new Integrations()
                                                                            const access_code = generateRandomHex(10)
                                                                            const password = generateRandomHex(5)

                                                                            const magicLink = await controller.createMagicLink({ email: e.email, password: access_code })
                                                                            controller.updateAccessKeys({
                                                                                userId: e.id,
                                                                                access_key: access_code
                                                                            })
                                                                            if (e.accessGroup === 'owner') {
                                                                                controller.sendSystemEmail({
                                                                                    email: e.email,
                                                                                    subject: `Press Zero Business Onboarding`,
                                                                                    message: `
                                                                                    <h4>Hello, ${e.name}</h4>
                                                                                    <p>This is an invitation for <strong>${indexedViewData.businessName || "Your Business"}</strong> to collaborate on Press Zero! Do follow the link below in order to access your account!</p>
                                                                                    `,
                                                                                    action: {
                                                                                        title: 'Login with Magic Link',
                                                                                        url: magicLink
                                                                                    }
                                                                                })
                                                                            } else if (e.accessGroup === 'agent') {
                                                                                controller.updateAdminPassword({
                                                                                    userId: e.id,
                                                                                    password: password
                                                                                }).then((res) => {
                                                                                    controller.sendSystemEmail({
                                                                                        email: e.email,
                                                                                        subject: `Invitation to Collaborate on Press Zero!`,
                                                                                        message: `
                                                                                        <h4>Hello, ${e.name}</h4>
                                                                                        <p>This is an invitation from <strong>${indexedViewData.businessName || "Your Business"}</strong> to collaborate on Press Zero! Do follow the link below in order to access your account!</p>
                                                            
                                                                                        <p>Please download the Press Zero app from App Store or Play Store, and use the following credentials to login!</p>
                                                                                        <br/>
                                                                                        <br/>
                                                                                        <p><strong>User Name:</strong><br/>${e.email}</p>
                                                                                        <p><strong>Password:</strong><br/>${password}</p>
                                                                                        `
                                                                                    })
                                                                                })
                                                                            } else {
                                                                                controller.sendSystemEmail({
                                                                                    email: e.email,
                                                                                    subject: `Invitation to Collaborate on Press Zero!`,
                                                                                    message: `
                                                                                    <h4>Hello, ${e.name}</h4>
                                                                                    <p>This is an invitation to collaborate on Press Zero! Do follow the link below in order to access your account!</p>
                                                                                    `,
                                                                                    action: {
                                                                                        title: 'Login with Magic Link',
                                                                                        url: magicLink
                                                                                    }
                                                                                })
                                                                            }
                                                                        }
                                                                        notify()
                                                                    },
                                                                })
                                                            }}
                                                        />}
                                                        {!e.is_active && <Button
                                                            title="Unblock"
                                                            onClick={() => {
                                                                setConfirmation({
                                                                    heading: "Activate Account",
                                                                    content: <p>You are about to activate this user account! Are you sure you want to continue?</p>,
                                                                    cancel: () => { },
                                                                    confirm: () => {
                                                                        API.updateModel({ model: "adminUser", fields: { is_active: true }, id: e.id }).then((res) => {
                                                                            onUniversalChange();
                                                                        })
                                                                    },
                                                                })
                                                            }}
                                                        />}
                                                    </div>
                                                </td>
                                            </tr>)}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </PageContainer>
            {preview && <CompanyProfileEditorPopup handleClose={hidePreview} popupType={preview.type} item={preview.item} />}
            {userPreview && <NewUserForm handleClose={hideUserPreview} popupType={userPreview.type} item={userPreview.item} />}
        </React.Fragment>
    )
}

export default CompanyUserView
