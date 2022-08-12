import React, { useState, useMemo, useContext, useEffect, useRef } from "react";
import Modal from "components/common/ReModal";
import Button from "components/common/Button";
import colors from "styles/colors";
import CheckBox from "components/common/CheckBox";
import { getS3Url,formatCurrency, formatNumber } from "redux/actions/utils";
import { fees } from "components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType";
import { API_POST_CHANGE_FEES_CURRENCY_ORDER } from "redux/actions/apis";
import axios from "axios";
import { useTranslation } from "next-i18next";
import { AlertContext } from "components/common/layouts/LayoutMobile";
import Tooltip from "components/common/Tooltip";
import { useSelector } from "react-redux";
import { isNumber } from "lodash";

const CurrencyPopup = (props) => {
    const { visibleModalFees, dataRow, setVisibleModalFees,forceFetchOrder } = props;
    const [hoverItemsChose, setHoverItemsChose] = useState("");
    const [feesFor, setFees] = useState([]);
    const [checkBox, setCheckBox] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const avlbAsset = useSelector((state) => state.wallet?.FUTURES);
    const { t } = useTranslation();
    const [disabledButton, setdDisabledButton] = useState(false);
    const assetId=useRef(null);
    const assetConfigs = useSelector((state) => state.utils.assetConfig) || [];
    const [disableForAvailable, setDisableForAvailable] = useState(false);

    const alertContext = useContext(AlertContext);

    useMemo(() => {
        if (dataRow) {
            const assetCodeArray = ["VNDC", "NAO", "NAMI", "ONUS", "USDT"];
            const codeOfAsset = [72, 447, 1, 86, 22];
            codeOfAsset.forEach((item, index) => {
                if (dataRow?.fee_metadata?.close_order?.currency === item) {
                    setHoverItemsChose(assetCodeArray[index]);
                }
            });
            let handleFeesNAO = [fees[1], fees[0], ...fees?.slice(2, 5)];
            if (dataRow?.symbol?.indexOf("USDT") > -1) {
                let handleFees = [
                    handleFeesNAO[0],
                    handleFeesNAO[4],
                    ...handleFeesNAO?.slice(2, 4),
                ];
                setFees(handleFees);
            } else {
                let handleFees = handleFeesNAO.slice(0, 4);
                setFees(handleFees);
            }
        }
    }, [dataRow]);

    const handleDisableBTN = (availableAsset, _assetConfigs) => {
        setDisableForAvailable(formatNumber(availableAsset, _assetConfigs.assetDigit) === "0"? true : false)
    }

    const renderAllCurrency = feesFor?.map((item, index) => {
        const _avlb = avlbAsset?.[item.assetId];
        const _assetConfigs = assetConfigs.find(e => e.id === item.assetId);
        const availableAsset =
            Math.max(_avlb?.value, 0) - Math.max(_avlb?.locked_value, 0);
        return (
            <div className="w-full relative"
            >
                <div className={`${
                    hoverItemsChose === item.assetCode
                        ? "border-[1px] border-[#0068FF]"
                        : "" } w-[100%] h-[62px] absolute rounded-md`}
                    onClick={() => {
                        assetId.current=item.assetId;
                        setHoverItemsChose(item.assetCode);
                        handleDisableBTN(availableAsset, _assetConfigs);
                        // console.log()
                        }}>
                </div>
                <div
                    className="flex items-center justify-between w-full h-[62px] bg-onus-bg rounded-md px-4 my-4"
                >
                    <div className="py-[18px] flex items-center">
                        <div className="w-6 h-6">
                            <img
                                src={getS3Url(
                                    `/images/coins/64/${item.assetId}.png`
                                )}
                            />
                        </div>
                        <p className="leading-6 font-medium text-base mx-2">
                            {item.assetCode}
                        </p>
                        {item?.assetCode === "NAO" && (
                            <img
                                className="w-4 h-4"
                                src={getS3Url(`/images/screen/futures/ic_star.png`)}
                            />
                        )}
                    </div>
                    <div className="flex items-end flex-col text-center text-xs py-2">
                        <div className="flex jutify-center items-center mb-[2px]">
                            <p
                                className={`${
                                    item.ratio !== "0.06%"
                                        ? "text-onus-grey text-center line-through text-xs font-normal"
                                        : "text-base font-medium"
                                } leading-5`}
                            >
                                0.06%
                            </p>
                            {item.ratio !== "0.06%" && (
                                <p className={`${item?.assetCode === "NAO"? "text-onus-base" : ""} leading-5 ml-1 font-medium text-base`}>{item.ratio}</p>
                            )}
                        </div>
                        <p className="leading-5 font-normal text-onus-grey text-xs">
                           {t(`futures:mobile:adjust_margin:available`)} {formatNumber(availableAsset, _assetConfigs.assetDigit)}
                        </p>
                    </div>
                </div>
            </div>
        );
    });

    const onClose = () => {
        setVisibleModalFees(false);
        if(forceFetchOrder)forceFetchOrder()
        const assetCodeArray = ["VNDC", "NAO", "NAMI", "ONUS", "USDT"];
        const codeOfAsset = [72, 447, 1, 86, 22];
        codeOfAsset.forEach((item, index) => {
            if (dataRow?.fee_metadata?.close_order?.currency === item) {
                setHoverItemsChose(assetCodeArray[index]);
            }
        });
    };

    useMemo(() => {
        const assetCodeArray = ["VNDC", "NAO", "NAMI", "ONUS", "USDT"];
        const codeOfAsset = [72, 447, 1, 86, 22];
       if (dataRow?.fee_metadata?.close_order?.currency === codeOfAsset[assetCodeArray.indexOf(hoverItemsChose)]) {
        setdDisabledButton(true);
       } else {
        setdDisabledButton(false);
       }
    }, [hoverItemsChose])

    const HandleConfirmModal = async () => {
        setSubmitting(true);
        const { data, status } = await axios
            .put(API_POST_CHANGE_FEES_CURRENCY_ORDER, {
                displaying_id: dataRow?.displaying_id,
                currency_change: hoverItemsChose.toLowerCase(),
                set_default: checkBox,
            })
            .catch((err) => {
                console.error(err);
                return {
                    data: {
                        status:
                            err.message === "Network Error"
                                ? "NETWORK_ERROR"
                                : "UNKNOWN",
                    },
                };
            });
        setSubmitting(false);

        if (data.status === "ok") {
            const message = t(`futures:mobile:change_success`);
            alertContext.alert.show(
                "success",
                t("common:success"),
                message,
                null,
                null,
                onClose()
            );
        } else {
            const requestId =
                data?.data?.requestId &&
                `(${data?.data?.requestId.substring(0, 8)})`;
            alertContext.alert.show(
                "error",
                t("common:failed"),
                t(`error:futures:${data.status || "UNKNOWN"}`),
                requestId
            );
        }
        onClose();
    };

    return (
        <Modal
            onusMode={true}
            isVisible={visibleModalFees}
            onBackdropCb={onClose}
            modalClassName="z-[99999999999]"
            containerStyle={{
                width: "100vw",
                transform: "translate(-50%,0)",
                left: "50%",
            }}
            onusClassName="min-h-[334px] rounded-2xl bg-onus-bgModal !px-4"
        >
            <div className="w-full" style={{ color: colors.wildSand }}>
                <div className="flex items-center w-full">
                    <h4 className="text-lg leading-6 font-bold pr-[10px]">
                        {t(`futures:mobile:trading_fees`)}
                    </h4>
                    <div
                        className="flex items-center justify-center rounded-full
                        w-4 h-4 cursor-pointer"
                        data-tip=""
                        data-for="header-tooltip"
                        id="header-tooltip-id"
                    >
                        <img src={"/images/screen/futures/logoguide.png"}/>
                    </div>
                    <Tooltip
                        id="header-tooltip"
                        place="bottom"
                        effect="solid"
                        arrowColor="transparent"
                        backgroundColor="bg-darkBlue-4"
                        className="!ml-[136px] !mt-1 !p-2 bg-[#071120] !opacity-100 !rounded-lg after:!border-t-onus-bg2 after:!left-3"
                        overridePosition={(e) => ({
                            left: 0,
                            top: e.top,
                        })}
                    >
                        <div className="font-medium w-[186px] text-xs leading-[18px] text-[#7586AD]">
                            {t('futures:mobile:tooltip_popup')}
                        </div>
                    </Tooltip>
                </div>
                <div className="!pt-2 w-full">
                    {renderAllCurrency}
                </div>
                <div className="w-full" onClick={() => setCheckBox(!checkBox)}>
                    <CheckBox
                        active={checkBox}
                        label={t(`futures:mobile:set_as_default_trading_fee`)}
                        boxContainerClassName={`${checkBox? "!bg-onus-base" : "!bg-onus-bg2"} border-none rounded-sm mr-[6px]`}
                        labelClassName="leading-[18px] font-medium text-xs text-onus-grey"
                        className="mb-6"
                        onChange={() => {}}
                    />
                </div>
                <Button
                    onusMode={true}
                    title={t(`futures:mobile:adjust_margin:confirm_btn`)}
                    componentType="button"
                    className={`!text-base !h-12 !font-semibold`}
                    type="primary"
                    disabled={ disabledButton || submitting || disableForAvailable}
                    onClick={HandleConfirmModal}
                />
            </div>
        </Modal>
    );
};

export default CurrencyPopup;
