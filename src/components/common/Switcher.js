import { memo, useMemo } from 'react'
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode'
import colors from 'styles/colors'

const Switcher = memo(({ active, onChange, wrapperClass = '', addClass }) => {

    const [currentTheme, ] = useDarkMode()

    const className = useMemo(() => {
        let _ = 'absolute top-0 left-0 w-[16px] h-[16px] rounded-full bg-dominant duration-100 ease-in '
        if (addClass) _ += addClass
        return _
    }, [addClass])

    return (
        <div className={'relative min-w-[32px] w-[32px] h-[16px] rounded-full cursor-pointer bg-teal-lightTeal dark:bg-teal-opacity ' + wrapperClass}
             style={!active ? {
                 backgroundColor: currentTheme === THEME_MODE.DARK ? 'rgba(123, 140, 178, 0.5)' : 'rgba(204, 204, 204, 0.2)'
             } : {
                 backgroundColor: currentTheme === THEME_MODE.DARK ? 'rgba(0, 200, 188, 0.5)' : colors.lightTeal
             }}
             onClick={() => onChange && onChange()}>
            <div className={active ? `${className} translate-x-full` : `${className} translate-x-0 !bg-gray-2 dark:!bg-darkBlue-5`}/>
        </div>
    )
})

export default Switcher
