import React from 'react'
import SearchBar from './generic/SearchBar'
import Button from './Button'
import QuerySets from '../controllers/dashboard.controller'

function CategoryManager({ item }) {
    const [API] = React.useState(new QuerySets())
    const [categoryList, setCategoryList] = React.useState([])
    const [searchPhrase, setSearchPhrase] = React.useState("")
    const [forceUpdate, setForceUpdate] = React.useState(0);


    const contains = (cat) => item.categoryList.filter((e)=>e===cat).length !== 0;

    const handleAddCategory = (cat) => {
        if (!contains(cat)){
            item.categoryList.push(cat)
        } else {
            item.categoryList = item.categoryList.filter((e)=> e !== cat)
        }
        setForceUpdate(forceUpdate + 1)

        API.manageCategories({companyId: item.id, categoryList: item.categoryList}).then((res)=>{console.log(res)})
    }

    let searchResults = searchPhrase.length < 2 ? categoryList : categoryList.filter((e) => {
        const keywords = searchPhrase.split(' ');
        const itemText = `${e.name}`.toLowerCase();

        return keywords.every((word) => itemText.includes(word.toLowerCase()));
    });

    React.useEffect(() => {
        const init = async () => {
            const categories = await API.getAllCategories();
            setCategoryList(categories.items)
        }

        init()
    }, [])

    React.useEffect(() => {}, [forceUpdate, item]);

    return (
        <div className='category-manager'>
            <div className='mini-toolbar'>
                <SearchBar placeholder={"Search"} searchPhrase={searchPhrase} onChange={setSearchPhrase} />
            </div>

            <div className='category-wrapper'>
                <table className="classic-table">
                    <thead>
                        <tr>
                            <td>Name</td>
                            <td>-</td>
                        </tr>
                    </thead>
                    <tbody>
                        {searchResults && searchResults.length > 0 && searchResults.map((e, idx) => e.name !== "" && <tr style={
                            {borderLeft: contains(e.name) ? "5px solid #007b70" : "5px solid white"}
                        } key={idx}>
                            <td style={{ width: 150 }}>{e.name}</td>
                            <td>
                                <div className='table-action-buttons'>
                                    {!contains(e.name) && <Button
                                        title="Add"
                                        onClick={() => {
                                            handleAddCategory(e.name)
                                        }}
                                    />}
                                    {contains(e.name) && <Button
                                        title="Remove"
                                        onClick={() => {
                                            handleAddCategory(e.name)
                                        }}
                                    />}
                                </div>
                            </td>
                        </tr>)}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default CategoryManager
