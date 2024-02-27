import React from 'react';

function SearchBar({onSearch, placeholder,searchPhrase, onChange}) {

    function handleKeyDown(e) {
        // Check if the pressed key is "Enter"
        if (e.key === 'Enter') {
            // Call your function here
            onSearch();
        }
    }
    
    return (
        <React.Fragment>
            <div className='search-wrapper'>
                <div className='form-control search-icon'>
                    <span className="material-symbols-outlined">search</span>
                </div>
                <div className='form-control search-special'>
                    <input
                        placeholder={placeholder}
                        value={searchPhrase}
                        onKeyDown={handleKeyDown}
                        onChange={(e)=>onChange(e.target.value)}
                    />
                </div>
            </div>
        </React.Fragment>
    );
}

export default SearchBar;
