import { QuoteData } from '../model/QuoteData';

export interface ICorretoraRepository {
  getCurrentQuote(symbol: string): Promise<QuoteData | undefined>;
}
