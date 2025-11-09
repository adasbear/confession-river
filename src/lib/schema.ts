import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';

export const confession = sqliteTable('confession', {
  id: text('id').primaryKey(),
  body: text('body').notNull(),
  approved: integer('approved').default(0).notNull(),
  userId: text('userId').notNull().references(() => ghostUser.id),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
});

export const ghostUser = sqliteTable('ghostUser', {
  id: text('id').primaryKey(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
});

export const like = sqliteTable(
  'like',
  {
    confessionId: text('confessionId').notNull().references(() => confession.id),
    userId: text('userId').notNull().references(() => ghostUser.id),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.confessionId, table.userId] }),
  })
);

export const comment = sqliteTable('comment', {
  id: text('id').primaryKey(),
  confessionId: text('confessionId')
    .notNull()
    .references(() => confession.id),
  userId: text('userId').notNull().references(() => ghostUser.id),
  body: text('body').notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
});

export const activityLog = sqliteTable('activityLog', {
  id: text('id').primaryKey(),
  ownerId: text('ownerId').notNull().references(() => ghostUser.id),
  type: text('type').notNull(),
  actorName: text('actorName').notNull(),
  targetId: text('targetId').notNull(),
  read: integer('read').default(0).notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
});

