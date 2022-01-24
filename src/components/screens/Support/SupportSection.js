import classNames from 'classnames'
import { PATHS } from 'constants/paths'
import Link from 'next/link'

const SupportSection = ({mode = 'announcement', title, children, containerClassNames = '', contentContainerClassName = '' }) => {
    const href = mode === 'announcement' ? PATHS.SUPPORT.ANNOUNCEMENT : PATHS.SUPPORT.FAQ
    return (
        <div className={classNames('lg:bg-bgPrimary dark:bg-bgPrimary-dark lg:rounded-xl', containerClassNames)}>
            {title && <div
                className="font-bold text-[16px] lg:text-[18px] lg:px-[28px] lg:pb-3 pt-5 lg:border-b lg:border-divider lg:dark:border-divider-dark">
                <Link href={href}>
                    <a className="hover:text-dominant hover:!underline">
                        {title}
                    </a>
                </Link>
            </div>}
            {children && <div
                className={'mt-4 lg:mt-0 lg:pt-[10px] lg:px-[28px] md:flex md:start md:flex-wrap lg:-mx-1.5 ' + contentContainerClassName}>
                {children}
            </div>}
        </div>
    )
}

export default SupportSection
