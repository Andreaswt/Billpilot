import * as Yup from 'yup';

// Invoice
export const invoiceSchema = Yup.object().shape({
    title: Yup.string().required().label('Title'),
    status: Yup.string().required().label('Status'),
    invoiceNumber: Yup.string().required().label('Invoice Number'),
    currency: Yup.string().required().label('Currency'),
    invoicedDatesFrom: Yup.date().required().label('Invoiced from'),
    invoicedDatesTo: Yup.date().required().label('Invoiced to'),
    issueDate: Yup.date().required().label('Issue Date'),
    dueDate: Yup.date().required().label('Due Date'),
    roundingScheme: Yup.string().required().label('Rounding Scheme'),
    client: Yup.string().required().label('Client'),
    invoiceLayout: Yup.string().required().label('Invoice Layout for Clients'),
    notesForClient: Yup.string().required().label('Notes for Client'),
})

// Time items
export const timeItemSchema = Yup.object().shape({
    name: Yup.string().required().label('Name'),
    time: Yup.number().required().min(0).label('Time'),
    rate: Yup.number().required().min(0).label('Rate'),
})

export const timeItemsSchema = Yup.object().shape({
    timeItems: Yup.array().min(1).of(timeItemSchema),
})

// Time items
export const fixedPriceTimeItemSchema = Yup.object().shape({
    name: Yup.string().required().label('Name'),
    amount: Yup.number().required().min(0).label('Amount'),
})

export const fixedPriceTimeItemsSchema = Yup.object().shape({
    fixedPriceTimeItems: Yup.array().of(fixedPriceTimeItemSchema),
})

// Taxes
export const taxItemSchema = Yup.object().shape({
    name: Yup.string().required().label('Name'),
    percentage: Yup.number().required().min(0).label('Percentage'),
})

export const taxesSchema = Yup.object().shape({
    taxItems: Yup.array().of(taxItemSchema),
})

// Percent discounts
export const discountItemSchema = Yup.object().shape({
    name: Yup.string().required().label('Name'),
    percentage: Yup.number().required().min(0).label('Percentage'),
})

export const discountsSchema = Yup.object().shape({
    discountItems: Yup.array().of(discountItemSchema),
})

// Fixed discounts
export const fixedDiscountItemSchema = Yup.object().shape({
    name: Yup.string().required().label('Name'),
    percentage: Yup.number().required().min(0).label('Amount'),
})

export const fixedDiscountsSchema = Yup.object().shape({
    fixedDiscountItems: Yup.array().of(fixedDiscountItemSchema),
})