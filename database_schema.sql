CREATE DATABASE HousingDB;
GO

USE HousingDB;
GO

-- Tabella Utenti
CREATE TABLE Users (
    SwitchEduID INT IDENTITY(1,1) PRIMARY KEY,
    FirstName NVARCHAR(100) NOT NULL,
    LastName NVARCHAR(100) NOT NULL,
    CompanyName NVARCHAR(200) NULL,
    Email NVARCHAR(255) UNIQUE NOT NULL,
    PhoneNumber NVARCHAR(20) NOT NULL,
    Address NVARCHAR(500) NULL,
    Username NVARCHAR(50) UNIQUE NULL,
    PasswordHash NVARCHAR(255) NOT NULL,
    UserType INT NOT NULL, -- 0=Student, 1=Individual, 2=Agency, 3=Admin
    -- UserType VARCHAR(20) NOT NULL CHECK (
    --     UserType IN ('Student', 'Individual', 'Agency', 'Admin')
    -- )
    IsVerified BIT DEFAULT 0,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE()
);

-- Tabella Categorie
CREATE TABLE Categories (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    NameEn NVARCHAR(100) NOT NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE()
);

-- Tabella Annunci
CREATE TABLE Listings (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    CategoryId INT NOT NULL,
    Title NVARCHAR(200) NOT NULL,
    Description NVARCHAR(MAX) NOT NULL,
    Address NVARCHAR(500) NOT NULL,
    PostalCode NVARCHAR(10) NOT NULL,
    City NVARCHAR(100) NOT NULL,
    Country NVARCHAR(100) NOT NULL,
    Latitude DECIMAL(10,8) NULL,
    Longitude DECIMAL(11,8) NULL,
    SurfaceArea INT NOT NULL, -- m²
    NumberOfRooms INT NULL,
    Floor INT NOT NULL,
    NumberOfBathrooms INT NULL,
    FurnishingStatus INT NOT NULL, -- 0=Unfurnished, 1=PartiallyFurnished, 2=Furnished
    -- FurnishingStatus VARCHAR(20) NOT NULL CHECK (
    --     FurnishingStatus IN ('Unfurnished', 'PartiallyFurnished', 'Furnished')
    -- )
    MonthlyRent DECIMAL(10,2) NOT NULL,
    ExpensesIncluded BIT DEFAULT 0,
    MonthlyExpenses DECIMAL(10,2) NULL,
    AnnualAdjustment BIT DEFAULT 0,
    HasTerrace BIT DEFAULT 0,
    HasGarden BIT DEFAULT 0,
    PetsAllowed BIT DEFAULT 0,
    AvailabilityDate DATE NOT NULL,
    IsAvailableImmediately BIT DEFAULT 1,
    MinContractDuration INT NULL, -- mesi
    Rules NVARCHAR(MAX) NULL,
    Accessibility NVARCHAR(MAX) NULL,
    SecurityDeposit DECIMAL(10,2) NULL,
    AcceptsSwissCaution BIT DEFAULT 0,
    Status INT DEFAULT 0, -- 0=Draft, 1=Active, 2=Expired, 3=Archived
    -- Status VARCHAR(20) NOT NULL CHECK (
    --     Status IN ('Draft', 'Active', 'Expired', 'Archived')
    -- )
    IsVerified BIT DEFAULT 0,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(SwitchEduId),
    FOREIGN KEY (CategoryId) REFERENCES Categories(Id)
);

-- Tabella Immagini Annunci
CREATE TABLE ListingImages (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ListingId INT NOT NULL,
    ImageUrl NVARCHAR(500) NOT NULL,
    IsPrimary BIT DEFAULT 0,
    OrderIndex INT DEFAULT 0,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (ListingId) REFERENCES Listings(Id) ON DELETE CASCADE
);

-- Tabella Preferiti
CREATE TABLE Favorites (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    ListingId INT NOT NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(SwitchEduId),
    FOREIGN KEY (ListingId) REFERENCES Listings(Id) ON DELETE CASCADE,
    UNIQUE(UserId, ListingId)
);

-- Tabella Messaggi
CREATE TABLE Messages (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    SenderId INT NOT NULL,
    ReceiverId INT NOT NULL,
    ListingId INT NULL,
    Subject NVARCHAR(200) NOT NULL,
    Content NVARCHAR(MAX) NOT NULL,
    IsRead BIT DEFAULT 0,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (SenderId) REFERENCES Users(SwitchEduId),
    FOREIGN KEY (ReceiverId) REFERENCES Users(SwitchEduId),
    FOREIGN KEY (ListingId) REFERENCES Listings(Id)
);

-- Tabella Ricerche Salvate
CREATE TABLE SavedSearches (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    SearchName NVARCHAR(100) NOT NULL,
    SearchCriteria NVARCHAR(MAX) NOT NULL, -- JSON con i filtri
    NotificationsEnabled BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(SwitchEduId)
);

-- Inserimento dati iniziali
INSERT INTO Categories (Name, NameEn) VALUES 
('Camera', 'Room'),
('Appartamento', 'Apartment'),
('Parcheggio', 'Parking');

-- Indici per performance
CREATE INDEX IX_Listings_Status ON Listings(Status);
CREATE INDEX IX_Listings_CategoryId ON Listings(CategoryId);
CREATE INDEX IX_Listings_City ON Listings(City);
CREATE INDEX IX_Listings_MonthlyRent ON Listings(MonthlyRent);
CREATE INDEX IX_Listings_AvailabilityDate ON Listings(AvailabilityDate);
CREATE INDEX IX_Messages_ReceiverId ON Messages(ReceiverId);
CREATE INDEX IX_Messages_IsRead ON Messages(IsRead);

GO




