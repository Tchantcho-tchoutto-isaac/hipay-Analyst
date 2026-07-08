import { OrderPayload } from '../data/payloads';

// ============================================================
// Page Object - API Order HiPay
// ============================================================

class OrderPage {

  // Envoie un paiement
  async createOrder(I: any, payload: OrderPayload): Promise<void> {
    await I.sendPostRequest('/v1/connector/order', payload);
  }

  // Envoie un paiement avec credentials invalides
  async createOrderWithInvalidAuth(I: any, payload: OrderPayload): Promise<void> {
    const invalidAuth = Buffer.from('invalid:invalid').toString('base64');
    await I.haveRequestHeaders({ 'Authorization': `Basic ${invalidAuth}` });
    await I.sendPostRequest('/v1/connector/order', payload);
  }

  // Vérifie la disponibilité du service
  async checkHealth(I: any): Promise<void> {
    await I.sendGetRequest('/v1/connector/healthcheck');
  }
}

export default new OrderPage();