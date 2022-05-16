import { getRepository, Repository } from 'typeorm';
import { ICreateQuoteDTO } from '../dto/ICreateQuoteDTO';

import { QuoteData } from '../model/QuoteData';
import { ICorretoraRepository } from './ICorretoraRepository';
export class CorretoraRepository implements ICorretoraRepository {
  private ormRepository: Repository<QuoteData>;

  constructor() {
    this.ormRepository = getRepository(QuoteData);
  }

  async getCurrentQuote(
    symbol: string
  ): Promise<QuoteData | undefined> {

    const quote = await this.ormRepository.findOne(
      { where: { symbol } }
    );

    return quote;
  }

  async save(quoteData: ICreateQuoteDTO): Promise<QuoteData> {

    const quote = this.ormRepository.create({
      ...quoteData,
      updated_at: new Date()
    });

    const savedQuote = await this.ormRepository.save(quote);

    return savedQuote;
  }
}
