export const ___DEV___ = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'dev'

export const log =  {
    d: (...arg) => {
       ___DEV___ && console.log('%cnamidev-DEBUG: ', 'color: purple;font-weight: bold', ...arg)
    },
    i: (...arg) => {
        ___DEV___ && console.log('%cnamidev-INFO: ', 'color: green;font-weight: bold', ...arg)
    },
    e: (...arg) => {
        ___DEV___ && console.log('%cnamidev-ERROR: ', 'color: red;font-weight: bold', ...arg)
    },
    w: (...arg) => {
        ___DEV___ && console.log('%cnamidev-WARNING: ', 'color: orange;font-weight: bold', ...arg)
    }
}
