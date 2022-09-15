import create from 'zustand';

export interface PickedState {
    pickedIssues: PickedIssue[]
    pickedProject: string,
}

export interface InvoiceInformation {
    title: string,
    currency: string,
    dueDate: Date,
    roundingScheme: string,
    economicOptions: {
        customer: string,
        customerPrice: number,
        text1: string,
        ourReference: string,
        customerContact: string
    },
}

export interface PickedIssue {
    key: string,
    id: string,
    name: string,
    hoursSpent: number
    updatedHoursSpent: number | null,
    discountPercentage: number | null
}

interface CreateInvoiceState extends PickedState, InvoiceInformation {
    setInvoiceInformation: (invoiceInformation: InvoiceInformation) => void,
    pickProject: (projectKey: string) => void,
    pickIssues: (pickedIssues: PickedIssue[]) => void,
}

const useInvoiceIssuesStore = create<CreateInvoiceState>((set) => ({
    title: "",
    currency: "",
    dueDate: new Date(),
    roundingScheme: "",
    client: "",
    pickedProject: "",
    pickedIssues: [],
    economicOptions: {
        customer: "",
        customerPrice: 0,
        text1: "",
        ourReference: "",
        customerContact: "",
    },
    setInvoiceInformation: (invoiceInformation: InvoiceInformation) => set((state) => ({ ...state, ...invoiceInformation })),
    pickProject: (projectKey: string) => set((state) => ({ ...state, pickedProject: projectKey })),
    pickIssues: (pickedIssues: PickedIssue[]) => set((state) => ({ ...state, pickedIssues: pickedIssues })),
}))

export default useInvoiceIssuesStore;