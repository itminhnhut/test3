import { Popover, Transition } from '@headlessui/react';
import SvgMoon from 'src/components/svg/Moon';
import SvgSun from 'src/components/svg/Sun';
import useDarkMode from 'hooks/useDarkMode';
import { Fragment, useMemo, memo, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import colors from 'styles/colors';
import Switch from 'components/common/V2/SwitchV2';
import { SettingIcon } from 'components/svg/SvgIcon';
import TextButton from 'components/common/V2/ButtonV2/TextButton';
import { FuturesSettings } from 'redux/reducers/futures';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFuturesSetting } from 'redux/actions/futures';
import classNames from 'classnames';
import Tooltip from 'components/common/Tooltip';

const FuturesSetting = memo(
    (props) => {
        const { spotState, onChangeSpotState, resetDefault, className, isDrawer } = props;
        const settings = useSelector((state) => state.futures.settings);
        const [currentTheme, onThemeSwitch] = useDarkMode();
        const {
            t,
            i18n: { language }
        } = useTranslation();
        const dispatch = useDispatch();
        const timer = useRef();
        const [loading, setLoading] = useState(false);
        const [mount, setMount] = useState(false);
        const userSetting = [
            { key: FuturesSettings.order_confirm, tooltip: t('spot:setting:order_confirmation_tooltip') },
            { key: FuturesSettings.show_sl_tp_order_line, tooltip: t('spot:setting:display_price_line_tooltip') }
        ];

        const FuturesComponents = [
            {
                label: t('futures:setting:favorites'),
                key: 'isShowFavorites',
                visible: true
            },
            {
                label: t('futures:setting:pair_detail'),
                key: 'isShowPairDetail',
                visible: true
            },
            {
                label: t('futures:setting:chart'),
                key: 'isShowChart',
                visible: true
            },
            {
                label: t('futures:setting:orders_history'),
                key: 'isShowOpenOrders',
                visible: true
            },
            {
                label: t('futures:setting:place_order'),
                key: 'isShowPlaceOrder',
                visible: true
            },
            {
                label: t('common:assets'),
                key: 'isShowAssets',
                visible: true
            }
        ];

        const getUserSettings = () => {
            if (!settings?.user_setting) return [];
            return userSetting.map((item) => {
                const label = settings.configs.find((rs) => rs.key === item.key)?.description?.[language];
                return {
                    key: item.key,
                    label,
                    tooltip: item?.tooltip
                };
            });
        };

        const settingFutures = useMemo(() => {
            return {
                userSetting: getUserSettings()
            };
        }, [settings, language]);

        const inActiveLabel = currentTheme === 'dark' ? colors.gray[7] : colors.gray[1];

        useEffect(() => {
            const settingFutures = localStorage.getItem('settingLayoutFutures');
            if (settings?.user_setting && settingFutures && !mount) {
                Object.keys(settings?.user_setting).map((item) => {
                    spotState[item] = settings?.user_setting?.[item] ?? spotState[item];
                });
                localStorage.setItem('settingLayoutFutures', JSON.stringify(spotState));
                onChangeSpotState(spotState);
                setMount(true);
            }
        }, [settings?.user_setting]);

        const onChangeSetting = (key, value) => {
            if (!userSetting.find((item) => item.key === key)) return;
            try {
                setLoading(true);
                const obj = userSetting.reduce((pre, curr) => {
                    pre[curr.key] = spotState[curr.key];
                    return pre;
                }, {});
                const params = { setting: { ...settings?.user_setting, ...obj, [key]: value } };
                dispatch(fetchFuturesSetting(params));
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        const onChangeFuturesComponent = (key, value) => {
            clearTimeout(timer.current);
            const _newSpotState = spotState;
            spotState[key] = value;
            localStorage.setItem('settingLayoutFutures', JSON.stringify(spotState));
            onChangeSpotState({
                ...spotState,
                ..._newSpotState
            });
            timer.current = setTimeout(() => {
                onChangeSetting(key, value);
            }, 800);
        };

        const onSetDefault = () => {
            clearTimeout(timer.current);
            timer.current = setTimeout(() => {
                const params = {
                    setting: {
                        ...settings?.user_setting,
                        [FuturesSettings.order_confirm]: true,
                        [FuturesSettings.show_sl_tp_order_line]: true
                    }
                };
                dispatch(fetchFuturesSetting(params));
                if (resetDefault) resetDefault({ [FuturesSettings.order_confirm]: true, [FuturesSettings.show_sl_tp_order_line]: true });
            }, 500);
        };
        console.log('isActive', props);
        return (
            <Popover className="relative h-full">
                {({ open }) => (
                    <>
                        <Popover.Button
                            className={`h-full  flex items-center ${
                                open ? '' : 'text-opacity-90'
                            } dark:hover:text-teal hover:text-teal text-txtSecondary dark:text-txtSecondary-dark group ${className}`}
                        >
                            <SettingIcon size={24} />
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
                            <Popover.Panel className={`absolute ${isDrawer ? '-right-3' : 'right-0'} top-full mt-[1px] z-10`}>
                                <div
                                    className={classNames(
                                        'p-4 min-w-[360px] border border-t-0 dark:border-divider-dark rounded-b-lg shadow-md bg-bgPrimary dark:bg-darkBlue-3 divide-solid divide-divider dark:divide-divider-dark divide-y ',
                                        // { '!border-none !shadow-none': isDrawer }
                                    )}
                                >
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

                                    <div className="py-6 divide-y-[1px] divide-divider dark:divide-divider-dark grid grid-cols-1 gap-6">
                                        <div className="space-y-4">
                                            {FuturesComponents.map((item, index) => {
                                                const { label, key, visible } = item;
                                                if (!visible) return null;
                                                return (
                                                    <div className="h-6 flex justify-between" key={key + index}>
                                                        <span className="text-sm text-txtPrimary dark:text-txtPrimary-dark flex items-center">{label}</span>
                                                        <Switch checked={spotState?.[key]} onChange={(value) => onChangeFuturesComponent(key, value)} />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        {Object.keys(settingFutures).map((setting) => {
                                            if (settingFutures[setting] && Array.isArray(settingFutures[setting])) {
                                                return (
                                                    <div className="space-y-4 pt-6">
                                                        {settingFutures[setting].map((item, indx) => {
                                                            const { label, key, className = '', tooltip } = item;
                                                            return (
                                                                <Fragment key={indx}>
                                                                    <div className="h-6 flex items-start justify-between space-x-2">
                                                                        <span
                                                                            className={classNames(
                                                                                `text-sm text-txtPrimary dark:text-txtPrimary-dark flex items-center`,
                                                                                {
                                                                                    'underline leading-6': !!tooltip
                                                                                },
                                                                                className
                                                                            )}
                                                                            style={{
                                                                                textDecorationStyle: !!tooltip ? 'dashed' : 'unset',
                                                                                textUnderlineOffset: 2,
                                                                                textUnderlinePosition: 'under',
                                                                                textDecorationColor: currentTheme === 'light' ? colors.gray[1] : colors.gray[7]
                                                                            }}
                                                                            data-tip={tooltip}
                                                                            data-for={key}
                                                                        >
                                                                            {label}
                                                                        </span>
                                                                        <Switch
                                                                            checked={spotState?.[key]}
                                                                            onChange={(value) => !loading && onChangeFuturesComponent(key, value)}
                                                                        />
                                                                    </div>
                                                                    {!!tooltip && (
                                                                        <Tooltip
                                                                            overridePosition={(e) => ({
                                                                                left: isDrawer ? 0 : e.left,
                                                                                top: e.top
                                                                            })}
                                                                            id={key}
                                                                            place="top"
                                                                            effect="solid"
                                                                            isV3
                                                                            className="max-w-[300px]"
                                                                        />
                                                                    )}
                                                                </Fragment>
                                                            );
                                                        })}
                                                    </div>
                                                );
                                            }
                                        })}
                                    </div>
                                    <TextButton className="pt-6 text-center" onClick={onSetDefault}>
                                        {t('spot:setting.reset_default_layout')}
                                    </TextButton>
                                </div>
                            </Popover.Panel>
                        </Transition>
                    </>
                )}
            </Popover>
        );
    },
    (pre, next) => {
        return pre.spotState === next.spotState;
    }
);

export default FuturesSetting;
