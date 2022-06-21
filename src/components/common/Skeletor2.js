import { useMemo } from 'react';

import Skeleton from 'react-loading-skeleton';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import colors from 'styles/colors';

import 'react-loading-skeleton/dist/skeleton.css';

const Skeleton2 = (props) => {
    const [themeMode] = useDarkMode()
    const config = useMemo(() => {
        switch (themeMode) {
            case THEME_MODE.DARK:
                return { base: colors.darkBlue3, highlight: colors.darkBlue4 }
            case THEME_MODE.LIGHT:
                return { base: colors.grey4, highlight: '#FCFCFC' }
            default:
                return { base: colors.grey4, highlight: '#FCFCFC' }
        }
    }, [themeMode])

    return <Skeleton baseColor={config?.base} highlightColor={config?.highlight} {...props}/>
}

export default Skeleton2
