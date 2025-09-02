import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

// Users table
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  phone: text('phone').notNull(),
  role: text('role', { enum: ['guest', 'student', 'landlord', 'admin'] }).notNull().default('guest'),
  companyName: text('company_name'),
  address: text('address'),
  verified: integer('verified', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Listings table
export const listings = sqliteTable('listings', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  category: text('category', { enum: ['room', 'apartment', 'parking'] }).notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  images: text('images', { mode: 'json' }).$type<string[]>().notNull().default([]),
  
  // Address fields
  street: text('street').notNull(),
  zipCode: text('zip_code').notNull(),
  city: text('city').notNull(),
  country: text('country').notNull(),
  latitude: real('latitude').notNull(),
  longitude: real('longitude').notNull(),
  
  // Property details
  surface: real('surface').notNull(),
  rooms: integer('rooms'),
  floor: text('floor'),
  bathrooms: integer('bathrooms').notNull().default(1),
  furnishing: text('furnishing', { enum: ['furnished', 'partially_furnished', 'unfurnished'] }).notNull(),
  
  // Financial details
  monthlyRent: real('monthly_rent').notNull(),
  expensesIncluded: integer('expenses_included', { mode: 'boolean' }).notNull().default(false),
  monthlyExpenses: real('monthly_expenses'),
  yearlyAdjustment: integer('yearly_adjustment', { mode: 'boolean' }).notNull().default(false),
  securityDeposit: real('security_deposit').notNull().default(0),
  acceptsSwissCaution: integer('accepts_swiss_caution', { mode: 'boolean' }).notNull().default(false),
  acceptsOtherGuarantees: integer('accepts_other_guarantees', { mode: 'boolean' }).notNull().default(false),
  guaranteeServices: text('guarantee_services'),
  
  // Features
  terrace: integer('terrace', { mode: 'boolean' }).notNull().default(false),
  garden: integer('garden', { mode: 'boolean' }).notNull().default(false),
  petsAllowed: integer('pets_allowed', { mode: 'boolean' }).notNull().default(false),
  
  // Availability
  availabilityType: text('availability_type', { enum: ['immediately', 'from_date'] }).notNull(),
  availableFrom: text('available_from').notNull(),
  minimumContractMonths: integer('minimum_contract_months').notNull().default(12),
  
  // Additional info
  rules: text('rules'),
  accessibility: text('accessibility', { mode: 'json' }).$type<string[]>().notNull().default([]),
  
  // Status
  status: text('status', { enum: ['draft', 'pending', 'active', 'expired', 'archived'] }).notNull().default('draft'),
  
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Messages table
export const messages = sqliteTable('messages', {
  id: text('id').primaryKey(),
  senderId: text('sender_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  receiverId: text('receiver_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  listingId: text('listing_id').notNull().references(() => listings.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  read: integer('read', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Favorites table
export const favorites = sqliteTable('favorites', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  listingId: text('listing_id').notNull().references(() => listings.id, { onDelete: 'cascade' }),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Saved searches table
export const savedSearches = sqliteTable('saved_searches', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  filters: text('filters', { mode: 'json' }).notNull(),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Notifications table
export const notifications = sqliteTable('notifications', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  read: integer('read', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Listing views table (for analytics)
export const listingViews = sqliteTable('listing_views', {
  id: text('id').primaryKey(),
  listingId: text('listing_id').notNull().references(() => listings.id, { onDelete: 'cascade' }),
  userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  viewedAt: text('viewed_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Export types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Listing = typeof listings.$inferSelect;
export type NewListing = typeof listings.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
export type Favorite = typeof favorites.$inferSelect;
export type NewFavorite = typeof favorites.$inferInsert;
export type SavedSearch = typeof savedSearches.$inferSelect;
export type NewSavedSearch = typeof savedSearches.$inferInsert;
export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;
export type ListingView = typeof listingViews.$inferSelect;
export type NewListingView = typeof listingViews.$inferInsert;