export interface IRepository<T> {
    findAll(): Promise<T[]>;
    findSingle(target: string): Promise<T | undefined>;
    addSingle(targetModel: any): Promise<T>;
    updateSingle(target: string, targetModel: any): Promise<T>;
    deleteSingle(target: string): Promise<void>;
}