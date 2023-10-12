import React, { Fragment, useMemo } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { ChevronDown } from 'react-feather';
import { FuturesOrderTypes as OrderTypes } from 'redux/reducers/futures';
import { useTranslation } from 'next-i18next';
import classNames from 'classnames';
import colors from "styles/colors";
import SortIcon from 'components/screens/Nao_futures/SortIcon';

const OrderTypeMobile = ({ type, setType, orderTypes, isVndcFutures }) => {
    const { t } = useTranslation();

    const getTypesLabel = (mode) => {
        switch (mode) {
            case OrderTypes.Limit:
                return t('trade:order_types.limit')
            case OrderTypes.StopLimit:
                return t('trade:order_types.stop_limit')
            case OrderTypes.Market:
                return t('trade:order_types.market')
            case OrderTypes.StopMarket:
                return t('trade:order_types.stop_market')
            case OrderTypes.TrailingStopMarket:
                return t('trade:order_types.trailing_stop')
            default:
                return '--'
        }
    }

    const typeList = useMemo(() => {
        return orderTypes
    }, [orderTypes, isVndcFutures])

    return (
        <Popover className="relative mr-2" style={{flexGrow: 1}}>
            {({ open, close }) => (
                <>
                    <Popover.Button data-tut="order-type" className='w-full h-[32px] border-b-2 border-divider dark:border-divider-dark'>
                        <div className="flex items-center justify-between text-xs font-medium">
                            <div className="w-full text-left">
                                {getTypesLabel(type)}
                            </div>
                            <SortIcon size={20} color="currentColor" activeColor="currentColor" className="text-gray-1 dark:text-gray-7"/>
                            {/* <ChevronDown color={colors.gray[1]} size={16} className="ml-1" /> */}
                        </div>
                    </Popover.Button>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                    >
                        <Popover.Panel className="w-full absolute z-50 bg-gray-12 dark:bg-dark-2 rounded-md">
                            <div
                                className="overflow-y-auto overflow-x-hidden px-[12px] py-[8px] shadow-onlyLight font-medium text-xs flex flex-col ">
                                {typeList?.map(o => {
                                    return (
                                        <div onClick={() => {
                                            setType(o)
                                            close()
                                        }}
                                            className={classNames(
                                                'pb-2 w-full min-w-[78px] text-txtSecondary dark:text-txtSecondary-dark font-medium text-xs cursor-pointer border-b-[2px] border-transparent',
                                                {
                                                    '!text-txtPrimary dark:!text-txtPrimary-dark':
                                                        o === type,
                                                }
                                            )}
                                            key={o}
                                        >
                                            {getTypesLabel(o)}
                                        </div>
                                    )
                                })}
                            </div>
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    );
};

export default OrderTypeMobile;
