import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode'
import MaldivesLayout from 'components/common/layouts/MaldivesLayout'
import SupportBanner from 'components/screens/Support/SupportBanner'
import SupportSearchBar from 'components/screens/Support/SupportSearchBar'
import { PATHS } from 'constants/paths'
import Link from 'next/link'

const COL_WIDTH = 304

const TopicsLayout = ({
    children,
    lastedArticles,
    topics,
    useTopicTitle = true
}) => {
    const router = useRouter()
    const [selectedTopic, setSelectedTopic] = useState()
    const [theme] = useDarkMode()

    useEffect(() => {
        if (topics) {
            console.log(topics)
            setSelectedTopic(topics?.find(o => o.slug === router?.query?.topic))
        }
    }, [topics, router])

    return (
        <MaldivesLayout>
            <SupportBanner title="Thông Báo" containerClassNames="hidden lg:block"/>
            <div style={
                theme === THEME_MODE.LIGHT ? { boxShadow: '0px -4px 30px rgba(0, 0, 0, 0.08)' } : undefined}
                 className="bg-bgPrimary dark:bg-darkBlue-2 rounded-t-[20px] mt-8">
                <div className="flex min-h-[500px]">
                    <div style={{ width: COL_WIDTH }}
                         className="hidden lg:block py-5 lg:py-[40px] border-r border-divider dark:border-divider-dark">
                        {topics?.map(item => <Link key={item.id} href={{
                            pathname: PATHS.SUPPORT.TOPICS,
                            query: { topic: item.slug }
                        }}>
                            <a className="block px-5 py-2.5 text-[16px] font-medium hover:bg-teal-lightTeal dark:hover:bg-teal-opacity cursor-pointer">
                                {item?.name}
                            </a>
                        </Link>)}
                    </div>

                    <div className="flex-grow px-4 pb-8 md:px-6 lg:px-8 lg:py-[40px]">
                        <SupportSearchBar simpleMode containerClassNames="!mt-4 lg:hidden"/>
                        {useTopicTitle && <div className="text-[16px] md:text-[20px] lg:text-[28px] font-bold my-6 lg:mt-0 lg:mb-10">
                            {selectedTopic?.name || '---'}
                        </div>}
                        {children}
                    </div>

                    {lastedArticles && Array.isArray(lastedArticles) && lastedArticles.length &&
                    <div style={{ width: COL_WIDTH }} className="hidden lg:block py-5 lg:py-[40px] bg-red">

                    </div>}
                </div>
            </div>
        </MaldivesLayout>
    )
}

export default TopicsLayout
