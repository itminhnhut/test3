import MaldivesLayout from 'components/common/layouts/MaldivesLayout'
import SupportBanner from 'components/screens/Support/SupportBanner'
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode'
import TopicItem from 'components/screens/Support/TopicItem'
import Image from 'next/image'
import Link from 'next/link'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { PATHS } from 'constants/paths'
import { useRouter } from 'next/router'
import axios from 'axios'
import { API_GET_ALL_BLOG_TAGS, getBlogApi } from 'redux/actions/apis'
import { useEffect, useState } from 'react'

const SupportAnnouncement = () => {
    const [tags, setTags] = useState([])
    const [theme] = useDarkMode()
    const router = useRouter()

    const getTags = async () => {
        const { status, data } = await axios.get(getBlogApi('tags', '&limit=all'))
        console.log('namidev ', data)
        // if (status === 200 && data?.tags?.length) {
        //     setTags(data?.tags?.filter(o => o?.slug === 'thong-bao'))
        // }
    }

    useEffect(() => {
        getTags()
    }, [])

    useEffect(() => {
        console.log('namidev-DEBUG: Announcement Tags => ', tags)
    }, [tags])

    return (
        <MaldivesLayout>
            <SupportBanner title="Thông Báo"/>
            <div className="">
                <div style={
                    theme === THEME_MODE.LIGHT ? { boxShadow: '0px -4px 30px rgba(0, 0, 0, 0.08)' } : undefined}
                     className="px-4 py-5 sm:px-6 lg:px-[48px] lg:py-[50px] rounded-t-[20px]">
                    <div className="container">
                        <div className="text-[16px] font-bold md:text-[20px] lg:text-[28px] mb-4 md:mb-6 lg:mb-8">Các chủ đề</div>
                        <div className="flex flex-wrap justify-between w-full mb-8 md:mb-12 lg:mb-[80px]">
                            <Link href={{
                                pathname: PATHS.SUPPORT.TOPICS,
                                query: { topic: 'new_listing' }
                            }}>
                                <a className="block w-[48%] sm:w-[49%] lg:w-[32%]">
                                    <TopicItem
                                        icon={<Image src="/images/icon/ic_exchange.png" layout="responsive" width="24"
                                                     height="24"/>}
                                        title="Niêm yết mới"
                                        description="Check out the latest coin listings and pairs on Exchange, Futures Markets, Launchpad..."
                                    />
                                </a>
                            </Link>
                            <Link href={{
                                pathname: PATHS.SUPPORT.TOPICS,
                                query: { topic: 'lasted_nami' },
                            }}>
                                <a className="block w-[48%] sm:w-[49%] lg:w-[32%]">
                                    <TopicItem icon={<Image src="/images/icon/ic_exchange.png" layout="responsive" width="24" height="24"/>}
                                               title="Tin tức mới về Nami"
                                               description="Check out the latest coin listings and pairs on Exchange, Futures Markets, Launchpad..."
                                    />
                                </a>
                            </Link>
                            <div className="w-[48%] sm:w-[49%] lg:w-[32%] mt-3 md:mt-5 lg:mt-0">
                                <TopicItem icon={<Image src="/images/icon/ic_exchange.png" layout="responsive" width="24" height="24"/>}
                                           title="Các chương trình Promotion"
                                           description="Check out the latest coin listings and pairs on Exchange, Futures Markets, Launchpad..."
                                />
                            </div>
                            <div className="w-[48%] sm:w-[49%] lg:w-[32%] mt-3 md:mt-5">
                                <TopicItem icon={<Image src="/images/icon/ic_exchange.png" layout="responsive" width="24" height="24"/>}
                                           title="Cập nhật API"
                                           description="Check out the latest coin listings and pairs on Exchange, Futures Markets, Launchpad..."
                                />
                            </div>
                        </div>
                        <div className="text-[16px] font-bold md:text-[20px] lg:text-[28px] mb-6 md:mb-8">Lasted Articles</div>
                        <div className="flex flex-col md:flex-row md:flex-wrap">
                            <Link href="#">
                                <a className="w-full md:w-1/2 text-sm lg:text-[16px] font-medium hover:text-dominant mb-5 lg:mb-8">Nami Exchange niêm yết Trader Joe (JOE){' '}
                                    <span className="text-[10px] lg:text-xs text-txtSecondary text-txtSecondary-dark whitespace-nowrap">2021-12-30</span>
                                </a>
                            </Link>
                            <Link href="#">
                                <a className="w-full md:w-1/2 text-sm lg:text-[16px] font-medium hover:text-dominant mb-5 lg:mb-8">Thông báo bảo trì cổng rút Bitcoin, BEP, BEP-20, Ethereum Classic, ERC-20{' '}
                                    <span className="text-[10px] lg:text-xs text-txtSecondary text-txtSecondary-dark whitespace-nowrap">2021-12-30</span>
                                </a>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </MaldivesLayout>
    )
}

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...await serverSideTranslations(locale, ['common', 'navbar'])
    }
})

export default SupportAnnouncement
