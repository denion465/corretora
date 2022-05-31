
import { QuoteData } from '../../model/QuoteData';
import { ICorretoraRepository } from '../ICorretoraRepository';
import { ICreateQuoteDTO } from '../../dto/ICreateQuoteDTO';

export class FakeCorretoraRepository implements ICorretoraRepository {
  private quotes: QuoteData[] = [];

  async getCurrentQuote(symbol: string): Promise<QuoteData | undefined> {

    return this.quotes.find(q => q.symbol === symbol);
  }

  save(quoteData: ICreateQuoteDTO): Promise<QuoteData> {

    const quote = new QuoteData();
    quote.id = this.quotes.length + 1;
    quote.symbol = quoteData.symbol;
    quote.data = quoteData.data;
    quote.updated_at = quoteData.updated_at || new Date();

    this.quotes.push(quote);

    return Promise.resolve(quote);
  }
}
