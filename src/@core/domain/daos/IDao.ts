import { IEntity } from '@core/domain/entities/Entity';

export default interface IDao<E extends IEntity> {
	insertEntity(entity: E): Promise<E>;
	findEntityById(id: number): Promise<E | null>;
	updateEntity(entity: E): Promise<E>;
	deleteEntity(entity: E): Promise<E>;
	insertBulkOfEntities(entities: E[]): Promise<E[]>;
	deleteBulkOfEntities(entities: E[]): Promise<E[]>;
	updateBulkOfEntities(entities: E[]): Promise<E[]>;
	getAllEntities(): Promise<E[]>;
	countAllEntities(): Promise<number>;
}