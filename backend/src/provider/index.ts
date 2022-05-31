import { container } from 'tsyringe';

import { CorretoraRepository } from '../corretora/repository/CorretoraRepository';
import { ICorretoraRepository } from '../corretora/repository/ICorretoraRepository';
import { UpdateQuote } from '../corretora/service/UpdateQuote';

container.registerSingleton<ICorretoraRepository>(
  'CorretoraRepository', CorretoraRepository
);

container.registerSingleton<UpdateQuote>(
  'UpdateQuote', UpdateQuote
);
