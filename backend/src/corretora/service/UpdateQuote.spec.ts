import axios from 'axios';

import { UpdateQuote } from './UpdateQuote';
import { ibmDataAplhaVantage } from '../constant';
import { FakeCorretoraRepository } from '../repository/fake/FakeCorretoraRepository';

let fakeCorretoraRepository: FakeCorretoraRepository;
let updateQuote: UpdateQuote;

describe('UpdateQuote', () => {

  beforeEach(async () => {
    fakeCorretoraRepository = new FakeCorretoraRepository();
    updateQuote = new UpdateQuote(fakeCorretoraRepository);
  });

  it('should be able return a quote saved from the database', async () => {
    await fakeCorretoraRepository.save({
      id: 1,
      symbol: 'IBM',
      data: ibmDataAplhaVantage
    });

    const response = await updateQuote.getUpdatedQuote('IBM');

    expect(response).toMatchObject(ibmDataAplhaVantage);
  });

  it('should be able return a fetch quote from Alpha Vantage if not exists',
    async () => {

      jest.spyOn(axios, 'get').mockReturnValueOnce(
        Promise.resolve({ data: ibmDataAplhaVantage })
      );

      const response = await updateQuote.getUpdatedQuote('IBM');

      expect(response).toMatchObject(ibmDataAplhaVantage);
    });

  it('should be able return a fetch quote updated from Alpha Vantage', async () => {

    await fakeCorretoraRepository.save({
      id: 1,
      symbol: 'IBM',
      data: ibmDataAplhaVantage,
      updated_at: new Date(2020, 10, 10)
    });

    jest.spyOn(axios, 'get').mockReturnValueOnce(
      Promise.resolve({ data: ibmDataAplhaVantage })
    );

    const response = await updateQuote.getUpdatedQuote('IBM');

    expect(response).toMatchObject(ibmDataAplhaVantage);
  });
});
