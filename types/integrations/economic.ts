export interface CreateInvoice {
    date:                    string;
    dueDate:                 string;
    currency:                string;
    // exchangeRate:            number;
    // netAmount:               number;
    // netAmountInBaseCurrency: number;
    // grossAmount:             number;
    // marginInBaseCurrency:    number;
    // marginPercentage:        number;
    // vatAmount:               number;
    // roundingAmount:          number;
    // costPriceInBaseCurrency: number;
    paymentTerms:            PaymentTerms;
    customer:                Customer;
    recipient:               Recipient;
    // delivery:                Delivery;
    references:              References;
    layout:                  Layout;
    lines:                   Line[];
    notes:                   Note;
}

export interface Customer {
    customerNumber: number;
    name:           string;
}

export interface Delivery {
    address:      string;
    zip:          string;
    city:         string;
    country:      string;
    deliveryDate: Date;
}

export interface Layout {
    layoutNumber: number;
}

export interface Line {
    lineNumber:           number;
    // sortKey:              number;
    unit:                 Unit;
    product:              Product;
    quantity:             number;
    unitNetPrice:         number;
    discountPercentage:   number;
    // unitCostPrice:        number;
    totalNetAmount:       number;
    // marginInBaseCurrency: number;
    // marginPercentage:     number;
    description:          string;
}

export interface Product {
    productNumber: string;
}

export interface Unit {
    unitNumber: number;
    name?:      string;
}

export interface PaymentTerms {
    paymentTermsNumber: number;
    daysOfCredit:       number;
    name:               string;
    paymentTermsType:   string;
}

export interface Recipient {
    name:    string;
    // address: string;
    // zip:     string;
    // city:    string;
    vatZone: VatZone;
}

export interface VatZone {
    name:               string;
    vatZoneNumber:      number;
    enabledForCustomer: boolean;
    enabledForSupplier: boolean;
}

export interface References {
    salesPerson: SalesPerson | null;
    other: string;
}

export interface SalesPerson {
    employeeNumber: number;
}

export interface Note {
    heading: string;
    // textLine1: string;
    // textLine2: string;
}