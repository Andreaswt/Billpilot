import create from 'zustand';

export interface PickedState {
    pickedTickets: PickedTicket[]
    pickedCompany: string,
}

export interface InvoiceInformation {
    title: string,
    currency: string,
    dueDate: Date,
    roundingScheme: string,
    economicOptions: {
        exportToEconomic: boolean,
        customer: string,
        customerName: string,
        customerPrice: number,
        text1: string,
        ourReference: string,
        ourReferenceName: string,
        customerContact: string
        customerContactName: string
    },
}

export interface PickedTicket {
    id: string
    subject: string
    content: string
    lastModified: string
    updatedHoursSpent: number | null,
    discountPercentage: number | null
}

interface CreateInvoiceState extends PickedState, InvoiceInformation {
    setInvoiceInformation: (invoiceInformation: InvoiceInformation) => void,
    pickCompany: (companyId: string) => void,
    pickTickets: (pickedTickets: PickedTicket[]) => void,
}

const useInvoiceHubspotTicketsStore = create<CreateInvoiceState>((set) => ({
    title: "",
    currency: "USD",
    dueDate: new Date(),
    roundingScheme: "2. Decimals",
    client: "",
    pickedCompany: "",
    pickedTickets: [],
    economicOptions: {
        exportToEconomic: false,
        customer: "",
        customerName: "",
        customerPrice: 0,
        text1: "",
        ourReference: "",
        ourReferenceName: "",
        customerContact: "",
        customerContactName: "",
    },
    setInvoiceInformation: (invoiceInformation: InvoiceInformation) => set((state) => ({ ...state, ...invoiceInformation })),
    pickCompany: (companyId: string) => set((state) => ({ ...state, pickedCompany: companyId })),
    pickTickets: (pickedTickets: PickedTicket[]) => set((state) => ({ ...state, pickedTickets: pickedTickets })),
}))

export default useInvoiceHubspotTicketsStore;