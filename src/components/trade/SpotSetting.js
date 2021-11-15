import { Popover, Transition } from '@headlessui/react';
import SvgMoon from 'components/svg/Moon';
import Setting from 'components/svg/Setting';
import SvgSun from 'components/svg/Sun';
import useDarkMode from 'hooks/useDarkMode';
import { useRouter } from 'next/router';
import { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SPOT_LAYOUT_MODE } from 'redux/actions/const';
import colors from 'styles/colors';

const SpotSetting = (props) => {
    const {changeLayoutCb} = props
    const [currentTheme, onThemeSwitch] = useDarkMode();
    const router = useRouter();
    const { t } = useTranslation();
    const { route, query } = router;
    const { layout, id } = query;
    const [layoutMode, setLayoutMode] = useState(layout === SPOT_LAYOUT_MODE.PRO ? SPOT_LAYOUT_MODE.PRO : SPOT_LAYOUT_MODE.SIMPLE);

    const onChangeLayout = (_layout) => {
        setLayoutMode(_layout);
        router.push({
            pathname: route,
            query: { ...query, layout: _layout },
        });
        if(changeLayoutCb) changeLayoutCb(_layout);
    };
    const inActiveLabel =
        currentTheme === 'dark' ? colors.gray4 : colors.darkBlue;
    return (
        <Popover className="relative">
            {({ open }) => (
                <>
                    <Popover.Button
                        className={`h-full flex items-center ml-2 ${
                            open ? '' : 'text-opacity-90'
                        } text-white group px-2`}
                    >
                        <Setting
                            size={20}
                            color={
                                currentTheme === 'dark'
                                    ? colors.white
                                    : colors.darkBlue
                            }
                        />
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
                        <Popover.Panel className="absolute right-0 z-10">
                            <div className="w-80  rounded-lg shadow-md bg-bgPrimary dark:bg-darkBlue-2 divide-solid divide-divider dark:divide-divider-dark divide-y">
                                <div className="px-5 py-3 flex justify-between">
                                    <span className="text-sm text-txtPrimary dark:text-txtPrimary-dark font-semibold">
                                        Theme
                                    </span>
                                    <span className="flex">
                                        <SvgMoon
                                            className="mr-2 cursor-pointer"
                                            size={20}
                                            color={
                                                currentTheme === 'dark'
                                                    ? colors.teal
                                                    : inActiveLabel
                                            }
                                            onClick={
                                                currentTheme === 'light'
                                                    ? onThemeSwitch
                                                    : undefined
                                            }
                                        />
                                        <SvgSun
                                            className="cursor-pointer"
                                            size={20}
                                            color={colors.teal}
                                            onClick={
                                                currentTheme === 'dark'
                                                    ? onThemeSwitch
                                                    : undefined
                                            }
                                            color={
                                                currentTheme === 'light'
                                                    ? colors.teal
                                                    : inActiveLabel
                                            }
                                        />
                                    </span>
                                </div>

                                <div className="px-5 py-3">
                                    <div className="text-sm text-txtPrimary dark:text-txtPrimary-dark font-semibold mb-4">
                                        Layout
                                    </div>

                                    <div className="flex justify-around">
                                        <div className="text-center">
                                            <img
                                                className={'cursor-pointer ' + (layoutMode === SPOT_LAYOUT_MODE.SIMPLE ? 'border-2 border-teal' : '')}
                                                onClick={() => onChangeLayout(SPOT_LAYOUT_MODE.SIMPLE)}
                                                src={`/images/icon/mode-classic${
                                                    currentTheme === 'dark'
                                                        ? '-dark'
                                                        : ''
                                                }.jpg`}
                                                alt="Spot Classic"
                                                width={82}
                                                height={55}
                                            />
                                            <span className="text-xs text-txtPrimary dark:text-txtPrimary-dark font-medium">
                                                Classic
                                            </span>
                                        </div>
                                        <div className="text-center">
                                            <img
                                                className={'cursor-pointer ' + (layoutMode === SPOT_LAYOUT_MODE.PRO ? 'border-2 border-teal' : '')}
                                                onClick={() => onChangeLayout(SPOT_LAYOUT_MODE.PRO)}
                                                src={`/images/icon/mode-advance${
                                                    currentTheme === 'dark'
                                                        ? '-dark'
                                                        : ''
                                                }.jpg`}
                                                alt="Spot Advance"
                                                width={82}
                                                height={55}
                                            />
                                            <span className="text-xs text-txtPrimary dark:text-txtPrimary-dark font-medium">
                                                Pro
                                            </span>
                                        </div>
                                        {/* <div className="text-center">
                                            <img
                                                src={`/images/icon/mode-fullscreen${
                                                    currentTheme === "dark"
                                                        ? "-dark"
                                                        : ""
                                                }.jpg`}
                                                alt="Spot Full Screen"
                                                width={82}
                                                height={55}
                                            />
                                            <span className="text-xs text-txtPrimary dark:text-txtPrimary-dark font-medium">
                                                Fullscreen
                                            </span>
                                        </div> */}
                                    </div>
                                </div>
                                {/* <div className="px-5 py-3 text-center">
                                    <span className="text-sm text-teal font-medium">
                                        Back to default layout
                                    </span>
                                </div> */}
                            </div>
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    );
};

export default SpotSetting;
