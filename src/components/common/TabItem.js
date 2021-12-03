import { useCallback } from 'react'
import Link from 'next/link'

const TabItem = ({ title, href = '/', target = '_self', active, component = TabItemComponent.Link }) => {

    const renderItem = useCallback(() => {
        const originClass = 'inline-flex flex-col items-center justify-center mr-7 text-sm cursor-pointer font-bold lg:text-[16px] '
        let className = originClass

        if (!active) className = originClass + 'text-txtSecondary dark:text-txtSecondary-dark font-medium'

        const indicators = <div className={active ? 'w-[50px] h-[2px] bg-dominant mt-3'
                                                    : 'w-[50px] h-[2px] bg-tranpsarent mt-3'}/>

        if (component === TabItemComponent.Link) {
            return (
                <Link href={href}>
                    <a target={target} className={className}>
                        {title || 'Please add title for this link'}
                        {indicators}
                    </a>
                </Link>
            )
        }

        if (component === TabItemComponent.a) {
            return (
                <a href={href} target={target} className={className}>
                    {title || 'Please add title for this link'}
                    {indicators}
                </a>
            )
        }

        if (component === TabItemComponent.Div) {
            return (
                <div onClick={() => window.open(href, '_self')}
                     className={className}>
                    {title || 'Please add title for this link'}
                    {indicators}
                </div>
            )
        }
    }, [target, title, active, component])

    return renderItem()
}

export const TabItemComponent = {
    Link: 'link',
    a: 'a',
    Div: 'div'
}

export default TabItem
