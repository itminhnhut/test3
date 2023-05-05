import { Popover, Transition } from '@headlessui/react';
import SvgMoon from 'src/components/svg/Moon';
import SvgSun from 'src/components/svg/Sun';
import useDarkMode from 'hooks/useDarkMode';
import { useRouter } from 'next/router';
import { Fragment, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SPOT_LAYOUT_MODE } from 'redux/actions/const';
import colors from 'styles/colors';
import useLanguage from 'hooks/useLanguage';
import classnames from 'classnames';
import Switch from 'components/common/V2/SwitchV2';
import { NavbarSettingIcon, SettingIcon } from 'components/svg/SvgIcon';
import TextButton from 'components/common/V2/ButtonV2/TextButton';
import { getS3Url } from 'src/redux/actions/utils';

const SpotSetting = (props) => {
    const { spotState, onChangeSpotState, resetDefault } = props;
    const [currentTheme, onThemeSwitch] = useDarkMode();
    const [currentLocale, onChangeLang] = useLanguage();
    const router = useRouter();
    const { t } = useTranslation();

    const SpotComponents = [
        {
            value: t('spot:setting.symbol_detail'),
            key: 'isShowSymbolDetail'
        },
        {
            value: t('spot:setting.chart'),
            key: 'isShowChart'
        },
        {
            value: t('spot:setting.order_book'),
            key: 'isShowOrderBook'
        },
        {
            value: t('spot:setting.trades'),
            key: 'isShowTrades'
        },
        {
            value: t('spot:setting.symbol_list'),
            key: 'isShowSymbolList'
        },
        {
            value: t('spot:setting.order_list'),
            key: 'isShowOrderList'
        },
        {
            value: t('spot:setting.place_order_form'),
            key: 'isShowPlaceOrderForm'
        }
    ];
    const { layout, id } = router.query;
    const [layoutMode, setLayoutMode] = useState(layout === SPOT_LAYOUT_MODE.PRO ? SPOT_LAYOUT_MODE.PRO : SPOT_LAYOUT_MODE.SIMPLE);

    useEffect(() => {
        setLayoutMode(layout === SPOT_LAYOUT_MODE.PRO ? SPOT_LAYOUT_MODE.PRO : SPOT_LAYOUT_MODE.SIMPLE);
    }, [router.query]);

    const onChangeLayout = (_layout) => {
        router.push(`/trade/${id}?layout=${_layout}`);
    };
    const inActiveLabel = currentTheme === 'dark' ? colors.gray[7] : colors.gray[1];

    const onChangeSpotComponent = (key, value) => {
        const _newSpotState = spotState;
        spotState[key] = value;
        onChangeSpotState({
            ...spotState,
            ..._newSpotState
        });
    };

    const layouts = [
        { icon: `/images/icon/mode-classic${currentTheme === 'dark' ? '-dark' : ''}.png`, value: SPOT_LAYOUT_MODE.SIMPLE, label: t('spot:setting.classic') },
        { icon: `/images/icon/mode-advance${currentTheme === 'dark' ? '-dark' : ''}.png`, value: SPOT_LAYOUT_MODE.PRO, label: t('spot:setting.pro') }
    ];

    return (
        <Popover className="relative h-full">
            {({ open, close }) => (
                <>
                    <Popover.Button className={`h-full hover:text-teal dark:hover:text-teal text-txtSecondary dark:text-txtSecondary-dark flex items-center ${open ? '' : 'text-opacity-90'} group`}>
                        <NavbarSettingIcon size={24} />
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
                        <Popover.Panel className="absolute right-0  top-full mt-[1px] z-10">
                            <div className="p-4 w-[295px] border border-t-0 dark:border-divider-dark rounded-b-lg shadow-md bg-bgPrimary dark:bg-darkBlue-3 divide-solid divide-divider dark:divide-divider-dark divide-y">
                                <div className="mb-6 flex justify-between">
                                    <span className="text-sm sm:text-base text-txtPrimary dark:text-txtPrimary-dark font-semibold">
                                        {t('spot:setting.theme')}
                                    </span>
                                    <span className="flex space-x-4">
                                        <SvgMoon
                                            className="cursor-pointer"
                                            size={24}
                                            color={currentTheme === 'dark' ? colors.teal : inActiveLabel}
                                            onClick={currentTheme === 'light' ? onThemeSwitch : undefined}
                                        />
                                        <SvgSun
                                            className="cursor-pointer"
                                            size={24}
                                            onClick={currentTheme === 'dark' ? onThemeSwitch : undefined}
                                            color={currentTheme === 'light' ? colors.teal : inActiveLabel}
                                        />
                                    </span>
                                </div>

                                <div className="py-6 space-y-6">
                                    <div className="text-sm sm:text-base text-txtPrimary dark:text-txtPrimary-dark font-semibold m6-4">
                                        {t('spot:setting.layout')}
                                    </div>
                                    <div className="flex justify-around">
                                        {layouts.map((rs, i) => {
                                            const isActive = layoutMode === rs.value;
                                            return (
                                                <div key={i} className="flex flex-col justify-center space-y-2">
                                                    <div
                                                        className={classnames('p-1 bg-gray-10 dark:bg-dark-2 cursor-pointer rounded-[3px]', {
                                                            'border border-teal': isActive
                                                        })}
                                                    >
                                                        <img
                                                            onClick={() => {
                                                                onChangeLayout(rs.value);
                                                                close();
                                                            }}
                                                            src={getS3Url(rs.icon)}
                                                            width={82}
                                                            height={55}
                                                        />
                                                    </div>
                                                    <span
                                                        className={classnames('text-xs text-center', {
                                                            'text-txtPrimary dark:text-txtSecondary': !isActive,
                                                            'font-semibold': isActive
                                                        })}
                                                    >
                                                        {rs.label}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="py-6 text-center space-y-4">
                                    {SpotComponents.map((item, index) => {
                                        const { value, key } = item;
                                        return (
                                            <div className="flex justify-between" key={key + index}>
                                                <span className="text-sm text-txtPrimary dark:text-txtPrimary-dark">{value}</span>
                                                {/* <Toggle checked={spotState?.[key]} onChange={(value) => onChangeSpotComponent(key, value)} /> */}
                                                <Switch checked={spotState?.[key]} onChange={(value) => onChangeSpotComponent(key, value)} />
                                            </div>
                                        );
                                    })}
                                </div>
                                <TextButton className="pt-6 text-center" onClick={() => resetDefault()}>
                                    {t('spot:setting.reset_default_layout')}
                                </TextButton>
                            </div>
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    );
};

export default SpotSetting;
