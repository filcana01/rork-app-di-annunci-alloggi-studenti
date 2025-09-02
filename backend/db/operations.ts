import { eq, and, or, desc, asc, like, gte, lte, sql } from 'drizzle-orm';
import { db, users, listings, messages, favorites, notifications, listingViews } from './index';
import type { 
  User, NewUser, 
  Listing, NewListing, 
  Message, NewMessage,
  Favorite, NewFavorite,

  Notification, NewNotification,
  ListingView, NewListingView
} from './schema';
import bcrypt from 'bcryptjs';

// Utility function to generate UUID
function generateId(): string {
  return crypto.randomUUID();
}

// User operations
export const userOperations = {
  async create(userData: Omit<NewUser, 'id' | 'createdAt' | 'updatedAt' | 'passwordHash'> & { password: string }): Promise<User> {
    const passwordHash = await bcrypt.hash(userData.password, 12);
    const newUser: NewUser = {
      id: generateId(),
      ...userData,
      passwordHash,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const [user] = await db.insert(users).values(newUser).returning();
    return user;
  },

  async findByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return user;
  },

  async findById(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return user;
  },

  async update(id: string, updates: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User | undefined> {
    const [user] = await db.update(users)
      .set({ ...updates, updatedAt: new Date().toISOString() })
      .where(eq(users.id, id))
      .returning();
    return user;
  },

  async verifyPassword(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (!user) return null;
    
    const isValid = await bcrypt.compare(password, user.passwordHash);
    return isValid ? user : null;
  },

  async list(limit = 50, offset = 0): Promise<User[]> {
    return db.select().from(users).limit(limit).offset(offset).orderBy(desc(users.createdAt));
  },
};

// Listing operations
export const listingOperations = {
  async create(listingData: Omit<NewListing, 'id' | 'createdAt' | 'updatedAt'>): Promise<Listing> {
    const newListing: NewListing = {
      id: generateId(),
      ...listingData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const [listing] = await db.insert(listings).values(newListing).returning();
    return listing;
  },

  async findById(id: string): Promise<Listing | undefined> {
    const [listing] = await db.select().from(listings).where(eq(listings.id, id)).limit(1);
    return listing;
  },

  async findByUserId(userId: string, limit = 50, offset = 0): Promise<Listing[]> {
    return db.select().from(listings)
      .where(eq(listings.userId, userId))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(listings.createdAt));
  },

  async update(id: string, updates: Partial<Omit<Listing, 'id' | 'createdAt'>>): Promise<Listing | undefined> {
    const [listing] = await db.update(listings)
      .set({ ...updates, updatedAt: new Date().toISOString() })
      .where(eq(listings.id, id))
      .returning();
    return listing;
  },

  async delete(id: string): Promise<boolean> {
    const result = await db.delete(listings).where(eq(listings.id, id));
    return result.rowsAffected > 0;
  },

  async search(filters: {
    category?: string;
    city?: string;
    minPrice?: number;
    maxPrice?: number;
    minSurface?: number;
    maxSurface?: number;
    rooms?: number;
    furnishing?: string;
    petsAllowed?: boolean;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<Listing[]> {

    const conditions = [];

    if (filters.category) {
      conditions.push(eq(listings.category, filters.category as any));
    }
    if (filters.city) {
      conditions.push(like(listings.city, `%${filters.city}%`));
    }
    if (filters.minPrice) {
      conditions.push(gte(listings.monthlyRent, filters.minPrice));
    }
    if (filters.maxPrice) {
      conditions.push(lte(listings.monthlyRent, filters.maxPrice));
    }
    if (filters.minSurface) {
      conditions.push(gte(listings.surface, filters.minSurface));
    }
    if (filters.maxSurface) {
      conditions.push(lte(listings.surface, filters.maxSurface));
    }
    if (filters.rooms) {
      conditions.push(eq(listings.rooms, filters.rooms));
    }
    if (filters.furnishing) {
      conditions.push(eq(listings.furnishing, filters.furnishing as any));
    }
    if (filters.petsAllowed !== undefined) {
      conditions.push(eq(listings.petsAllowed, filters.petsAllowed));
    }
    if (filters.status) {
      conditions.push(eq(listings.status, filters.status as any));
    } else {
      // Default to active listings only
      conditions.push(eq(listings.status, 'active'));
    }

    if (conditions.length > 0) {
      return db.select().from(listings)
        .where(and(...conditions))
        .limit(filters.limit || 50)
        .offset(filters.offset || 0)
        .orderBy(desc(listings.createdAt));
    }

    return db.select().from(listings)
      .limit(filters.limit || 50)
      .offset(filters.offset || 0)
      .orderBy(desc(listings.createdAt));
  },

  async getActive(limit = 50, offset = 0): Promise<Listing[]> {
    return db.select().from(listings)
      .where(eq(listings.status, 'active'))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(listings.createdAt));
  },
};

// Message operations
export const messageOperations = {
  async create(messageData: Omit<NewMessage, 'id' | 'createdAt'>): Promise<Message> {
    const newMessage: NewMessage = {
      id: generateId(),
      ...messageData,
      createdAt: new Date().toISOString(),
    };
    
    const [message] = await db.insert(messages).values(newMessage).returning();
    return message;
  },

  async getConversation(userId1: string, userId2: string, listingId: string): Promise<Message[]> {
    return db.select().from(messages)
      .where(
        and(
          eq(messages.listingId, listingId),
          or(
            and(eq(messages.senderId, userId1), eq(messages.receiverId, userId2)),
            and(eq(messages.senderId, userId2), eq(messages.receiverId, userId1))
          )
        )
      )
      .orderBy(asc(messages.createdAt));
  },

  async getUserMessages(userId: string): Promise<Message[]> {
    return db.select().from(messages)
      .where(
        or(
          eq(messages.senderId, userId),
          eq(messages.receiverId, userId)
        )
      )
      .orderBy(desc(messages.createdAt));
  },

  async markAsRead(messageId: string): Promise<boolean> {
    const result = await db.update(messages)
      .set({ read: true })
      .where(eq(messages.id, messageId));
    return result.rowsAffected > 0;
  },
};

// Favorite operations
export const favoriteOperations = {
  async add(userId: string, listingId: string): Promise<Favorite> {
    const newFavorite: NewFavorite = {
      id: generateId(),
      userId,
      listingId,
      createdAt: new Date().toISOString(),
    };
    
    const [favorite] = await db.insert(favorites).values(newFavorite).returning();
    return favorite;
  },

  async remove(userId: string, listingId: string): Promise<boolean> {
    const result = await db.delete(favorites)
      .where(
        and(
          eq(favorites.userId, userId),
          eq(favorites.listingId, listingId)
        )
      );
    return result.rowsAffected > 0;
  },

  async getUserFavorites(userId: string): Promise<Listing[]> {
    return db.select({
      id: listings.id,
      userId: listings.userId,
      category: listings.category,
      title: listings.title,
      description: listings.description,
      images: listings.images,
      street: listings.street,
      zipCode: listings.zipCode,
      city: listings.city,
      country: listings.country,
      latitude: listings.latitude,
      longitude: listings.longitude,
      surface: listings.surface,
      rooms: listings.rooms,
      floor: listings.floor,
      bathrooms: listings.bathrooms,
      furnishing: listings.furnishing,
      monthlyRent: listings.monthlyRent,
      expensesIncluded: listings.expensesIncluded,
      monthlyExpenses: listings.monthlyExpenses,
      yearlyAdjustment: listings.yearlyAdjustment,
      securityDeposit: listings.securityDeposit,
      acceptsSwissCaution: listings.acceptsSwissCaution,
      acceptsOtherGuarantees: listings.acceptsOtherGuarantees,
      guaranteeServices: listings.guaranteeServices,
      terrace: listings.terrace,
      garden: listings.garden,
      petsAllowed: listings.petsAllowed,
      availabilityType: listings.availabilityType,
      availableFrom: listings.availableFrom,
      minimumContractMonths: listings.minimumContractMonths,
      rules: listings.rules,
      accessibility: listings.accessibility,
      status: listings.status,
      createdAt: listings.createdAt,
      updatedAt: listings.updatedAt,
    })
    .from(favorites)
    .innerJoin(listings, eq(favorites.listingId, listings.id))
    .where(eq(favorites.userId, userId))
    .orderBy(desc(favorites.createdAt));
  },

  async isFavorite(userId: string, listingId: string): Promise<boolean> {
    const [favorite] = await db.select().from(favorites)
      .where(
        and(
          eq(favorites.userId, userId),
          eq(favorites.listingId, listingId)
        )
      )
      .limit(1);
    return !!favorite;
  },
};

// Notification operations
export const notificationOperations = {
  async create(notificationData: Omit<NewNotification, 'id' | 'createdAt'>): Promise<Notification> {
    const newNotification: NewNotification = {
      id: generateId(),
      ...notificationData,
      createdAt: new Date().toISOString(),
    };
    
    const [notification] = await db.insert(notifications).values(newNotification).returning();
    return notification;
  },

  async getUserNotifications(userId: string, limit = 50, offset = 0): Promise<Notification[]> {
    return db.select().from(notifications)
      .where(eq(notifications.userId, userId))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(notifications.createdAt));
  },

  async markAsRead(notificationId: string): Promise<boolean> {
    const result = await db.update(notifications)
      .set({ read: true })
      .where(eq(notifications.id, notificationId));
    return result.rowsAffected > 0;
  },

  async markAllAsRead(userId: string): Promise<boolean> {
    const result = await db.update(notifications)
      .set({ read: true })
      .where(eq(notifications.userId, userId));
    return result.rowsAffected > 0;
  },
};

// Analytics operations
export const analyticsOperations = {
  async recordView(viewData: Omit<NewListingView, 'id' | 'viewedAt'>): Promise<ListingView> {
    const newView: NewListingView = {
      id: generateId(),
      ...viewData,
      viewedAt: new Date().toISOString(),
    };
    
    const [view] = await db.insert(listingViews).values(newView).returning();
    return view;
  },

  async getListingViews(listingId: string): Promise<number> {
    const [result] = await db.select({ count: sql<number>`count(*)` })
      .from(listingViews)
      .where(eq(listingViews.listingId, listingId));
    return result.count;
  },

  async getUserListingViews(userId: string): Promise<{ listingId: string; views: number }[]> {
    return db.select({
      listingId: listingViews.listingId,
      views: sql<number>`count(*)`
    })
    .from(listingViews)
    .innerJoin(listings, eq(listingViews.listingId, listings.id))
    .where(eq(listings.userId, userId))
    .groupBy(listingViews.listingId);
  },
};