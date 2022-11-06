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
    checkAll: boolean,
}

interface StoreState extends State {
    setStore: (store: State) => void,
    setCheckAll: (value: boolean) => void,
    setCheckClient: (clientId: string, value: boolean) => void,
    setCheckClientTemplate: (clientId: string, templateId: string, value: boolean) => void
}

const useInvoiceTemplatesStore = create<StoreState>((set) => ({
    clients: {},
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
}))

export default useInvoiceTemplatesStore;