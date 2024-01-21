import React from 'react'
import QuerySets from '../../controllers/dashboard.controller';
import WidgetFigure from '../../components/metrics/widgets/WidgetFigure';
import Button from '../../components/Button';
import zendeskLogo from "../../images/zendesk.png";
import outlookLogo from "../../images/outlook.png";
import presszeroLogo from "../../images/logo.png";
import blurLoadingBackground from "../../images/blurred-loading-control.png"
import Integrations from '../../controllers/integration.controller';
import ZendeskIntegrationView from '../integrations/ZendeskIntegrationView';
import OutlookIntegrationView from '../integrations/OutlookIntegrationView';

const QAPI = new QuerySets();

const COMPANY_REPORTS = {
    "presszero_integration": {
        analytics: (item) => {
            return {}
        },
        name: "Press Zero Mobile"
    },
    "outlook_integration": {
        analytics: (item) => {
            return {}
        },
        name: "Outlook Integration"
    },
    "zendesk_integration": {
        analytics: (item) => {
            return {}
        },
        name: "Zendesk Integration"
    },
    "new_tickets": {
        analytics: (item) => {
            return {}
        },
        name: "Ticket Management Analytics"
    },
    "total_messages": {
        analytics: async (item) => {
            const chats = await QAPI.getCompanyChatMessages({ companyId: item.id })

            const positiveResponses = chats.response.filter((e) => e.sentimentScore >= 5 && e.createdBy === "user" && e.userName != undefined).sort((a, b) => (new Date(a.createdDate)) < (new Date(b.createdDate)));
            const negativeResponses = chats.response.filter((e) => e.sentimentScore < 5 && e.createdBy === "user" && e.userName != undefined).sort((a, b) => (new Date(a.createdDate)) < (new Date(b.createdDate)));

            const hashTable = { positive: {}, negative: {} }

            negativeResponses.forEach((e) => {
                if (hashTable.negative.hasOwnProperty(`user_${e.userId}`)) {
                    hashTable.negative[`user_${e.userId}`].count++;
                } else {
                    hashTable.negative[`user_${e.userId}`] = {}
                    hashTable.negative[`user_${e.userId}`].object = e;
                    hashTable.negative[`user_${e.userId}`].count = 1;
                }
            })
            positiveResponses.forEach((e) => {
                if (hashTable.hasOwnProperty(e.id)) {
                    hashTable.positive[`user_${e.userId}`].count++;
                } else {
                    hashTable.positive[`user_${e.userId}`] = {}
                    hashTable.positive[`user_${e.userId}`].object = e;
                    hashTable.positive[`user_${e.userId}`].count = 1;
                }
            })

            const topPositive = Object.keys(hashTable.positive).map(key => {
                const { object, count } = hashTable.positive[key];
                return { ...object, count };
            });
            const topNegative = Object.keys(hashTable.negative).map(key => {
                const { object, count } = hashTable.negative[key];
                return { ...object, count };
            });

            return {
                chats: chats.response,
                positiveFeedback: topPositive,
                negativeFeedback: topNegative,
            }
        },
        name: "Sentiment Analytics"
    },
    "open_tickets": {
        analytics: (item) => {
            return {}
        },
        name: "Service Delivery Analytics"
    },
}

function CompanyReport({ item, popupType, handleClose }) {
    const [API] = React.useState(new QuerySets())
    const [SYSTEMS] = React.useState(new Integrations())
    const [dataset, setDataset] = React.useState(null)
    const popupRef = React.useRef(null);
    const [integrationList, setIntegrationList] = React.useState([])
    const [processing, setProcessing] = React.useState(false)
    const [transform, setTransform] = React.useState("translateX(100%)")
    const [analysis, setAnalysis] = React.useState(null)
    const [isNewIntegration, setIsNewIntegration] = React.useState(false)
    const [zendeskDomain, setZendeskDomain] = React.useState(item.zendeskDomain)
    const [zendeskUser, setZendeskUser] = React.useState(item.zendeskUser)
    const [zendeskToken, setZendeskToken] = React.useState(item.zendeskToken)

    const handleZendeskIntegration = () => {
        let invalid = false;

        integrationList.forEach((e) => {
            if (zendeskDomain === e.domain && !invalid) {
                alert(`You have already registered an integration with '${e.domain}'`)
                invalid = true;
                return;
            }
        })

        if (invalid) return;

        setProcessing(true);

        SYSTEMS.zendeskTest({
            companyId: item.id,
            token: zendeskToken,
            username: zendeskUser + "/token",
            domain: zendeskDomain
        }).then((res) => {
            if (res.response === "successful") {
                setTimeout(async () => {
                    setProcessing(false);
                    setIsNewIntegration(false);

                    const lst = await SYSTEMS.listZendeskIntegrations({ companyId: item.id })
                    setIntegrationList(lst.items)
                }, 5000);
            } else {
                setProcessing(false);
            }
        });

    }


    React.useEffect(() => {
        if (popupType === "total_messages" && dataset && dataset.chats) {
            console.log(dataset)
            let tempAnalysis = {
                positive: dataset.positiveFeedback.length,
                negative: dataset.negativeFeedback.length,
                sentimentScore: 0,
                positiveFeedback: dataset.positiveFeedback,
                negativeFeedback: dataset.negativeFeedback,
            }

            tempAnalysis.sentimentScore = Math.floor(Math.abs((tempAnalysis.positive / (tempAnalysis.positive + tempAnalysis.negative)) * 100))

            setAnalysis(tempAnalysis)
        }
    }, [dataset])

    React.useEffect(() => {
        const init = async () => {
            try {
                setDataset(await COMPANY_REPORTS[popupType].analytics(item))

                const lst = await SYSTEMS.listZendeskIntegrations({ companyId: item.id })

                setIntegrationList(lst.items)
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
                        <span class="material-symbols-outlined">close</span>
                    </div>
                    <div className='block'>
                        <h4>{COMPANY_REPORTS[popupType].name}</h4>
                        <p>Reports</p>
                    </div>
                </div>
            </div>
            <div style={{ maxHeight: "65vh" }} className="scrollable chat-view">
                <div className="scrollable popup-scrollview">
                    <div className='col-2x2 flex'>
                        <div style={{ width: "92%" }} className='form-classic col-1x2'>
                            {popupType === "total_messages" && <div className='form-classic'>
                                <div className='heading'>
                                    <div className='col-4x4 flex'>
                                        <div style={{ width: "80%" }} className='col-1x4'>
                                            <h4>Sentiment Analysis Report</h4>
                                        </div>
                                    </div>
                                </div>
                                <div className='widget col-3x3'>
                                    <div className="col-1x5 menu-statistics">
                                        <div className='heading metric-heading'>
                                            <h4 className='metric-numeric top'>{analysis ? analysis.positive || 0 : 0}</h4>
                                            <WidgetFigure value={analysis ? (analysis.positive - analysis.negative) || 0 : 0} />
                                        </div>
                                        <div className='heading metric-heading'>
                                            <h4>Positive Sentiments</h4>
                                        </div>
                                    </div>
                                    <div className="col-1x5 menu-statistics">
                                        <div className='heading metric-heading'>
                                            <h4 className='metric-numeric top'>{analysis ? analysis.negative || 0 : 0}</h4>
                                            <WidgetFigure value={analysis ? (analysis.negative - analysis.positive) || 0 : 0} />
                                        </div>
                                        <div className='heading metric-heading'>
                                            <h4>Negative Sentiments</h4>
                                        </div>
                                    </div>
                                    <div className="col-1x5 menu-statistics">
                                        <div className='heading metric-heading'>
                                            <h4 className='metric-numeric top'>{analysis ? analysis.sentimentScore || 0 : 0}%</h4>
                                            <WidgetFigure value={0} />
                                        </div>
                                        <div className='heading metric-heading'>
                                            <h4>Satisfaction Score</h4>
                                        </div>
                                    </div>
                                </div>

                                <div className='widget col-2x2'>
                                    <div className='col-1x2'>
                                        <div style={{ width: "80%" }} className='col-1x4'>
                                            <h4>Positive Sentiments</h4>
                                        </div>

                                        <table className="classic-table">
                                            <thead>
                                                <tr>
                                                    <td style={{ width: 150 }}><div title="Number of positive messages received from the user." className="hint"><center>@Frequency</center></div></td>
                                                    <td>User Name</td>
                                                    <td>Last Contacted</td>
                                                    <td>Status</td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {dataset && dataset.positiveFeedback && dataset.positiveFeedback.length > 0 &&
                                                    dataset.positiveFeedback.sort((a, b) => b.count - a.count).slice(0, 10).map((e, idx) => <tr key={idx}>
                                                        <td><div className='numeric-graphic good'>{e.count}</div></td>
                                                        <td style={{ width: 150 }}>{e.userName || "System User"}</td>
                                                        <td>{e.createdDate}</td>
                                                        <td><div style={{ width: 100 }} className="hint"><center>{e.status}</center></div></td>
                                                    </tr>)
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className='col-1x2'>
                                        <div style={{ width: "80%" }} className='col-1x4'>
                                            <h4>Negative Sentiments</h4>
                                        </div>

                                        <table className="classic-table">
                                            <thead>
                                                <tr>
                                                    <td style={{ width: 150 }}><div title="Number of negative messages received from the user." className="hint"><center>@Frequency</center></div></td>
                                                    <td>User Name</td>
                                                    <td>Last Contacted</td>
                                                    <td>Status</td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {dataset && dataset.negativeFeedback && dataset.negativeFeedback.length > 0 &&
                                                    dataset.negativeFeedback.sort((a, b) => b.count - a.count).slice(0, 10).map((e, idx) => <tr key={idx}>
                                                        <td><div className='numeric-graphic bad'>{e.count}</div></td>
                                                        <td style={{ width: 150 }}>{e.userName || "System User"}</td>
                                                        <td>{e.createdDate}</td>
                                                        <td><div style={{ width: 100 }} className="hint"><center>{e.status}</center></div></td>
                                                    </tr>)
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>}
                            {popupType === "zendesk_integration" && <div className='form-classic integration-controls'>
                                {isNewIntegration && <ZendeskIntegrationView
                                    processing={processing}
                                    handleIntegration={handleZendeskIntegration}
                                    setZendeskDomain={setZendeskDomain}
                                    setZendeskUser={setZendeskUser}
                                    setZendeskToken={setZendeskToken}
                                    zendeskDomain={zendeskDomain}
                                    zendeskUser={zendeskUser}
                                    zendeskToken={zendeskToken}
                                />}
                                {!isNewIntegration && <div className='widget col-3x3'>
                                    {integrationList.map((e, idx) => <div class="col-1x3 integration-item">
                                        <div class="logo-wrapper">
                                            <img src={zendeskLogo} alt="zendesk" />
                                        </div>
                                        <div class="heading metric-heading">
                                            <div className='heading'>
                                                <h4>Queries: {e.queryCount}</h4>
                                                <h4>Last Sync: {e.lastSyncDate}</h4>
                                            </div>
                                            <div class="hint"><center>{(e.companyData.businessName||"System").split(" ")[0]}/{e.domain}</center></div>
                                        </div>
                                    </div>)}
                                    <div onClick={()=>setIsNewIntegration(true)} class="col-1x3 integration-item">
                                        <div class="logo-wrapper">
                                            <img src={"https://as1.ftcdn.net/jpg/01/09/34/96/220_F_109349657_6BLNYxVVSBLQxwXjJ9n05OAuHVOZk8lh.jpg"} alt="zendesk" />
                                        </div>
                                        <div class="heading-wrapper">
                                            <h4>New Integration</h4>
                                        </div>
                                    </div>
                                </div>}
                            </div>}
                            {popupType === "outlook_integration"  && <div className='form-classic integration-controls'>
                                {isNewIntegration && <OutlookIntegrationView
                                    processing={processing}
                                    handleIntegration={handleZendeskIntegration}
                                    setZendeskDomain={setZendeskDomain}
                                    setZendeskUser={setZendeskUser}
                                    setZendeskToken={setZendeskToken}
                                    zendeskDomain={zendeskDomain}
                                    zendeskUser={zendeskUser}
                                    zendeskToken={zendeskToken}
                                />}
                                {!isNewIntegration && <div className='widget col-3x3'>
                                    {integrationList.map((e, idx) => <div class="col-1x3 integration-item">
                                        <div class="logo-wrapper">
                                            <img src={outlookLogo} alt="zendesk" />
                                        </div>
                                        <div class="heading metric-heading">
                                            <div className='heading'>
                                                <h4>Queries: {e.queryCount}</h4>
                                                <h4>Last Sync: {e.lastSyncDate}</h4>
                                            </div>
                                            <div class="hint"><center>{(e.companyData.businessName||"System").split(" ")[0]}/{e.domain}</center></div>
                                        </div>
                                    </div>)}
                                    <div onClick={()=>setIsNewIntegration(true)} class="col-1x3 integration-item">
                                        <div class="logo-wrapper">
                                            <img src={"https://as1.ftcdn.net/jpg/01/09/34/96/220_F_109349657_6BLNYxVVSBLQxwXjJ9n05OAuHVOZk8lh.jpg"} alt="zendesk" />
                                        </div>
                                        <div class="heading-wrapper">
                                            <h4>New Integration</h4>
                                        </div>
                                    </div>
                                </div>}
                            </div>}
                            {popupType === "presszero_integration"  && <div className='form-classic integration-controls'>
                                <div className='widget col-3x3'>
                                    <div class="col-1x3 integration-item">
                                        <div class="logo-wrapper">
                                            <img src={presszeroLogo} alt="zendesk" />
                                        </div>
                                        <div class="heading metric-heading">
                                            <div className='heading'>
                                                <h4>Queries: {"100"}</h4>
                                                <h4>Last Sync: {(new Date()).toTimeString()}</h4>
                                            </div>
                                            <div class="hint"><center>{(item.businessName||"System").split(" ")[0]}/{item.categoryDefault}</center></div>
                                        </div>
                                    </div>
                                </div>
                            </div>}
                        </div>
                        <div style={{ display: 'none' }} className="pre-loaders">
                            <img src={zendeskLogo} alt="preloader" />
                            <img src={outlookLogo} alt="preloader" />
                            <img src={blurLoadingBackground} alt="preloader" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CompanyReport