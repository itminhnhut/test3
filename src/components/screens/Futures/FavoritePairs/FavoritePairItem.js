import { PATHS } from 'constants/paths'
import { useRouter } from 'next/router'

const FuturesFavoritePairItem = ({ pair }) => {
    const router = useRouter()

    return (
        <div
            className='font-medium text-xs px-2.5 py-2 hover:bg-gray-4 dark:hover:bg-darkBlue-3 cursor-pointer rounded-sm select-none'
            onClick={() =>
                router.query?.pair !== pair.pair &&
                router.push(PATHS.FUTURES_V2.DEFAULT + `/${pair.pair}`)
            }
        >
            <span className='mr-1'>{pair.pair}</span>
            <span className='text-red tracking-wide'>+99%</span>
        </div>
    )
}

export default FuturesFavoritePairItem
