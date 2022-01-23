import { useCallback, useMemo } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { BREAK_POINTS } from 'constants/constants'
import { useRouter } from 'next/router'
import { PATHS } from 'constants/paths'

import SupportSectionItem from 'components/screens/Support/SupportSectionItem'
import SupportSearchBar from 'components/screens/Support/SupportSearchBar'
import SupportSection from 'components/screens/Support/SupportSection'
import MaldivesLayout from 'components/common/layouts/MaldivesLayout'
import useWindowSize from 'hooks/useWindowSize'
import Image from 'next/image'
import useApp from 'hooks/useApp'

const Support = () => {
    // ? Use hooks
    const { width } = useWindowSize()

    // ? Memmoized
    const sectionIconSize = useMemo(() => width >= BREAK_POINTS.lg ? 32 : 24, [width])

    // ? Render input
    const renderInput = useCallback(() => {
        return (
            <SupportSearchBar
                simpleMode={width < BREAK_POINTS.lg}
            />)
    }, [width])

    return (
        <MaldivesLayout>
            <div className="bg-[#F8F9FA] dark:bg-darkBlue-1">
                <div className="container pt-6 max-w-[1400px]">
                    <div className="font-bold px-4 text-[20px] mt-8 lg:mt-[40px] lg:text-[26px]">Trung tâm hỗ trợ</div>
                    <div
                        className="mt-8 pt-4 pb-[80px] px-4 h-full bg-[#FCFCFC] dark:bg-darkBlue-2 rounded-t-[20px] drop-shadow-onlyLight lg:!bg-transparent">
                        <div className="text-[16px] font-medium">Tìm kiếm câu hỏi thường gặp</div>
                        {renderInput()}

                        <div className="mt-6 lg:mt-8">
                            <SupportSection title="Câu hỏi thường gặp" containerClassNames="lg:pb-[32px]">
                                <SupportSectionItem href={PATHS.SUPPORT.FAQ}
                                                    title="Tính năng về tài khoản"
                                                    titleClassNames="truncate"
                                                    icon={<Image src="/images/screen/support/ic_user.png"
                                                                 width={sectionIconSize}
                                                                 height={sectionIconSize}/>}/>
                                <SupportSectionItem title="Mua trực tiếp Crypto (từ Fiat)"
                                                    titleClassNames="truncate"
                                                    icon={<Image src="/images/screen/support/ic_dollar.png"
                                                                 width={sectionIconSize}
                                                                 height={sectionIconSize}/>}/>
                                <SupportSectionItem title="Hướng dẫn sử dụng"
                                                    titleClassNames="truncate"
                                                    icon={<Image src="/images/screen/support/ic_book.png"
                                                                 width={sectionIconSize}
                                                                 height={sectionIconSize}/>}/>
                                <SupportSectionItem title="Giao dịch Exchange"
                                                    titleClassNames="truncate"
                                                    icon={<Image src="/images/screen/support/ic_analytic.png"
                                                                 width={sectionIconSize}
                                                                 height={sectionIconSize}/>}/>
                                <SupportSectionItem title="API"
                                                    titleClassNames="truncate"
                                                    icon={<Image src="/images/screen/support/ic_command.png"
                                                                 width={sectionIconSize}
                                                                 height={sectionIconSize}/>}/>
                                <SupportSectionItem title="Bảo mật"
                                                    titleClassNames="truncate"
                                                    icon={<Image src="/images/screen/support/ic_shield.png"
                                                                 width={sectionIconSize}
                                                                 height={sectionIconSize}/>}/>
                            </SupportSection>
                        </div>

                        <div className="mt-6 lg:mt-8">
                            <SupportSection title="Thông báo" containerClassNames="lg:pb-[32px]">
                                <SupportSectionItem href={PATHS.SUPPORT.ANNOUNCEMENT}
                                                    title="Niêm yết mới"
                                                    titleClassNames="truncate"
                                                    icon={<Image src="/images/screen/support/ic_duo_dollar.png"
                                                                 width={sectionIconSize} height={sectionIconSize}/>}/>
                                <SupportSectionItem title="Tin tức mới nhất về Nami"
                                                    titleClassNames="truncate"
                                                    icon={<Image src="/images/screen/support/ic_book.png"
                                                                 width={sectionIconSize}
                                                                 height={sectionIconSize}/>}/>
                                <SupportSectionItem title="Các chương trình khuyến mãi"
                                                    titleClassNames="truncate"
                                                    icon={<Image src="/images/screen/support/ic_reward.png"
                                                                 width={sectionIconSize}
                                                                 height={sectionIconSize}/>}/>
                                <SupportSectionItem title="Cập nhật API"
                                                    titleClassNames="truncate"
                                                    icon={<Image src="/images/screen/support/ic_command.png"
                                                                 width={sectionIconSize}
                                                                 height={sectionIconSize}/>}/>
                            </SupportSection>
                        </div>

                        <div className="mt-6 lg:mt-8">
                            <div className="lg:bg-bgPrimary dark:bg-bgPrimary-dark lg:rounded-xl lg:flex lg:mt-4">
                                <SupportSection title="Tin mới nhất"
                                                contentContainerClassName="lg:!py-0 lg:!pb-6 lg:!mt-4">
                                    <SupportSectionItem
                                        title={<>
                                            <span
                                                className="mr-2">
                                                Lorem ip sum nonstop Lorem ip sum nonstop Lorem ip sum nonstop
                                            </span>
                                            <span
                                                className="text-txtSecondary dark:text-txtSecondary-dark text-[10px] lg:text-[12px] whitespace-nowrap">2021-12-30</span>
                                        </>}
                                        containerClassNames="lg:!w-full md:!pr-6 lg:!pr-3 lg:!mb-0"
                                        classNames="active:!bg-transparent hover:!underline hover:!text-dominant"/>
                                    <SupportSectionItem
                                        title="Lorem ip sum nonstop Lorem ip sum nonstop Lorem ip sum nonstop"
                                        containerClassNames="lg:!w-full md:!pr-6 lg:!pr-3 lg:!mb-0"
                                        classNames="active:!bg-transparent hover:!underline hover:!text-dominant"/>
                                    <SupportSectionItem
                                        title="Lorem ip sum nonstop Lorem ip sum nonstop Lorem ip sum nonstop"
                                        containerClassNames="lg:!w-full md:!pr-6 lg:!pr-3 lg:!mb-0"
                                        classNames="active:!bg-transparent hover:!underline hover:!text-dominant"/>
                                    <SupportSectionItem
                                        title="Lorem ip sum nonstop Lorem ip sum nonstop Lorem ip sum nonstop"
                                        containerClassNames="lg:!w-full md:!pr-6 lg:!pr-3 lg:!mb-0"
                                        classNames="active:!bg-transparent hover:!underline hover:!text-dominant"/>
                                    <SupportSectionItem
                                        title="Lorem ip sum nonstop Lorem ip sum nonstop Lorem ip sum nonstop"
                                        containerClassNames="lg:!w-full md:!pr-6 lg:!pr-3 lg:!mb-0"
                                        classNames="active:!bg-transparent hover:!underline hover:!text-dominant"/>
                                </SupportSection>
                                <SupportSection title="Tin nổi bật"
                                                contentContainerClassName="lg:!py-0 lg:!pb-6 lg:!mt-4"
                                                containerClassNames="mt-6 lg:mt-0">
                                    <SupportSectionItem
                                        title="Lorem ip sum nonstop Lorem ip sum nonstop Lorem ip sum nonstop"
                                        containerClassNames="lg:!w-full md:!pr-6 lg:!pr-3 lg:!mb-0"
                                        classNames="active:!bg-transparent hover:!underline hover:!text-dominant"/>
                                    <SupportSectionItem
                                        title="Lorem ip sum nonstop Lorem ip sum nonstop Lorem ip sum nonstop"
                                        containerClassNames="lg:!w-full md:!pr-6 lg:!pr-3 lg:!mb-0"
                                        classNames="active:!bg-transparent hover:!underline hover:!text-dominant"/>
                                    <SupportSectionItem
                                        title="Lorem ip sum nonstop Lorem ip sum nonstop Lorem ip sum nonstop"
                                        containerClassNames="lg:!w-full md:!pr-6 lg:!pr-3 lg:!mb-0"
                                        classNames="active:!bg-transparent hover:!underline hover:!text-dominant"/>
                                    <SupportSectionItem
                                        title="Lorem ip sum nonstop Lorem ip sum nonstop Lorem ip sum nonstop"
                                        containerClassNames="lg:!w-full md:!pr-6 lg:!pr-3 lg:!mb-0"
                                        classNames="active:!bg-transparent hover:!underline hover:!text-dominant"/>
                                    <SupportSectionItem
                                        title="Lorem ip sum nonstop Lorem ip sum nonstop Lorem ip sum nonstop"
                                        containerClassNames="lg:!w-full md:!pr-6 lg:!pr-3 lg:!mb-0"
                                        classNames="active:!bg-transparent hover:!underline hover:!text-dominant"/>
                                </SupportSection>
                            </div>
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

export default Support
