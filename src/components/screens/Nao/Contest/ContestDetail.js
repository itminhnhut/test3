import React, { useState, useEffect, useRef, useContext, useMemo } from 'react';
import classNames from 'classnames';
import { TextLiner, CardNao, ButtonNao, Table, Column, getColor, renderPnl, useOutsideAlerter, capitalize, ImageNao, ButtonNaoVariants } from 'components/screens/Nao/NaoStyle';
import { useTranslation } from 'next-i18next';
import fetchApi from 'utils/fetch-api';
import { API_CONTEST_GET_GROUP_MEMBER, API_CONTEST_CANCEL_INVITE, API_CONTEST_POST_ACCEPT_INVITATION } from 'redux/actions/apis';
import { ApiStatus } from 'redux/actions/const';
import { getS3Url, formatNumber } from 'redux/actions/utils';
import useWindowSize from 'hooks/useWindowSize';
import Skeletor from 'components/common/Skeletor';
import Modal from 'components/common/ReModal';
import { WarningIcon } from '../AlertNaoV2Modal';
import { AlertContext } from 'components/common/layouts/LayoutNaoToken';
import AddMemberModal from './season2/AddMemberModal';
import { IconLoading } from 'components/common/Icons';
import colors from 'styles/colors';
import TickFbIcon from 'components/svg/TickFbIcon';
import { NoDataDarkIcon, NoDataLightIcon } from 'components/common/V2/TableV2/NoData';
import SvgCross from 'components/svg/Cross';

const statusMember = {
    PENDING: 0,
    ACCEPTED: 1,
    DENIED: 2,
    CANCELED: 3
};

const statusGroup = {
    PENDING: 0,
    ENABLE: 1
};

const ContestDetail = ({ visible = true, onClose, sortName = 'volume', rowData, previous, contest_id, rules }) => {
    const quoteAsset = rowData?.quoteAsset ?? 'VNDC';
    const context = useContext(AlertContext);
    const { t } = useTranslation();
    const { width } = useWindowSize();
    const [dataSource, setDataSource] = useState(null);
    const [loading, setLoading] = useState(true);
    const isLeader = rowData?.is_leader === 1;
    const [showAddMemberModal, setShowAddMemberModal] = useState(false);
    const member = useRef(null);
    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        getDetail(rowData?.displaying_id);
    }, [rowData]);

    const getDetail = async (id) => {
        try {
            const { data, status } = await fetchApi({
                url: API_CONTEST_GET_GROUP_MEMBER,
                params: {
                    contest_id: contest_id,
                    displaying_id: id,
                    quoteAsset: quoteAsset
                }
            });
            if (data && status === ApiStatus.SUCCESS) {
                if (isLeader) {
                    const length = data.members.length;
                    for (let i = 1; i <= 4 - length; i++) {
                        data.members.push(null);
                    }
                }
                setDataSource(data);
            }
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    const onCancelInvite = async (user, index) => {
        if (!user) return;
        setDisabled(true);
        try {
            const { data, status } = await fetchApi({
                url: API_CONTEST_CANCEL_INVITE,
                options: { method: 'POST' },
                params: {
                    contest_id: contest_id,
                    invite_onus_user_id: user.onus_user_id
                }
            });
            if (!index) return;
            if (status === ApiStatus.SUCCESS) {
                const _dataSource = { ...dataSource };
                const members = [..._dataSource?.members];
                members[index] = null;
                _dataSource.members = members;
                context.alertV2.show('success', t('nao:contest:delete_successfully'), t('nao:contest:delete_message', {username: user.name}), null, null, () => {
                    setDataSource(_dataSource);
                });
            } else {
                context.alertV2.show('error', t('common:failed'), t(`error:futures:${status || 'UNKNOWN'}`));
            }
        } catch (e) {
            console.log(e);
        } finally {
            setDisabled(false);
        }
    };

    const renderStatusMember = (status) => {
        if (status === undefined) return '-';
        const baseClass = 'rounded-[800px] px-2 text-xs sm:text-sm font-semibold py-[2px] whitespace-nowrap';
        let html = '';
        switch (status) {
            case statusMember.PENDING:
                html = <div className={`${baseClass} text-yellow-2 bg-yellow-2/[0.1]`}>{t('nao:contest:status_pending')}</div>;
                break;
            case statusMember.ACCEPTED:
                html = <div className={`${baseClass} text-green-2 bg-green-2/[0.1]`}>{t('nao:contest:status_joined')}</div>;
                break;
            case statusMember.DENIED:
                html = <div className={`${baseClass} text-red-2 bg-red-2/[0.1]`}>{t('nao:contest:status_declined')}</div>;
                break;
            case statusMember.CANCELED:
                html = <div className={`${baseClass} text-txtSecondary dark:text-txtSecondary-dark bg-gray-13/[0.7] dark:bg-dark-4/[0.5]`}>CANCELED</div>;
                break;
            default:
                html = '';
                break;
        }
        return html;
    };

    const validatorLeader = (item) => {
        return ((item?.status === statusMember.PENDING || item?.status === statusMember.DENIED) && isLeader) || !item?.onus_user_id;
    };

    const renderActions = (e, item) => {
        const invalid = !validatorLeader(item);
        if (invalid) return;
        switch (item?.status) {
            case statusMember.PENDING:
                return t('nao:contest:delete_invitation');
            case statusMember.DENIED:
                return t('nao:contest:add_member');
            default:
                return t('nao:contest:add_member');
        }
    };

    const onActions = (item, index) => {
        member.current = { ...item, rowIndx: index };
        if (disabled) return;
        switch (item?.status) {
            case statusMember.PENDING:
                context.alertV2.show(
                    'warning',
                    t('nao:contest:delete_invitation'),
                    t('nao:contest:delete_content', { value: item.name }),
                    null,
                    () => {
                        onCancelInvite(item, index);
                    },
                    null,
                    { confirmTitle: t('nao:contest:delete_invitation') }
                );
                break;
            case statusMember.DENIED:
                onAddMember();
                break;
            default:
                onAddMember();
                break;
        }
    };

    const onAddMember = (data) => {
        if (data) {
            const _dataSource = { ...dataSource };
            const members = [..._dataSource?.members];
            members[member.current?.rowIndx] = data;
            _dataSource.members = members;
            setDataSource(_dataSource);
            if (member.current?.status === statusMember.DENIED) onCancelInvite(member.current?.onus_user_id);
        }
        setShowAddMemberModal(!showAddMemberModal);
    };

    const onAccept = () => {
        if (disabled) return;
        context.alertV2.show(
            'team',
            t('nao:contest:confirm_title'),
            t('nao:contest:confirm_description', { value: dataSource.name }),
            null,
            () => {
                acceptInvite(dataSource);
            },
            null,
            { confirmTitle: t('nao:contest:confirm_accept') }
        );
    };

    const acceptInvite = async (group) => {
        setDisabled(true);
        try {
            const { data, status } = await fetchApi({
                url: API_CONTEST_POST_ACCEPT_INVITATION,
                options: { method: 'POST' },
                params: {
                    contest_id: contest_id,
                    group_displaying_id: group?.displaying_id,
                    action: 'ACCEPT'
                }
            });
            if (status === ApiStatus.SUCCESS) {
                setTimeout(() => context.alertV2.show('success', t('nao:contest:join_success'), t('nao:contest:join_message', { teamname: group.name }), null, null, () => {
                    onClose('trigger');
                }), 500);
            } else {
                setTimeout(
                    () => context.alertV2.show('error', t('common:failed'), t(`error:futures:${status || 'UNKNOWN'}`)),
                    500
                );

            }
        } catch (e) {
            console.log(e);
        } finally {
            setDisabled(false);
        }
    };

    const renderName = (data, item) => {
        return (
            <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-[50%] bg-bgPrimary dark:bg-bgPrimary-dark flex items-center justify-center">
                    {item?.onus_user_id && (
                        <ImageNao
                            className="rounded-[50%] min-w-[32px] min-h-[32px] max-w-[32px] max-h-[32px]"
                            src={item?.avatar}
                            width="24"
                            height="24"
                            alt=""
                        />
                    )}
                </div>
                <div>{capitalize(data) ?? t('nao:contest:member', { value: item?.rowIndex + 1 })}</div>
                {item?.is_onus_master && <TickFbIcon size={16} />}
            </div>
        );
    };

    const onRedirect = () => {
        window.open(rules, '_blank');
    };

    const isPending = useMemo(() => {
        return {
            person: dataSource?.status === statusGroup.PENDING && rowData?.isPending,
            group: dataSource?.status === statusGroup.PENDING
        };
    }, [dataSource]);

    const isMobile = width <= 640;
    const rank = sortName === 'pnl' ? 'current_rank_pnl' : 'current_rank_volume';
    const visibleStatus = contest_id > 8;

    return (
        <>
            {showAddMemberModal && <AddMemberModal onClose={onAddMember} contest_id={contest_id} />}
            <Modal
                onusMode={true}
                center={!isMobile}
                isVisible={true}
                onBackdropCb={onClose}
                modalClassName="z-[99999]"
                onusClassName={`${
                    isMobile ? '!px-2 pb-[3.75rem]' : '!px-8 !py-10 max-w-[979px]'
                } min-h-[304px] rounded-t-[16px] !overflow-hidden `}
                containerClassName="!bg-black-800/[0.6] dark:!bg-black-800/[0.8]"
            >
                <SvgCross size={24} onClick={onClose} color="currentColor" className="ml-auto mb-2 cursor-pointer" />
                <div className="pb-3 sm:pb-0 px-4 scrollbar-nao overflow-y-auto h-full text-sm sm:text-base">
                    <div className="flex sm:items-center sm:justify-between flex-wrap lg:flex-row flex-col">
                        {isMobile ? (
                            <div className="flex flex-col items-center justify-center">
                                <div className="flex items-center space-x-[10px]">
                                    {dataSource?.[rank] ? (
                                        <span className="font-semibold text-5xl pb-0" liner>
                                            #{dataSource?.[rank]}
                                        </span>
                                    ) : null}
                                    <div className="w-[3.375rem] h-[3.375rem] flex-shrink-0 rounded-[50%] bg-bgPrimary dark:bg-bgPrimary-dark">
                                        <ImageNao
                                            className="rounded-[50%] w-full h-full object-cover"
                                            src={dataSource?.avatar}
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 mt-2">
                                    <LeadIcon />
                                    <div className="capitalize">
                                        {t('nao:contest:captain')}: {capitalize(dataSource?.leader_name) ?? '-'}
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="text-base sm:text-2xl font-semibold uppercase">
                                        {loading ? <Skeletor onusMode width={100} height={10} /> : dataSource?.name ?? '-'}
                                    </div>
                                    {dataSource?.is_group_master && <TickFbIcon size={16} />}
                                </div>
                                {visibleStatus &&
                                    (loading ? (
                                        <Skeletor onusMode width={50} height={24} />
                                    ) : (
                                        <div className="bg-gray-13/[0.7] dark:bg-dark-4/[0.5] rounded-[800px] px-2 mt-2">
                                            <span className={`text-xs sm:text-sm font-semibold ${!dataSource?.status ? 'text-yellow-2' : 'text-txtSecondary dark:text-txtSecondary-dark'}`}>
                                                {dataSource?.status ? t('nao:contest:eligible') : t('nao:contest:not_eligible')}
                                            </span>
                                        </div>
                                    ))}
                            </div>
                        ) : (
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center space-x-4">
                                    <div className="w-[3.375rem] h-[3.375rem] flex-shrink-0 rounded-[50%] bg-bgPrimary dark:bg-bgPrimary-dark">
                                        <ImageNao
                                            className="rounded-[50%] w-full h-full object-cover"
                                            src={dataSource?.avatar}
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="flex items-center space-x-3">
                                            <div className="text-base sm:text-2xl font-semibold uppercase">
                                                {loading ? <Skeletor onusMode width={100} height={24} /> : dataSource?.name ?? '-'}
                                            </div>
                                            {dataSource?.is_group_master && <TickFbIcon size={24} />}
                                            {visibleStatus &&
                                                (loading ? (
                                                    <Skeletor onusMode width={50} height={24} />
                                                ) : (
                                                    <span
                                                        className={`text-xs sm:text-sm font-semibold rounded-[800px] px-2 ${
                                                            !dataSource?.status ? 'text-yellow-2 bg-yellow-2/[0.1]' : 'text-txtSecondary dark:text-txtSecondary-dark bg-gray-13/[0.7] dark:bg-dark-4/[0.5]'
                                                        }`}
                                                    >
                                                        {dataSource?.status ? t('nao:contest:eligible') : t('nao:contest:not_eligible')}
                                                    </span>
                                                ))}
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <LeadIcon />
                                            <div className="capitalize">
                                                {t('nao:contest:captain')}:{' '}
                                                {loading ? <Skeletor onusMode width={100} height={10} /> : capitalize(dataSource?.leader_name) ?? '-'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {dataSource?.[rank] ? (
                                    <div className="text-5xl font-semibold pb-0">
                                        #{dataSource?.[rank]}
                                    </div>
                                ) : null}
                            </div>
                        )}

                        {!isPending.group && (
                            <CardNao noBg className="!py-5 !px-[26px] mt-8 !min-h-[92px] sm:flex-row w-full sm:min-w-[577px] dark:bg-none dark:bg-darkBlue-3">
                                <div className="flex sm:flex-row sm:justify-around flex-col w-full">
                                    <div className="flex flex-row sm:flex-col-reverse gap-1 justify-between items-center">
                                        <label className="text-sm text-txtSecondary dark:text-txtSecondary-dark leading-6 whitespace-nowrap">{t('nao:contest:pnl_ranking')}</label>
                                        <span className="font-semibold">#{dataSource?.current_rank_pnl}</span>
                                    </div>
                                    <div className="h-0 sm:h-auto w-full sm:min-w-[1px] sm:max-w-[1px] sm:w-[1px] bg-divider dark:bg-divider-dark sm:mx-5 my-1.5 sm:my-0"></div>
                                    <div className="flex flex-row sm:flex-col-reverse gap-1 justify-between items-center">
                                        <label className="text-sm text-txtSecondary dark:text-txtSecondary-dark leading-6 whitespace-nowrap">{t('nao:contest:per_pnl')}</label>
                                        <span className={`font-semibold ${getColor(dataSource?.pnl)}`}>
                                            {`${dataSource?.pnl > 0 ? '+' : ''}${formatNumber(dataSource?.pnl, 2, 0, true)}%`}
                                        </span>
                                    </div>
                                    <div className="h-[1px] sm:h-auto w-full sm:min-w-[1px] sm:max-w-[1px] sm:w-[1px] bg-divider dark:bg-divider-dark sm:mx-5 my-1.5 sm:my-0"></div>
                                    <div className="flex flex-row sm:flex-col-reverse gap-1 justify-between items-center">
                                        <label className="text-sm text-txtSecondary dark:text-txtSecondary-dark leading-6 whitespace-nowrap">{t('nao:contest:volume_ranking')}</label>
                                        <span className="font-semibold">#{dataSource?.[rank]}</span>
                                    </div>
                                    <div className="h-0 sm:h-auto w-full sm:min-w-[1px] sm:max-w-[1px] sm:w-[1px] bg-divider dark:bg-divider-dark sm:mx-5 my-1.5 sm:my-0"></div>
                                    <div className="flex flex-row sm:flex-col-reverse gap-1 justify-between items-center">
                                        <label className="text-sm text-txtSecondary dark:text-txtSecondary-dark leading-6 whitespace-nowrap">
                                            {t('nao:contest:volume')} ({quoteAsset})
                                        </label>
                                        <span className="font-semibold break-all text-right">{formatNumber(dataSource?.total_volume, 0)}</span>
                                    </div>
                                </div>
                            </CardNao>
                        )}
                        {/* {visibleStatus &&
                            (loading ? (
                                <div className="w-full">
                                    <Skeletor className="!rounded-xl" onusMode height={92} width={'100%'} colors={colors.nao.grey} />
                                </div>
                            ) : (
                                !isPending.group && (
                                    <CardNao noBg className="!p-4 mt-8 sm:!p-6 space-x-4 sm:space-x-8 !flex-row !items-center !justify-start !min-h-[80px]">
                                        <div className="min-w-[32px]">
                                            <WarningIcon size={28} />
                                        </div>
                                        <div className="text-sm">
                                            {t('nao:contest:rules_for_season_2')}
                                            <span onClick={onRedirect} className="font-semibold underline text-teal cursor-pointer">
                                                {t('nao:contest:rules_content')}
                                            </span>
                                        </div>
                                    </CardNao>
                                )
                            ))} */}
                    </div>
                    {isMobile ? (
                        <div className="mt-8">
                            <div className="flex flex-col overflow-y-auto space-y-4">
                                {Array.isArray(dataSource?.members) && dataSource?.members?.length > 0 ? (
                                    dataSource?.members.map((item, index) => {
                                        return (
                                            <CardNao key={index} className={'p-4 rounded-xl border border-divider dark:border-divider-dark'}>
                                                <div className="flex items-center justify-between space-x-4">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="bg-bgPrimary dark:bg-bgPrimary-dark rounded-[50%] min-w-[36px] min-h-[36px]">
                                                            {item?.name && (
                                                                <ImageNao
                                                                    className="rounded-[50%] min-w-[36px] min-h-[36px] max-w-[36px] max-h-[36px] object-cover"
                                                                    src={item?.avatar}
                                                                />
                                                            )}
                                                        </div>
                                                        <div className="text-sm font-semibold leading-5 capitalize flex items-center space-x-2">
                                                            <span>{capitalize(item?.name) ?? t('nao:contest:member', { value: index + 1 })}</span>
                                                            {item?.is_onus_master && <TickFbIcon size={16} />}
                                                        </div>
                                                    </div>
                                                    {item?.name && renderStatusMember(item?.status)}
                                                </div>
                                                <div className="w-full h-0 my-4" />
                                                <div className="flex flex-col text-sm space-y-2">
                                                    <div className="flex items-center justify-between leading-6">
                                                        <div className="text-txtSecondary dark:text-txtSecondary-dark">ID </div>
                                                        <div className="font-semibold">{item?.onus_user_id ?? '-'}</div>
                                                    </div>
                                                    {validatorLeader(item) && (
                                                        <div className="flex items-center justify-between leading-6">
                                                            <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('nao:contest:action')} </div>
                                                            <div onClick={() => onActions(item, index)} className="text-txtSecondary dark:text-txtSecondary-dark underline cursor-pointer font-semibold">
                                                                {renderActions(null, item)}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {dataSource?.status === statusGroup.ENABLE && (
                                                        <>
                                                            <div className="flex items-center justify-between leading-6">
                                                                <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('nao:contest:trades')}</div>
                                                                <span className="text-right font-semibold">{formatNumber(item?.total_order, 0)}</span>
                                                            </div>
                                                            <div className="flex items-center justify-between leading-6">
                                                                <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('nao:contest:volume')}</div>
                                                                <span className="text-right font-semibold">
                                                                    {formatNumber(item?.total_volume, 0)} {quoteAsset}
                                                                </span>
                                                            </div>
                                                            {!previous && (
                                                                <div className="flex items-center justify-between leading-6">
                                                                    <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('common:ext_gate:time')}</div>
                                                                    <span className="text-right font-semibold">
                                                                        {formatNumber(item?.time, 2)} {t('common:hours')}
                                                                    </span>
                                                                </div>
                                                            )}
                                                            <div className="flex items-center justify-between leading-6">
                                                                <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('nao:contest:per_pnl')}</div>
                                                                <span className={`text-right font-semibold ${getColor(item?.pnl)}`}>
                                                                    {`${item.pnl > 0 ? '+' : ''}${formatNumber(item.pnl, 2, 0, true)}%`}
                                                                </span>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </CardNao>
                                        );
                                    })
                                ) : (
                                    <div className={`flex items-center justify-center flex-col m-auto`}>
                                        <div className="block dark:hidden">
                                            <NoDataLightIcon />
                                        </div>
                                        <div className="hidden dark:block">
                                            <NoDataDarkIcon />
                                        </div>
                                        <div className="text-xs text-txtSecondary dark:text-txtSecondary-dark mt-1">{t('common:no_data')}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <Table dataSource={dataSource?.members ?? []} classWrapper="border border-divider dark:border-none">
                            <Column minWidth={50} className="text-txtSecondary dark:text-txtSecondary-dark font-semibold" title={t('nao:contest:no')} fieldName={'index'} />
                            <Column
                                minWidth={220}
                                ellipsis
                                className="font-semibold capitalize"
                                title={t('nao:contest:name')}
                                fieldName="name"
                                cellRender={renderName}
                            />
                            <Column minWidth={200} ellipsis className="text-txtSecondary dark:text-txtSecondary-dark" title={'ID NAO Futures'} fieldName="onus_user_id" />
                            <Column
                                visible={visibleStatus}
                                minWidth={isPending.group ? 140 : 160}
                                title={t('common:status')}
                                fieldName="status"
                                cellRender={renderStatusMember}
                            />
                            <Column
                                visible={!isPending.group}
                                minWidth={70}
                                align="right"
                                className="text-txtSecondary dark:text-txtSecondary-dark"
                                title={t('nao:contest:trades')}
                                fieldName="total_order"
                            />
                            <Column
                                visible={!isPending.group}
                                minWidth={150}
                                align="right"
                                className="font-semibold"
                                title={`${t('nao:contest:volume')} (${quoteAsset})`}
                                decimal={0}
                                fieldName="total_volume"
                            />
                            <Column
                                minWidth={150}
                                align="right"
                                visible={!previous}
                                className="font-semibold"
                                title={t('common:ext_gate:time')}
                                decimal={2}
                                fieldName="time"
                                suffix={t('common:hours')}
                            />
                            <Column
                                visible={!isPending.group}
                                minWidth={100}
                                align="right"
                                className="font-semibold"
                                title={t('nao:contest:per_pnl')}
                                fieldName="pnl"
                                cellRender={renderPnl}
                            />
                            <Column
                                visible={isPending.group}
                                minWidth={200}
                                align="right"
                                className="text-txtSecondary dark:text-txtSecondary-dark underline cursor-pointer"
                                fieldName="pnl"
                                cellRender={renderActions}
                                onCellClick={(e, item) => validatorLeader(item) && onActions(item, item?.rowIndex)}
                            />
                        </Table>
                    )}
                    {isPending.person && (
                        <div className="px-4 w-full mt-8 flex space-x-4">
                            <ButtonNao onClick={onAccept} disabled={disabled} className="!rounded-md font-semibold w-full">
                                {disabled && <IconLoading className="!m-0" color="currentColor" />} {t('nao:contest:confirm_accept')}
                            </ButtonNao>
                        </div>
                    )}
                </div>

            </Modal>
        </>
    );
};

const LeadIcon = () => {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_14907_6665)">
                <path
                    d="M8.53348 2.83289C6.417 2.26486 4.46293 1.75932 2.44278 2.63339C2.30286 2.69394 2.21191 2.8316 2.21191 2.98404V10.4204C2.21191 10.686 2.47704 10.8713 2.7257 10.7779C4.64598 10.057 6.51595 10.3934 8.53348 10.9348C10.65 11.5029 12.604 11.9143 14.6242 11.0403C14.7641 10.9797 14.8551 7.10084 14.8551 6.9484V5.41218C14.8551 5.14658 14.5899 2.95922 14.3413 3.05256C12.421 3.77353 10.551 3.37438 8.53348 2.83289Z"
                    fill="url(#paint0_linear_14907_6665)"
                />
                <path
                    d="M2.02333 16.0002C1.6248 16.0002 1.30176 15.6772 1.30176 15.2787V2.16493C1.30176 1.7664 1.6248 1.44336 2.02333 1.44336C2.42185 1.44336 2.7449 1.7664 2.7449 2.16493V15.2787C2.7449 15.6772 2.42185 16.0002 2.02333 16.0002Z"
                    fill="url(#paint1_linear_14907_6665)"
                />
                <path
                    d="M2.02345 1.75686C2.5086 1.75686 2.90188 1.36358 2.90188 0.878431C2.90188 0.393287 2.5086 0 2.02345 0C1.53831 0 1.14502 0.393287 1.14502 0.878431C1.14502 1.36358 1.53831 1.75686 2.02345 1.75686Z"
                    fill="url(#paint2_linear_14907_6665)"
                />
                <path
                    d="M2.02345 1.75734C2.5086 1.75734 2.90188 1.36405 2.90188 0.878906H1.14502C1.14502 1.36405 1.53831 1.75734 2.02345 1.75734Z"
                    fill="url(#paint3_linear_14907_6665)"
                />
            </g>
            <defs>
                <linearGradient id="paint0_linear_14907_6665" x1="1.52708" y1="1.7257" x2="18.3726" y2="6.24598" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00dc68" />
                    <stop offset="1" stopColor="#49E8D5" />
                </linearGradient>
                <linearGradient id="paint1_linear_14907_6665" x1="2.02333" y1="1.44336" x2="2.02333" y2="16.0002" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00dc68" />
                    <stop offset="1" stopColor="#49E8D5" />
                </linearGradient>
                <linearGradient id="paint2_linear_14907_6665" x1="2.02345" y1="0" x2="2.02345" y2="1.75686" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00dc68" />
                    <stop offset="1" stopColor="#49E8D5" />
                </linearGradient>
                <linearGradient id="paint3_linear_14907_6665" x1="2.02345" y1="0.878906" x2="2.02345" y2="1.75734" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00dc68" />
                    <stop offset="1" stopColor="#49E8D5" />
                </linearGradient>
                <clipPath id="clip0_14907_6665">
                    <rect width="16" height="16" fill="white" />
                </clipPath>
            </defs>
        </svg>
    );
};

export default ContestDetail;
