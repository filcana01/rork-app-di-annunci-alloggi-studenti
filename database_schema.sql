-- ============================================
-- SCRIPT CREAZIONE DATABASE PIATTAFORMA ALLOGGI STUDENTI
-- ============================================

-- Tabella per la gestione dei ruoli utente
CREATE TABLE UserRoles (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    RoleName NVARCHAR(50) NOT NULL UNIQUE,
    Description NVARCHAR(255),
    CreatedAt DATETIME2 DEFAULT GETDATE()
);

-- Tabella per la gestione dei badge utente
CREATE TABLE UserBadges (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    BadgeName NVARCHAR(50) NOT NULL UNIQUE,
    Description NVARCHAR(255),
    Color NVARCHAR(7), -- Hex color code
    Icon NVARCHAR(50),
    CreatedAt DATETIME2 DEFAULT GETDATE()
);

-- Tabella principale degli utenti
CREATE TABLE Users (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Username NVARCHAR(50) NOT NULL UNIQUE,
    Email NVARCHAR(255) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    FirstName NVARCHAR(100) NOT NULL,
    LastName NVARCHAR(100) NOT NULL,
    CompanyName NVARCHAR(255) NULL,
    PhoneNumber NVARCHAR(20),
    Address NVARCHAR(500),
    City NVARCHAR(100),
    PostalCode NVARCHAR(10),
    Country NVARCHAR(100),
    RoleId INT NOT NULL,
    BadgeId INT NULL,
    IsEmailVerified BIT DEFAULT 0,
    IsActive BIT DEFAULT 1,
    ProfileImageUrl NVARCHAR(500),
    Bio NVARCHAR(1000),
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    LastLoginAt DATETIME2 NULL,
    
    CONSTRAINT FK_Users_UserRoles FOREIGN KEY (RoleId) REFERENCES UserRoles(Id),
    CONSTRAINT FK_Users_UserBadges FOREIGN KEY (BadgeId) REFERENCES UserBadges(Id)
);

-- Tabella per le categorie di annunci
CREATE TABLE ListingCategories (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    CategoryName NVARCHAR(50) NOT NULL UNIQUE,
    Description NVARCHAR(255),
    Icon NVARCHAR(50),
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETDATE()
);

-- Tabella per gli stati degli annunci
CREATE TABLE ListingStatuses (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    StatusName NVARCHAR(50) NOT NULL UNIQUE,
    Description NVARCHAR(255),
    Color NVARCHAR(7), -- Hex color code
    CreatedAt DATETIME2 DEFAULT GETDATE()
);

-- Tabella per i tipi di arredamento
CREATE TABLE FurnishingTypes (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    TypeName NVARCHAR(50) NOT NULL UNIQUE,
    Description NVARCHAR(255),
    CreatedAt DATETIME2 DEFAULT GETDATE()
);

-- Tabella principale degli annunci
CREATE TABLE Listings (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    CategoryId INT NOT NULL,
    StatusId INT NOT NULL,
    Title NVARCHAR(255) NOT NULL,
    Description NVARCHAR(MAX),
    
    -- Informazioni indirizzo
    Address NVARCHAR(500) NOT NULL,
    City NVARCHAR(100) NOT NULL,
    PostalCode NVARCHAR(10) NOT NULL,
    Country NVARCHAR(100) NOT NULL,
    Latitude DECIMAL(10, 8),
    Longitude DECIMAL(11, 8),
    
    -- Caratteristiche immobile
    SurfaceArea DECIMAL(8, 2), -- m²
    NumberOfRooms INT,
    Floor INT,
    NumberOfBathrooms INT,
    FurnishingTypeId INT,
    
    -- Informazioni economiche
    MonthlyRent DECIMAL(10, 2) NOT NULL,
    ExpensesIncluded BIT DEFAULT 0,
    MonthlyExpenses DECIMAL(10, 2) NULL,
    AnnualAdjustment BIT DEFAULT 0,
    SecurityDeposit DECIMAL(10, 2),
    AcceptsSwissCaution BIT DEFAULT 0,
    AcceptsOtherGuarantees BIT DEFAULT 0,
    GuaranteeServices NVARCHAR(500), -- Lista servizi accettati
    
    -- Caratteristiche aggiuntive
    HasTerrace BIT DEFAULT 0,
    HasGarden BIT DEFAULT 0,
    PetsAllowed BIT DEFAULT 0,
    SmokingAllowed BIT DEFAULT 0,
    
    -- Accessibilità
    HasElevator BIT DEFAULT 0,
    DisabilityAccessible BIT DEFAULT 0,
    AccessibilityNotes NVARCHAR(500),
    
    -- Date e durata
    AvailableFrom DATETIME2,
    AvailableImmediately BIT DEFAULT 1,
    MinimumContractDuration INT, -- in mesi
    
    -- Regole
    Rules NVARCHAR(MAX),
    
    -- Metadati
    ViewCount INT DEFAULT 0,
    IsPromoted BIT DEFAULT 0,
    PromotedUntil DATETIME2 NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    PublishedAt DATETIME2 NULL,
    ExpiresAt DATETIME2 NULL,
    
    CONSTRAINT FK_Listings_Users FOREIGN KEY (UserId) REFERENCES Users(Id),
    CONSTRAINT FK_Listings_Categories FOREIGN KEY (CategoryId) REFERENCES ListingCategories(Id),
    CONSTRAINT FK_Listings_Status FOREIGN KEY (StatusId) REFERENCES ListingStatuses(Id),
    CONSTRAINT FK_Listings_FurnishingType FOREIGN KEY (FurnishingTypeId) REFERENCES FurnishingTypes(Id)
);

-- Tabella per le immagini degli annunci
CREATE TABLE ListingImages (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ListingId INT NOT NULL,
    ImageUrl NVARCHAR(500) NOT NULL,
    ImageOrder INT DEFAULT 0,
    Caption NVARCHAR(255),
    IsMainImage BIT DEFAULT 0,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    
    CONSTRAINT FK_ListingImages_Listings FOREIGN KEY (ListingId) REFERENCES Listings(Id) ON DELETE CASCADE
);

-- Tabella per i preferiti degli utenti
CREATE TABLE UserFavorites (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    ListingId INT NOT NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    
    CONSTRAINT FK_UserFavorites_Users FOREIGN KEY (UserId) REFERENCES Users(Id),
    CONSTRAINT FK_UserFavorites_Listings FOREIGN KEY (ListingId) REFERENCES Listings(Id) ON DELETE CASCADE,
    CONSTRAINT UQ_UserFavorites_UserListing UNIQUE (UserId, ListingId)
);

-- Tabella per le ricerche salvate
CREATE TABLE SavedSearches (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    SearchName NVARCHAR(255) NOT NULL,
    SearchCriteria NVARCHAR(MAX), -- JSON con i criteri di ricerca
    NotificationsEnabled BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    
    CONSTRAINT FK_SavedSearches_Users FOREIGN KEY (UserId) REFERENCES Users(Id)
);

-- Tabella per le conversazioni tra utenti
CREATE TABLE Conversations (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ListingId INT NOT NULL,
    BuyerId INT NOT NULL, -- Utente interessato
    SellerId INT NOT NULL, -- Proprietario
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    
    CONSTRAINT FK_Conversations_Listings FOREIGN KEY (ListingId) REFERENCES Listings(Id),
    CONSTRAINT FK_Conversations_Buyer FOREIGN KEY (BuyerId) REFERENCES Users(Id),
    CONSTRAINT FK_Conversations_Seller FOREIGN KEY (SellerId) REFERENCES Users(Id),
    CONSTRAINT UQ_Conversations_ListingBuyer UNIQUE (ListingId, BuyerId)
);

-- Tabella per i messaggi
CREATE TABLE Messages (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ConversationId INT NOT NULL,
    SenderId INT NOT NULL,
    MessageText NVARCHAR(MAX) NOT NULL,
    IsRead BIT DEFAULT 0,
    ReadAt DATETIME2 NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    
    CONSTRAINT FK_Messages_Conversations FOREIGN KEY (ConversationId) REFERENCES Conversations(Id) ON DELETE CASCADE,
    CONSTRAINT FK_Messages_Sender FOREIGN KEY (SenderId) REFERENCES Users(Id)
);

-- Tabella per le notifiche
CREATE TABLE Notifications (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    Type NVARCHAR(50) NOT NULL, -- 'new_message', 'listing_expired', 'new_match', etc.
    Title NVARCHAR(255) NOT NULL,
    Message NVARCHAR(MAX) NOT NULL,
    RelatedEntityId INT NULL, -- ID dell'entità correlata (listing, message, etc.)
    RelatedEntityType NVARCHAR(50) NULL, -- Tipo dell'entità correlata
    IsRead BIT DEFAULT 0,
    ReadAt DATETIME2 NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    
    CONSTRAINT FK_Notifications_Users FOREIGN KEY (UserId) REFERENCES Users(Id)
);

-- Tabella per i log delle attività
CREATE TABLE ActivityLogs (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NULL,
    Action NVARCHAR(100) NOT NULL,
    EntityType NVARCHAR(50) NOT NULL,
    EntityId INT NOT NULL,
    Details NVARCHAR(MAX),
    IpAddress NVARCHAR(45),
    UserAgent NVARCHAR(500),
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    
    CONSTRAINT FK_ActivityLogs_Users FOREIGN KEY (UserId) REFERENCES Users(Id)
);

-- Tabella per le università/centri di ricerca (per filtri di vicinanza)
CREATE TABLE Universities (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(255) NOT NULL,
    Address NVARCHAR(500),
    City NVARCHAR(100),
    PostalCode NVARCHAR(10),
    Country NVARCHAR(100),
    Latitude DECIMAL(10, 8),
    Longitude DECIMAL(11, 8),
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETDATE()
);

-- Tabella per le sessioni utente (per gestire login/logout)
CREATE TABLE UserSessions (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    SessionToken NVARCHAR(255) NOT NULL UNIQUE,
    RefreshToken NVARCHAR(255),
    ExpiresAt DATETIME2 NOT NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    LastAccessedAt DATETIME2 DEFAULT GETDATE(),
    IpAddress NVARCHAR(45),
    UserAgent NVARCHAR(500),
    IsActive BIT DEFAULT 1,
    
    CONSTRAINT FK_UserSessions_Users FOREIGN KEY (UserId) REFERENCES Users(Id)
);

-- ============================================
-- INSERIMENTO DATI INIZIALI
-- ============================================

-- Inserimento ruoli utente
INSERT INTO UserRoles (RoleName, Description) VALUES
('Admin', 'Amministratore del sistema'),
('Student', 'Studente'),
('Landlord', 'Proprietario/Inserzionista'),
('Agency', 'Agenzia immobiliare');

-- Inserimento badge utente
INSERT INTO UserBadges (BadgeName, Description, Color, Icon) VALUES
('Studente Verificato', 'Studente con identità verificata', '#28a745', 'verified'),
('Persona Conosciuta', 'Utente fidato della community', '#17a2b8', 'star'),
('Azienda Conosciuta', 'Azienda verificata e affidabile', '#6f42c1', 'building'),
('Nuovo Utente', 'Utente appena registrato', '#6c757d', 'user');

-- Inserimento categorie annunci
INSERT INTO ListingCategories (CategoryName, Description, Icon) VALUES
('Appartamento', 'Appartamento completo', 'home'),
('Camera', 'Camera singola o condivisa', 'bed'),
('Parcheggio', 'Posto auto o garage', 'car'),
('Altro', 'Altri tipi di alloggio', 'more');

-- Inserimento stati annunci
INSERT INTO ListingStatuses (StatusName, Description, Color) VALUES
('Bozza', 'Annuncio in fase di creazione', '#6c757d'),
('In Revisione', 'Annuncio in attesa di verifica', '#ffc107'),
('Attivo', 'Annuncio pubblicato e visibile', '#28a745'),
('Scaduto', 'Annuncio scaduto', '#dc3545'),
('Archiviato', 'Annuncio archiviato', '#6c757d'),
('Sospeso', 'Annuncio sospeso per violazioni', '#fd7e14');

-- Inserimento tipi di arredamento
INSERT INTO FurnishingTypes (TypeName, Description) VALUES
('Arredato', 'Completamente arredato'),
('Parzialmente Arredato', 'Parzialmente arredato'),
('Non Arredato', 'Vuoto, senza arredamento');

-- Inserimento università di esempio (Svizzera)
INSERT INTO Universities (Name, Address, City, PostalCode, Country, Latitude, Longitude) VALUES
('Università della Svizzera italiana (USI)', 'Via Giuseppe Buffi 13', 'Lugano', '6900', 'Svizzera', 46.0037, 8.9511),
('ETH Zurich', 'Rämistrasse 101', 'Zurigo', '8092', 'Svizzera', 47.3769, 8.5417),
('EPFL', 'Route Cantonale', 'Losanna', '1015', 'Svizzera', 46.5197, 6.5659),
('Università di Basilea', 'Petersplatz 1', 'Basilea', '4003', 'Svizzera', 47.5596, 7.5886);

-- ============================================
-- CREAZIONE INDICI PER PERFORMANCE
-- ============================================

-- Indici per ricerche frequenti
CREATE INDEX IX_Listings_CategoryId ON Listings(CategoryId);
CREATE INDEX IX_Listings_StatusId ON Listings(StatusId);
CREATE INDEX IX_Listings_UserId ON Listings(UserId);
CREATE INDEX IX_Listings_City ON Listings(City);
CREATE INDEX IX_Listings_MonthlyRent ON Listings(MonthlyRent);
CREATE INDEX IX_Listings_AvailableFrom ON Listings(AvailableFrom);
CREATE INDEX IX_Listings_CreatedAt ON Listings(CreatedAt);
CREATE INDEX IX_Listings_Location ON Listings(Latitude, Longitude);

-- Indici per messaggistica
CREATE INDEX IX_Messages_ConversationId ON Messages(ConversationId);
CREATE INDEX IX_Messages_SenderId ON Messages(SenderId);
CREATE INDEX IX_Messages_CreatedAt ON Messages(CreatedAt);
CREATE INDEX IX_Conversations_ListingId ON Conversations(ListingId);
CREATE INDEX IX_Conversations_BuyerId ON Conversations(BuyerId);
CREATE INDEX IX_Conversations_SellerId ON Conversations(SellerId);

-- Indici per notifiche
CREATE INDEX IX_Notifications_UserId ON Notifications(UserId);
CREATE INDEX IX_Notifications_IsRead ON Notifications(IsRead);
CREATE INDEX IX_Notifications_CreatedAt ON Notifications(CreatedAt);

-- Indici per sessioni
CREATE INDEX IX_UserSessions_UserId ON UserSessions(UserId);
CREATE INDEX IX_UserSessions_SessionToken ON UserSessions(SessionToken);
CREATE INDEX IX_UserSessions_ExpiresAt ON UserSessions(ExpiresAt);

-- ============================================
-- STORED PROCEDURES UTILI
-- ============================================

-- Procedura per ottenere annunci con filtri
CREATE PROCEDURE GetFilteredListings
    @CategoryId INT = NULL,
    @City NVARCHAR(100) = NULL,
    @MinRent DECIMAL(10,2) = NULL,
    @MaxRent DECIMAL(10,2) = NULL,
    @MinRooms INT = NULL,
    @MaxRooms INT = NULL,
    @FurnishingTypeId INT = NULL,
    @PetsAllowed BIT = NULL,
    @HasTerrace BIT = NULL,
    @HasGarden BIT = NULL,
    @AvailableFrom DATETIME2 = NULL,
    @PageNumber INT = 1,
    @PageSize INT = 20
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @Offset INT = (@PageNumber - 1) * @PageSize;
    
    SELECT 
        l.*,
        u.FirstName + ' ' + u.LastName AS OwnerName,
        u.CompanyName,
        ub.BadgeName,
        ub.Color AS BadgeColor,
        lc.CategoryName,
        ls.StatusName,
        ft.TypeName AS FurnishingType,
        (SELECT TOP 1 ImageUrl FROM ListingImages WHERE ListingId = l.Id AND IsMainImage = 1) AS MainImageUrl,
        (SELECT COUNT(*) FROM ListingImages WHERE ListingId = l.Id) AS ImageCount
    FROM Listings l
    INNER JOIN Users u ON l.UserId = u.Id
    LEFT JOIN UserBadges ub ON u.BadgeId = ub.Id
    INNER JOIN ListingCategories lc ON l.CategoryId = lc.Id
    INNER JOIN ListingStatuses ls ON l.StatusId = ls.Id
    LEFT JOIN FurnishingTypes ft ON l.FurnishingTypeId = ft.Id
    WHERE 
        l.StatusId = (SELECT Id FROM ListingStatuses WHERE StatusName = 'Attivo')
        AND (@CategoryId IS NULL OR l.CategoryId = @CategoryId)
        AND (@City IS NULL OR l.City LIKE '%' + @City + '%')
        AND (@MinRent IS NULL OR l.MonthlyRent >= @MinRent)
        AND (@MaxRent IS NULL OR l.MonthlyRent <= @MaxRent)
        AND (@MinRooms IS NULL OR l.NumberOfRooms >= @MinRooms)
        AND (@MaxRooms IS NULL OR l.NumberOfRooms <= @MaxRooms)
        AND (@FurnishingTypeId IS NULL OR l.FurnishingTypeId = @FurnishingTypeId)
        AND (@PetsAllowed IS NULL OR l.PetsAllowed = @PetsAllowed)
        AND (@HasTerrace IS NULL OR l.HasTerrace = @HasTerrace)
        AND (@HasGarden IS NULL OR l.HasGarden = @HasGarden)
        AND (@AvailableFrom IS NULL OR l.AvailableFrom <= @AvailableFrom)
    ORDER BY l.CreatedAt DESC
    OFFSET @Offset ROWS
    FETCH NEXT @PageSize ROWS ONLY;
END;

-- Procedura per aggiornare il contatore visualizzazioni
CREATE PROCEDURE IncrementListingViewCount
    @ListingId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE Listings 
    SET ViewCount = ViewCount + 1,
        UpdatedAt = GETDATE()
    WHERE Id = @ListingId;
END;

-- ============================================
-- TRIGGER PER AUDIT E AUTOMAZIONI
-- ============================================

-- Trigger per aggiornare UpdatedAt automaticamente
CREATE TRIGGER TR_Listings_UpdatedAt
ON Listings
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE Listings
    SET UpdatedAt = GETDATE()
    FROM Listings l
    INNER JOIN inserted i ON l.Id = i.Id;
END;

-- Trigger per aggiornare le conversazioni quando cambia lo stato di un annuncio
CREATE TRIGGER TR_Listings_StatusChange
ON Listings
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Se l'annuncio viene archiviato o sospeso, disattiva le conversazioni
    IF UPDATE(StatusId)
    BEGIN
        UPDATE Conversations
        SET IsActive = 0,
            UpdatedAt = GETDATE()
        FROM Conversations c
        INNER JOIN inserted i ON c.ListingId = i.Id
        INNER JOIN ListingStatuses ls ON i.StatusId = ls.Id
        WHERE ls.StatusName IN ('Archiviato', 'Sospeso', 'Scaduto');
    END
END;