import create from 'zustand';
import { persist } from 'zustand/middleware';
import { difference } from 'lodash';

export interface InvoiceState {
    title: string,
    status: string,
    invoiceNumber: string,
    currency: string,
    invoicedDatesFrom: Date,
    invoicedDatesTo: Date,
    issueDate: Date,
    dueDate: Date,
    roundingScheme: string,
    client: string,
    invoiceLayout: string,
    notesForClient: string,
}

// Jira Item 
interface JiraItem {
    key: string,
    displayName: string
}

export interface TimeItemsState {
    timeItems: {
        name: string,
        time: number,
        rate: number,
        jiraProjects: JiraItem[],
        jiraIssues: JiraItem[],
        jiraEmployees: JiraItem[],
    }[],
}

export interface FixedPriceTimeItemsState {
    fixedPriceTimeItems: {
        name: string,
        amount: number,
    }[],
}

export interface TaxesState {
    taxes: {
        name: string,
        percentage: number,
        appliesToTimeItems: string[],
        appliesToFixedPriceTimeItems: string[]
    }[],
}

export interface DiscountsState {
    discounts: {
        name: string,
        percentage: number,
        appliesToTimeItems: string[],
        appliesToFixedPriceTimeItems: string[]
    }[],
}

interface CreateInvoiceState extends InvoiceState, TimeItemsState, FixedPriceTimeItemsState, TaxesState, DiscountsState {
    setInvoice: (newInvoice: InvoiceState) => void,
    setTimeItems: (timeItems: TimeItemsState) => void,
    setFixedPriceTimeItems: (timeItems: FixedPriceTimeItemsState) => void,
    setTaxes: (taxes: TaxesState) => void,
    setDiscounts: (discounts: DiscountsState) => void,
    addDiscountToTimeItem: (timeItemName: string, discountName: string[]) => void,
    addTaxToTimeItem: (timeItemName: string, taxName: string[]) => void,
    addDiscountToFixedPriceTimeItem: (timeItemName: string, discountName: string[]) => void,
    addTaxToFixedPriceTimeItem: (timeItemName: string, taxName: string[]) => void,
    removeDiscountToTimeItem: (timeItemName: string, discountName: string[]) => void,
    removeTaxToTimeItem: (timeItemName: string, taxName: string[]) => void,
    removeDiscountToFixedPriceTimeItem: (timeItemName: string, discountName: string[]) => void,
    removeTaxToFixedPriceTimeItem: (timeItemName: string, taxName: string[]) => void,
}

const useCreateInvoiceStore = create<CreateInvoiceState>((set) => ({
    title: "",
    status: "",
    invoiceNumber: "",
    currency: "",
    invoicedDatesFrom: new Date(),
    invoicedDatesTo: new Date(),
    issueDate: new Date(),
    dueDate: new Date(),
    roundingScheme: "",
    client: "",
    invoiceLayout: "",
    notesForClient: "",
    timeItems: [],
    fixedPriceTimeItems: [],
    taxes: [],
    discounts: [],
    setInvoice: (newInvoice: InvoiceState) => set(newInvoice),
    setTimeItems: (timeItems: TimeItemsState) => set(timeItems),
    setFixedPriceTimeItems: (timeItems: FixedPriceTimeItemsState) => set(timeItems),
    setTaxes: (taxes: TaxesState) => set(taxes),
    setDiscounts: (discounts: DiscountsState) => set(discounts),
    addDiscountToTimeItem: (discountName: string, itemNames: string[]) => {
        set((state) => ({
            discounts: state.discounts.map((d) =>
                d.name === discountName ? ({ ...d, appliesToTimeItems: d.appliesToTimeItems.concat(itemNames) }) : d
            ),
        }));
    },
    addDiscountToFixedPriceTimeItem: (discountName: string, itemNames: string[]) => {
        set((state) => ({
            discounts: state.discounts.map((d) =>
                d.name === discountName ? ({ ...d, appliesToFixedPriceTimeItems: d.appliesToFixedPriceTimeItems.concat(itemNames) }) : d
            ),
        }));
    },
    addTaxToTimeItem: (taxName: string, itemNames: string[]) => {
        set((state) => ({
            taxes: state.taxes.map((t) =>
                t.name === taxName ? ({ ...t, appliesToTimeItems: t.appliesToTimeItems.concat(itemNames) }) : t
            ),
        }));
    },
    addTaxToFixedPriceTimeItem: (taxName: string, itemNames: string[]) => {
        set((state) => ({
            taxes: state.taxes.map((t) =>
                t.name === taxName ? ({ ...t, appliesToFixedPriceTimeItems: t.appliesToFixedPriceTimeItems.concat(itemNames) }) : t
            ),
        }));
    },
    removeDiscountToTimeItem: (discountName: string, itemNames: string[]) => {
        set((state) => ({
            discounts: state.discounts.map((d) =>
                d.name === discountName ? ({ ...d, appliesToTimeItems: difference(d.appliesToTimeItems, itemNames) }) : d
            ),
        }));
    },
    removeDiscountToFixedPriceTimeItem: (discountName: string, itemNames: string[]) => {
        set((state) => ({
            discounts: state.discounts.map((d) =>
                d.name === discountName ? ({ ...d, appliesToFixedPriceTimeItems: difference(d.appliesToFixedPriceTimeItems, itemNames) }) : d
            ),
        }));
    },
    removeTaxToTimeItem: (taxName: string, itemNames: string[]) => {
        set((state) => ({
            taxes: state.taxes.map((t) =>
                t.name === taxName ? ({ ...t, appliesToTimeItems: difference(t.appliesToTimeItems, itemNames) }) : t
            ),
        }));
    },
    removeTaxToFixedPriceTimeItem: (taxName: string, itemNames: string[]) => {
        set((state) => ({
            taxes: state.taxes.map((t) =>
                t.name === taxName ? ({ ...t, appliesToFixedPriceTimeItems: difference(t.appliesToFixedPriceTimeItems, itemNames) }) : t
            ),
        }));
    },
}))

export default useCreateInvoiceStore;