import { fetchApiAlphaVantage } from '../../api/AlphaVantage';
import { QuoteData } from '../model/QuoteData';
import { CorretoraRepository } from '../repository/CorretoraRepository';
import { ICorretoraRepository } from '../repository/ICorretoraRepository';

interface ISaveQuoteRequest {
  id?: number;
  symbol: string;
  data: object;
}

export class UpdateQuote {

  private corretoraRepository: ICorretoraRepository;

  constructor() {
    this.corretoraRepository = new CorretoraRepository();
  }

  async saveQuote({
    id,
    symbol,
    data
  }: ISaveQuoteRequest): Promise<QuoteData> {

    return await this.corretoraRepository.save({
      id,
      symbol,
      data
    });
  }

  async getUpdatedQuote(symbol: string): Promise<any> {

    const quoteSaved = await this.corretoraRepository
      .getCurrentQuote(symbol);

    if (quoteSaved) {
      const today = new Date().toLocaleDateString();

      if (new Date(today) > new Date(quoteSaved.updated_at)) {

        const data = await fetchApiAlphaVantage(symbol);

        await this.saveQuote({
          id: quoteSaved.id,
          symbol,
          data
        });

        return data;
      }

      return quoteSaved.data;
    }

    const data = await fetchApiAlphaVantage(symbol);

    await this.saveQuote({
      symbol,
      data
    });

    return data;
  }
}
