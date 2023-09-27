import { createContext, useContext, useState } from 'react'

const EarnContext = createContext({
    poolInfo: undefined,
    setPoolInfo: (pool) => {}
})

export const EarnProvider = ({ children }) => {
    const [poolInfo, setPoolInfo] = useState();

    return <EarnContext.Provider value={{
        poolInfo,
        setPoolInfo
    }} >{children}</EarnContext.Provider>;

}

export const useEarnCtx = () => useContext(EarnContext);
