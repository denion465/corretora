import { UpdateQuote } from './UpdateQuote';

interface IResponseRecentQuote {
  name: string;
  lastPrice: number;
  pricedAt: string;
}
export class CurrentQuoteService {

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
}
