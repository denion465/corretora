import { QuoteData } from '../model/QuoteData';
import { CorretoraRepository } from '../repository/CorretoraRepository';
import { ICorretoraRepository } from '../repository/ICorretoraRepository';


export class CorretoraService {
  private corretoraRepository: ICorretoraRepository;

  constructor() {
    this.corretoraRepository = new CorretoraRepository();
  }

  async getCurrentQuote(
    symbol: string
  ): Promise<QuoteData | undefined> {

    const quote = await this.corretoraRepository.getCurrentQuote(
      symbol
    );

    return quote;
  }
}
