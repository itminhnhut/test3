import { useSelector } from 'react-redux';
import find from 'lodash/find';
import { getS3Url } from 'redux/actions/utils';

const AssetLogo = (props) => {
    const { size, assetCode, assetId } = props;
    const assetConfig = useSelector(state => state.utils.assetConfig);
    const logoSize = size || 32;

    if (!assetConfig) return null;
    const filter = {};

    if (assetCode !== undefined) filter.assetCode = assetCode;
    if (assetId !== undefined) filter.id = assetId;
    const config = find(assetConfig, filter);
    if (config) {
        const logoUrl = getS3Url(`/images/coins/64/${config?.id}.png`);
        return <img src={logoUrl} style={{ minWidth: logoSize }} width={logoSize} height={logoSize} alt={config?.assetCode} />;
    }
    return <img src="/images/coins/no_logo.png" style={{ minWidth: logoSize }} width={logoSize} height={logoSize} alt="no-logo" />;
};

export default AssetLogo;
