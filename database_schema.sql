-- =====================================================
-- Database Schema per Applicazione Annunci Alloggi
-- Integrazione con Switch Edu-ID
-- =====================================================

CREATE DATABASE StudentHousingDB;
GO

USE StudentHousingDB;
GO

-- =====================================================
-- TABELLA UTENTI (senza autenticazione locale)
-- =====================================================
CREATE TABLE Users (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    SwitchEduId NVARCHAR(255) UNIQUE NOT NULL, -- ID univoco da Switch Edu-ID
    FirstName NVARCHAR(100) NOT NULL,
    LastName NVARCHAR(100) NOT NULL,
    CompanyName NVARCHAR(200) NULL,
    Email NVARCHAR(255) UNIQUE NOT NULL,
    PhoneNumber NVARCHAR(20) NOT NULL,
    Address NVARCHAR(500) NOT NULL,
    UserType INT NOT NULL, -- 0=VerifiedStudent, 1=KnownPerson, 2=KnownCompany, 3=Admin
    Badge NVARCHAR(50) NOT NULL, -- Badge che determina il ruolo
    IsVerified BIT DEFAULT 0,
    IsActive BIT DEFAULT 1,
    PreferredLanguage NVARCHAR(5) DEFAULT 'it', -- 'it' o 'en'
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    LastLoginAt DATETIME2 NULL
);

-- =====================================================
-- TABELLA CATEGORIE
-- =====================================================
CREATE TABLE Categories (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    NameEn NVARCHAR(100) NOT NULL,
    Description NVARCHAR(500) NULL,
    DescriptionEn NVARCHAR(500) NULL,
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETDATE()
);

-- =====================================================
-- TABELLA ANNUNCI (con tutti i campi richiesti)
-- =====================================================
CREATE TABLE Listings (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    CategoryId INT NOT NULL,
    Title NVARCHAR(200) NOT NULL,
    Description NVARCHAR(MAX) NOT NULL,
    
    -- Informazioni indirizzo e posizione
    Address NVARCHAR(500) NOT NULL,
    PostalCode NVARCHAR(10) NOT NULL,
    City NVARCHAR(100) NOT NULL,
    Country NVARCHAR(100) NOT NULL DEFAULT 'Switzerland',
    Latitude DECIMAL(10,8) NULL,
    Longitude DECIMAL(11,8) NULL,
    
    -- Caratteristiche immobile
    SurfaceArea INT NULL, -- m²
    NumberOfRooms INT NULL, -- Solo per appartamenti
    Floor INT NULL,
    NumberOfBathrooms INT NULL,
    FurnishingStatus INT NULL, -- 0=Non arredato, 1=Parzialmente arredato, 2=Arredato
    
    -- Informazioni economiche
    MonthlyRent DECIMAL(10,2) NOT NULL,
    ExpensesIncluded BIT DEFAULT 0,
    MonthlyExpenses DECIMAL(10,2) NULL,
    AnnualAdjustment BIT DEFAULT 0, -- Conguaglio annuale
    SecurityDeposit DECIMAL(10,2) NULL,
    AcceptsSwissCaution BIT DEFAULT 0,
    AcceptsOtherGuarantees BIT DEFAULT 0,
    GuaranteeServices NVARCHAR(500) NULL, -- Altri servizi di garanzia accettati
    
    -- Caratteristiche aggiuntive
    HasTerrace BIT DEFAULT 0,
    HasGarden BIT DEFAULT 0,
    PetsAllowed BIT DEFAULT 0,
    HasElevator BIT DEFAULT 0,
    DisabilityAccessible BIT DEFAULT 0,
    
    -- Disponibilità e contratto
    AvailabilityDate DATE NOT NULL,
    IsAvailableImmediately BIT DEFAULT 1,
    MinContractDuration INT NULL, -- mesi
    MaxContractDuration INT NULL, -- mesi (opzionale)
    
    -- Regole e accessibilità
    Rules NVARCHAR(MAX) NULL, -- No fumatori, no animali, etc.
    AccessibilityFeatures NVARCHAR(MAX) NULL, -- Ascensore, accesso disabili, etc.
    
    -- Vicinanza università/centri ricerca
    NearbyUniversities NVARCHAR(MAX) NULL, -- JSON array con università vicine
    DistanceToUSI DECIMAL(5,2) NULL, -- km
    DistanceToSUPSI DECIMAL(5,2) NULL, -- km
    
    -- Stato e gestione
    Status INT DEFAULT 0, -- 0=Bozza, 1=Attivo, 2=Scaduto, 3=Archiviato, 4=In verifica
    IsVerified BIT DEFAULT 0,
    VerifiedAt DATETIME2 NULL,
    VerifiedBy INT NULL, -- UserId dell'admin che ha verificato
    ExpirationDate DATE NULL,
    ViewCount INT DEFAULT 0,
    ContactCount INT DEFAULT 0,
    
    -- Timestamp
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    PublishedAt DATETIME2 NULL,
    
    FOREIGN KEY (UserId) REFERENCES Users(Id),
    FOREIGN KEY (CategoryId) REFERENCES Categories(Id),
    FOREIGN KEY (VerifiedBy) REFERENCES Users(Id)
);

-- =====================================================
-- TABELLA IMMAGINI ANNUNCI
-- =====================================================
CREATE TABLE ListingImages (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ListingId INT NOT NULL,
    ImageUrl NVARCHAR(500) NOT NULL,
    ImagePath NVARCHAR(500) NULL, -- Path locale se salvate su server
    IsPrimary BIT DEFAULT 0,
    OrderIndex INT DEFAULT 0,
    Caption NVARCHAR(200) NULL,
    AltText NVARCHAR(200) NULL, -- Per accessibilità
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (ListingId) REFERENCES Listings(Id) ON DELETE CASCADE
);

-- =====================================================
-- TABELLA PREFERITI
-- =====================================================
CREATE TABLE Favorites (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    ListingId INT NOT NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(Id),
    FOREIGN KEY (ListingId) REFERENCES Listings(Id) ON DELETE CASCADE,
    UNIQUE(UserId, ListingId)
);

-- =====================================================
-- TABELLA MESSAGGI (sistema messaggistica interna)
-- =====================================================
CREATE TABLE Messages (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    SenderId INT NOT NULL,
    ReceiverId INT NOT NULL,
    ListingId INT NULL, -- Messaggio relativo a un annuncio specifico
    ConversationId NVARCHAR(100) NULL, -- Per raggruppare messaggi della stessa conversazione
    Subject NVARCHAR(200) NOT NULL,
    Content NVARCHAR(MAX) NOT NULL,
    IsRead BIT DEFAULT 0,
    ReadAt DATETIME2 NULL,
    MessageType INT DEFAULT 0, -- 0=Standard, 1=System, 2=Notification
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (SenderId) REFERENCES Users(Id),
    FOREIGN KEY (ReceiverId) REFERENCES Users(Id),
    FOREIGN KEY (ListingId) REFERENCES Listings(Id)
);

-- =====================================================
-- TABELLA RICERCHE SALVATE
-- =====================================================
CREATE TABLE SavedSearches (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    SearchName NVARCHAR(100) NOT NULL,
    SearchCriteria NVARCHAR(MAX) NOT NULL, -- JSON con i filtri di ricerca
    NotificationsEnabled BIT DEFAULT 1,
    LastNotificationSent DATETIME2 NULL,
    ResultCount INT DEFAULT 0, -- Numero risultati ultima esecuzione
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(Id)
);

-- =====================================================
-- TABELLA NOTIFICHE
-- =====================================================
CREATE TABLE Notifications (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    Type INT NOT NULL, -- 0=NewMessage, 1=ListingExpiring, 2=NewMatchingListing, 3=ListingVerified
    Title NVARCHAR(200) NOT NULL,
    Content NVARCHAR(MAX) NOT NULL,
    RelatedListingId INT NULL,
    RelatedMessageId INT NULL,
    IsRead BIT DEFAULT 0,
    ReadAt DATETIME2 NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(Id),
    FOREIGN KEY (RelatedListingId) REFERENCES Listings(Id),
    FOREIGN KEY (RelatedMessageId) REFERENCES Messages(Id)
);

-- =====================================================
-- TABELLA LOG ATTIVITÀ (per audit e statistiche)
-- =====================================================
CREATE TABLE ActivityLogs (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NULL,
    Action NVARCHAR(100) NOT NULL, -- 'CREATE_LISTING', 'VIEW_LISTING', 'SEND_MESSAGE', etc.
    EntityType NVARCHAR(50) NOT NULL, -- 'Listing', 'Message', 'User', etc.
    EntityId INT NULL,
    Details NVARCHAR(MAX) NULL, -- JSON con dettagli aggiuntivi
    IpAddress NVARCHAR(45) NULL,
    UserAgent NVARCHAR(500) NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(Id)
);

-- =====================================================
-- INSERIMENTO DATI INIZIALI
-- =====================================================

-- Categorie base
INSERT INTO Categories (Name, NameEn, Description, DescriptionEn) VALUES 
('Camera', 'Room', 'Camera singola o condivisa', 'Single or shared room'),
('Appartamento', 'Apartment', 'Appartamento completo', 'Complete apartment'),
('Parcheggio', 'Parking', 'Posto auto o garage', 'Parking space or garage'),
('Monolocale', 'Studio', 'Monolocale o studio', 'Studio apartment'),
('Posto letto', 'Bed', 'Posto letto in camera condivisa', 'Bed in shared room');

-- =====================================================
-- INDICI PER PERFORMANCE
-- =====================================================

-- Indici principali per ricerche
CREATE INDEX IX_Listings_Status_Category ON Listings(Status, CategoryId);
CREATE INDEX IX_Listings_City_Status ON Listings(City, Status);
CREATE INDEX IX_Listings_Rent_Status ON Listings(MonthlyRent, Status);
CREATE INDEX IX_Listings_Availability ON Listings(AvailabilityDate, Status);
CREATE INDEX IX_Listings_Location ON Listings(Latitude, Longitude);
CREATE INDEX IX_Listings_UserId ON Listings(UserId);

-- Indici per messaggi
CREATE INDEX IX_Messages_Receiver_Read ON Messages(ReceiverId, IsRead);
CREATE INDEX IX_Messages_Conversation ON Messages(ConversationId, CreatedAt);
CREATE INDEX IX_Messages_Listing ON Messages(ListingId);

-- Indici per notifiche
CREATE INDEX IX_Notifications_User_Read ON Notifications(UserId, IsRead);
CREATE INDEX IX_Notifications_Type ON Notifications(Type, CreatedAt);

-- Indici per preferiti
CREATE INDEX IX_Favorites_User ON Favorites(UserId);

-- Indici per ricerche salvate
CREATE INDEX IX_SavedSearches_User_Active ON SavedSearches(UserId, IsActive);

-- Indici per log attività
CREATE INDEX IX_ActivityLogs_User_Date ON ActivityLogs(UserId, CreatedAt);
CREATE INDEX IX_ActivityLogs_Action ON ActivityLogs(Action, CreatedAt);

-- Indici per utenti
CREATE INDEX IX_Users_SwitchEduId ON Users(SwitchEduId);
CREATE INDEX IX_Users_Email ON Users(Email);
CREATE INDEX IX_Users_Type ON Users(UserType);

-- =====================================================
-- VISTE UTILI
-- =====================================================

-- Vista per annunci attivi con informazioni utente
CREATE VIEW ActiveListingsView AS
SELECT 
    l.*,
    u.FirstName + ' ' + u.LastName AS OwnerName,
    u.CompanyName,
    u.Badge AS OwnerBadge,
    u.PhoneNumber AS OwnerPhone,
    u.Email AS OwnerEmail,
    c.Name AS CategoryName,
    c.NameEn AS CategoryNameEn,
    (SELECT COUNT(*) FROM Favorites f WHERE f.ListingId = l.Id) AS FavoriteCount,
    (SELECT TOP 1 ImageUrl FROM ListingImages li WHERE li.ListingId = l.Id AND li.IsPrimary = 1) AS PrimaryImageUrl
FROM Listings l
INNER JOIN Users u ON l.UserId = u.Id
INNER JOIN Categories c ON l.CategoryId = c.Id
WHERE l.Status = 1 AND l.IsVerified = 1;

-- Vista per statistiche utente
CREATE VIEW UserStatsView AS
SELECT 
    u.Id,
    u.FirstName + ' ' + u.LastName AS FullName,
    u.Badge,
    COUNT(l.Id) AS TotalListings,
    COUNT(CASE WHEN l.Status = 1 THEN 1 END) AS ActiveListings,
    COUNT(CASE WHEN l.Status = 0 THEN 1 END) AS DraftListings,
    SUM(l.ViewCount) AS TotalViews,
    SUM(l.ContactCount) AS TotalContacts,
    (SELECT COUNT(*) FROM Messages m WHERE m.ReceiverId = u.Id AND m.IsRead = 0) AS UnreadMessages
FROM Users u
LEFT JOIN Listings l ON u.Id = l.UserId
GROUP BY u.Id, u.FirstName, u.LastName, u.Badge;

GO

-- =====================================================
-- STORED PROCEDURES UTILI
-- =====================================================

-- Procedura per aggiornare il contatore visualizzazioni
CREATE PROCEDURE UpdateListingViewCount
    @ListingId INT
AS
BEGIN
    UPDATE Listings 
    SET ViewCount = ViewCount + 1,
        UpdatedAt = GETDATE()
    WHERE Id = @ListingId;
END;
GO

-- Procedura per aggiornare il contatore contatti
CREATE PROCEDURE UpdateListingContactCount
    @ListingId INT
AS
BEGIN
    UPDATE Listings 
    SET ContactCount = ContactCount + 1,
        UpdatedAt = GETDATE()
    WHERE Id = @ListingId;
END;
GO

-- Procedura per archiviare annunci scaduti
CREATE PROCEDURE ArchiveExpiredListings
AS
BEGIN
    UPDATE Listings 
    SET Status = 2, -- Scaduto
        UpdatedAt = GETDATE()
    WHERE Status = 1 
    AND ExpirationDate IS NOT NULL 
    AND ExpirationDate < GETDATE();
END;
GO

PRINT 'Database schema creato con successo!';
PRINT 'Tabelle create: Users, Categories, Listings, ListingImages, Favorites, Messages, SavedSearches, Notifications, ActivityLogs';
PRINT 'Viste create: ActiveListingsView, UserStatsView';
PRINT 'Stored Procedures create: UpdateListingViewCount, UpdateListingContactCount, ArchiveExpiredListings';