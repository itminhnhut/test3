import { ChevronRight } from 'react-feather'
import Link from 'next/link'
import { PATHS } from 'constants/paths'
import useWindowSize from 'hooks/useWindowSize'
import { useMemo } from 'react'
import { BREAK_POINTS } from 'constants/constants'

const SearchResultItem = () => {
    const { width } = useWindowSize()

    // ? Memmoized
    const iconSize = useMemo(() => width >= BREAK_POINTS.lg ? 20 : 16, [width])

    return (
        <div className="mb-6 lg:mb-9 max-w-[1140px]">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <Link href="#">
                    <a className="font-bold text-sm lg:text-[18px] hover:text-dominant hover:!underline cursor-pointer">
                        Nami Exchange niêm yết Trader Joe (JOE)
                    </a>
                </Link>
                <div className="font-bold text-[10px] text-txtSecondary dark:text-txtSecondary-dark">
                    2021-12-30 10:31
                </div>
            </div>
            <div className="mt-2.5 font-medium text-xs lg:text-sm lg:mt-4 md:text-txtSecondary md:dark:text-txtSecondary-dark">
                Để nạp/rút token Off-chain từ sàn Nami Exchange, cụ thể là với ví ONUS,
                người dùng làm theo các bước hướng dẫn như sau: Đăng nhập vào ứng dụng Onus, tại phần Ứng dụng trên
                màn hình chính...
                Để nạp/rút token Off-chain từ sàn Nami Exchange, cụ thể là với ví ONUS,
                người dùng làm theo các bước hướng dẫn như sau: Đăng nhập vào ứng dụng Onus, tại phần Ứng dụng trên
                màn hình chính...
            </div>
            <div className="mt-2.5 flex items-center text-[10px] lg:text-sm font-medium">
                <Link href={PATHS.SUPPORT.DEFAULT}>
                    <a className="!underline">Trung tâm trợ giúp</a>
                </Link>
                <ChevronRight strokeWidth={1.5} size={iconSize} className="mx-2"/>
                <div className="underline">Kết quả tìm kiếm</div>
            </div>
        </div>
    )
}

export default SearchResultItem
