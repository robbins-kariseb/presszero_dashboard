import React from 'react';

function SearchBar({placeholder,searchPhrase, onChange}) {
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
                        onChange={(e)=>onChange(e.target.value)}
                    />
                </div>
            </div>
        </React.Fragment>
    );
}

export default SearchBar;
