import { Popover, Transition } from "@headlessui/react";
import SvgMoon from "components/svg/Moon";
import Setting from "components/svg/Setting";
import SvgSun from "components/svg/Sun";
import { Fragment } from "react";
import colors from "styles/colors";

const SpotSetting = (props) => {
    return (
        <Popover className="relative">
            {({ open }) => (
                <>
                    <Popover.Button
                        className={`h-full flex items-center ${
                            open ? "" : "text-opacity-90"
                        } text-white group px-2`}
                    >
                        <Setting size={20}/>
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
                            <div className="w-80  rounded-lg shadow-md bg-bgPrimary dark:bg-bgPrimary-dark divide-solid divide-divider dark:divider-dark divide-y">
                                <div className="px-5 py-3 flex justify-between">
                                    <span className="text-sm text-txtPrimary dark:text-txtPrimary-dark font-semibold">
                                        Theme
                                    </span>
                                    <span className="flex">
                                        <SvgMoon
                                            className="mr-1"
                                            size={20}
                                            color={colors.teal}
                                        />
                                        <SvgSun size={20} color={colors.teal} />
                                    </span>
                                </div>

                                <div className="px-5 py-3">
                                    <div className="text-sm text-txtPrimary dark:text-txtPrimary-dark font-semibold mb-4">
                                        Layout
                                    </div>

                                    <div className="flex justify-between">
                                        <div className="text-center">
                                            <img
                                                src="/images/icon/mode-classic.jpg"
                                                alt="Spot Classic"
                                                width={82}
                                                height={55}
                                            />
                                            <span className="text-xs text-txtPrimary font-medium">
                                                Classic
                                            </span>
                                        </div>
                                        <div className="text-center">
                                            <img
                                                src="/images/icon/mode-advance.jpg"
                                                alt="Spot Advance"
                                                width={82}
                                                height={55}
                                            />
                                            <span className="text-xs text-txtPrimary font-medium">
                                                Pro
                                            </span>
                                        </div>
                                        <div className="text-center">
                                            <img
                                                src="/images/icon/mode-fullscreen.jpg"
                                                alt="Spot Full Screen"
                                                width={82}
                                                height={55}
                                            />
                                            <span className="text-xs text-txtPrimary font-medium">
                                                Fullscreen
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="px-5 py-3 text-center">
                                    <span className="text-sm text-teal font-medium">
                                        Back to default layout
                                    </span>
                                </div>
                            </div>
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    );
};

export default SpotSetting;
