// ********* Maldives Card *********
// Version: M1
// ---------------------------------

import { useMemo } from 'react'

const MCard = ({ children, background }) => {

    const backgroundColor = useMemo(() => background || 'bg-bgContainer dark:bg-bgContainer-dark', [background]);

    return (
        <div className={`p-12 rounded-12 ${backgroundColor}`}>
            {children}
        </div>
    )
}

export default MCard






