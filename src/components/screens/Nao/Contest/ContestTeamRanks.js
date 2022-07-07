import React, { useState, useMemo } from 'react';
import { TextLiner, CardNao, ButtonNao, Table, Column } from 'components/screens/Nao/NaoStyle';
import { useTranslation } from 'next-i18next';
import useWindowSize from 'hooks/useWindowSize';

const ContestTeamRanks = () => {
    const [tab, setTab] = useState('volume');
    const { t } = useTranslation();
    const { width } = useWindowSize()

    const arr = [
        { rank: 1, team: "QUNI Offical", caption: 3, volume: 4, pnl: 5 },
        { rank: 1, team: "QUNI Offical", caption: 3, volume: 4, pnl: 5 },
        { rank: 1, team: "QUNI Offical", caption: 3, volume: 4, pnl: 5 },
        { rank: 1, team: "QUNI Offical", caption: 3, volume: 4, pnl: 5 },
        { rank: 1, team: "QUNI Offical", caption: 3, volume: 4, pnl: 5 },
        { rank: 1, team: "QUNI Offical", caption: 3, volume: 4, pnl: 5 },
        { rank: 1, team: "QUNI Offical", caption: 3, volume: 4, pnl: 5 },
        { rank: 1, team: "QUNI Offical", caption: 3, volume: 4, pnl: 5 },
        { rank: 1, team: "QUNI Offical", caption: 3, volume: 4, pnl: 5 },
        
    ]
    const top3 = arr.slice(0, 3)

    return (
        <section className="contest_individual_ranks pt-[70px] sm:pt-[124px]">
            <div className="flex justify-between flex-wrap gap-4">
                <TextLiner>{t('nao:contest:team_ranking')}</TextLiner>
                <div className="flex items-center gap-3 text-sm">
                    <ButtonNao
                        onClick={() => setTab('volume')}
                        className={`px-4 py-2 !rounded-md ${tab === 'volume' ? 'font-semibold' : '!bg-nao-bg3'}`}>{t('nao:contest:volume')}</ButtonNao>
                    <ButtonNao
                        onClick={() => setTab('pnl')}
                        className={`px-4 py-2 !rounded-md   ${tab === 'pnl' ? 'font-semibold' : '!bg-nao-bg3'}`}>{t('nao:contest:per_pnl')}</ButtonNao>
                </div>
            </div>
            <div className="flex items-center flex-wrap gap-5 sm:gap-[22px] mt-8">
                {top3.map((item, index) => (
                    <CardNao key={index} className="!p-5 !bg-transparent border border-nao-border2">
                        <div className="flex items-center gap-[30px] sm:gap-6">
                            <TextLiner className="!text-[4.125rem] !leading-[100px] !pb-0" linder>#{index + 1}</TextLiner>
                            <div className="gap-1 flex flex-col">
                                <label className="text-lg font-semibold leading-8">Nguyễn T. Văn Huy</label>
                                <span className="text-nao-grey text-sm text-medium">96110109278</span>
                            </div>
                        </div>
                        <div className="rounded-lg mt-7">
                            <div className="flex items-center justify-between gap-2">
                                <label className="text-sm text-nao-text">{t('nao:contest:volume')}</label>
                                <span className="font-semibold leading-8">100,000,000 VNDC</span>
                            </div>
                            <div className="h-[1px] bg-nao-grey/[0.2] w-full my-2"></div>
                            <div className="flex items-center justify-between gap-2">
                                <label className="text-sm text-nao-text">{t('nao:contest:per_pnl')}</label>
                                <span className="font-semibold leading-8 text-nao-green2">+6.42%</span>
                            </div>
                        </div>
                    </CardNao>
                ))}
            </div>

            <Table dataSource={arr} >
                <Column minWidth={100} title={t('nao:contest:rank')} fieldName="rank" />
                <Column minWidth={200} title={t('nao:contest:team')} fieldName="team" />
                <Column minWidth={300} title={t('nao:contest:caption')} fieldName="caption" />
                <Column minWidth={200} align="right" title={t('nao:contest:volume')} fieldName="volume" />
                <Column minWidth={200} align="right" title={t('nao:contest:per_pnl')} fieldName="pnl" />
            </Table>
        </section>
    );
};

export default ContestTeamRanks;