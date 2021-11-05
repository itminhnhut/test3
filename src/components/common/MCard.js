// ********* Maldives Card *********
// Version: M1
// ---------------------------------

import { useMemo } from 'react'

const MCard = ({ children, background, addClass }) => {

    const backgroundColor = useMemo(() => background || 'bg-bgContainer dark:bg-bgContainer-dark', [background]);

    return (
        <div className={`px-[16px] py-[20px] rounded-12 ${backgroundColor} ${addClass || ''}`}>
            {children}
        </div>
    )
}

export default MCard






