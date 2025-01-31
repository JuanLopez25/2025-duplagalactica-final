import React from 'react';

const Searcher = ({filteredValues,setFilterValues,isSmallScreen,searchingParameter}) => {
    return (
        <div className='input-container' style={{marginLeft: isSmallScreen ? '60px' : '100px', width: isSmallScreen ? '50%' : '30%', position: 'absolute', top: '1%'}}>
            <div className='input-small-container'>
                <input
                type="text"
                placeholder={`Search by ${searchingParameter} ....`}
                style={{
                borderRadius: '10px',
                left: '3%',
                transition: 'all 0.3s ease',
                }}
                id={filteredValues}
                onChange={(e) => setFilterValues(e.target.value)} 
                />
                </div>
            </div>
    )
}

export default Searcher