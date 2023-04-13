import { useTranslation } from 'next-i18next';
import React from 'react';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import { DisputedType, REPORT_ABLE_TIME } from '../constants';
import { PartnerPersonStatus } from 'redux/actions/const';
import Countdown from 'react-countdown';

const AppealButton = ({ timeExpire, timeDispute = REPORT_ABLE_TIME, onMarkWithStatus }) => {
    const { t } = useTranslation(['dw_partner']);
    return timeExpire ? (
        <Countdown date={new Date(timeExpire).getTime()} renderer={({ props, ...countdownProps }) => props.children(countdownProps)}>
            {(props) => {
                return (
                    <ButtonV2 disabled={props.total > timeDispute} onClick={onMarkWithStatus} className="px-6 disabled:!cursor-default" variants="secondary">
                        {t('dw_partner:appeal')}
                    </ButtonV2>
                );
            }}
        </Countdown>
    ) : (
        <></>
    );
};

export default AppealButton;
