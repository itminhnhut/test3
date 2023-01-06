import { CardNao, Column, ImageNao, Table } from 'components/screens/Nao/NaoStyle';
import React, { useEffect, useMemo, useState } from 'react';
import fetchApi from 'utils/fetch-api';
import { useTranslation } from 'next-i18next';
import Rank1Card from 'components/screens/Nao/YearSummary/Rank1Card';
import useWindowSize from 'hooks/useWindowSize';
import { getS3Url } from 'redux/actions/utils';
import { format } from 'date-fns';

function RankList({
    url = '',
    information = [],
    rankFieldName = ''
}) {
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
        })
            .then((res) => {
                if (res.status === 'ok') {
                    setData(res.data);
                }
            });
    }, []);

    const {
        rank1User,
        restUsers
    } = useMemo(() => {
        const users = data.users || []
        return {
            rank1User: users[0] || {},
            restUsers: users.slice(1)
        };
    }, [data]);

    const renderRank = (data) => {
        return (
            <div
                className='relative w-6 h-6'
                style={{
                    backgroundImage: `url(${getS3Url("/images/nao/year_summary/bg-rank-nao.png")})`,
                    backgroundSize: 'cover'
                }}
            >
                <div
                    className='absolute text-bold text-white inset-0 text-center text-[0.625rem] leading-6'>{data}</div>
            </div>
        );
    };

    const renderUser = (name, record) => {
        return <div className='flex items-center'>
            <ImageNao className='rounded-full w-6 h-6 object-cover' src={record.avatar} alt={name} />
            <span className='font-bold ml-3'>{name}</span>
        </div>;
    };

    return (
        <div>
            <Rank1Card
                record={rank1User}
                information={information}
            />

            {width <= 640 ? (
                <CardNao noBg className='mt-6 !py-[1.125rem] !px-3'>
                    <div
                        className='flex mx-3 gap-6 text-nao-grey text-sm font-medium pb-2 border-b border-nao-grey/[0.2]'>
                        <div className='min-w-[31px]'>{t('nao:contest:rank')}</div>
                        <div>{t('nao:contest:information')}</div>
                    </div>
                    <div>
                        {restUsers.map((record, index) => {
                            return (
                                <div key={record._id}
                                     className='flex justify-between p-3 gap-6 even:bg-nao/[0.15] even:rounded-lg'>
                                    <div className='min-w-[31px]'>{renderRank(record[rankFieldName] || index + 2)}</div>
                                    <div className='flex-1'>
                                        <div className='flex justify-between items-center mb-2'>
                                            <div className='min-w-0'>
                                                <p className='text-sm font-bold'>{record.name}</p>
                                                <span
                                                    className='text-sm text-nao-grey font-medium break-words'><span className='hidden xsm:inline'>ID: </span>{record.onus_user_id}</span>
                                            </div>
                                            <ImageNao
                                                className='w-[44px] h-[44px] object-cover rounded-full'
                                                src={record.avatar}
                                            />
                                        </div>
                                        <div className='space-y-1'>
                                            {information.map(item => {
                                                const value = record[item.valueKey];
                                                return <div key={item.valueKey} className='flex justify-between'>
                                                    <span
                                                        className='text-sm text-nao-grey font-medium'>{item.label}</span>
                                                    {item.render ? item.render(value) : value}
                                                </div>;
                                            })}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardNao>
            ) : (
                <Table loading={false} noItemsMessage={t('nao:contest:no_rank')} dataSource={restUsers}>
                    <Column minWidth={50}
                            className='text-nao-grey font-medium' title={t('nao:contest:rank')}
                            fieldName={rankFieldName} cellRender={renderRank} />
                    <Column minWidth={200} title={t('nao:contest:name')} fieldName='name'
                            cellRender={renderUser} />
                    <Column minWidth={150} className='text-nao-text capitalize' title={'ID ONUS Futures'}
                            fieldName='onus_user_id' />
                    {information.map(item => {
                        return <Column
                            key={item.valueKey}
                            minWidth={150}
                            align='right'
                            title={item.label}
                            fieldName={item.valueKey}
                            cellRender={item.render}
                        />;
                    })}
                </Table>
            )}
            <div className='text-nao-grey font-medium text-sm mt-6'>
                <span>{t('nao:year_summary:last_time_update')}{': '}</span><span>{format(new Date(data.last_time_update), 'HH:mm:ss dd/MM/yyy')}</span>
                </div>
        </div>
    );
}

export default React.memo(RankList, (prevProps, nextProps) => {
    return prevProps.url === nextProps.url;
});
