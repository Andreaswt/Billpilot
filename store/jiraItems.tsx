import produce, { current } from 'immer';
import _ from 'lodash';
import { get } from 'lodash';
import create from 'zustand';

export interface Item {
    key: string,
    displayName: string
}

export interface CheckedTimeItems {
    project: Item[],
    issue: Item[],
    employee: Item[],
}

interface JiraTable {
    importedHoursTotal: number,
    timeItems: CheckedTimeItems
}

export interface TimeItemsState {
    jiraTables: JiraTable[]
}

interface CheckedItemsState extends TimeItemsState {
    setJiraTable: (timeItemIndex: number, timeItems: CheckedTimeItems, importedHoursTotal: number) => void,
    removeJiraTable: (timeItemIndex: number) => void,
    getAllJiraTableHours: () => number,

    // Projects
    removeCheckedProject: (timeItemIndex: number, projectKey: string) => void,
    checkProject: (timeItemIndex: number, checkedItems: Item) => void,
    projectExists: (timeItemIndex: number, projectKey: string) => boolean,

    // Issues
    removeCheckedIssue: (timeItemIndex: number, issueKey: string) => void,
    checkIssue: (timeItemIndex: number, checkedItems: Item) => void,
    issueExists: (timeItemIndex: number, issueKey: string) => boolean,

    // Employees
    removeCheckedEmployee: (timeItemIndex: number, employeeKey: string) => void,
    checkEmployee: (timeItemIndex: number, checkedItems: Item) => void,
    employeeExists: (timeItemIndex: number, employeeKey: string) => boolean,
}

const useJiraItemsStore = create<CheckedItemsState>((set, get) => ({
    jiraTables: [],

    setJiraTable: (timeItemIndex: number, timeItems: CheckedTimeItems, importedHoursTotal: number) => set(
        produce<CheckedItemsState>((draft) => {
            // If the time item index doesn't exist yet, add a new time item (create)
            if (!draft.jiraTables[timeItemIndex]) {
                draft.jiraTables[timeItemIndex] = {
                    importedHoursTotal: importedHoursTotal,
                    timeItems: timeItems
                }
            }

            // Otherwise, update the time item (update)
            else {
                draft.jiraTables[timeItemIndex].timeItems = timeItems;
                draft.jiraTables[timeItemIndex].importedHoursTotal = importedHoursTotal;
            }
        })
    ),

    removeJiraTable: (timeItemIndex: number) => set(
        produce<CheckedItemsState>(draft => {
            draft.jiraTables.splice(timeItemIndex, 1);
        })
    ),

    getAllJiraTableHours: () => get().jiraTables.reduce((previous, current) => previous + current.importedHoursTotal, 0),

    // Projects
    removeCheckedProject: (timeItemIndex: number, projectKey: string) => set(
        produce<CheckedItemsState>((draft) => {
            const index = draft.jiraTables[timeItemIndex].timeItems.project.findIndex(i => i.key === projectKey);
            if (index !== -1) draft.jiraTables[timeItemIndex].timeItems.project.splice(index, 1);
        }
        )),
    checkProject: (timeItemIndex: number, checkedItems: Item) => set(
        produce<CheckedItemsState>((draft) => {
            draft.jiraTables[timeItemIndex].timeItems.project.push(checkedItems);
        })
    ),
    projectExists: (timeItemIndex: number, projectKey: string) => get().jiraTables[timeItemIndex].timeItems.project.some(p => p.key === projectKey),

    // Issues
    removeCheckedIssue: (timeItemIndex: number, issueKey: string) => set(
        produce<CheckedItemsState>((draft) => {
            const index = draft.jiraTables[timeItemIndex].timeItems.issue.findIndex(i => i.key === issueKey);
            if (index !== -1) draft.jiraTables[timeItemIndex].timeItems.issue.splice(index, 1);
        }
        )),
    checkIssue: (timeItemIndex: number, checkedItems: Item) => set(
        produce<CheckedItemsState>((draft) => {
            draft.jiraTables[timeItemIndex].timeItems.issue.push(checkedItems);
        }
        )),
    issueExists: (timeItemIndex: number, issueKey: string) => get().jiraTables[timeItemIndex].timeItems.issue.some(i => i.key === issueKey),


    // Employees
    removeCheckedEmployee: (timeItemIndex: number, employeeKey: string) => set(
        produce<CheckedItemsState>((draft) => {
            const index = draft.jiraTables[timeItemIndex].timeItems.employee.findIndex(e => e.key === employeeKey);
            if (index !== -1) draft.jiraTables[timeItemIndex].timeItems.employee.splice(index, 1);
        }
        )),
    checkEmployee: (timeItemIndex: number, checkedItems: Item) => set(
        produce<CheckedItemsState>((draft) => {
            draft.jiraTables[timeItemIndex].timeItems.employee.push(checkedItems);
        }
        )),
    employeeExists: (timeItemIndex: number, employeeKey: string) => get().jiraTables[timeItemIndex].timeItems.employee.some(e => e.key === employeeKey),
}))

export default useJiraItemsStore;