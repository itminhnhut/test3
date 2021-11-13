import { useMemo } from 'react'

import Skeleton from 'react-loading-skeleton'
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode'
import colors from 'styles/colors'

import 'react-loading-skeleton/dist/skeleton.css'

const Skeletor = (props) => {
    const [currentTheme, ] = useDarkMode()
    const _ = useMemo(() => {
        switch (currentTheme) {
            case THEME_MODE.DARK:
                return { base: colors.darkBlue3, highlight: colors.darkBlue4 }
            case THEME_MODE.LIGHT:
                return { base: colors.grey4, highlight: '#FCFCFC' }
            default:
                return { base: colors.grey4, highlight: '#FCFCFC' }
        }
    }, [currentTheme])

    return <Skeleton width={45} height={20} baseColor={_?.base} highlightColor={_?.highlight} {...props}/>
}

export default Skeletor
