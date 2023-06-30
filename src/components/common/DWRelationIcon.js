import React from 'react';
import { DwPartnerIconMulti, DwPartnerIconSingle } from 'components/svg/SvgIcon';

const DWRelationIcon = ({ userIsPartner }) => {
    return userIsPartner ? <DwPartnerIconMulti /> : <DwPartnerIconSingle />;
};
export default DWRelationIcon;
