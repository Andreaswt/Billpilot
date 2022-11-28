export interface Response<T> {
    success: boolean;
    data: T[];
    total: number;
}

export interface ActivityLink {
    id: number;
    activity_id: number;
    resource_type: string;
}

export interface Activity {
    id: number;
    name: string;
}