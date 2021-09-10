import find from 'lodash/find';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getMarketWatch } from 'redux/actions/market';
import { formatBalance, formatPercentage, getExchange24hPercentageChange, getS3Url, getSparkLine } from 'redux/actions/utils';

const AssetLineChart = () => {
    const { query } = useRouter();
    const assetConfig = useSelector(state => state.utils.assetConfig);

    const [percentage, setPercentage] = useState(0);
    const [assetCode, setAssetCode] = useState('');
    const [assetQuote, setAssetQuote] = useState('VNDC');
    const [assetName, setAssetName] = useState('');
    const [decimalLimit, setDecimalLimit] = useState(0);
    const [assetData, setAssetData] = useState(null);

    const fetchAssetData = async (asset, quote = 'VNDC') => {
        const result = await getMarketWatch(`${asset}${quote}`);
        if (result && result.length > 0) {
            setAssetData(result?.[0]);
            setPercentage(getExchange24hPercentageChange(result?.[0]));
        } else {
            setPercentage(0);
        }
    };

    const getLogoUrl = (asset) => {
        const filter = {};
        if (asset !== undefined) {
            filter.assetCode = asset;
        }
        const config = find(assetConfig, filter);
        let logoUrl = '/images/coins/no_logo.png';
        if (config) {
            logoUrl = config?.s3LogoUrl ? getS3Url(config?.s3LogoUrl) : '/images/coins/no_logo.png';
        }
        return logoUrl;
    };

    const formatAssetLatestPrice = () => {
        return assetData?.p ? formatBalance(assetData?.p, 2, true) + ' ' + assetQuote : '-';
    };

    useEffect(() => {
        if (query?.asset && query?.quote && assetConfig?.length > 0) {
            const filter = {};
            filter.assetCode = query?.asset;
            const config = find(assetConfig, filter);
            if (config) {
                setAssetName(config?.assetName);
                setDecimalLimit(config?.displayDigit);
            }
            setAssetCode(query?.asset);
            setAssetQuote(query?.quote);

            fetchAssetData(query?.asset, query?.quote);

            document.querySelector('body').classList.add('bg-transparent');
            document.querySelector('html').classList.add('bg-transparent');
        }
    }, [query, assetConfig]);

    const renderPercentage = () => {
        if (percentage >= 0) {
            return (
                <tspan
                    dy="2"
                    fill="#05B169"
                    xmlSpace="preserve"
                    style={{ whiteSpace: 'pre', dominantBaseline: 'central', textAnchor: 'middle', fontWeight: 500 }}
                    fontFamily="Barlow"
                    fontSize="21"
                    letterSpacing="-0.02em"
                >
                    {`+${formatPercentage(percentage, 2, true)}%`}
                </tspan>
            );
        }
        return (
            <tspan
                dy="2"
                fill="#E95F67"
                xmlSpace="preserve"
                style={{ whiteSpace: 'pre', dominantBaseline: 'central', textAnchor: 'middle', fontWeight: 500, padding: '0 24px' }}
                fontFamily="Barlow"
                fontSize="21"
                letterSpacing="-0.02em"
            >
                {formatPercentage(percentage, 2, true)}%
            </tspan>
        );
    };

    return (
        <div className="absolute inset-0 bg-transparent">
            <svg
                width="500"
                height="500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 500 500"
                fill="none"
                className="w-full h-full"
                xmlnsXlink="http://www.w3.org/1999/xlink"
            >
                <path xmlns="http://www.w3.org/2000/svg" d="M6 0.75H494C496.899 0.75 499.25 3.10051 499.25 6V495C499.25 497.347 497.347 499.25 495 499.25H5C2.65279 499.25 0.75 497.347 0.75 495V6.00001C0.75 3.10052 3.10051 0.75 6 0.75Z" fill="white" stroke="#EEF2FA" strokeWidth="1.5" />
                <rect width="498" height="498" rx="5" fill="white" x="1" y="1" />
                <image href="/images/logo/Attlas_Dark.png" width="167" height="161" x="363" y="30" />
                <g transform="translate(224, 24)">
                    <image
                        id="image0"
                        width="54"
                        height="54"
                        href={getLogoUrl(assetCode)}
                    />
                </g>
                <g transform="translate(250, 109)">
                    <text
                        fill=" #02083D"
                        xmlSpace="preserve"
                        style={{ whiteSpace: 'pre', dominantBaseline: 'central', textAnchor: 'middle', fontWeight: 600 }}
                        fontFamily="Barlow"
                        fontSize="24"
                        letterSpacing="-0.02em"
                    >
                        {assetName}
                    </text>
                </g>
                <g transform="translate(250, 160)">
                    <g transform="translate(0, 0)">
                        <text
                            fill="#02083D"
                            xmlSpace="preserve"
                            style={{ whiteSpace: 'pre', dominantBaseline: 'auto', textAnchor: 'middle' }}
                            fontFamily="Barlow"
                            fontSize="28"
                            letterSpacing="-0.02em"
                        >
                            <tspan style={{ whiteSpace: 'pre', dominantBaseline: 'central', textAnchor: 'middle', fontWeight: 600 }}>{formatAssetLatestPrice()}</tspan>
                            {' '}
                            {renderPercentage()}
                        </text>
                    </g>
                </g>
                <rect x="1" y="196" width="498" height="1" fill="#EEF2FA" />
                <g transform="translate(40, 255)">
                    <image href={getSparkLine(`${assetData?.b}${assetData?.q}`, percentage >= 0 ? '#05B169' : '#E95F67', '5m')} width="436" />
                </g>
                {/* <rect y="454" width="500" height="45" fill="#4021D0" fillOpacity="0.15" /> */}
                <path xmlns="http://www.w3.org/2000/svg" d="M0 455H500V495C500 497.761 497.761 500 495 500H5C2.23857 500 0 497.761 0 495V455Z" fill="#4021D0" fillOpacity="0.15" />
                <a href={`https://nami.exchange/spot/${assetCode}_${assetQuote}`} target="_blank" rel="noopener noreferrer">
                    <g transform="translate(484, 481.823)">
                        <text
                            fill="#4021D0"
                            xmlSpace="preserve"
                            style={{ whiteSpace: 'pre', textAnchor: 'end' }}
                            fontFamily="Barlow"
                            fontSize="14"
                            letterSpacing="-0.01em"
                        >
                            <tspan>View Price Chart</tspan>
                        </text>
                    </g>
                </a>
                <text
                    fill="#02083D"
                    xmlSpace="preserve"
                    style={{ whiteSpace: 'pre' }}
                    fontFamily="Barlow"
                    fontSize="14"
                    letterSpacing="-0.01em"
                >
                    <tspan x="16.1661" y="481.823">Powered by</tspan>
                </text>
                <a href="https://nami.exchange" target="_blank" rel="noreferrer noopener">
                    <text
                        fill="#4021D0"
                        xmlSpace="preserve"
                        style={{ whiteSpace: 'pre', fontWeight: 600 }}
                        fontFamily="Barlow"
                        fontSize="14"
                        fontWeight="bold"
                        letterSpacing="-0.01em"
                    >
                        <tspan x="98.438" y="481.823">Nami Exchange</tspan>
                    </text>
                </a>
            </svg>
        </div>
    );
};

export default AssetLineChart;
