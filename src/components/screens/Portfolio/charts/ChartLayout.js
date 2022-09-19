import React from 'react'

const ChartLayout = ({ children, className, area = ''}) => {
    return (
        <div className={`w-full h-full rounded-xl bg-white ${className || ''}`} style={{gridArea: area}} id={area}>
            {children}
        </div>
    )
}

export default ChartLayout