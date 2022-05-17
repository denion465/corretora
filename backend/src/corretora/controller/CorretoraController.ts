import { Request, Response } from 'express';

import { CurrentQuoteService } from '../service/CurrentQuoteService';
export class CorretoraController {
  async getCurrentQuote(req: Request, res: Response): Promise<Response> {
    const { symbol } = req.params;

    const currentQuoteService = new CurrentQuoteService();

    const response = await currentQuoteService.getCurrentQuote(symbol);

    return res.json(response);
  }
}

