import React from 'react'
import WidgetFigure from './WidgetFigure'
import presszeroLogo from "../../../images/presszero.png"
import zendeskLogo from "../../../images/zendesk.png"
import outlookLogo from "../../../images/outlook.png"
import QuerySets from '../../../controllers/dashboard.controller'
import { timeseriesExtract } from '../../../utilities/helpers'
import CompanyReport from '../../../views/reports/CompanyReport'
import Integrations from '../../../controllers/integration.controller'

function WidgetCompanyMetrics({item, timeseriesIndex}) {
    const [API] = React.useState(new QuerySets())
    const [SYSTEMS] = React.useState(new Integrations())
    const [companyId] = React.useState(window.location.href.split("/")[4])
    const [data, setData] = React.useState([])
    const [metrics, setMetrics] = React.useState({})
    const [metricsMonth, setMetricsMonth] = React.useState({})
    const [metricsDay, setMetricsDay] = React.useState({})
    const [preview, setPreview] = React.useState(null)
    const [hasZendesk, setHasZendesk] = React.useState(null)

    const hidePreview = () => setPreview(null)

    React.useEffect(() => {
        const init = async () => {
            try {
                let _metricsAll = {
                    totalChats: 0,
                    openTickets: 0,
                    activeTickets: 0
                }

                let _metricsMonth = {
                    totalChats: 0,
                    openTickets: 0,
                    activeTickets: 0
                }

                let _metricsDay = {
                    totalChats: 0,
                    openTickets: 0,
                    activeTickets: 0
                }

                const tickets = timeseriesExtract({dataset:await API.getCompanyTickets({companyId: companyId}),key:"response"})
                const lst = await SYSTEMS.listZendeskIntegrations({ companyId: companyId })

                setHasZendesk(lst.items.length > 0)

                tickets.response.forEach(async (e) => {
                    const chats = await API.getChatMessages({userId: e.userId, companyId: e.companyId})
                    e.chats = chats.response

                    if (chats.response)
                        _metricsAll.totalChats += e.chats.length;
                });

                tickets.timeseriesMonth.forEach(async (e) => {
                    const chats = await API.getChatMessages({userId: e.userId, companyId: e.companyId})
                    e.chats = chats.response

                    if (chats.response)
                        _metricsMonth.totalChats += e.chats.length;
                });

                tickets.timeseriesDay.forEach(async (e) => {
                    const chats = await API.getChatMessages({userId: e.userId, companyId: e.companyId})
                    e.chats = chats.response

                    if (chats.response)
                        _metricsDay.totalChats += e.chats.length;
                });

                _metricsAll.activeTickets = tickets.response.filter((e)=>e.status === "new").length;
                _metricsAll.openTickets = tickets.response.filter((e)=>e.status === "open").length;

                _metricsDay.activeTickets = tickets.timeseriesDay.filter((e)=>e.status === "new").length;
                _metricsDay.openTickets = tickets.timeseriesDay.filter((e)=>e.status === "open").length;

                _metricsMonth.activeTickets = tickets.timeseriesMonth.filter((e)=>e.status === "new").length;
                _metricsMonth.openTickets = tickets.timeseriesMonth.filter((e)=>e.status === "open").length;

                setData(tickets.response)

                setMetrics(_metricsAll)
                setMetricsDay(_metricsDay)
                setMetricsMonth(_metricsMonth)
            } catch (error) {
                console.warn(error)
            }
        }
        init();
    }, [API,companyId]);

    React.useEffect(()=>{},[data,metrics,metricsMonth,metricsDay,timeseriesIndex,hasZendesk])

    const indexedMetrics = timeseriesIndex === 0 ? metricsDay : timeseriesIndex === 1 ? metricsMonth : metrics;
    
    return (
        <div className='widget col-5x5'>
            <div onClick={()=>setPreview({type:'total_messages', item: item})} className="col-1x5 menu-statistics">
                <div className='heading metric-heading'>
                    <h4 className='metric-numeric top'>{indexedMetrics.openTickets||0}</h4>
                    <WidgetFigure value={0} />
                </div>
                <div className='heading metric-heading'>
                    <h4>Open Tickets</h4>
                </div>
            </div>

            <div onClick={()=>setPreview({type:'total_messages', item: item})}  className="col-1x5 menu-statistics">
                <div className='heading metric-heading'>
                    <h4 className='metric-numeric top'>{indexedMetrics.totalChats||0}</h4>
                    <WidgetFigure value={0} />
                </div>
                <div className='heading metric-heading'>
                    <h4>Total Messages</h4>
                </div>
            </div>

            <div onClick={()=>setPreview({type:'total_messages', item: item})}  className="col-1x5 menu-statistics">
                <div className='heading metric-heading'>
                    <h4 className='metric-numeric top'>{indexedMetrics.activeTickets||0}</h4>
                    <WidgetFigure value={0} />
                </div>
                <div className='heading metric-heading'>
                    <h4>New Tickets</h4>
                </div>
            </div>

            <div onClick={()=>setPreview({type:'zendesk_integration', item: item})}  className="col-1x5 menu-statistics">
                <div className="logo-wrapper">
                    <img src={zendeskLogo} alt="zendesk" />
                </div>
                <div className='heading metric-heading'>
                    <div className={`hint ${hasZendesk ? '' : 'disabled'}`}><center>{`${hasZendesk ? 'ENABLED' : 'DISABLED'}`}</center></div>
                 </div>
            </div>

            <div onClick={()=>setPreview({type:'outlook_integration', item: item})}  className="col-1x5 menu-statistics">
                <div className="logo-wrapper">
                    <img src={outlookLogo} alt="zendesk" />
                </div>
                <div className='heading metric-heading'>
                    <div className="hint disabled"><center>DISABLED</center></div>
                </div>
            </div>

            <div onClick={()=>setPreview({type:'presszero_integration', item: item})}  className="col-1x5 menu-statistics">
                <div className="logo-wrapper">
                    <img src={presszeroLogo} alt="zendesk" />
                </div>
                <div className='heading metric-heading'>
                    <div className={`hint ${item.verified ? '' : 'disabled'}`}><center>{`${item.verified ? 'ENABLED' : 'DISABLED'}`}</center></div>
                </div>
            </div>

            {preview && <CompanyReport handleClose={hidePreview} popupType={preview.type} item={preview.item} />}
        </div>
    )
}

export default WidgetCompanyMetrics
