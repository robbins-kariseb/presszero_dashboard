import React from 'react'
import TabButton from './TabButton'

function Tab({ tabs, setTab, initialIndex }) {
    const [tabIndex, setTabIndex] = React.useState(initialIndex||0)
    
    const handleSwapTab = (idx, e)=> {
        setTabIndex(idx); 
        setTab(idx); 
        if (e.onClick) e.onClick(idx);
    }

    return (
        <React.Fragment>
            <div className='flex tabs'>
                {tabs.map((e,idx)=><TabButton selected={idx===tabIndex} onClick={()=>handleSwapTab(idx, e)} key={idx} title={e.title} />)}
            </div>
        </React.Fragment>
    )
}

export default Tab
