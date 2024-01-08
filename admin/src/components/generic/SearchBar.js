import React from 'react';

function SearchBar({items, placeholder}) {
    const [isFocused, setIsFocused] = React.useState(false);
    const [searchPhrase, setSearchPhrase] = React.useState("");

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    const searchResults = searchPhrase.length < 2 ? [] : items.filter((e) => {
        const keywords = searchPhrase.split(' ');
        const itemText = `${e.searchName} ${e.searchCategory}`.toLowerCase();
    
        return keywords.every((word) => itemText.includes(word.toLowerCase()));
    });

    React.useEffect(()=>{},[searchPhrase])

    return (
        <React.Fragment>
            <div className='search-wrapper'>
                <div className='form-control search-icon'>
                    <span className="material-symbols-outlined">search</span>
                </div>
                <div className='form-control'>
                    <input
                        placeholder={placeholder}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        value={searchPhrase}
                        onChange={(e)=>setSearchPhrase(e.target.value)}
                    />
                </div>
            </div>

            {(isFocused || searchResults.length > 0) && (
                <div className='search-controls'>
                    {searchResults.slice(0,100).map((e,idx)=>{
                        return (<div key={idx} className='search-result'>
                            <div className="mini-heading">
                                <div className="logo-wrapper">
                                    <img src={e.searchImage} alt="company-0" />
                                </div>
                                <div className="title-wrapper">
                                    <h4 className='title'>{e.searchName}</h4>
                                    <p className='description'>{e.description.slice(0,80)}...</p>
                                </div>
                                {e.searchCategory && <div className="title-wrapper">
                                    <h4 className='subTitle'>{e.searchCategory}</h4>
                                </div>}
                            </div>
                        </div>)
                    })}
                    {searchResults.length === 0 && <div className='search-result'>
                            <div className="mini-heading">
                                <div className="title-wrapper">
                                    <h4 className='title'>Nothing found for this search!</h4>
                                </div>
                            </div>
                        </div>}
                </div>
            )}
        </React.Fragment>
    );
}

export default SearchBar;
