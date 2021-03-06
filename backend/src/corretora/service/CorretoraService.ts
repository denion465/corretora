import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import { isValid } from 'date-fns';

import { UpdateQuote } from './UpdateQuote';
import AppError from '../../errors/AppError';

interface IResponseRecentQuote {
  name: string;
  lastPrice: number;
  pricedAt: string;
}

interface IResponseBetweenDates {
  name: string;
  prices: IPricesList[];
}

interface IResponseComparedQuotes {
  lastPrices: ILastPricesList[];
}

interface IResponseEarningsProjection {
  name: string;
  purchasedAmount: number;
  purchasedAt: string;
  priceAtDate: number;
  lastPrice: number;
  capitalGains: number;
}

interface IPricesList {
  opening: number;
  low: number;
  high: number;
  closing: number;
  pricedAt: string;
}[];

interface IDateRangeRequest {
  symbol: string;
  [key: string]: unknown;
}

interface ICompareStocksRequest {
  symbol: string;
  stocks: string[];
}

interface ILastPricesList {
  name: string;
  lastPrice: number;
  pricedAt: string;
}[];

interface IEarningsProjectionRequest {
  [key: string]: any;
}


@injectable()
export class CorretoraService {

  constructor(
    @inject('UpdateQuote')
    private updateQuote: UpdateQuote
  ) {}

  async getCurrentQuote(symbol: string): Promise<IResponseRecentQuote> {

    symbol = symbol.toUpperCase();

    const quoteUpdated = await this.updateQuote.getUpdatedQuote(symbol);
    const pricedAt = quoteUpdated['Meta Data']['3. Last Refreshed'];

    return {
      name: symbol,
      lastPrice: Number(
        quoteUpdated['Time Series (Daily)'][pricedAt]['4. close']
      ),
      pricedAt
    };
  }

  async getQuotePricesBetweenDates({
    symbol,
    from,
    to
  }: IDateRangeRequest): Promise<IResponseBetweenDates> {

    symbol = symbol.toUpperCase();
    const prices: IPricesList[] = [];

    const quoteUpdated = await this.updateQuote.getUpdatedQuote(symbol);

    const startDate = new Date(from as string);
    const endDate = new Date(to as string);

    if (!isValid(startDate) || !isValid(endDate)) {
      throw new AppError('Formato de data inv??lido!', 400);
    }

    if (startDate > endDate) {
      throw new AppError('A data inicial n??o pode ser maior que a data final!', 400);
    }

    Object.entries(quoteUpdated['Time Series (Daily)'])
      .forEach(([key, value]: [string, any]) => {
        const keyDate = new Date(key);
        if (keyDate >= startDate && keyDate <= endDate) {
          prices.push({
            opening: Number(value['1. open']),
            high: Number(value['2. high']),
            low: Number(value['3. low']),
            closing: Number(value['4. close']),
            pricedAt: key
          });
        }
      });

    return {
      name: symbol,
      prices: prices.reverse()
    };
  }

  async compareStocks({
    symbol,
    stocks
  }: ICompareStocksRequest): Promise<IResponseComparedQuotes> {

    symbol = symbol.toUpperCase();

    const quoteUpdated = await this.updateQuote.getUpdatedQuote(symbol);
    let pricedAt = quoteUpdated['Meta Data']['3. Last Refreshed'];
    let lastPrice = quoteUpdated['Time Series (Daily)'][pricedAt]['4. close'];

    const lastPrices: ILastPricesList[] = [];

    lastPrices.push({
      name: symbol,
      lastPrice: Number(lastPrice),
      pricedAt
    });

    for (const stock of stocks) {
      const quote = await this.updateQuote.getUpdatedQuote(stock);

      pricedAt = quote['Meta Data']['3. Last Refreshed'];
      lastPrice = quote['Time Series (Daily)'][pricedAt]['4. close'];

      lastPrices.push({
        name: stock,
        lastPrice: Number(lastPrice),
        pricedAt
      });
    }

    return {
      lastPrices
    };
  }

  async earningsProjection(
    symbol: string ,
    {
      purchasedAmount,
      purchasedAt
    }: IEarningsProjectionRequest): Promise<IResponseEarningsProjection> {
    symbol = symbol.toUpperCase();

    const quoteUpdated = await this.updateQuote.getUpdatedQuote(symbol);

    const pricedAt = quoteUpdated['Meta Data']['3. Last Refreshed'];

    const lastPrice = Number(
      quoteUpdated['Time Series (Daily)'][pricedAt]['4. close']
    );

    if (!(quoteUpdated['Time Series (Daily)'][purchasedAt])) {
      throw new AppError(
        `A????o n??o encontrada para o dia de ${purchasedAt}!`,
        404
      );
    }

    const priceOnPurchaseDate = Number(
      quoteUpdated['Time Series (Daily)'][purchasedAt]['4. close']
    );

    const percentage = (lastPrice / priceOnPurchaseDate - 1) * 100;
    const capitalGains = percentage / 100 * Number(purchasedAmount);

    return {
      name: symbol,
      purchasedAmount: Number(purchasedAmount),
      purchasedAt,
      priceAtDate: priceOnPurchaseDate,
      lastPrice,
      capitalGains: Number(capitalGains.toFixed(2))
    };
  }
}
