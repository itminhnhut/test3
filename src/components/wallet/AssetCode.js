import { useSelector } from 'react-redux';
import find from 'lodash/find';
import { useMemo } from 'react';

const AssetCode = (props) => {
    const { assetId } = props;
    const assetConfig = useSelector(state => state.utils.assetConfig);
    if (!assetConfig) return null;

    const assetCode = useMemo(() => {
        const filter = {};
        if (assetId !== undefined) filter.id = assetId;
        const config = find(assetConfig, filter);
        if (config) {
            return config.assetCode;
        }
        return '';
    }, [assetId]);

    return assetCode;
};

export default AssetCode;
