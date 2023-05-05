import { Popover, Transition } from '@headlessui/react';
import SvgMoon from 'src/components/svg/Moon';
import SvgSun from 'src/components/svg/Sun';
import useDarkMode from 'hooks/useDarkMode';
import { useRouter } from 'next/router';
import { Fragment, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import colors from 'styles/colors';
import Switch from 'components/common/V2/SwitchV2';
import { SettingIcon,NavbarSettingIcon } from 'components/svg/SvgIcon';
import TextButton from 'components/common/V2/ButtonV2/TextButton';

const FuturesSetting = (props) => {
    const { spotState, onChangeSpotState, resetDefault, className } = props;

    const [currentTheme, onThemeSwitch] = useDarkMode();
    const router = useRouter();
    const { t } = useTranslation();
    const isVndcFutures = router.asPath.indexOf('VNDC') !== -1;

    const FuturesComponents = [
        {
            value: t('futures:setting:favorites'),
            key: 'isShowFavorites',
            visible: true
        },
        {
            value: t('futures:setting:pair_detail'),
            key: 'isShowPairDetail',
            visible: true
        },
        {
            value: t('futures:setting:chart'),
            key: 'isShowChart',
            visible: true
        },
        {
            value: t('common:orderbook'),
            key: 'isShowOrderBook',
            visible: !isVndcFutures
        },
        {
            value: t('common:trades'),
            key: 'isShowTrades',
            visible: !isVndcFutures
        },
        {
            value: t('futures:setting:orders_history'),
            key: 'isShowOpenOrders',
            visible: true
        },
        {
            value: t('futures:setting:place_order'),
            key: 'isShowPlaceOrder',
            visible: true
        },
        {
            value: t('common:assets'),
            key: 'isShowAssets',
            visible: true
        }
    ];
    const inActiveLabel = currentTheme === 'dark' ? colors.gray[7] : colors.gray[1];

    const onChangeFuturesComponent = (key, value) => {
        const _newSpotState = spotState;
        spotState[key] = value;
        localStorage.setItem('settingLayoutFutures', JSON.stringify(spotState));
        onChangeSpotState({
            ...spotState,
            ..._newSpotState
        });
    };

    const settingLayout = useMemo(() => {
        const settings = localStorage.getItem('settingLayoutFutures');
        return settings ? JSON.parse(settings) : spotState;
    }, [spotState]);

    return (
        <Popover className="relative">
            {({ open }) => (
                <>
                    <Popover.Button className={`h-full flex items-center ${open ? '' : 'text-opacity-90'} text-txtSecondary dark:text-txtSecondary-dark group ${className}`}>
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
                        <Popover.Panel className="absolute right-0 top-[52px] z-10">
                            <div className="p-4 w-[295px] border border-t-0 dark:border-divider-dark rounded-b-lg shadow-md bg-bgPrimary dark:bg-darkBlue-3 divide-solid divide-divider dark:divide-divider-dark divide-y">
                                <div className="mb-6 flex justify-between">
                                    <span className="text-sm sm:text-base text-txtPrimary dark:text-txtPrimary-dark font-semibold">
                                        {t('spot:setting.theme')}
                                    </span>
                                    <span className="flex space-x-4">
                                        <SvgMoon
                                            className="mr-2 cursor-pointer"
                                            size={20}
                                            color={currentTheme === 'dark' ? colors.teal : inActiveLabel}
                                            onClick={currentTheme === 'light' ? onThemeSwitch : undefined}
                                        />
                                        <SvgSun
                                            className="cursor-pointer"
                                            size={20}
                                            onClick={currentTheme === 'dark' ? onThemeSwitch : undefined}
                                            color={currentTheme === 'light' ? colors.teal : inActiveLabel}
                                        />
                                    </span>
                                </div>

                                <div className="py-6 text-center space-y-4">
                                    {FuturesComponents.map((item, index) => {
                                        const { value, key, visible } = item;
                                        if (!visible) return null;
                                        return (
                                            <div className="h-6 my-1 flex justify-between" key={key + index}>
                                                <span className="font-medium text-sm text-txtPrimary dark:text-txtPrimary-dark">{value}</span>
                                                <Switch checked={spotState?.[key]} onChange={(value) => onChangeFuturesComponent(key, value)} />
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

export default FuturesSetting;
