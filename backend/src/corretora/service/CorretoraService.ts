import { UpdateQuote } from './UpdateQuote';

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

export class CorretoraService {

  private updateQuote = new UpdateQuote();

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
    to,
    from
  }: IDateRangeRequest): Promise<IResponseBetweenDates> {

    symbol = symbol.toUpperCase();
    const prices: IPricesList[] = [];

    const quoteUpdated = await this.updateQuote.getUpdatedQuote(symbol);

    const startDate = new Date(from as string);
    const endDate = new Date(to as string);

    Object.entries(quoteUpdated['Time Series (Daily)'])
      .forEach(([key, value]: [string, any]) => {
        const keyDate = new Date(key);
        if (keyDate <= startDate && keyDate >= endDate) {
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
}
