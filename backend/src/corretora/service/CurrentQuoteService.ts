import { fetchDataApi } from '../../api/AlphaVantage';
import { QuoteData } from '../model/QuoteData';
import { CorretoraRepository } from '../repository/CorretoraRepository';
import { ICorretoraRepository } from '../repository/ICorretoraRepository';

interface IResponseRecentQuote {
  name: string;
  lastPrice: number;
  pricedAt: string;
}

interface ISaveQuoteRequest {
  id?: number;
  symbol: string;
  data: object;
}

export class CurrentQuoteService {
  private corretoraRepository: ICorretoraRepository;

  constructor() {
    this.corretoraRepository = new CorretoraRepository();
  }

  async saveQuote({ id, symbol, data }: ISaveQuoteRequest): Promise<QuoteData> {
    return await this.corretoraRepository.save({
      id,
      symbol,
      data
    });
  }

  async getCurrentQuoteAndUpdate(symbol: string): Promise<IResponseRecentQuote> {

    symbol = symbol.toUpperCase();

    const quoteSaved = await this.corretoraRepository.getCurrentQuote(
      symbol
    );

    if (quoteSaved) {
      const quoteSavedPricedAt = quoteSaved.data['Meta Data']['3. Last Refreshed'];

      const today = new Date();

      if (
        new Date(today.toLocaleDateString()) > new Date(quoteSaved.updated_at)
      ) {

        const data = await fetchDataApi(symbol);

        const response = await this.saveQuote({
          id: quoteSaved.id,
          symbol,
          data
        });

        const reponsePricedAt = response.data['Meta Data']['3. Last Refreshed'];

        return {
          name: symbol,
          lastPrice: Number(
            response.data['Time Series (Daily)'][reponsePricedAt]['4. close']
          ),
          pricedAt: reponsePricedAt
        };
      }

      return {
        name: symbol,
        lastPrice: Number(
          quoteSaved.data['Time Series (Daily)'][quoteSavedPricedAt]['4. close']
        ),
        pricedAt: quoteSavedPricedAt
      };
    }

    const data = await fetchDataApi(symbol);
    const pricedAt = data['Meta Data']['3. Last Refreshed'];

    await this.saveQuote({
      symbol,
      data
    });

    return {
      name: symbol,
      lastPrice: Number(
        data['Time Series (Daily)'][pricedAt]['4. close']
      ),
      pricedAt
    };
  }
}
