import { Search } from 'react-feather'
import classNames from 'classnames'
import { useTranslation } from 'next-i18next'

const SupportSearchBar = ({
                              value,
                              onChange,
                              onCallBack,
                              containerClassNames = '',
                              simpleMode = false,
                              ...restProps
                          }) => {
    const { t } = useTranslation()

    return (
        <div
            className={classNames('mt-2 lg:mt-3 flex items-center bg-gray-4 lg:bg-white dark:bg-darkBlue-4 p-2 lg:pl-[18px] lg:py-3.5 rounded-md lg:rounded-xl lg:max-w-[600px] lg:max-h-[56px]',
                                  {
                                      'min-w-[280px] max-w-[310px] md:min-w-[450px] md:rounded-xl xl:min-w-[600px] xl:max-w-[600px]': !simpleMode
                                  }, containerClassNames)}>
            <Search strokeWidth={2}
                    className="text-txtSecondary dark:text-txtSecondary-dark w-4 h-4 lg:w-[24px] lg:h-[24px] lg:!text-dominant"/>
            <input className="px-2 lg:px-4 flex-grow font-medium text-xs md:text-sm lg:text-[16px]"
                   value={value}
                   onChange={({ target: { value } }) => onChange && onChange(value)}
                   {...restProps}
            />
            {!simpleMode && <button style={{
                background: 'linear-gradient(138.83deg, rgba(0, 220, 194, 0.9) 2.54%, #00BEB3 50.84%)'
            }}
                                    onClick={() => onCallBack && onCallBack(value)}
                                    className="w-[86px] lg:w-[160px] h-[24px] sm:h-[35px] lg:h-[42px] rounded-[8px] lg:rounded-xl text-[10px] md:text-sm lg:text-[16px] font-medium text-white hover:opacity-80">
                {t('common:search')}
            </button>}
        </div>
    )
}

export default SupportSearchBar
