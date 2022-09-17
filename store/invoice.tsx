import create from 'zustand';
import { persist } from 'zustand/middleware';
import { difference } from 'lodash';
import produce from 'immer';

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

export interface PickedIssue {
    key: string,
    id: string,
    name: string,
    hoursSpent: number
    updatedHoursSpent: number | null,
    discountPercentage: number | null
}

interface BillIssuesState {
    pickedProject: string,
    pickedIssues: PickedIssue[]
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

export interface AddTax {
    name: string,
    percentage: number,
}

export interface DiscountsState {
    discounts: {
        name: string,
        percentage: number,
        appliesToTimeItems: string[],
        appliesToFixedPriceTimeItems: string[]
    }[],
}

interface EconomicOptions {
    customer: string,
    customerPrice: number,
    text1: string,
    ourReference: string,
    customerContact: string
}

interface CreateInvoiceState extends InvoiceState, TimeItemsState, FixedPriceTimeItemsState, TaxesState, DiscountsState, BillIssuesState, EconomicOptions {
    setInvoice: (newInvoice: InvoiceState) => void,
    pickProject: (projectKey: string) => void,
    pickIssues: (pickedIssues: PickedIssue[]) => void,
    setTimeItems: (timeItems: TimeItemsState) => void,
    setFixedPriceTimeItems: (timeItems: FixedPriceTimeItemsState) => void,
    setTaxes: (taxes: TaxesState) => void,
    addTax: (tax: AddTax, index: number) => void,
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
    pickedProject: "",
    pickedIssues: [],
    timeItems: [],
    fixedPriceTimeItems: [],
    taxes: [],
    discounts: [],
    customer: "",
    customerPrice: 0,
    text1: "",
    ourReference: "",
    customerContact: "",
    setInvoice: (newInvoice: InvoiceState) => set(newInvoice),
    pickProject: (projectKey: string) => set((state) => ({ ...state, pickedProject: projectKey })),
    pickIssues: (pickedIssues: PickedIssue[]) => set((state) => ({...state, pickedIssues: pickedIssues})),
    setTimeItems: (timeItems: TimeItemsState) => set(timeItems),
    setFixedPriceTimeItems: (timeItems: FixedPriceTimeItemsState) => set(timeItems),
    setTaxes: (taxes: TaxesState) => set(taxes),
    addTax: (tax: AddTax, index: number) => set(
        produce<TaxesState>((draft) => {
            draft.taxes.splice(index, 0, {...tax, appliesToTimeItems: [], appliesToFixedPriceTimeItems: []})
        })
    ),
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