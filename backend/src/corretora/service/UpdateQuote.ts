import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import { fetchApiAlphaVantage } from '../../api/AlphaVantage';
import { QuoteData } from '../model/QuoteData';
import { ICorretoraRepository } from '../repository/ICorretoraRepository';

interface ISaveQuoteRequest {
  id?: number;
  symbol: string;
  data: object;
}

@injectable()
export class UpdateQuote {

  constructor(
    @inject('CorretoraRepository')
    private corretoraRepository: ICorretoraRepository
  ) {}

  async saveQuote({
    id,
    symbol,
    data
  }: ISaveQuoteRequest): Promise<QuoteData> {

    return this.corretoraRepository.save({
      id,
      symbol,
      data
    });
  }

  async getUpdatedQuote(symbol: string): Promise<QuoteData | any> {

    const quoteSaved = await this.corretoraRepository
      .getCurrentQuote(symbol);

    if (quoteSaved) {

      const today = new Date().toLocaleDateString();

      if (new Date(today) > new Date(quoteSaved.updated_at)) {

        const response = await fetchApiAlphaVantage(symbol);

        await this.saveQuote({
          id: quoteSaved.id,
          symbol,
          data: response
        });

        return response;
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
