import React, { useState, useMemo } from "react";
import Modal from "components/common/ReModal";
import { useTranslation } from "next-i18next";
import classNames from "classnames";
import AddVolume from "./ModifyOrder/AddVolume";
import { createSelector } from "reselect";
import { useSelector } from "react-redux";

const getWallet = createSelector(
    [(state) => state?.wallet?.NAO_FUTURES, (utils, params) => params],
    (wallet, params) => {
        return wallet[params];
    }
);

const ModifyOrder = ({
    order,
    pairPrice,
    onClose,
    forceFetchOrder,
    pairConfig,
    getMaxQuoteQty
}) => {
    const { t } = useTranslation();
    const [tab, setTab] = useState(0);
    const assetConfig = useSelector((state) => state.utils.assetConfig);

    const futuresBalance = useSelector((state) =>
        getWallet(state, pairConfig?.quoteAssetId)
    );

    const { available } = useMemo(() => {
        if (!assetConfig || !futuresBalance) return {};
        return {
            available:
                Math.max(futuresBalance.value, 0) -
                Math.max(futuresBalance.locked_value, 0),
        };
    }, [assetConfig, futuresBalance]);

    return (
        <Modal
            onusMode={true}
            isVisible={true}
            onBackdropCb={() => onClose()}
            onusClassName="px-0"
        >
            <div className="relative bg-bgPrimary dark:bg-bgPrimary-dark w-full rounded-t-2xl">
                <div className="flex justify-between items-center px-4">
                    <span className="text-lg text-txtPrimary dark:text-txtPrimary-dark font-bold leading-6">
                        {t("futures:mobile:adjust_margin:add_volume")}
                    </span>
                </div>
                {/* <div className="grid grid-cols-2 font-bold">
                    <div
                        className={classNames(
                            "px-2 py-1 text-center leading-[1.375rem]",
                            {
                                "border-b border-divider dark:border-divider-dark text-txtSecondary dark:text-txtSecondary-dark":
                                    tab === 1,
                                "border-b-2 border-dominant text-dominant":
                                    tab === 0,
                            }
                        )}
                        onClick={() => setTab(0)}
                    >
                        {t("futures:mobile:adjust_margin:added_volume")}
                    </div>
                    <div
                        className={classNames(
                            "px-2 py-1 text-center leading-[1.375rem]",
                            {
                                "border-b border-divider dark:border-divider-dark text-txtSecondary dark:text-txtSecondary-dark":
                                    tab === 0,
                                "border-b-2 border-dominant text-dominant":
                                    tab === 1,
                            }
                        )}
                        onClick={() => setTab(1)}
                    >
                        {t("futures:margin")}
                    </div>
                </div> */}
                <AddVolume
                        onClose={onClose}
                        order={order}
                        pairPrice={pairPrice}
                        forceFetchOrder={forceFetchOrder}
                        pairConfig={pairConfig}
                        available={available}
                    />
            </div>
        </Modal>
    );
};



export default ModifyOrder;
