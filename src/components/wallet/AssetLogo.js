import { useSelector } from 'react-redux';
import find from 'lodash/find';
import { getS3Url } from 'redux/actions/utils';
import { useMemo } from 'react';
import Image from 'next/image';

const AssetLogo = (props) => {
    const { size, assetCode, assetId, useNextImg } = props;
    const assetConfig = useSelector(state => state.utils.assetConfig);
    const logoSize = size || 32;

    if (!assetConfig) return null;

    const assetLogo = useMemo(() => {
        const filter = {};
        if (assetCode !== undefined) filter.assetCode = assetCode;
        if (assetId !== undefined) filter.id = assetId;
        const config = find(assetConfig, filter);
        if (config) {
            const logoUrl = getS3Url(`/images/coins/64/${config?.id}.png`);
            if (useNextImg) {
                return <Image src={logoUrl} width={`${logoSize}`} height={`${logoSize}`} />;
            }
            return <img
                src={logoUrl}
                alt=""
                style={{ minWidth: logoSize }}
                width={logoSize}
                height={logoSize}
            />;
        }
        return <img src="/images/icon/ic_exchange_unknown.png" style={{ minWidth: logoSize }} width={logoSize} height={logoSize} alt="" />;
    }, [size, assetCode, assetId, assetConfig]);

    return assetLogo;
};

export default AssetLogo;
