/* eslint-disable no-console */
/* eslint-disable no-alert */
/* eslint-disable no-undef */
/* eslint-disable prefer-destructuring */
import merge from 'lodash/merge';
import AuthStorage from 'src/utils/auth-storage';
// import applyURIFilter from 'src/utils/apply-url-filter';
import axios from 'axios';
// const axios = require('axios');

const mandatory = () => {
    return Promise.reject(new Error('Fetch API Missing parameter!'));
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;
console.log('__ check api url', API_URL);

const FetchApi = async ({ url, options, params, cancelToken, timeout } = mandatory(), cb = f => f) => {
    try {
        const defaultOptions = {
            method: 'GET',
            baseURL: API_URL,
            url,
            withCredentials: true,
            // headers: {
            //     'Accept': 'application/json',
            //     'Content-Type': 'application/json',
            // },
            cancelToken,
            timeout,
        };

        const opts = merge(defaultOptions, options);

        // Set auth token
        // if (AuthStorage.loggedIn) {
        //     opts.headers.authorization = `${AuthStorage.accessToken}`;
        // }

        // if (AuthStorage.clientId) {
        //     opts.headers.clientid = `${AuthStorage.clientId}`;
        // }

        if (opts && opts.method === 'GET') {
            opts.params = params;
        } else {
            opts.data = params;
        }

        if (process.env.NODE_ENV !== 'production') {
            console.log('Call API: url, options, params', opts, options);
        }

        const { data } = await axios(opts);
        console.log(`fetchApi: ${url} ------------`, opts, data);
        cb(null, data);
        return data;
    } catch (err) {
        if (process.env.NODE_ENV !== 'production') {
            console.error('Call API Error: ', err, err?.response?.data);
        }
        if (err?.response?.data) {
            return err?.response?.data;
        }
        cb(err);
        return Promise.reject(err);
    }
};

export default FetchApi;
