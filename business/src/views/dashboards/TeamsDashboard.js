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
import SuccessIcon from "../../images/success-icon.png"
import WarningIcon from "../../images/warning-icon.png"
import { generateRandomHex } from '../../utilities/helpers';
import Integrations from '../../controllers/integration.controller';


const TeamsDashboard = () => {
    const { universalChangeCounter, onUniversalChange, userData, setConfirmation, handleAlert, handleWarning } = React.useContext(AppContext)
    const [isLoading, setIsLoading] = React.useState(true)
    const [USERS] = React.useState(new Users())
    const [API] = React.useState(new QuerySets())
    const [selection, setSelection] = React.useState([])
    const [activeUserList, setActiveUserList] = React.useState([])
    const [preview, setPreview] = React.useState(null)
    const [menuTab, setMenuTab] = React.useState(0)
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [checkAll, setCheckAll] = React.useState(false);
    const [invitationEmail, setInvitationEmail] = React.useState(false);
    const [companyId] = React.useState(userData ? userData.userData.companyId : null)

    const hidePreview = () => setPreview(null)

    const handleBulkSelection = (event) => {
        if (!checkAll) {
            setSelection(activeUserList)

            activeUserList.forEach((item) => {
                item.checked = true;
            })
            setCheckAll(true)
        } else {
            setSelection([])

            activeUserList.forEach((item) => {
                item.checked = false;
            })
            setCheckAll(false)
        }
    }

    const handleSelectionToggle = (event, item) => {
        let list = [];
        let selected = false;

        selection.forEach((e) => {
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
        setSelection(list)
    }

    React.useEffect(() => {
        const init = async () => {
            const users = await USERS.listCompanyUsers({ companyId: companyId })
            try {
                setActiveUserList(users.items)
            } catch (ex) {
                console.warn(ex)
            }
        }

        init();
    }, [API, universalChangeCounter])

    React.useEffect(() => {
        setIsLoading(activeUserList.length === 0)
        if (!isLoaded) {
            setIsLoaded(!(activeUserList.length === 0));
        }
    }, [activeUserList, universalChangeCounter])

    return (
        <React.Fragment>
            {isLoading && !isLoaded && <LoadingOverlay />}
            <TopMenuBar setTab={setMenuTab} />

            <PageContainer
                pageTitle={'Team'}
                pageSubtitle={""}
                searchSpace={[]}
                addons={<div className='col-1x3 tab-wrapper time-series-tabs float-right'>
                    <Button
                        special={"special"}
                        title="Invite Users"
                        onClick={() => {
                            setConfirmation({
                                heading: ``,
                                content: <div className='mini-form'>
                                    <div className='mini-form-banner full-width'>
                                        <img src={TeamBanner} alt='PZ Teams Banner' />
                                    </div>
                                    <div className='heading'>
                                        <h4>Invite your team</h4>
                                        <p>You’ve created a new project! Invite colleagues to collaborate on this project.</p>
                                    </div>
                                    <div className='form'>
                                        <div className='form-control'>
                                            <label>Enter email</label>
                                            <input onChange={(event)=>setInvitationEmail(event.target.value)} type={"email"} />
                                        </div>
                                    </div>
                                </div>,
                                cancel: () => { },
                                confirm: () => { 
                                    const access_code = generateRandomHex(10)
                                    const controller = new Users()

                                    controller.createAdminUser({
                                        companyId: companyId,
                                        accessGroup: "admin",
                                        name: "Anonymous",
                                        surname: "User",
                                        email: invitationEmail,
                                        dob: "1994-01-01",
                                        gender: "male",
                                        password: access_code,
                                        image: null,
                                        phoneNumber: null,
                                        country: "UK",
                                        timezone: "SAST",
                                        delta: "2:00",
                                    })
                                    onUniversalChange()
                                },
                            })
                        }}
                    />
                    {selection.length > 0 && <React.Fragment>
                        <Button
                            special={"dropdown"}
                            title={<React.Fragment><span className="material-symbols-outlined">expand_more</span> <span className='text'>Actions</span></React.Fragment>}
                            onClick={() => { }}
                            popup={[
                                {
                                    name: "Send Again",
                                    onClick: () => {
                                        setConfirmation({
                                            heading: ``,
                                            content: <div className='mini-form'>
                                                <div style={{ width: "50%", margin: "auto" }} className='mini-form-banner full-width'>
                                                    <img style={{ width: "35%" }} src={WarningIcon} alt='PZ Teams Banner' />
                                                </div>
                                                <div className='heading'>
                                                    <h4>Are you sure?</h4>
                                                    <p>You are about to Re-send invitations to the following user(s):</p>
                                                    {selection.map((e) => <strong>{e.email}</strong>)}
                                                </div>
                                            </div>,
                                            cancel: () => { },
                                            confirm: () => {
                                                const controller = new Integrations()
                                                const access_code = generateRandomHex(10)

                                                selection.forEach(async (user) => {
                                                    const magicLink = await controller.createMagicLink({ email: user.email, password: access_code })
                                                    controller.updateAccessKeys({
                                                        userId: user.id,
                                                        access_key: access_code
                                                    })
                                                    controller.sendSystemEmail({
                                                        email: user.email,
                                                        subject: `Invitation to Collaborate on Press Zero!`,
                                                        message: `
                                                        <h4>Hello, ${user.name}</h4>
                                                        <p>This is an invitation to collaborate on Press Zero! Do follow the link below in order to access your account!</p>
                                                        <p><a href='${magicLink}'><strong>Click Here</strong></a> in order to access your account!</p>
                                                        `
                                                    })
                                                })
                                                onUniversalChange()
                                            },
                                        })
                                    },
                                }, {
                                    name: "Revoke Invite",
                                    onClick: () => {
                                        setConfirmation({
                                            heading: ``,
                                            content: <div className='mini-form'>
                                                <div style={{ width: "50%", margin: "auto" }} className='mini-form-banner full-width'>
                                                    <img style={{ width: "35%" }} src={WarningIcon} alt='PZ Teams Banner' />
                                                </div>
                                                <div className='heading'>
                                                    <h4>Are you sure?</h4>
                                                    <p>You are about to Revoke the invitation for the following user(s):</p>
                                                    {(selection || []).map((e) => <strong>{e.email}</strong>)}
                                                </div>
                                            </div>,
                                            cancel: () => { },
                                            confirm: () => {
                                                onUniversalChange()
                                             },
                                        })
                                    },
                                }, {
                                    name: "Remove",
                                    onClick: () => {
                                        setConfirmation({
                                            heading: ``,
                                            content: <div className='mini-form'>
                                                <div style={{ width: "50%", margin: "auto" }} className='mini-form-banner full-width'>
                                                    <img style={{ width: "35%" }} src={WarningIcon} alt='PZ Teams Banner' />
                                                </div>
                                                <div className='heading'>
                                                    <h4>Are you sure?</h4>
                                                    <p>Do you really want to remove these members? This process cannot be undone</p>
                                                </div>
                                            </div>,
                                            cancel: () => { },
                                            confirm: () => {
                                                const controller = new Users()
                                                selection.forEach((user) => {
                                                    controller.deleteAdminUser({ id: user.id })
                                                })
                                                onUniversalChange()
                                            },
                                        })
                                    },
                                }
                            ]}
                        />
                        <Button
                            special={"info"}
                            title={<React.Fragment>Selected <small>{selection.length}</small></React.Fragment>}
                        />
                    </React.Fragment>}
                </div>}
            >
                <div className='col-4x4'>
                    <div style={{ height: "60vh", maxHeight: "60vh" }} className="scrollable full-width">
                        <table className='business-themed-table'>
                            <thead>
                                <tr>
                                    <td style={{ width: 30 }}><input checked={checkAll} onChange={(event) => handleBulkSelection(event)} type='checkbox' /></td>
                                    <td>Name</td>
                                    <td>Email</td>
                                    <td>Status</td>
                                    <td>Actions</td>
                                </tr>
                            </thead>
                            <tbody>
                                {activeUserList.map((e, idx) => <tr key={idx}>
                                    <td><input checked={e.checked || false} onChange={(event) => handleSelectionToggle(event, e)} type='checkbox' /></td>
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
                                            title={<span className="material-symbols-outlined">more_vert</span>}
                                            popup={[
                                                {
                                                    name: "Send Again",
                                                    onClick: () => {
                                                        setConfirmation({
                                                            heading: ``,
                                                            content: <div className='mini-form'>
                                                                <div style={{ width: "50%", margin: "auto" }} className='mini-form-banner full-width'>
                                                                    <img style={{ width: "35%" }} src={WarningIcon} alt='PZ Teams Banner' />
                                                                </div>
                                                                <div className='heading'>
                                                                    <h4>Are you sure?</h4>
                                                                    <p>You are about to Re-send invitations to the following user(s):</p>
                                                                    <strong>{e.email}</strong>
                                                                </div>
                                                            </div>,
                                                            cancel: () => { },
                                                            confirm: async () => {
                                                                const controller = new Integrations()
                                                                const access_code = generateRandomHex(10)

                                                                const magicLink = await controller.createMagicLink({ email: e.email, password: access_code })
                                                                controller.updateAccessKeys({
                                                                    userId: e.id,
                                                                    access_key: access_code
                                                                })
                                                                controller.sendSystemEmail({
                                                                    email: e.email,
                                                                    subject: `Invitation to Collaborate on Press Zero!`,
                                                                    message: `
                                                                        <h4>Hello, ${e.name}</h4>
                                                                        <p>This is an invitation to collaborate on Press Zero! Do follow the link below in order to access your account!</p>
                                                                        <p><a href='${magicLink}'><strong>Click Here</strong></a> in order to access your account!</p>
                                                                        `
                                                                })
                                                                onUniversalChange()
                                                            },
                                                        })
                                                    },
                                                }, {
                                                    name: "Revoke Invite",
                                                    onClick: () => {
                                                        setConfirmation({
                                                            heading: ``,
                                                            content: <div className='mini-form'>
                                                                <div style={{ width: "50%", margin: "auto" }} className='mini-form-banner full-width'>
                                                                    <img style={{ width: "35%" }} src={WarningIcon} alt='PZ Teams Banner' />
                                                                </div>
                                                                <div className='heading'>
                                                                    <h4>Are you sure?</h4>
                                                                    <p>You are about to Revoke the invitation for the following user(s):</p>
                                                                    <strong>{e.email}</strong>
                                                                </div>
                                                            </div>,
                                                            cancel: () => { },
                                                            confirm: () => { },
                                                        })
                                                    },
                                                }, {
                                                    name: "Remove",
                                                    onClick: () => {
                                                        setConfirmation({
                                                            heading: ``,
                                                            content: <div className='mini-form'>
                                                                <div style={{ width: "50%", margin: "auto" }} className='mini-form-banner full-width'>
                                                                    <img style={{ width: "35%" }} src={WarningIcon} alt='PZ Teams Banner' />
                                                                </div>
                                                                <div className='heading'>
                                                                    <h4>Are you sure?</h4>
                                                                    <p>Do you really want to remove these members? This process cannot be undone</p>
                                                                </div>
                                                            </div>,
                                                            cancel: () => { },
                                                            confirm: () => {
                                                                API.deleteModel({ model: "adminUser", id: e.id }).then((res) => {
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