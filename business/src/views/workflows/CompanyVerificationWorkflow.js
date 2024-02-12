import React from 'react'
import QuerySets from '../../controllers/dashboard.controller'
import Button from '../../components/Button'
import Subscriptions from '../../controllers/subscription.controller'
import { AppContext } from '../../context/AppProvider'

function CompanyVerificationWorkflow({ item }) {
    const {onUniversalChange} = React.useContext(AppContext)
    const [API] = React.useState(new QuerySets())
    const [SUBS] = React.useState(new Subscriptions())
    const [subscriptions, setSubscriptions] = React.useState([])
    const [selection, setSelection] = React.useState(0)


    const handleSubscriptionChange = (idx) => {
        console.log(subscriptions[idx])
        SUBS.manageSubscriptions({
            productId: subscriptions[idx].id,
            companyId: item.id,
        }).then((res)=>{
            console.log(res)
            if (res && res.items && res.items.company) {
                setSelection(idx)
                onUniversalChange()
            }
        })
    }

    React.useEffect(() => {
        const init = async () => {
            const subs = await API.getSubscriptionProducts()

            setSubscriptions(subs.items)
        }
        init();
    }, [])

    return (
        <React.Fragment>
            <p className='info-message'>
                Please select one of the following subscription models in order to verify the company.
            </p>
            <div className='content-scroll-control'>
                {subscriptions && subscriptions.length > 0 && subscriptions.map((e, idx) => <div
                    key={idx}
                    onClick={() => handleSubscriptionChange(idx)} style={{
                        borderBottom: selection === idx ? "5px solid #004D40" : "5px solid #d3dcda",
                        background: selection === idx ? "#e9e9e9" : "white"
                    }}
                    className="widget col-1x3 large-button">

                    <div className="subscription-widget">
                        <h4>{e.name}</h4>
                        <h4>${e.currentPrice}</h4>
                        <h5>Add Subscription</h5>
                    </div>
                </div>)}
            </div>
        </React.Fragment>
    )
}

export default CompanyVerificationWorkflow
