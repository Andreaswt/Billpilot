// Customer
export interface CustomerForInvoice {
    customerNumber: number;
    // name:           string;
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
    name:         string;
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
    productNumber: number;
    name:          string;
}

export interface Unit {
    unitNumber: number;
    name:      string;
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
    salesPerson: SalesPersonForInvoice | null;
    customerContact: CustomerContact
    // other: string;
}

// CustomerContact
export interface CustomerContact {
    customerContactNumber: number
}

// SalesPerson
export interface SalesPersonForInvoice {
    employeeNumber: number;
}

export interface SalesPerson {
    employeeNumber: number;
    name: string;
}

export interface Note {
    heading: string;
    textLine1: string;
    // textLine2: string;
}

export interface Contact {
    customer: Customer,
    name: string,
    customerContactNumber: number
}