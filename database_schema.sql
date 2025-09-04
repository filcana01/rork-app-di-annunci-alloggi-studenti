-- =============================================
-- Database Schema per Applicativo Annunci Alloggi Studenti
-- Sistema di autenticazione: Switch Edu-ID (esterno)
-- =============================================

-- Tabella Utenti (dati base da Switch Edu-ID)
CREATE TABLE Users (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    SwitchEduId NVARCHAR(255) NOT NULL UNIQUE, -- ID univoco da Switch Edu-ID
    Email NVARCHAR(255) NOT NULL UNIQUE,
    FirstName NVARCHAR(100) NOT NULL,
    LastName NVARCHAR(100) NOT NULL,
    PhoneNumber NVARCHAR(20),
    CompanyName NVARCHAR(200), -- Facoltativo per agenzie
    Address NVARCHAR(500),
    UserType NVARCHAR(50) NOT NULL DEFAULT 'Student', -- Student, VerifiedStudent, KnownPerson, KnownCompany
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

-- Tabella Annunci
CREATE TABLE Listings (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL,
    Title NVARCHAR(200) NOT NULL,
    Description NVARCHAR(MAX),
    Category NVARCHAR(50) NOT NULL, -- Room, Apartment, Parking, Other
    
    -- Indirizzo e posizione
    Street NVARCHAR(200) NOT NULL,
    PostalCode NVARCHAR(10) NOT NULL,
    City NVARCHAR(100) NOT NULL,
    Country NVARCHAR(100) NOT NULL DEFAULT 'Switzerland',
    Latitude DECIMAL(10, 8),
    Longitude DECIMAL(11, 8),
    
    -- Caratteristiche immobile
    SurfaceArea INT, -- m²
    NumberOfRooms INT, -- Solo per appartamenti
    Floor NVARCHAR(20), -- Piano (es: "2", "PT", "Mansarda")
    NumberOfBathrooms INT,
    FurnishingStatus NVARCHAR(50), -- Furnished, PartiallyFurnished, Unfurnished
    
    -- Caratteristiche aggiuntive
    HasTerrace BIT NOT NULL DEFAULT 0,
    HasGarden BIT NOT NULL DEFAULT 0,
    PetsAllowed BIT NOT NULL DEFAULT 0,
    HasElevator BIT NOT NULL DEFAULT 0,
    DisabilityAccessible BIT NOT NULL DEFAULT 0,
    
    -- Aspetti economici
    MonthlyRent DECIMAL(10, 2) NOT NULL,
    ExpensesIncluded BIT NOT NULL DEFAULT 0,
    MonthlyExpenses DECIMAL(10, 2), -- Se spese escluse
    AnnualAdjustment BIT NOT NULL DEFAULT 0, -- Conguaglio annuale
    SecurityDeposit DECIMAL(10, 2),
    AcceptsSwissCaution BIT NOT NULL DEFAULT 0,
    
    -- Disponibilità e contratto
    AvailableFrom DATETIME2, -- NULL = da subito
    MinimumContractDuration NVARCHAR(50), -- es: "6 months", "1 year"
    Rules NVARCHAR(1000), -- Regole specifiche
    
    -- Stato annuncio
    Status NVARCHAR(50) NOT NULL DEFAULT 'Draft', -- Draft, Active, Expired, Archived
    IsVerified BIT NOT NULL DEFAULT 0,
    
    -- Metadati
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    PublishedAt DATETIME2,
    ExpiresAt DATETIME2,
    
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);

-- Tabella Immagini Annunci
CREATE TABLE ListingImages (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    ListingId UNIQUEIDENTIFIER NOT NULL,
    ImageUrl NVARCHAR(500) NOT NULL,
    ImageOrder INT NOT NULL DEFAULT 0,
    Caption NVARCHAR(200),
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    
    FOREIGN KEY (ListingId) REFERENCES Listings(Id) ON DELETE CASCADE
);

-- Tabella Preferiti
CREATE TABLE Favorites (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL,
    ListingId UNIQUEIDENTIFIER NOT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
    FOREIGN KEY (ListingId) REFERENCES Listings(Id) ON DELETE CASCADE,
    
    -- Constraint per evitare duplicati
    CONSTRAINT UK_Favorites_User_Listing UNIQUE (UserId, ListingId)
);

-- Tabella Messaggi
CREATE TABLE Messages (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    SenderId UNIQUEIDENTIFIER NOT NULL,
    ReceiverId UNIQUEIDENTIFIER NOT NULL,
    ListingId UNIQUEIDENTIFIER, -- Riferimento all'annuncio (opzionale)
    Subject NVARCHAR(200),
    Content NVARCHAR(MAX) NOT NULL,
    IsRead BIT NOT NULL DEFAULT 0,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    
    FOREIGN KEY (SenderId) REFERENCES Users(Id),
    FOREIGN KEY (ReceiverId) REFERENCES Users(Id),
    FOREIGN KEY (ListingId) REFERENCES Listings(Id) ON DELETE SET NULL
);

-- Tabella Ricerche Salvate
CREATE TABLE SavedSearches (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL,
    SearchName NVARCHAR(100) NOT NULL,
    SearchCriteria NVARCHAR(MAX) NOT NULL, -- JSON con i filtri di ricerca
    NotificationsEnabled BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);

-- =============================================
-- INDICI PER OTTIMIZZAZIONE PERFORMANCE
-- =============================================

-- Indici per ricerche frequenti
CREATE INDEX IX_Listings_Status_Category ON Listings(Status, Category);
CREATE INDEX IX_Listings_City_PostalCode ON Listings(City, PostalCode);
CREATE INDEX IX_Listings_MonthlyRent ON Listings(MonthlyRent);
CREATE INDEX IX_Listings_AvailableFrom ON Listings(AvailableFrom);
CREATE INDEX IX_Listings_CreatedAt ON Listings(CreatedAt DESC);
CREATE INDEX IX_Listings_UserId ON Listings(UserId);

-- Indici per geolocalizzazione
CREATE INDEX IX_Listings_Location ON Listings(Latitude, Longitude);

-- Indici per messaggistica
CREATE INDEX IX_Messages_Receiver_Read ON Messages(ReceiverId, IsRead);
CREATE INDEX IX_Messages_Sender ON Messages(SenderId);
CREATE INDEX IX_Messages_CreatedAt ON Messages(CreatedAt DESC);

-- Indici per preferiti
CREATE INDEX IX_Favorites_UserId ON Favorites(UserId);

-- Indici per immagini
CREATE INDEX IX_ListingImages_ListingId_Order ON ListingImages(ListingId, ImageOrder);

-- =============================================
-- TRIGGER PER AGGIORNAMENTO AUTOMATICO UpdatedAt
-- =============================================

-- Trigger per Users
CREATE TRIGGER TR_Users_UpdatedAt
ON Users
AFTER UPDATE
AS
BEGIN
    UPDATE Users 
    SET UpdatedAt = GETUTCDATE()
    FROM Users u
    INNER JOIN inserted i ON u.Id = i.Id;
END;

-- Trigger per Listings
CREATE TRIGGER TR_Listings_UpdatedAt
ON Listings
AFTER UPDATE
AS
BEGIN
    UPDATE Listings 
    SET UpdatedAt = GETUTCDATE()
    FROM Listings l
    INNER JOIN inserted i ON l.Id = i.Id;
END;

-- Trigger per SavedSearches
CREATE TRIGGER TR_SavedSearches_UpdatedAt
ON SavedSearches
AFTER UPDATE
AS
BEGIN
    UPDATE SavedSearches 
    SET UpdatedAt = GETUTCDATE()
    FROM SavedSearches s
    INNER JOIN inserted i ON s.Id = i.Id;
END;

-- =============================================
-- DATI DI ESEMPIO (OPZIONALE)
-- =============================================

-- Inserimento utente di esempio
INSERT INTO Users (SwitchEduId, Email, FirstName, LastName, PhoneNumber, UserType)
VALUES 
('edu-id-001', 'mario.rossi@usi.ch', 'Mario', 'Rossi', '+41791234567', 'VerifiedStudent'),
('edu-id-002', 'anna.bianchi@usi.ch', 'Anna', 'Bianchi', '+41797654321', 'Student');

-- =============================================
-- STORED PROCEDURES UTILI (OPZIONALE)
-- =============================================

-- Procedura per ottenere annunci con filtri
CREATE PROCEDURE GetListingsWithFilters
    @Category NVARCHAR(50) = NULL,
    @City NVARCHAR(100) = NULL,
    @MinRent DECIMAL(10,2) = NULL,
    @MaxRent DECIMAL(10,2) = NULL,
    @MinRooms INT = NULL,
    @PetsAllowed BIT = NULL,
    @PageNumber INT = 1,
    @PageSize INT = 20
AS
BEGIN
    DECLARE @Offset INT = (@PageNumber - 1) * @PageSize;
    
    SELECT 
        l.*,
        u.FirstName + ' ' + u.LastName AS OwnerName,
        u.Email AS OwnerEmail,
        u.PhoneNumber AS OwnerPhone,
        (SELECT TOP 1 ImageUrl FROM ListingImages WHERE ListingId = l.Id ORDER BY ImageOrder) AS MainImage,
        (SELECT COUNT(*) FROM ListingImages WHERE ListingId = l.Id) AS ImageCount
    FROM Listings l
    INNER JOIN Users u ON l.UserId = u.Id
    WHERE l.Status = 'Active'
        AND l.IsVerified = 1
        AND (@Category IS NULL OR l.Category = @Category)
        AND (@City IS NULL OR l.City LIKE '%' + @City + '%')
        AND (@MinRent IS NULL OR l.MonthlyRent >= @MinRent)
        AND (@MaxRent IS NULL OR l.MonthlyRent <= @MaxRent)
        AND (@MinRooms IS NULL OR l.NumberOfRooms >= @MinRooms)
        AND (@PetsAllowed IS NULL OR l.PetsAllowed = @PetsAllowed)
    ORDER BY l.CreatedAt DESC
    OFFSET @Offset ROWS
    FETCH NEXT @PageSize ROWS ONLY;
END;

-- Procedura per ottenere dettagli completi annuncio
CREATE PROCEDURE GetListingDetails
    @ListingId UNIQUEIDENTIFIER
AS
BEGIN
    -- Dettagli annuncio
    SELECT 
        l.*,
        u.FirstName + ' ' + u.LastName AS OwnerName,
        u.Email AS OwnerEmail,
        u.PhoneNumber AS OwnerPhone,
        u.UserType AS OwnerType
    FROM Listings l
    INNER JOIN Users u ON l.UserId = u.Id
    WHERE l.Id = @ListingId;
    
    -- Immagini annuncio
    SELECT ImageUrl, Caption
    FROM ListingImages
    WHERE ListingId = @ListingId
    ORDER BY ImageOrder;
END;