import { getRepository, Repository } from 'typeorm';
import { SuperAdmin } from '../entity/superadmin.entity';
import { SuperAdminModel } from '../model/SuperAdminModel';
import { IRepository } from './repository.interface';

export class SuperAdminRepository implements IRepository<SuperAdmin> {
    public async findAll(): Promise<SuperAdmin[]> {
        const repository: Repository<SuperAdmin> = getRepository(SuperAdmin);
        let superlist: SuperAdmin[] = await repository.find();
        if (superlist.length === 0) throw new Error('There are no registered superadmin keys.');
        return superlist;
    }

    public async findSingle(key: string): Promise<SuperAdmin | undefined> {
        const repository: Repository<SuperAdmin> = getRepository(SuperAdmin);
        let superadmin: SuperAdmin | undefined = await repository.findOne({ key: key });
        if (superadmin === undefined) throw new Error('Such superadmin is not registered.');
        return superadmin;
    }

    public async addSingle(superadmin: SuperAdminModel): Promise<SuperAdmin> {
        const repository: Repository<SuperAdmin> = getRepository(SuperAdmin);
        let newSuperadmin: SuperAdmin | undefined = await repository.findOne({ key: superadmin.key });
        if (newSuperadmin === undefined) {
            newSuperadmin = new SuperAdmin();
            newSuperadmin.key = superadmin.key;
            newSuperadmin.description = superadmin.description;
        } else {
            throw new Error('Such superadmin is already registered.');
        }
        return await repository.save(newSuperadmin);
    }

    public async updateSingle(key: string, superadmin: SuperAdminModel): Promise<SuperAdmin> {
        const repository: Repository<SuperAdmin> = getRepository(SuperAdmin);
        let newSuperadmin: SuperAdmin | undefined = await repository.findOne({ key: key });
        if (newSuperadmin !== undefined) {
            newSuperadmin.key = superadmin.key;
            newSuperadmin.description = superadmin.description;
        } else {
            throw new Error('Such player is not registered yet.');
        }
        return await repository.save(newSuperadmin);
    }

    public async deleteSingle(key: string): Promise<void> {
        const repository: Repository<SuperAdmin> = getRepository(SuperAdmin);
        let superadmin: SuperAdmin | undefined = await repository.findOne({ key: key });
        if (superadmin === undefined) {
            throw new Error('Such player is not registered yet.');
        } else {
            await repository.remove(superadmin);
        }
    }
}
