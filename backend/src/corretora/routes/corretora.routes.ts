import { Router } from 'express';

import { CorretoraController } from '../controller/CorretoraController';

export const corretoraRouter = Router();

const corretoraController = new CorretoraController();

corretoraRouter.get(
  '/:symbol/quote',
  corretoraController.getCurrentQuote
);

corretoraRouter.get(
  '/:symbol/history',
  corretoraController.getQuotePricesBetweenDates
);
