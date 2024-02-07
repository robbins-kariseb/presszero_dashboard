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
    const [hasOutlook, setHasOutlook] = React.useState(null)

    const hidePreview = () => setPreview(null)

    React.useEffect(() => {
        const init = async () => {
            try {
                let _metricsAll = {
                    totalChats: 0,
                    totalChatsWF: 0,
                    openTickets: 0,
                    openTicketsWF: 0,
                    activeTicketsWF: 0,
                    activeTickets: 0
                }

                let _metricsMonth = {
                    totalChats: 0,
                    totalChatsWF: 0,
                    openTickets: 0,
                    openTicketsWF: 0,
                    activeTickets: 0,
                    activeTicketsWF: 0,
                }

                let _metricsDay = {
                    totalChats: 0,
                    totalChatsWF: 0,
                    openTickets: 0,
                    openTicketsWF: 0,
                    activeTickets: 0,
                    activeTicketsWF: 0
                }

                let metricList = []
                const tickets = await API.getCompanyTicketsAndChats({companyId: companyId})

                tickets.items.forEach((e)=>{
                    const chatCount = e.chats.length;
                    e.chats.forEach((m)=>{
                        metricList.push({
                            ...e,
                            ...m
                        })
                    })
                })

                const timeseries = timeseriesExtract({dataset:{"items": metricList},key:"items"})
                const timeseriesTickets = timeseriesExtract({dataset:tickets, key:"items"})
                const lst = await SYSTEMS.listZendeskIntegrations({ companyId: companyId })
                const out = await SYSTEMS.listOutlookIntegrations({ companyId: companyId });
                
                console.log(timeseries)

                setHasZendesk(lst.items.length > 0)
                setHasOutlook(out.response.length > 0)

                _metricsAll.totalChats = timeseries.items.length;
                _metricsMonth.totalChats = timeseries.timeseriesMonth.length;
                _metricsDay.totalChats = timeseries.timeseriesDay.length;

                _metricsAll.activeTickets = timeseriesTickets.items.filter((e)=>e.status === "new").length;
                _metricsAll.openTickets = timeseriesTickets.items.filter((e)=>e.status === "open").length;

                _metricsDay.activeTickets = timeseriesTickets.timeseriesDay.filter((e)=>e.status === "new").length;
                _metricsDay.openTickets = timeseriesTickets.timeseriesDay.filter((e)=>e.status === "open").length;

                _metricsMonth.activeTickets = timeseriesTickets.timeseriesMonth.filter((e)=>e.status === "new").length;
                _metricsMonth.openTickets = timeseriesTickets.timeseriesMonth.filter((e)=>e.status === "open").length;

                
                _metricsAll.activeTicketsWF = _metricsAll.activeTickets - _metricsMonth.activeTickets;
                _metricsAll.openTicketsWF = _metricsAll.openTickets - _metricsMonth.openTickets;
                _metricsAll.totalChatsWF = _metricsAll.totalChats - _metricsMonth.totalChats;

                _metricsDay.activeTicketsWF = _metricsDay.activeTickets;
                _metricsDay.openTicketsWF = _metricsDay.openTickets;
                _metricsDay.totalChatsWF = _metricsDay.totalChats;

                _metricsMonth.activeTicketsWF = _metricsMonth.activeTickets - _metricsDay.activeTickets;
                _metricsMonth.openTicketsWF = _metricsMonth.openTickets - _metricsDay.openTickets;
                _metricsMonth.totalChatsWF = _metricsMonth.totalChats - _metricsDay.totalChats;

                setData(tickets.items)

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
                    <WidgetFigure value={indexedMetrics.openTicketsWF||0} />
                </div>
                <div className='heading metric-heading'>
                    <h4>Open Tickets</h4>
                </div>
            </div>

            <div onClick={()=>setPreview({type:'total_messages', item: item})}  className="col-1x5 menu-statistics">
                <div className='heading metric-heading'>
                    <h4 className='metric-numeric top'>{indexedMetrics.totalChats||0}</h4>
                    <WidgetFigure value={indexedMetrics.totalChatsWF||0} />
                </div>
                <div className='heading metric-heading'>
                    <h4>Total Messages</h4>
                </div>
            </div>

            <div onClick={()=>setPreview({type:'total_messages', item: item})}  className="col-1x5 menu-statistics">
                <div className='heading metric-heading'>
                    <h4 className='metric-numeric top'>{indexedMetrics.activeTickets||0}</h4>
                    <WidgetFigure value={indexedMetrics.activeTicketsWF||0} />
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
                <div className={`hint ${hasOutlook ? '' : 'disabled'}`}><center>{`${hasOutlook ? 'ENABLED' : 'DISABLED'}`}</center></div>
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
