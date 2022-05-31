import axios from 'axios';

import { UpdateQuote } from './UpdateQuote';
import { CorretoraService } from './CorretoraService';
import { FakeCorretoraRepository } from '../repository/fake/FakeCorretoraRepository';
import AppError from '../../errors/AppError';
import {
  ibmDataAplhaVantage,
  petr4DataAlphaVantage,
  vale5DataAlphaVantage
} from '../constant';

let fakeCorretoraRepository: FakeCorretoraRepository;
let updateQuote: UpdateQuote;
let corretoraService: CorretoraService;

describe('CorretoraService', () => {

  beforeEach(async () => {
    fakeCorretoraRepository = new FakeCorretoraRepository();
    updateQuote = new UpdateQuote(fakeCorretoraRepository);
    corretoraService = new CorretoraService(
      updateQuote
    );
  });

  it('should be able return a quote saved from the database', async () => {

    jest.spyOn(axios, 'get').mockReturnValueOnce(
      Promise.resolve({ data: ibmDataAplhaVantage })
    );

    const response = await corretoraService.getCurrentQuote('IBM');

    const valueToReturn = {
      lastPrice: 139.27,
      name: 'IBM',
      pricedAt: '2022-05-27'
    };

    expect(response).toMatchObject(valueToReturn);
  });

  it('should be able return quote prices between dates', async () => {

    jest.spyOn(axios, 'get').mockReturnValueOnce(
      Promise.resolve({ data: ibmDataAplhaVantage })
    );

    const response = await corretoraService.getQuotePricesBetweenDates({
      symbol: 'IBM',
      from: '2022-04-13',
      to: '2022-04-16'
    });

    const valueToReturn = {
      name: 'IBM',
      prices: [
        {
          opening: 125.64,
          high: 126.67,
          low: 124.91,
          closing: 126.14,
          pricedAt: '2022-04-13'
        },
        {
          opening: 128.93,
          high: 130.58,
          low: 126.38,
          closing: 126.56,
          pricedAt: '2022-04-14'
        }
      ]
    };

    expect(response).toMatchObject(valueToReturn);
  });

  it('should not be able return quote with invalid date', async () => {

    jest.spyOn(axios, 'get').mockReturnValueOnce(
      Promise.resolve({ data: ibmDataAplhaVantage })
    );

    await expect(corretoraService.getQuotePricesBetweenDates({
      symbol: 'IBM',
      from: 'INVALID_DATE',
      to: '2022-04-15'
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able return quote with start date greater than end date', async () => {

    jest.spyOn(axios, 'get').mockReturnValueOnce(
      Promise.resolve({ data: ibmDataAplhaVantage })
    );

    await expect(corretoraService.getQuotePricesBetweenDates({
      symbol: 'IBM',
      from: '2022-04-15',
      to: '2022-04-13'
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to return compare quotes', async () => {

    await fakeCorretoraRepository.save({
      id: 1,
      symbol: 'IBM',
      data: ibmDataAplhaVantage
    });

    await fakeCorretoraRepository.save({
      id: 2,
      symbol: 'PETR4.SA',
      data: petr4DataAlphaVantage
    });

    await fakeCorretoraRepository.save({
      id: 3,
      symbol: 'VALE5.SA',
      data: vale5DataAlphaVantage
    });

    const response = await corretoraService.compareStocks({
      symbol: 'IBM',
      stocks: ['PETR4.SA', 'VALE5.SA']
    });

    const valueToReturn = {
      lastPrices: [
        {
          name: 'IBM',
          lastPrice: 139.27,
          pricedAt: '2022-05-27'
        },
        {
          name: 'PETR4.SA',
          lastPrice: 30.6,
          pricedAt: '2022-05-27'
        },
        {
          name: 'VALE5.SA',
          lastPrice: 33.36,
          pricedAt: '2019-02-15'
        }
      ]
    };

    expect(response).toMatchObject(valueToReturn);
  });

  it('should be able return earnings of a stock', async () => {

    await fakeCorretoraRepository.save({
      id: 1,
      symbol: 'IBM',
      data: ibmDataAplhaVantage
    });

    const response = await corretoraService.earningsProjection(
      'IBM',
      {
        purchasedAmount: 100,
        purchasedAt: '2022-04-01'
      }
    );

    const valueToReturn = {
      name: 'IBM',
      purchasedAmount: 100,
      purchasedAt: '2022-04-01',
      priceAtDate: 130.15,
      lastPrice: 139.27,
      capitalGains: 7.01
    };

    expect(response).toMatchObject(valueToReturn);
  });

  it('should not be return with a invalid date', async () => {

    await fakeCorretoraRepository.save({
      id: 1,
      symbol: 'IBM',
      data: ibmDataAplhaVantage
    });

    await expect(corretoraService.earningsProjection(
      'IBM',
      {
        purchasedAmount: 100,
        purchasedAt: '2022-02-32'
      }
    )).rejects.toBeInstanceOf(AppError);
  });
});
