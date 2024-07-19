import axios from 'axios';

import { API_TOKEN, EOD_URL } from '@/constants';
import BitcoinComponent from "./bitcoinScreen.component"

const fetchEODData = async (from: string) => {
    const { data } = await axios.get(`${EOD_URL}/MCD.US?period=m&api_token=${API_TOKEN}&fmt=json&from=${from}`);

    return data;
}

const BitcoinContainer = () => {
    return (<BitcoinComponent fetchEODData={fetchEODData} />)
}

export default BitcoinContainer