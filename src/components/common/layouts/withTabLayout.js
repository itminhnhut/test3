import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { getLastestSourcePath } from 'redux/actions/utils'
import { PATHS } from 'constants/paths'
import { log } from 'utils'

import MaldivesLayout from 'components/common/layouts/MaldivesLayout'
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode'

import styled from 'styled-components'
import colors from 'styles/colors'
import TabItem, { TabItemComponent } from 'components/common/TabItem'

const INITIAL_STATE = {
    currentPath: null,
}

export default (props) => (WrappedComponent) => {
    return wrappedProps => {
        // Own props
        const { routes, tabStyle, containerDimension } = props

        // Init state
        const [state, set] = useState(INITIAL_STATE)
        const setState = state => set(prevState => ({ ...prevState, ...state }))

        // Use hooks
        const [currentTheme, ] = useDarkMode()
        const router = useRouter()
        const { t } = useTranslation()

        // Helper
        const setCurrentPath = (currentPath) => setState({ currentPath })

        // Render Handler
        const renderTabLink = useCallback(() => {
            if (!(routes || Object.keys(routes).length)) return null

            return Object.values(routes).map(route => {
                const path = getLastestSourcePath(route?.pathname)
                const isActive = state.currentPath === path

                return (
                    <TabItem key={`tab_link__${path}`} href={route?.pathname}
                             title={route?.localized ? t(route?.localized) : route?.alias}
                             active={isActive} component={TabItemComponent.Link}/>
                )
            })
        }, [routes, tabStyle, state.currentPath])

        useEffect(() => {
            setCurrentPath(getLastestSourcePath(router?.pathname))
        }, [router])

        useEffect(() => {
            log.d('withTabLayout props => ', props)
        }, [props])

        useEffect(() => {
            log.d('withTabLayout state => ', state)
        }, [state])

        return (
            <MaldivesLayout>
                <Background isDark={currentTheme === THEME_MODE.DARK}>
                    <CustomContainer containerDimension={containerDimension}>
                        <div className="flex items-center mb-8 lg:mb-10 border-b border-divider dark:border-divider-dark">
                            {renderTabLink()}
                        </div>
                        <WrappedComponent {...wrappedProps}/>
                    </CustomContainer>
                </Background>
            </MaldivesLayout>
        )
    }
}

const Background = styled.div.attrs({ className: 'w-full h-full pt-5' })`
  background-color: ${({ isDark }) => isDark ? colors.darkBlue1 : '#F8F9FA'};
`

const CustomContainer = styled.div.attrs({ className: 'mal-container px-4' })`
  @media (min-width: 1024px) {
    max-width: 1000px !important;
  }

  @media (min-width: 1280px) {
    max-width: 1260px !important;
  }

  @media (min-width: 1440px) {
    max-width: 1300px !important;
  }

  @media (min-width: 1920px) {
    max-width: 1440px !important;
  }
`

export const ROUTES = {
    FEE_STRUCTURE: [
        { pathname: PATHS.FEE_STRUCTURES.TRADING, alias: 'Trading Fee', localized: 'fee-structure:trading_fee_t' },
        { pathname: PATHS.FEE_STRUCTURES.DEPWDL, alias: 'Deposit and Withdrawal Fee', localized: 'fee-structure:depwdl_fee' }
    ],

}
