import { useTranslation } from 'next-i18next';

import { NoDataDarkIcon, NoDataLightIcon } from 'components/common/V2/TableV2/NoData';

const NoData = () => {
    const { t } = useTranslation();

    return (
        <div className="flex items-center justify-center flex-col m-auto">
            <div className="block dark:hidden">
                <NoDataLightIcon />
            </div>
            <div className="hidden dark:block">
                <NoDataDarkIcon />
            </div>
            <div className="text-xs sm:text-sm text-txtSecondary dark:text-txtSecondary-dark mt-1">Bạn hiện không có NFT</div>
        </div>
    );
};
export default NoData;
