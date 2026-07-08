import { expect } from 'chai';
import {
  validMinimalPayload,
  missingAmountPayload,
  emptyPayload
} from '../data/payloads';

const { container } = require('codeceptjs');

declare const Given: any;
declare const When: any;
declare const Then: any;

const getI = () => container.support('I');

// GIVEN
Given('je suis authentifie avec des credentials valides', () => {
  // credentials configures dans codecept.conf.ts
});

Given('je suis authentifie avec des credentials invalides', async () => {
  const I = getI();
  const invalidAuth = Buffer.from('invalid:invalid').toString('base64');
  await I.haveRequestHeaders({ 'Authorization': `Basic ${invalidAuth}` });
});

// WHEN
When('j\'envoie une requete POST sur {string} avec un payload minimal valide', async () => {
  const I = getI();
  await I.sendPostRequest('/v1/connector/order', validMinimalPayload);
});

When('j\'envoie une requete POST sur {string} avec un payload vide', async () => {
  const I = getI();
  await I.sendPostRequest('/v1/connector/order', emptyPayload);
});

When('j\'envoie une requete POST sur {string} sans le champ {string}', async () => {
  const I = getI();
  await I.sendPostRequest('/v1/connector/order', missingAmountPayload);
});

When('j\'envoie une requete GET sur {string}', async () => {
  const I = getI();
  await I.sendGetRequest('/v1/connector/healthcheck');
});

// THEN
Then('la reponse doit avoir le statut {int}', async (statusCode: number) => {
  const I = getI();
  await I.seeResponseCodeIs(statusCode);
});

Then('la reponse doit contenir un {string}', async (field: string) => {
  const I = getI();
  const response = await I.grabResponse();
  const body = JSON.parse(response as string);
  expect(body).to.have.property(field);
});