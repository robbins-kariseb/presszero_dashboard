import React from 'react'
import SearchBar from './SearchBar'

function PageContainer({pageTitle, pageSubtitle, children, searchSpace, searchPlaceholder}) {

    return (
        <div className='page-container'>
            <div className='page-heading'>
                <h2>{pageTitle}</h2>
                <p>{pageSubtitle}</p>
            </div>
            <br/>
            <SearchBar placeholder={searchPlaceholder||"Search for Companies here..."} items={searchSpace||[]} />
            <div className='scrollable-container'>
                {children}
            </div>
        </div>
    )
}

export default PageContainer
