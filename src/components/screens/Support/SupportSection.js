import classNames from 'classnames';
import { PATHS } from 'constants/paths';
import Link from 'next/link';
import useApp from 'hooks/useApp';

const SupportSection = ({
    mode,
    title,
    children,
    containerClassNames = '',
    contentContainerClassName = '',
    isMobile = false
}) => {

    let href
    if (mode !== undefined) {
        href = mode === 'announcement' ? PATHS.SUPPORT.ANNOUNCEMENT : PATHS.SUPPORT.FAQ
    }

    const isApp = useApp()
    href = isApp ? href + '?source=app' : href

    return (
        <div className={classNames('', containerClassNames)}>
            {title &&
                <div
                    className="text-gray-4 text-base font-semibold sm:text-[32px] sm:leading-[38px] cursor-pointer">
                    {href ? <Link href={href}>
                        <a className="">
                            {title}
                        </a>
                    </Link>
                        : <div className="">
                            {title}
                        </div>}
                </div>
            }
            {children && <div
                className={classNames('flex flex-col sm:grid justify-between gap-4 sm:gap-6', contentContainerClassName)}
                style={{
                    gridTemplateColumns: isMobile ? "repeat(auto-fill, 170px)" : "repeat(auto-fill, 286px)",
                }}
            >
                {children}
            </div>}
        </div>
    )
}

export default SupportSection
