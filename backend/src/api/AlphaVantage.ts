import axios from 'axios';

import AppError from '../errors/AppError';

const api = axios.create({
  baseURL: 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol='
});

export const fetchApiAlphaVantage = async (symbol: string): Promise<any> => {
  const { data }  = await api.get(
    `${symbol}&outputsize=full&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
  );

  if (data['Error Message']) {
    throw new AppError(
      `Não foi possível encontrar a cotação para o ativo ${symbol}`,
      404
    );
  }

  if (data['Note']) {
    throw new AppError(
      'Limite de requisições excedido para API da Alpha Vantage, aguarde 1 minuto e tente novamente',
      429
    );
  }

  return data;
};
