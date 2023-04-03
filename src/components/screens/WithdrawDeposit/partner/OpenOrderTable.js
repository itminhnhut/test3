import React, { useState } from 'react';
import TableV2 from 'components/common/V2/TableV2';
import Countdown from 'react-countdown';
import CircleCountdown from '../components/common/CircleCountdown';
import TextCopyable from 'components/screens/Account/TextCopyable';
import { getAssetCode, formatTime, formatBalance } from 'redux/actions/utils';
import AssetLogo from 'components/wallet/AssetLogo';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import TagV2 from 'components/common/V2/TagV2';
import TabV2 from 'components/common/V2/TabV2';

const getColumns = () => [
    {
        key: 'timeExpire',
        dataIndex: 'timeExpire',
        title: 'Trạng thái',
        align: 'left',
        width: 107,
        render: (row) => <CircleCountdown size={34} textSize={10} timeExpire={row} />
    },
    {
        key: 'displayingId',
        dataIndex: 'displayingId',
        title: 'Mã giao dịch',
        align: 'left',
        width: 124,
        render: (row) => <TextCopyable text={row} />
    },
    {
        key: 'baseAssetId',
        dataIndex: 'baseAssetId',
        title: 'Mã giao dịch',
        align: 'left',
        width: 148,
        render: (row) => {
            const assetCode = getAssetCode(row);
            return (
                <div className="flex gap-2 items-center">
                    <AssetLogo assetCode={assetCode} size={32} useNextImg /> <div>{assetCode}</div>
                </div>
            );
        }
    },
    {
        key: 'createdAt',
        dataIndex: 'createdAt',
        title: 'Thời gian',
        align: 'left',
        width: 196,
        render: (row) => {
            return formatTime(row, 'HH:mm:ss dd/MM/yyyy');
        }
    },
    {
        key: 'baseQty',
        dataIndex: 'baseQty',
        title: 'Số lượng',
        align: 'right',
        width: 152,
        render: (row) => {
            return formatBalance(row);
        }
    },
    {
        key: 'partner',
        dataIndex: 'partnerMetadata',
        title: 'Đến',
        align: 'left',
        width: 152,
        render: (row) => {
            return (
                <div>
                    <div className="">{row.name}</div>
                    <div className="text-sm dark:text-txtSecondary-dark text-txtSecondary">{row.code}</div>
                </div>
            );
        }
    },
    {
        key: 'action',
        dataIndex: '',
        title: '',
        align: 'left',
        width: 171,
        render: (row) => {
            return (
                <ButtonV2 disabled variants="secondary">
                    Đã nhận tiền
                </ButtonV2>
            );
        }
    }
];

const dataTable = [
    {
        status: 0,
        userStatus: 0,
        partnerStatus: 0,
        partnerCommissionRecieved: false,
        _id: '6422a2ffc970c94477c283e9',
        displayingId: '794SCE',
        userId: 18,
        side: 'BUY',
        baseQty: 500000,
        baseAssetId: 72,
        quoteQty: 500000,
        quoteAssetId: 24,
        price: 1,
        partnerUserId: 1823,
        partnerMetadata: {
            _id: '624125493bb388239f5b0bd1',
            analyticMetadata: {
                avgTime: 1170217.7826086956,
                count: 30,
                totalValue: 81035757
            },
            avatar: 'https://thao68.com/wp-content/uploads/2022/02/avatar-sammy-dao-1.jpg',
            createdAt: '2022-01-06T10:04:32.727Z',
            name: 'Partner Kidd',
            orderConfig: {
                buy: {
                    min: 100000,
                    max: 50000000,
                    status: 1,
                    partnerMax: 50000000,
                    partnerMin: 100000
                },
                sell: {
                    min: 500000,
                    max: 50000000,
                    status: 1,
                    partnerMax: 50000000,
                    partnerMin: 100000
                }
            },
            partnerId: 'P1823',
            partnerMetadata: {
                maintainVolume: 200000000
            },
            phone: '12345678',
            startedAt: '2022-01-04T07:08:29.456Z',
            status: 1,
            type: 4,
            updatedAt: '2023-03-28T08:19:00.034Z',
            userId: 1823,
            code: 'Nami653PLH1823'
        },
        transferMetadata: {
            bankName: 'DemoBank - Ngân hàng TMCP Demo',
            bankCode: '970433',
            accountNumber: '1786237845324',
            accountName: 'Nhi Tran ',
            note: 'CK 794SCE NGUYEN DUC TRUNG',
            QR: '00020101021238570010A00000072701270006970433011317862378453240208QRIBFTTA530370454065000005802VN62300826CK 794SCE NGUYEN DUC TRUNG63043CA6'
        },
        createdAt: '2023-03-28T08:19:11.872Z',
        updatedAt: '2023-03-28T08:19:11.891Z',
        __v: 0,
        timeExpire: 1679992200000
    },
    {
        status: 0,
        userStatus: 0,
        partnerStatus: 0,
        partnerCommissionRecieved: false,
        _id: '6422b1f897be580ee2e95cdc',
        displayingId: '543PLH',
        userId: 18,
        side: 'SELL',
        baseQty: 1000000,
        baseAssetId: 72,
        quoteQty: 1000000,
        quoteAssetId: 24,
        price: 1,
        partnerUserId: 1823,
        partnerMetadata: {
            _id: '624125493bb388239f5b0bd1',
            analyticMetadata: {
                avgTime: 1170217.7826086956,
                count: 30,
                totalValue: 81035757
            },
            avatar: 'https://thao68.com/wp-content/uploads/2022/02/avatar-sammy-dao-1.jpg',
            createdAt: '2022-01-06T10:04:32.727Z',
            name: 'Partner Kidd',
            orderConfig: {
                buy: {
                    min: 100000,
                    max: 705032704,
                    status: 1,
                    partnerMax: 50000000,
                    partnerMin: 100000
                },
                sell: {
                    min: 500000,
                    max: 50000000,
                    status: 1,
                    partnerMax: 50000000,
                    partnerMin: 100000
                }
            },
            partnerId: 'P1823',
            partnerMetadata: {
                maintainVolume: 200000000
            },
            phone: '12345678',
            startedAt: '2022-01-04T07:08:29.456Z',
            status: 1,
            type: 4,
            updatedAt: '2023-03-28T09:23:00.056Z',
            userId: 1823,
            code: 'Nami653PLH1823'
        },
        transferMetadata: {
            bankName: 'VPBank - Ngân hàng TMCP Việt Nam Thịnh Vượng',
            bankCode: '970432',
            accountNumber: '140061476_',
            accountName: 'NGUYEN DUC TRUNG2',
            note: 'CK 543PLH NGUYEN DUC TRUNG',
            QR: '00020101021238540010A000000727012400069704320110140061476_0208QRIBFTTA5303704540710000005802VN62300826CK 543PLH NGUYEN DUC TRUNG630411AD'
        },
        createdAt: '2023-03-28T09:23:04.382Z',
        updatedAt: '2023-03-28T09:23:04.415Z',
        __v: 0,
        timeExpire: '2023-03-28T09:28:04.382Z'
    }
];

const OpenOrderTable = () => {
    const [tab, setTab] = useState(1);

    return (
        <div>
            <div className="mb-3">
                <TabV2
                    activeTabKey={tab}
                    onChangeTab={(key) => setTab(key)}
                    tabs={[
                        {
                            key: 1,
                            children: <div className="capitalize">Mua</div>
                        },
                        {
                            key: 2,
                            children: <div className="capitalize">Bán</div>
                        }
                    ]}
                />
            </div>
            <TableV2
                limit={10}
                skip={0}
                useRowHover={false}
                data={dataTable}
                columns={getColumns()}
                rowKey={(item) => item?.key}
                scroll={{ x: true }}
                height={404}
                className="border border-divider dark:border-divider-dark rounded-lg pt-4"
                tableStyle={{
                    fontSize: '16px',
                    padding: '16px',
                    headerFontStyle: { 'font-size': `14px !important` }
                }}
                pagingPrevNext={{
                    page: 0,
                    hasNext: false,
                    onChangeNextPrev: (e) => {},
                    language: 'vi'
                }}
                emptyTextContent={'Không có giao dịch nào'}
            />
        </div>
    );
};

export default OpenOrderTable;
