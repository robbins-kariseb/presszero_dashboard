import React from 'react'
import WidgetFigure from './WidgetFigure'
import QuerySets from '../../../controllers/dashboard.controller';
import { timeseriesExtract } from '../../../utilities/helpers';

function WidgetPlatformMetrics({item, timeseriesIndex}) {
    const [API] = React.useState(new QuerySets())
    const [metrics, setMetrics] = React.useState({})
    const [metricsMonth, setMetricsMonth] = React.useState({})
    const [metricsDay, setMetricsDay] = React.useState({})

    React.useEffect(()=>{
        const init = async ()=>{
            try {
                const companies = timeseriesExtract({dataset: await API.getAllCompanies(), key: "items"})
                companies.items.forEach((e) => {
                    e.searchName = e.businessName;
                    e.searchCategory = e.categoryDefault;
                    e.searchImage = e.logoUrl;
                });

                const metrics = await API.getSubscriptions()

                const subscriptions = timeseriesExtract({dataset: {items: metrics.items.map((e)=>{
                    return {
                        ...e.company,
                        ...e.product,
                        ...e,
                    }
                })}, key: "items"})

                // All timeseries
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
                verified: companies.items.filter((a)=>{
                    return a.verified === true;
                }).length,
                unverified: companies.items.filter((a)=>{
                    return a.verified === false;
                }).length,
                unverifiedWF: companies.items.filter((a)=>{
                    return a.verified === false;
                }).length - companies.timeseriesMonth.filter((a)=>{
                    return a.verified === false;
                }).length,
                requested: companies.items.filter((a)=>{
                    return a.requested === false;
                }).length})



                // Daily timeseries
                setMetricsDay({verified: companies.timeseriesDay.filter((a)=>{
                    return a.verified === true;
                }).length,
                unverified: companies.timeseriesDay.filter((a)=>{
                    return a.verified === false;
                }).length,
                requested: companies.timeseriesDay.filter((a)=>{
                    return a.requested === false;
                }).length})


                // Monthly timeseries
                setMetricsMonth({verified: companies.timeseriesMonth.filter((a)=>{
                    return a.verified === true;
                }).length,
                unverified: companies.timeseriesMonth.filter((a)=>{
                    return a.verified === false;
                }).length,
                requested: companies.timeseriesMonth.filter((a)=>{
                    return a.requested === false;
                }).length})

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
                    <h4 className='metric-numeric top'>{indexedMetrics.verified||0}</h4>
                    <WidgetFigure value={indexedMetrics.verifiedWF||0} />
                </div>
                <div className='heading metric-heading'>
                    <h4>Active companies</h4>
                </div>
            </div>
            <div className="col-1x5 menu-statistics">
                <div className='heading metric-heading'>
                    <h4 className='metric-numeric top'>{indexedMetrics.trial||0}</h4>
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
                    <h4 className='metric-numeric top'>{indexedMetrics.unverified||0}</h4>
                    <WidgetFigure value={indexedMetrics.unverifiedWF||0} />
                </div>
                <div className='heading metric-heading'>
                    <h4>Activity by Company</h4>
                </div>
            </div>
            <div className="col-1x5 menu-statistics">
                <div className='heading metric-heading'>
                    <h4 className='metric-numeric top'>{indexedMetrics.requested||0}</h4>
                    <WidgetFigure value={indexedMetrics.requestedWF||0} />
                </div>
                <div className='heading metric-heading'>
                    <h4>Speed by Company</h4>
                </div>
            </div>
        </div>
    )
}

export default WidgetPlatformMetrics
