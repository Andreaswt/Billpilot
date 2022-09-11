import create from 'zustand';
import { persist } from 'zustand/middleware';
import { difference } from 'lodash';
import produce from 'immer';

export interface DiscountsState {
    discounts: {
        name: string,
        percentage: number,
    }[],
}

export interface Tax {
    name: string,
    percentage: number,
}

export interface TaxesState {
    taxes: Tax[]
}

interface TaxDiscountState extends DiscountsState, TaxesState {
    addTax: (tax: Tax) => void,
    setTaxes: (taxes: Tax[]) => void
}

const useTaxDiscountStore = create<TaxDiscountState>((set) => ({
    taxes: [],
    discounts: [],
    addTax: (tax: Tax) => set((state) => ({ taxes: [...state.taxes, tax] })),
    setTaxes: (taxes: Tax[]) => set(state => ({ taxes: taxes })),
}))

export default useTaxDiscountStore;