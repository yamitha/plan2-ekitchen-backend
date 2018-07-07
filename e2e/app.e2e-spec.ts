import { EkitchenBackendPage } from './app.po';

describe('ekitchen-backend App', () => {
  let page: EkitchenBackendPage;

  beforeEach(() => {
    page = new EkitchenBackendPage();
  });

  it('should display welcome message', done => {
    page.navigateTo();
    page.getParagraphText()
      .then(msg => expect(msg).toEqual('Welcome to app!!'))
      .then(done, done.fail);
  });
});
