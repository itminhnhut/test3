import { CardNao, Column, ImageNao, Table } from 'components/screens/Nao/NaoStyle';
import React, { useEffect, useMemo, useState } from 'react';
import fetchApi from 'utils/fetch-api';
import { useTranslation } from 'next-i18next';
import Rank1Card from 'components/screens/Nao/YearSummary/Rank1Card';
import useWindowSize from 'hooks/useWindowSize';
import { getS3Url } from 'redux/actions/utils';
import { format } from 'date-fns';
// this is the mock data

// const mock = {
//     users: [
//         {
//             year: 2022,
//             total_volume: 12572043243.774212,
//             pnl_rate: 89.71,
//             total_pnl: 45722076.956990935,
//             total_margin: 50969210.448216006,
//             total_order: 69,
//             rank_pnl: 1,
//             rank_volume: 0,
//             rank_order: 0,
//             _id: '63a9e67290f6243ec7ac9efd',
//             user_id: 991914,
//             onus_user_id: '6277729711787636638',
//             name: 'Nguyễn Trần Phi Trúc',
//             avatar: null,
//             created_at: '2022-12-26T18:22:42.299Z',
//             updated_at: '2022-12-26T22:45:06.086Z',
//             __v: 0
//         },
//         {
//             year: 2022,
//             total_volume: 1551195024.5794115,
//             pnl_rate: 93.18,
//             total_pnl: 5766325.461936,
//             total_margin: 6188582.415999999,
//             total_order: 10,
//             rank_pnl: 2,
//             rank_volume: 0,
//             rank_order: 0,
//             _id: '63a9e64d90f6243ec7ac9ea7',
//             user_id: 785382,
//             onus_user_id: '6277729711982538654',
//             name: 'rahul',
//             avatar: null,
//             created_at: '2022-12-26T18:22:05.016Z',
//             updated_at: '2022-12-26T22:45:06.228Z',
//             __v: 0
//         },
//         {
//             year: 2022,
//             total_volume: 2087787096.4790967,
//             pnl_rate: 89.25,
//             total_pnl: 9400737.3772276,
//             total_margin: 10533035.164,
//             total_order: 16,
//             rank_pnl: 3,
//             rank_volume: 0,
//             rank_order: 0,
//             _id: '63a9e67890f6243ec7ac9f0c',
//             user_id: 776599,
//             onus_user_id: '6277729706911455134',
//             name: 'đinh xuân việt dũng',
//             avatar: null,
//             created_at: '2022-12-26T18:22:48.334Z',
//             updated_at: '2022-12-26T22:45:06.055Z',
//             __v: 0
//         },
//         {
//             year: 2022,
//             total_volume: 1018211983.0278211,
//             pnl_rate: 87.45,
//             total_pnl: 3719530.389744,
//             total_margin: 4253294.308,
//             total_order: 8,
//             rank_pnl: 4,
//             rank_volume: 0,
//             rank_order: 0,
//             _id: '63a9e68a90f6243ec7ac9f35',
//             user_id: 797007,
//             onus_user_id: '6277729711962570654',
//             name: 'pawan',
//             avatar: null,
//             created_at: '2022-12-26T18:23:06.987Z',
//             updated_at: '2022-12-26T22:45:05.954Z',
//             __v: 0
//         },
//         {
//             year: 2022,
//             total_volume: 1002813848.4773977,
//             pnl_rate: 83.9,
//             total_pnl: 3362782.0671900003,
//             total_margin: 4008239.6800000006,
//             total_order: 5,
//             rank_pnl: 5,
//             rank_volume: 0,
//             rank_order: 0,
//             _id: '63a9e6b090f6243ec7ac9f90',
//             user_id: 780944,
//             onus_user_id: '6277729712005052318',
//             name: 'sujit',
//             avatar: null,
//             created_at: '2022-12-26T18:23:44.975Z',
//             updated_at: '2022-12-26T22:45:05.858Z',
//             __v: 0
//         },
//         {
//             year: 2022,
//             total_volume: 13494110816.393728,
//             pnl_rate: 82.62,
//             total_pnl: 44951334.94054848,
//             total_margin: 54406082.552939996,
//             total_order: 68,
//             rank_pnl: 6,
//             rank_volume: 0,
//             rank_order: 0,
//             _id: '63a9e6ba90f6243ec7ac9fa6',
//             user_id: 1179526,
//             onus_user_id: '6277729711107721118',
//             name: 'Nguyen Tan Tu',
//             avatar: null,
//             created_at: '2022-12-26T18:23:54.981Z',
//             updated_at: '2022-12-26T22:45:05.803Z',
//             __v: 0
//         },
//         {
//             year: 2022,
//             total_volume: 22702579523.224873,
//             pnl_rate: 82.01,
//             total_pnl: 91617140.09705544,
//             total_margin: 111715679.49707599,
//             total_order: 92,
//             rank_pnl: 7,
//             rank_volume: 0,
//             rank_order: 0,
//             _id: '63a9e6c190f6243ec7ac9fb4',
//             user_id: 969137,
//             onus_user_id: '6277729711842324382',
//             name: 'Tô Thái Thành',
//             avatar: null,
//             created_at: '2022-12-26T18:24:01.532Z',
//             updated_at: '2022-12-26T22:45:05.774Z',
//             __v: 0
//         },
//         {
//             year: 2022,
//             total_volume: 1510208166.9412365,
//             pnl_rate: 77.2,
//             total_pnl: 14429115.07932152,
//             total_margin: 18691306.924999997,
//             total_order: 11,
//             rank_pnl: 8,
//             rank_volume: 0,
//             rank_order: 0,
//             _id: '63a9e6f190f6243ec7aca025',
//             user_id: 918032,
//             onus_user_id: '6277729711699648414',
//             name: 'arpit',
//             avatar: null,
//             created_at: '2022-12-26T18:24:49.910Z',
//             updated_at: '2022-12-26T22:45:05.551Z',
//             __v: 0
//         },
//         {
//             year: 2022,
//             total_volume: 1036410589.9361625,
//             pnl_rate: 69.99,
//             total_pnl: 3622774.80229104,
//             total_margin: 5176235.17466667,
//             total_order: 10,
//             rank_pnl: 9,
//             rank_volume: 0,
//             rank_order: 0,
//             _id: '63a9e58da425aa3eba262e5c',
//             user_id: 688987,
//             onus_user_id: '6277729707350794142',
//             name: 'Phùng Huy Hiếu',
//             avatar: 'https://wallet.vndc.io/api/images/content/VFss5wP3pvpP14Qr1XDfWgwD5N08f5EX8GGrORuOIUJ4fyT4KdgY5jERpS72DU9h_640x1138.jpeg',
//             created_at: '2022-12-26T18:18:53.314Z',
//             updated_at: '2022-12-31T13:05:38.701Z',
//             __v: 0
//         },
//         {
//             year: 2022,
//             total_volume: 1163981862.3827906,
//             pnl_rate: 67.21,
//             total_pnl: 15688091.745846,
//             total_margin: 23343072.48,
//             total_order: 11,
//             rank_pnl: 10,
//             rank_volume: 0,
//             rank_order: 0,
//             _id: '63a9e73d90f6243ec7aca0d8',
//             user_id: 1101435,
//             onus_user_id: '6277729711878911902',
//             name: '767676',
//             avatar: null,
//             created_at: '2022-12-26T18:26:05.277Z',
//             updated_at: '2022-12-26T22:45:05.308Z',
//             __v: 0
//         }
//     ],
//     last_time_update: 1672504200040
// };

function RankList({ url = '', information = [], rankFieldName = '', version }) {
    const [data, setData] = useState({
        users: [],
        last_time_update: 0
    });

    const { width } = useWindowSize();
    const { t } = useTranslation();

    useEffect(() => {
        fetchApi({
            url,
            options: {
                method: 'GET'
            }
        }).then((res) => {
            if (res.status === 'ok') {
                setData(res.data);
            }
        });
    }, []);

    const { rank1User, restUsers } = useMemo(() => {
        const users = data.users || [];
        return {
            rank1User: users[0] || {},
            restUsers: users.slice(1)
        };
    }, [data]);

    const renderRank = (data) => {
        return (
            <div
                className="relative w-6 h-6"
                style={{
                    backgroundImage: `url(${getS3Url('/images/nao/contest/ic_top_teal.png')})`,
                    backgroundSize: 'cover'
                }}
            >
                <div className="font-bold text-[0.625rem] leading-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 absolute text-white">{data}</div>
            </div>
        );
    };

    const renderUser = (name, record) => {
        return (
            <div className="flex items-center">
                <ImageNao className="rounded-full w-6 h-6 object-cover" src={record.avatar} alt={name} />
                <span className="font-bold ml-3">{name}</span>
            </div>
        );
    };

    return (
        <div>
            <Rank1Card record={rank1User} information={information} />

            {width <= 640 ? (
                <div className="mt-3 text-sm sm:text-base">
                    {restUsers.map((record, index) => {
                        return (
                            <CardNao key={record._id} className="mt-3 !py-[1.125rem] !px-3 ">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <ImageNao
                                            className="rounded-[50%] object-cover w-9 h-9 flex-shrink-0"
                                            src={record?.avatar}
                                            width="36"
                                            height="36"
                                            alt=""
                                        />
                                        <div className="space-y-1 flex flex-col">
                                            <span className="font-semibold">{record.name}</span>
                                            <span className="text-txtSecondary dark:text-txtSecondary-dark cursor-pointer capitalize">
                                                {record.onus_user_id}
                                            </span>
                                        </div>
                                    </div>
                                    {renderRank(record[rankFieldName] || index + 2)}
                                </div>
                                <div className="flex-1 mt-8">
                                    <div className="space-y-2">
                                        {information.map((item) => {
                                            const value = record[item.valueKey];
                                            return (
                                                <div key={item.valueKey} className="flex justify-between">
                                                    <span className="text-sm text-txtSecondary dark:text-txtSecondary-dark">{item.label}</span>
                                                    {item.render ? item.render(value) : value}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </CardNao>
                        );
                    })}
                </div>
            ) : (
                <Table loading={false} noItemsMessage={t('nao:contest:no_rank')} dataSource={restUsers}>
                    <Column
                        minWidth={50}
                        className="text-txtSecondary dark:text-txtSecondary-dark"
                        title={t('nao:contest:rank')}
                        fieldName={rankFieldName}
                        cellRender={renderRank}
                    />
                    <Column minWidth={200} title={t('nao:contest:name')} fieldName="name" cellRender={renderUser} />
                    <Column
                        minWidth={150}
                        className="text-txtPrimary dark:text-txtPrimary-dark capitalize"
                        title={`ID NAO Futures`}
                        fieldName="onus_user_id"
                    />
                    {information.map((item) => {
                        return (
                            <Column key={item.valueKey} minWidth={150} align="right" title={item.label} fieldName={item.valueKey} cellRender={item.render} />
                        );
                    })}
                </Table>
            )}
            <div className="text-txtSecondary dark:text-txtSecondary-dark text-xs sm:text-sm mt-4">
                <span>
                    {t('nao:year_summary:last_time_update')}
                    {': '}
                </span>
                <span>{format(new Date(data.last_time_update), 'HH:mm:ss dd/MM/yyy')}</span>
            </div>
        </div>
    );
}

export default React.memo(RankList, (prevProps, nextProps) => {
    return prevProps.url === nextProps.url;
});
