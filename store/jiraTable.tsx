import create from 'zustand';

export interface CheckedItemsState {
    project: { id: string, key: string, displayName: string }[]
    issue: { id: string, key: string, displayName: string }[]
    employee: { id: string, key: string, displayName: string }[]
}

interface TaxDiscountState extends CheckedItemsState {
    checkProject: (item: { id: string, key: string, displayName: string }) => void,
    checkIssue: (item: { id: string, key: string, displayName: string }) => void,
    checkEmployee: (item: { id: string, key: string, displayName: string }) => void,
    uncheckProject: (item: { id: string, key: string }) => void,
    uncheckIssue: (item: { id: string, key: string }) => void,
    uncheckEmployee: (item: { id: string, key: string }) => void,
}

const useJiraTableStore = create<TaxDiscountState>((set) => ({
    project: [],
    issue: [],
    employee: [],
    checkProject: (item: { id: string, key: string, displayName: string }) => set((state) => ({ project: [...state.project, item] })),
    checkIssue: (item: { id: string, key: string, displayName: string }) => set((state) => ({ issue: [...state.issue, item] })),
    checkEmployee: (item: { id: string, key: string, displayName: string }) => set((state) => ({ employee: [...state.employee, item] })),
    uncheckProject: (item: { id: string, key: string }) => set((state) => ({ project: [...state.project.filter(x => x.id === item.id && x.key !== item.key)] })),
    uncheckIssue: (item: { id: string, key: string }) => set((state) => ({ issue: [...state.issue.filter(x => x.id === item.id && x.key !== item.key)] })),
    uncheckEmployee: (item: { id: string, key: string }) => set((state) => ({ employee: [...state.employee.filter(x => x.id === item.id && x.key !== item.key)] })),
}))

export default useJiraTableStore;