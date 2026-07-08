

export type TransactionType = 'Debit' | 'Credit' | 'Refund';
export type Currency = 'EUR' | 'USD' | 'GBP';
export type Protocol = 'AppNepting';
export type Manufacturer = 'PAX' | 'INGENICO' | 'VERIFONE';
export type ProductType = 'good' | 'service' | 'fee';

export interface Price {
  amount?: number;
  currency: Currency;
}

export interface BasketItem {
  product_reference: string;
  name: string;
  type: ProductType;
  quantity: number;
  unit_price: number;
  tax_rate: number;
  discount: number;
  total_amount: number;
}

export interface CustomData {
  internal_reference: string;
  customer_first_order: boolean;
  other_sample_parameter?: string;
}

export interface Order {
  order_id: string;
  transaction_type: TransactionType;
  price: Price;
  basket?: BasketItem[];
  description?: string;
  custom_data?: CustomData;
}

export interface Customer {
  customer_id: string;
  email: string;
  phone: string;
  first_name: string;
  last_name: string;
}

export interface DeviceInformation {
  serial_number: string;
  manufacturer: Manufacturer;
}

export interface TerminalDisplay {
  protocol: Protocol;
  force_authorization?: boolean;
}

export interface PosInfo {
  device_information: DeviceInformation;
  terminal_transaction_display: TerminalDisplay;
  notify_url?: string;
}

export interface OrderPayload {
  order?: Order;
  pos_technical_info?: PosInfo;
  customer?: Customer;
}

// DATASETS


const defaultDevice: DeviceInformation = {
  serial_number: '1850320198',
  manufacturer: 'PAX'
};

const defaultTerminalDisplay: TerminalDisplay = {
  protocol: 'AppNepting'
};

const forcedAuthTerminalDisplay: TerminalDisplay = {
  protocol: 'AppNepting',
  force_authorization: true
};

const testCustomer: Customer = {
  customer_id: '283749291',
  email: 'hipay.pos@test.com',
  phone: '33012345678',
  first_name: 'Cathy',
  last_name: 'Doe'
};

const testBasket: BasketItem[] = [
  {
    product_reference: 'NF-a1690',
    name: 'My first product',
    type: 'good',
    quantity: 1,
    unit_price: 8.99,
    tax_rate: 0,
    discount: 0,
    total_amount: 8.99
  }
];

const testCustomData: CustomData = {
  internal_reference: 'ORD_987465',
  customer_first_order: true
};

// ============================================================
// JDD - Parcours de test
// ============================================================

// Paiement minimal valide → 200 OK
export const validMinimalPayload: OrderPayload = {
  order: {
    order_id: `ORDER_${Date.now()}`,
    transaction_type: 'Debit',
    price: { amount: 100, currency: 'EUR' }
  },
  pos_technical_info: {
    device_information: defaultDevice,
    terminal_transaction_display: defaultTerminalDisplay
  }
};

// Paiement complet valide → 200 OK
export const validFullPayload: OrderPayload = {
  order: {
    order_id: `ORDER_${Date.now()}`,
    transaction_type: 'Debit',
    price: { amount: 100, currency: 'EUR' },
    basket: testBasket,
    description: 'Test paiement HiPay QA Analyst',
    custom_data: testCustomData
  },
  customer: testCustomer,
  pos_technical_info: {
    notify_url: 'https://hipay.com/notify',
    device_information: defaultDevice,
    terminal_transaction_display: forcedAuthTerminalDisplay
  }
};

//  Sans montant → 400 Bad Request
export const missingAmountPayload: OrderPayload = {
  order: {
    order_id: `ORDER_${Date.now()}`,
    transaction_type: 'Debit',
    price: { currency: 'EUR' }
  },
  pos_technical_info: {
    device_information: defaultDevice,
    terminal_transaction_display: defaultTerminalDisplay
  }
};

//  Payload vide → 400 Bad Request
export const emptyPayload: OrderPayload = {};

//  Montant négatif → 400 Bad Request
export const negativeAmountPayload: OrderPayload = {
  order: {
    order_id: `ORDER_${Date.now()}`,
    transaction_type: 'Debit',
    price: { amount: -50, currency: 'EUR' }
  },
  pos_technical_info: {
    device_information: defaultDevice,
    terminal_transaction_display: defaultTerminalDisplay
  }
};