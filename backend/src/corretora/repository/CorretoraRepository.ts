import { getRepository, Repository } from 'typeorm';
import { ICreateQuoteDTO } from '../dto/ICreateQuoteDTO';

import { QuoteData } from '../model/QuoteData';
import { ICorretoraRepository } from './ICorretoraRepository';
export class CorretoraRepository implements ICorretoraRepository {
  private ormRepository: Repository<QuoteData>;

  constructor() {
    this.ormRepository = getRepository(QuoteData);
  }

  async getCurrentQuote(symbol: string): Promise<QuoteData | undefined> {

    return this.ormRepository.findOne(
      { where: { symbol } }
    );
  }

  async save(quoteData: ICreateQuoteDTO): Promise<QuoteData> {

    const quote = this.ormRepository.create({
      ...quoteData,
      updated_at: new Date()
    });

    return this.ormRepository.save(quote);
  }
}
