import axios from 'axios';

import AppError from '../errors/AppError';

const api = axios.create({
  baseURL: 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol='
});

export const fetchDataApi = async (symbol: string): Promise<any> => {
  const { data }  = await api.get(
    `${symbol}&outputsize=full&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
  );

  if (data['Error Message']) {
    throw new AppError(
      `Não foi possível encontrar a cotação para o ativo ${symbol}`,
      404
    );
  }

  return data;
};
