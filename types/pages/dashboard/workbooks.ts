export interface Statistics {
    budgetedHours: number;
    budget: string;
    hoursTracked: number;
    cost: string;
    overUnderBudget: string;
}

export interface Employee extends Statistics {
    name: string;
}

export interface Job extends Statistics {
    name: string;
    employees: Employee[];
}

export interface Client extends Statistics {
    name: string;
    jobs: Job[];
}