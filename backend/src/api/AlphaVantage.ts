import axios from 'axios';

import AppError from '../errors/AppError';

export const fetchApiAlphaVantage = async (
  symbol: string
): Promise<[key: string, value: any]> => {

  try {
    const response  = await axios.get(
      `${process.env.BASE_URL}${symbol}&outputsize=full&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
    );

    if (response.data['Error Message']) {
      throw new AppError(
        `Não foi possível encontrar a cotação para o ativo ${symbol}`,
        404
      );
    }

    if (response.data['Note']) {
      throw new AppError(
        'Limite de requisições excedido para API da Alpha Vantage, aguarde 1 minuto e tente novamente',
        429
      );
    }

    return response.data;
  } catch (error) {

    throw new AppError(error.message);
  }
};
