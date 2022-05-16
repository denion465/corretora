import { ICreateQuoteDTO } from '../dto/ICreateQuoteDTO';
import { QuoteData } from '../model/QuoteData';

export interface ICorretoraRepository {
  getCurrentQuote(symbol: string): Promise<QuoteData | undefined>;
  save(quoteData: ICreateQuoteDTO): Promise<QuoteData>;
}
