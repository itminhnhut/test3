import classNames from 'classnames'
import React from 'react'

const RefCard = ({ wrapperClassName = '', children }) => {
    return (
        <div className={classNames('bg-white px-4 py-6 rounded-xl', wrapperClassName)}>
            {children}
        </div>
    )
}

export default RefCard