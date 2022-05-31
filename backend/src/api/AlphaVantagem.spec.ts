import axios from 'axios';

import { ibmDataAplhaVantage } from '../corretora/constant';
import { fetchApiAlphaVantage } from './AlphaVantage';
import AppError from '../errors/AppError';

describe('AlphaVantageApi', () => {
  it('should be able fetch data from Alpha Vantage', async () => {

    jest.spyOn(axios, 'get').mockReturnValueOnce(
      Promise.resolve({ data: ibmDataAplhaVantage })
    );

    const response = await fetchApiAlphaVantage('IBM');

    expect(response).toMatchObject(ibmDataAplhaVantage);
  });

  it('should be reject return data from Alpha Vantage with undefined symbol',
    async () => {

      jest.spyOn(axios, 'get').mockReturnValueOnce(
        Promise.resolve({ data: {
          'Error Message': 'Invalid API call'
        } })
      );

      await expect(fetchApiAlphaVantage('UNDEFINED_SYMBOL'))
        .rejects.toBeInstanceOf(AppError);
    });

  it('should be reject return data from Alpha Vantage with request limit',
    async () => {

      jest.spyOn(axios, 'get').mockReturnValueOnce(
        Promise.resolve({ data: {
          'Note': 'Thank you for using Alpha Vantage!'
        } })
      );

      await expect(fetchApiAlphaVantage('IBM'))
        .rejects.toBeInstanceOf(AppError);
    });
});
