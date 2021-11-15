// ********* Maldives Card *********
// Version: M1
// Author:
// ---------------------------------

import { useMemo } from 'react'

const MCard = ({ children, addClass, style }) => {
    return (
        <div style={{ ...style } || {}}
             className={addClass ? 'px-4 py-5 rounded-xl bg-bgContainer dark:bg-bgContainer-dark text-textTabLabelInactive ' + addClass
                 : 'px-4 py-5 rounded-xl bg-bgContainer dark:bg-bgContainer-dark '}>
            {children}
        </div>
    )
}

export default MCard






