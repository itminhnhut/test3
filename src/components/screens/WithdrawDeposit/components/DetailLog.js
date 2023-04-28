import classNames from 'classnames';
import React from 'react';
import { PartnerOrderLog, PartnerOrderStatusLog } from 'redux/actions/const';
import { formatTime } from 'redux/actions/utils';
import styled from 'styled-components';
import colors from 'styles/colors';
import { MODE } from '../constants';
import { SIDE } from 'redux/reducers/withdrawDeposit';
import { useTranslation } from 'next-i18next';
import { BxsImage } from 'components/svg/SvgIcon';

const Row = styled.div.attrs({
    className: 'relative'
})`
    .line {
        box-sizing: border-box;
        position: absolute;
        inset: 6px auto -32px -3px;
        border-left: 1px solid currentColor;
    }
    .dot {
        left: -6px;
        top: 6px;
    }
    &:last-child {
        .line {
            display: none;
        }
        .dot {
            background: #fff !important;
            width: 16px;
            height: 16px;
            border: 3px solid ${({ isReject }) => (isReject ? colors.red[2] : colors.teal)};
            left: -10px;
            top: 4px;
        }
    }
`;

const Dot = styled.div.attrs({
    className: 'w-2 h-2 -left-1 rounded-full bg-gray-7 text-divider dark:text-divider-dark dot absolute'
})``;

const Line = styled.div.attrs({ className: 'line text-divider dark:text-divider-dark' })``;
const DetailLog = ({ orderDetail, onShowProof, mode }) => {
    const { t } = useTranslation();
    const logs = orderDetail?.logMetadata || [];
    const side = orderDetail?.side || '';
    return logs && logs.length ? (
        <div className="mt-12">
            <div className="text-[18px] font-semibold mb-6">{t('common:global_label.history')}</div>
            <div className="dark:bg-darkBlue-3 border-divider border dark:border-0 bg-bgPrimary rounded-xl p-6 space-y-4 ">
                {logs.map((log, logIndex, orginArr) => {
                    let contentLog = '',
                        contentObj = {},
                        viewProof = null;
                    const isReject = log.status === PartnerOrderStatusLog.DISPUTED || log.status === PartnerOrderStatusLog.REJECTED;
                    const isCurrent = logIndex === orginArr.length - 1;
                    switch (log.type) {
                        case PartnerOrderLog.CREATED:
                            contentLog = 'created';
                            break;
                        case PartnerOrderLog.ACCEPTED:
                            contentLog = 'accept';
                            break;
                        case PartnerOrderLog.REJECTED:
                            contentLog = 'reject';
                            break;
                        case PartnerOrderLog.CANCELED:
                            contentLog = 'cancel';

                            break;
                        case PartnerOrderLog.TRANSFERRED_FIAT:
                            contentLog = 'transferred';
                            break;
                        case PartnerOrderLog.RECEIVED_FIAT:
                            contentLog = 'received_fiat';
                            break;
                        case PartnerOrderLog.UPLOADED:
                            contentLog = 'uploaded_proof';
                            viewProof = (
                                <div onClick={onShowProof} className="hover:opacity-70 cursor-pointer text-dominant font-semibold flex items-center space-x-2">
                                    <BxsImage />
                                    <span>{t('dw_partner:logs.view_proof')}</span>
                                </div>
                            );
                            break;
                        case PartnerOrderLog.DISPUTED:
                            contentLog = 'dispute';
                            contentObj = {
                                mode: t(`dw_partner:${side === SIDE.BUY ? MODE.PARTNER : MODE.USER}`).toLowerCase()
                            };
                            break;
                        case PartnerOrderLog.COMPLETED_DISPUTE:
                            contentLog = 'resolve_dispute';
                            contentObj = {
                                mode: t(`dw_partner:${side === SIDE.BUY ? MODE.PARTNER : MODE.USER}`).toLowerCase()
                            };
                            break;
                        case PartnerOrderLog.TIMEOUT_NOT_ACCEPT:
                            contentLog = 'timeout_not_accept';
                            break;
                        case PartnerOrderLog.TIMEOUT_NOT_RECEIVE:
                            contentLog = 'timeout_not_receive';
                            contentObj = {
                                mode: t(`dw_partner:${side === SIDE.BUY ? MODE.PARTNER : MODE.USER}`).toLowerCase()
                            };
                            break;
                        case PartnerOrderLog.TIMEOUT_NOT_TRANSFER:
                            contentLog = 'timeout_not_transfer';
                            contentObj = {
                                mode: t(`dw_partner:${side === SIDE.BUY ? MODE.USER : MODE.PARTNER}`).toLowerCase()
                            };
                            break;
                        case PartnerOrderLog.SYSTEM_UPDATE_DISPUTE:
                            contentLog = 'system_dispute';
                            break;
                        case PartnerOrderLog.SYSTEM_UPDATE_REJECT:
                            contentLog = 'system_reject';
                            break;
                        case PartnerOrderLog.SYSTEM_UPDATE_SUCCESS:
                            contentLog = 'system_success';
                            break;
                        default:
                            break;
                    }

                    return (
                        <React.Fragment key={logIndex}>
                            <Row
                                isReject={isReject}
                                className={classNames('relative txtSecond-2', {
                                    '!text-txtPrimary dark:!text-txtPrimary-dark': isCurrent
                                })}
                            >
                                <Line />
                                <Dot />
                                <div className="ml-6 space-y-2 md:space-y-0 flex-wrap flex justify-between items-center">
                                    <div
                                        className={classNames('w-full space-y-2 md:space-y-0 flex-wrap md:w-auto flex items-center', {
                                            'font-semibold': isCurrent
                                        })}
                                    >
                                        <span>{t(`dw_partner:logs.${contentLog}`, contentObj)}</span>
                                        {viewProof && <div className="w-full md:w-auto md:ml-6"> {viewProof}</div>}
                                    </div>
                                    <span className="md:text-right md:w-auto w-full">{formatTime(log.time, 'HH:mm:ss dd/MM/yyyy')}</span>
                                </div>
                            </Row>
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    ) : (
        <></>
    );
};

export default DetailLog;
