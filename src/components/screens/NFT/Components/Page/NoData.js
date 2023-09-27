import Button from 'components/common/V2/ButtonV2/Button';
import { NoDataDarkIcon, NoDataLightIcon } from 'components/common/V2/TableV2/NoData';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';

const NoData = ({ isWallet }) => {
    const { t } = useTranslation();

    return (
        <div className="flex items-center justify-center flex-col m-auto">
            <div className="block dark:hidden">
                <NoDataLightIcon />
            </div>
            <div className="hidden dark:block">
                <NoDataDarkIcon />
            </div>
            {!isWallet ? (
                <div className="text-xs sm:text-sm text-txtSecondary dark:text-txtSecondary-dark mt-1">{t('common:no_data')}</div>
            ) : (
                <>
                    <div className="mb-4">{t('nft:wallet_no_data')}</div>
                    <Link href="/nft">
                        <Button>{t('nft:to_nft')}</Button>
                    </Link>
                </>
            )}
        </div>
    );
};
export default NoData;
