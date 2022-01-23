import { useTranslation } from 'next-i18next'
import SupportSearchBar from 'components/screens/Support/SupportSearchBar'
import classNames from 'classnames'

const SupportBanner = ({ title, containerClassNames = '' }) => {
    const { t } = useTranslation()
    return (
        <div className={classNames("support-search-bg", containerClassNames)}>
            <div
                className="container flex flex-col items-center justify-center py-5 px-14 sm:py-8 lg:py-9 lg:px-0 lg:flex-row lg:items-center lg:justify-between">
                <div className="font-bold text-center text-[16px] mb-4 lg:mb-0 lg:text-[36px] lg:leading-[56px]">
                    {title || 'No title'}
                </div>
                <SupportSearchBar
                    placeholder={t('common:search_articles')}
                    containerClassNames={classNames('rounded-lg bg-white dark:bg-darkBlue-2')}
                />
            </div>
        </div>
    )
}

export default SupportBanner
