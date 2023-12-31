import { IEntity } from '@core/domain/entities/Entity';

export default interface IDao<E extends IEntity> {
	insertEntity(entity: E): Promise<E>;
	findEntityById(id: number | undefined): Promise<E | null>;
	updateEntity(entity: E): Promise<E>;
	deleteEntity(entity: E): Promise<E>;

	findGraphEntityById(id: number, grap: string): Promise<E | null>;
	getGraphAllEntities(grap: string): Promise<E[]>;
	updateGraphEntity(entity: E): Promise<E>;
	insertGraphEntity(entity: E): Promise<E>;
	insertGraphMultipleEntities(entity: E[]): Promise<E[]>;

	insertBulkOfEntities(entities: E[]): Promise<E[]>;
	deleteBulkOfEntities(entities: E[]): Promise<E[]>;
	updateBulkOfEntities(entities: E[]): Promise<E[]>;

	getAllEntities(): Promise<E[]>;
	countAllEntities(): Promise<number>;
}
