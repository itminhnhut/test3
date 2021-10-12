import { memo } from 'react'

import SvgActivity from 'components/svg/Activity'
import SvgChevronDown from 'components/svg/ChevronDown'
import SvgContract from 'components/svg/Contract'
import SvgCreditCard from 'components/svg/CreditCard'
import SvgCross from 'components/svg/Cross'
import SvgExchange from 'components/svg/Exchange'
import SvgGlobe from 'components/svg/Globe'
import SvgHexagon from 'components/svg/Hexagon'
import SvgMenu from 'components/svg/Menu'
import SvgMoon from 'components/svg/Moon'
import SvgNami from 'components/svg/Nami'
import SvgRefresh from 'components/svg/Refresh'
import SvgShare from 'components/svg/Share'
import SvgSun from 'components/svg/Sun'

const SvgIcon = memo((props) => {
    const { name } = props

    switch (name) {
        case 'activity':
            return <SvgActivity {...props} />
        case 'chevron_down':
            return <SvgChevronDown {...props} />
        case 'contract':
            return <SvgContract {...props} />
        case 'credit_card':
            return <SvgCreditCard {...props}/>
        case 'cross':
            return <SvgCross {...props}/>
        case 'exchange':
            return <SvgExchange {...props}/>
        case 'globe':
            return <SvgGlobe {...props}/>
        case 'hexagon':
            return <SvgHexagon {...props}/>
        case 'menu':
            return <SvgMenu {...props}/>
        case 'moon':
            return <SvgMoon {...props}/>
        case 'nami':
            return <SvgNami {...props}/>
        case 'refresh':
            return <SvgRefresh {...props}/>
        case 'share':
            return <SvgShare {...props}/>
        case 'sun':
            return <SvgSun {...props}/>
        default:
            return null
    }
})

export default SvgIcon
