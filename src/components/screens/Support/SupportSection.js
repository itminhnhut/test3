import classNames from 'classnames';
import { PATHS } from 'constants/paths';
import Link from 'next/link';
import useApp from 'hooks/useApp';

const SupportSection = ({
    mode,
    title,
    children,
    containerClassNames = '',
    contentContainerClassName = ''
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
                    className="text-namiv2-gray-2 text-[32px] font-semibold leading-[38px] cursor-pointer">
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
                className={'flex flex-wrap justify-between gap-[23px]' + ' ' + contentContainerClassName}>
                {children}
            </div>}
        </div>
    )
}

export default SupportSection
