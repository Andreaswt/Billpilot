import create from 'zustand';

export interface PickedState {
    pickedTickets: PickedHubspotTicket[]
    pickedCompany: string,
    pickedIssues: PickedJiraIssue[],
    pickedProject: string,
}

export interface InvoiceInformationState {
    title: string,
    description: string,
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
        unit: string
        unitName: string
        layout: string
        layoutName: string
        vatZone: string
        vatZoneName: string
        paymentTerms: string
        paymentTermsName: string
        product: string
        productName: string
    },
}

// Hubspot
export interface PickedHubspotTicket {
    id: string
    subject: string
    content: string
    lastModified: string
    updatedHoursSpent: number | null,
    discountPercentage: number | null
}

// Jira
export interface PickedJiraIssue {
    key: string,
    id: string,
    name: string,
    hoursSpent: number
    updatedHoursSpent: number | null,
    discountPercentage: number | null
}

interface CreateInvoiceState extends PickedState, InvoiceInformationState {
    setInvoiceInformation: (invoiceInformation: InvoiceInformationState) => void,

    // Hubspot
    pickCompany: (companyId: string) => void,
    pickTickets: (pickedTickets: PickedHubspotTicket[]) => void,
    pickedTickets: PickedHubspotTicket[]
    pickedCompany: string,

    // Jira
    pickProject: (projectKey: string) => void,
    pickIssues: (pickedIssues: PickedJiraIssue[]) => void,
    pickedIssues: PickedJiraIssue[]
    pickedProject: string,
}

const useInvoiceStore = create<CreateInvoiceState>((set) => ({
    title: "",
    description: "",
    currency: "USD",
    dueDate: new Date(),
    roundingScheme: "2. Decimals",
    client: "",

    // Hubspot
    pickedCompany: "",
    pickedTickets: [],
    pickCompany: (companyId: string) => set((state) => ({ ...state, pickedCompany: companyId })),
    pickTickets: (pickedTickets: PickedHubspotTicket[]) => set((state) => ({ ...state, pickedTickets: pickedTickets })),

    // Jira
    pickedProject: "",
    pickedIssues: [],
    pickProject: (projectKey: string) => set((state) => ({ ...state, pickedProject: projectKey })),
    pickIssues: (pickedIssues: PickedJiraIssue[]) => set((state) => ({ ...state, pickedIssues: pickedIssues })),
    
    // Economic
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
        unit: "",
        unitName: "",
        layout: "",
        layoutName: "",
        vatZone: "",
        vatZoneName: "",
        paymentTerms: "",
        paymentTermsName: "",
        product: "",
        productName: ""
    },
    setInvoiceInformation: (invoiceInformation: InvoiceInformationState) => set((state) => ({ ...state, ...invoiceInformation })),
}))

export default useInvoiceStore;