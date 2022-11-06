import create from 'zustand';

export interface State {
    clients: {
        [clientId: string]: {
            checkAllTemplates: boolean,
            checkedTemplates: {
                [templateId: string]: boolean
            }
        }
    },
    generatedTemplatesInfo: {
        [templateId: string]: {
            time: number | null,
            amount: number | null,
            formattedAmount: string | null
        }
    },
    checkAll: boolean,
}

interface GeneratedTemplatesInfo {
    [templateId: string]: {
        time: number | null,
        amount: number | null,
        formattedAmount: string | null
    }
}

interface StoreState extends State {
    setStore: (store: State) => void,
    setCheckAll: (value: boolean) => void,
    setCheckClient: (clientId: string, value: boolean) => void,
    setCheckClientTemplate: (clientId: string, templateId: string, value: boolean) => void,
    setGeneratedTemplatesInfo: (templates: GeneratedTemplatesInfo) => void
}

const useInvoiceTemplatesStore = create<StoreState>((set) => ({
    clients: {},
    generatedTemplatesInfo: {},
    checkAll: false,
    setStore: (store: State) => set(() => store),
    setCheckAll: (value: boolean) => set((state) => ({ ...state, checkAll: value })),
    setCheckClient: (clientId: string, value: boolean) => set((state) => ({
        ...state,
        clients: {
            ...state.clients,
            [clientId]: {
                ...state.clients[clientId],
                checkAllTemplates: value
            },
        }
    })),
    setCheckClientTemplate: (clientId: string, templateId: string, value: boolean) => set((state) => ({
        ...state,
        clients: {
            ...state.clients,
            [clientId]: {
                ...state.clients[clientId],
                checkedTemplates: {
                    ...state.clients[clientId].checkedTemplates,
                    [templateId]: value
                }
            },
        }
    })),
    setGeneratedTemplatesInfo: (templates: GeneratedTemplatesInfo) => set((state) => ({
        ...state,
        generatedTemplatesInfo: templates
    }))
}))

export default useInvoiceTemplatesStore;