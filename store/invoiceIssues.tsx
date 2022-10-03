import create from 'zustand';

export interface PickedState {
    pickedIssues: PickedJiraIssue[]
    pickedProject: string,
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

export interface PickedJiraIssue {
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
    pickIssues: (pickedIssues: PickedJiraIssue[]) => void,
}

const useInvoiceIssuesStore = create<CreateInvoiceState>((set) => ({
    title: "",
    currency: "USD",
    dueDate: new Date(),
    roundingScheme: "2. Decimals",
    client: "",
    pickedProject: "",
    pickedIssues: [],
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
    pickProject: (projectKey: string) => set((state) => ({ ...state, pickedProject: projectKey })),
    pickIssues: (pickedIssues: PickedJiraIssue[]) => set((state) => ({ ...state, pickedIssues: pickedIssues })),
}))

export default useInvoiceIssuesStore;