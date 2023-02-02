import classNames from 'classnames'
import React from 'react'

const RefCard = ({ wrapperClassName = '', children, style = {}, isBlack = false }) => {
    return (
        <div className={classNames('bg-white px-4 py-6 rounded-xl', wrapperClassName, {
            '!bg-namiapp-black-1': isBlack,
        })} style={style}>
            {children}
        </div>
    )
}

export default RefCard