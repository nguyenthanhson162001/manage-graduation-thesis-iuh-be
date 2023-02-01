import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('topic', table => {
		table.increments('id').primary().unsigned();
		table.string('name').notNullable();
		table.integer('quantity_group_max').defaultTo(1);
		table.text('description');
		table.text('note');
		table.text('target');
		table.text('standrad_output');
		table.text('require_input');
		table.text('comment');

		table.enum('status', ['refuse', 'Peding', 'Accept']);

		table.integer('term_id').unsigned().references('id').inTable('term');
		table.integer('lecturer_id').unsigned().references('id').inTable('lecturer');
		table.timestamps();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('topic');
}