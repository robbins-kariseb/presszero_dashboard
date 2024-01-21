import React from 'react'
import WidgetFigure from './WidgetFigure'
import QuerySets from '../../../controllers/dashboard.controller';
import { timeseriesExtract } from '../../../utilities/helpers';

function WidgetSubscriptionMetrics({item, timeseriesIndex}) {
    const [API] = React.useState(new QuerySets())
    const [metrics, setMetrics] = React.useState({})
    const [metricsMonth, setMetricsMonth] = React.useState({})
    const [metricsDay, setMetricsDay] = React.useState({})

    React.useEffect(()=>{
        const init = async ()=>{
            try {
                const dataset = await API.getSubscriptions()

                const subscriptions = timeseriesExtract({dataset: {items: dataset.items.map((e)=>{
                    return {
                        ...e.company,
                        ...e.product,
                        ...e,
                    }
                })}, key: "items"})

                setMetrics({demo: subscriptions.items.filter((a)=>{
                    return a.name === "Demo";
                }).length,
                trial: subscriptions.items.filter((a)=>{
                    return a.name === "Trial";
                }).length,
                premium: subscriptions.items.filter((a)=>{
                    return a.name === "Premium";
                }).length,
                basic: subscriptions.items.filter((a)=>{
                    return a.name === "Basic";
                }).length,
                revenue: subscriptions.items.reduce((accumulator, currentItem) => {
                    return accumulator + currentItem.currentPrice;
                }, 0),
                demoWF: subscriptions.timeseriesMonth.filter((a)=>{
                    return a.name === "Demo";
                }).length,
                trialWF: subscriptions.timeseriesMonth.filter((a)=>{
                    return a.name === "Trial";
                }).length,
                premiumWF: subscriptions.timeseriesMonth.filter((a)=>{
                    return a.name === "Premium";
                }).length,
                basicWF: subscriptions.timeseriesMonth.filter((a)=>{
                    return a.name === "Basic";
                }).length,
                revenueWF: subscriptions.timeseriesMonth.reduce((accumulator, currentItem) => {
                    return accumulator + currentItem.currentPrice;
                }, 0)})



                // Daily timeseries
                setMetricsDay({demo: subscriptions.timeseriesDay.filter((a)=>{
                    return a.name === "Demo";
                }).length,
                trial: subscriptions.timeseriesDay.filter((a)=>{
                    return a.name === "Trial";
                }).length,
                premium: subscriptions.timeseriesDay.filter((a)=>{
                    return a.name === "Premium";
                }).length,
                basic: subscriptions.timeseriesDay.filter((a)=>{
                    return a.name === "Basic";
                }).length,
                revenue: subscriptions.timeseriesDay.reduce((accumulator, currentItem) => {
                    return accumulator + currentItem.currentPrice;
                }, 0)})


                // Monthly timeseries
                setMetricsMonth({demo: subscriptions.timeseriesMonth.filter((a)=>{
                    return a.name === "Demo";
                }).length,
                trial: subscriptions.timeseriesMonth.filter((a)=>{
                    return a.name === "Trial";
                }).length,
                premium: subscriptions.timeseriesMonth.filter((a)=>{
                    return a.name === "Premium";
                }).length,
                basic: subscriptions.timeseriesMonth.filter((a)=>{
                    return a.name === "Basic";
                }).length,
                revenue: subscriptions.timeseriesMonth.reduce((accumulator, currentItem) => {
                    return accumulator + currentItem.currentPrice;
                }, 0),
                demoWF: subscriptions.timeseriesDay.filter((a)=>{
                    return a.name === "Demo";
                }).length,
                trialWF: subscriptions.timeseriesDay.filter((a)=>{
                    return a.name === "Trial";
                }).length,
                premiumWF: subscriptions.timeseriesDay.filter((a)=>{
                    return a.name === "Premium";
                }).length,
                basicWF: subscriptions.timeseriesDay.filter((a)=>{
                    return a.name === "Basic";
                }).length,
                revenueWF: subscriptions.timeseriesDay.reduce((accumulator, currentItem) => {
                    return accumulator + currentItem.currentPrice;
                }, 0)})

            } catch (ex) {
                console.warn(ex)
            }
        }
        
        init();
    },[API])

    React.useEffect(()=>{},[metrics,metricsMonth,metricsDay])

    const indexedMetrics = timeseriesIndex === 0 ? metricsDay : timeseriesIndex === 1 ? metricsMonth : metrics;
    return (
        <div className='widget col-5x5'>
            <div className="col-1x5 menu-statistics">
                <div className='heading metric-heading'>
                    <h4 className='metric-numeric top'>{indexedMetrics.trail||0}</h4>
                    <WidgetFigure value={indexedMetrics.trialWF||0} />
                </div>
                <div className='heading metric-heading'>
                    <h4>Trial Subscription</h4>
                </div>
            </div>
            <div className="col-1x5 menu-statistics">
                <div className='heading metric-heading'>
                    <h4 className='metric-numeric top'>{indexedMetrics.basic||0}</h4>
                    <WidgetFigure value={indexedMetrics.basicWF||0} />
                </div>
                <div className='heading metric-heading'>
                    <h4>Basic Subscription</h4>
                </div>
            </div>
            <div className="col-1x5 menu-statistics">
                <div className='heading metric-heading'>
                    <h4 className='metric-numeric top'>{indexedMetrics.premium||0}</h4>
                    <WidgetFigure value={indexedMetrics.premiumWF||0} />
                </div>
                <div className='heading metric-heading'>
                    <h4>Premium Subscription</h4>
                </div>
            </div>
            <div className="col-1x5 menu-statistics">
                <div className='heading metric-heading'>
                    <h4 className='metric-numeric top'>{indexedMetrics.demo||0}</h4>
                    <WidgetFigure value={indexedMetrics.demoWF||0} />
                </div>
                <div className='heading metric-heading'>
                    <h4>Demo Requests</h4>
                </div>
            </div>
            <div className="col-1x5 menu-statistics">
                <div className='heading metric-heading'>
                    <h4 className='metric-numeric top'>{`$ ${indexedMetrics.revenue||0}`}</h4>
                    <WidgetFigure value={indexedMetrics.revenueWF||0} />
                </div>
                <div className='heading metric-heading'>
                    <h4>Monthly Revenue</h4>
                </div>
            </div>
        </div>
    )
}

export default WidgetSubscriptionMetrics


