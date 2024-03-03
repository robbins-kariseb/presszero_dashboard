import React from 'react';
import PageContainer from '../../components/generic/PageContainer';
import QuerySets from '../../controllers/dashboard.controller';
import LoadingOverlay from '../../components/overlays/LoadingOverlay';
import TopMenuBar from '../../components/generic/TopMenuBar';
import WidgetPlatformMetrics from '../../components/metrics/widgets/WidgetPlatformMetrics';

import CompanyGridView from '../../components/generic/CompanyGridView';
import SearchBar from '../../components/generic/SearchBar';
import Button from '../../components/Button';
import Tab from '../../components/Tab';
import ListView from '../../components/generic/ListView';
import NewCompanyForm from '.././forms/NewCompanyForm';
import { AppContext } from '../../context/AppProvider';


const UsersDashboard = () => {
    const { universalChangeCounter, applicationTabs, companyList } = React.useContext(AppContext)
    const [isLoading, setIsLoading] = React.useState(true)
    const [API] = React.useState(new QuerySets())
    const [unfilteredData, setUnfilteredData] = React.useState([])
    const [data, setData] = React.useState([])
    const [chatData, setChatData] = React.useState([])
    const [businesses, setBusinesses] = React.useState([])
    const [activeUserList, setActiveUserList] = React.useState([])
    const [preview, setPreview] = React.useState(null)
    const [searchPhrase, setSearchPhrase] = React.useState("")
    const [tab, setTab] = React.useState(0)
    const [menuTab, setMenuTab] = React.useState(0)
    const [timeSeriesTab, setTimeSeriesTab] = React.useState(0)
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [tabMetrics, setTabMetrics] = React.useState({});

    const hidePreview = () => setPreview(null)

    let searchResults = searchPhrase.length < 2 ? [] : data.filter((e) => {
        const keywords = searchPhrase.split(' ');
        const itemText = `${e.searchName} ${e.searchCategory}`.toLowerCase();

        return keywords.every((word) => itemText.includes(word.toLowerCase()));
    });

    if (searchResults.length === 0) searchResults = data;

    React.useEffect(() => {
        const init = async () => {
            const dataset = await API.getCompanyStatistics()
            const users = await API.getActiveUsers()

            try {
                setBusinesses(dataset.items.sort((a, b) => {
                    return a.totalChats - b.totalChats
                }).slice().reverse().slice(0, 3));

                setActiveUserList(users.items)

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
    }, [API, universalChangeCounter])

    React.useEffect(() => {
        if (tab === 0) {
            const dataset = unfilteredData.filter((a) => {
                return a.verified === true;
            })

            setData(dataset)
        } else if (tab === 1) {
            const dataset = unfilteredData.filter((a) => {
                return a.verified === false;
            })

            setData(dataset)
        } else if (tab === 2) {
            const dataset = unfilteredData.filter((a) => {
                return a.unsubscribed === true;
            })

            setData(dataset)
        }
    }, [tab, universalChangeCounter])

    React.useEffect(() => { }, [businesses])

    React.useEffect(() => {
        companyList.forEach((e) => {
            e.searchName = e.businessName;
            e.searchCategory = e.categoryDefault;
            e.searchImage = e.logoUrl;
        });

        console.log(companyList)

        setUnfilteredData(companyList)
        setData(companyList.filter((a) => {
            return a.verified === true;
        }))

        setTabMetrics({
            verified: companyList.filter((a) => {
                return a.verified === true;
            }).length,
            unverified: companyList.filter((a) => {
                return a.verified === false;
            }).length,
            requested: companyList.filter((a) => {
                return a.requested === false;
            }).length
        })
    }, [companyList])

    React.useEffect(() => {
        setIsLoading(companyList.length === 0)
        if (!isLoaded) {
            setIsLoaded(!(companyList.length === 0));
        }
    }, [data, chatData, businesses, universalChangeCounter])

    return (
        <React.Fragment>
            {isLoading && !isLoaded && <LoadingOverlay />}
            <TopMenuBar setTab={setMenuTab} />

            <PageContainer
                pageTitle={'System User Main KPIs'}
                pageSubtitle={<div className='col-1x3 tab-wrapper time-series-tabs'>
                    <Tab
                        initialIndex={applicationTabs}
                        tabs={[
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
                searchSpace={data}
                addons={<WidgetPlatformMetrics timeseriesIndex={timeSeriesTab} metrics={tabMetrics} />}
            >
                <div className='col-4x4'>
                    <div className='widget-container db-v-2 col-3x4'>
                        <div className='tool-bar col-3x3'>
                            <div className='col-1x3 widget-tabs'>
                                <div className='flex widget-menu'>
                                    <div className='heading' style={{ width: 100, position: "relative", top: 20 }}>
                                        <h4>Companies</h4>
                                    </div>
                                    <Tab
                                        setTab={setTab}
                                        tabs={[
                                            {
                                                title: `Verified (${tabMetrics.verified || 0})`,
                                                onClick: () => { }
                                            }, {
                                                title: `Unsubscribed (${tabMetrics.unverified || 0})`,
                                                onClick: () => { }
                                            }, {
                                                title: `Requested (${tabMetrics.requested || 0})`,
                                                onClick: () => { }
                                            },]}
                                    />
                                </div>
                            </div>
                            <div className='col-1x3 widget-search'>
                                <SearchBar placeholder={"Search for Companies here..."} searchPhrase={searchPhrase} onChange={setSearchPhrase} />
                            </div>
                            <div className='col-1x3 widget-actions'>
                                <Button onClick={() => setPreview({ item: {}, type: "new" })} additionalClasses={'special'} title={`Add Company`} />
                            </div>
                        </div>
                        {searchResults.sort((a, b) => (a.verified ? 1 : 0) - (b.verified ? 1 : 0)).reverse().map((e, idx) => {
                            return <CompanyGridView pageBreak={`${(idx + 1) % 3 === 2 ? 'last-in-row' : ''}`} item={e} key={idx} />
                        })}
                    </div>
                    <div className='widget-container db-v-2 col-1x4'>
                        <div className='tool-bar col-3x3'>
                            <div className='col-1x3' style={{ width: "100%" }}>
                                <div className='flex'>
                                    <div className='heading' style={{ paddingTop: 20 }}>
                                        <h4>Active Users</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {activeUserList.map((e, idx) => <ListView key={idx} item={{ title: `${e.name} ${e.surname}`, logoUrl: e.imageUrl, subtitle: e.businessName }} />)}
                    </div>
                </div>
            </PageContainer>
            {preview && <NewCompanyForm handleClose={hidePreview} popupType={preview.type} item={preview.item} />}
        </React.Fragment>
    )
}

export default UsersDashboard