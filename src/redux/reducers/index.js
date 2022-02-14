import { combineReducers } from 'redux'
import auth from './auth'
import user from './user'
import utils from './utils'
import socket from './socket'
import spot from './spot'
import futures from './futures'
import wallet from './wallet'
import notification from './notification'

const rootReducer = combineReducers({
    auth,
    user,
    utils,
    socket,
    spot,
    futures,
    notification,
    wallet,
})

export default rootReducer
