// import { memo, useEffect, useState } from 'react'
// import { useSelector } from 'react-redux'
// import { debounce } from 'lodash/function'
// import { log, subscribeExchangeSocket, unsubscribeExchangeSocket } from 'utils'
//
// const BASE_RATE_PAIR = 'USDTVNDC'
//
// const ReferencePrice = memo(({ price, debug }) => {
//     // * Init State
//     const [state, set] = useState({
//         rateTicker: null,
//         loading: false,
//     })
//     const setState = state => set(prevState => ({ ...prevState, ...state }))
//
//     // * Get Socket
//     const publicSocket = useSelector(state => state.socket.publicSocket)
//
//     // * Helper
//     const listenHandler = debounce(rateTicker => setState({ rateTicker }), 1000)
//
//     // * Side Effect
//     useEffect(() => {
//         const event = `spot:mini_ticker:update:${BASE_RATE_PAIR}`
//         if (publicSocket) {
//             subscribeExchangeSocket(publicSocket, [{ socketString: 'mini_ticker', payload: BASE_RATE_PAIR }])
//             publicSocket.removeListener(event, listenHandler)
//             publicSocket.on(event, listenHandler)
//         }
//         return () => {
//             publicSocket && unsubscribeExchangeSocket(publicSocket, BASE_RATE_PAIR)
//             publicSocket && publicSocket.removeListener(event, listenHandler)
//         }
//     }, [publicSocket])
//
//     useEffect(() => {
//         debug && log.d(`Reference Price Base on ${BASE_RATE_PAIR} rate `, state?.rateTicker)
//     }, [debug, state.rateTicker])
//
//     return <span></span>
// })
//
// export default ReferencePrice
