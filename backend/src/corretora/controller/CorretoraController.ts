import { Request, Response } from 'express';

import { CorretoraService } from '../service/CorretoraService';

export class CorretoraController {
  async getCurrentQuote(req: Request, res: Response): Promise<Response> {
    const { symbol } = req.params;

    const corretoraService = new CorretoraService();

    const quote = await corretoraService.getCurrentQuote(symbol);

    return res.json(quote);
  }
}

