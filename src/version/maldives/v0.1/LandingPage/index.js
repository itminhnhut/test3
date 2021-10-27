import MadivesLayout from 'components/common/layouts/MaldivesLayout'
import { NAVBAR_USE_TYPE } from 'components/common/NavBar/NavBar'
import ScreenPresent from 'version/maldives/v0.1/LandingPage/ScreenPresent'
import { useWindowSize } from 'utils/customHooks'

const LandingPage = () => {
    const { width } = useWindowSize()

    return (
        <MadivesLayout navOverComponent={width >= 768}
                       navMode={NAVBAR_USE_TYPE.FLUENT}
                       navStyle={{backgroundColor: 'rgba(21, 29, 47, 0.95)'}}>
            <ScreenPresent/>
        </MadivesLayout>
    )
}

export default LandingPage
