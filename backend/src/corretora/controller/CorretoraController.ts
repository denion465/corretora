import { Request, Response } from 'express';
import { CorretoraService } from '../service/CorretoraService';

export class CorretoraController {

  async getCurrentQuote(req: Request, res: Response): Promise<Response> {
    const { symbol } = req.params;

    const corretoraService = new CorretoraService();

    const response = await corretoraService.getCurrentQuote(symbol);

    return res.json(response);
  }

  async getQuotePricesBetweenDates(
    req: Request,
    res: Response
  ): Promise<Response> {

    const { symbol } = req.params;
    const { to, from } = req.query;

    const corretoraService = new CorretoraService();

    const response = await corretoraService
      .getQuotePricesBetweenDates({ symbol, to, from });

    return res.json(response);
  }

  async compareStocks(req: Request, res: Response): Promise<Response> {
    const { symbol } = req.params;
    const { stocks } = req.body;

    const corretoraService = new CorretoraService();

    const response = await corretoraService.compareStocks({
      symbol,
      stocks
    });

    return res.json(response);
  }
}

