CREATE DATABASE HousingDB;
GO

USE HousingDB;
GO

-- Tabella Utenti
CREATE TABLE [User] (

    Id BIGINT IDENTITY(1,1) NOT NULL,
    FirstName NVARCHAR(100) NOT NULL,
    LastName NVARCHAR(100) NOT NULL,
    CompanyName NVARCHAR(200) NULL,
    CompanyWebsite NVARCHAR(200) NULL,
    Email NVARCHAR(255) UNIQUE NOT NULL,
    PhoneNumber NVARCHAR(20) NOT NULL,
    Address NVARCHAR(500) NULL,
    -- UserType INT NOT NULL, -- 1 = Individual, 2 = Agency, 3 = Admin
    -- UserType VARCHAR(20) NOT NULL CHECK (
    --   UserType IN ('Individual', 'Agency', 'Admin')
    -- ),
    IsIndividual BIT DEFAULT 0,
    IsAgency BIT DEFAULT 0,
    IsAdmin BIT DEFAULT 0,
    IsVerified BIT DEFAULT 0,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE()

    CONSTRAINT [PK_housing_User] PRIMARY KEY CLUSTERED (Id)
);

-- Tabella Categorie
CREATE TABLE Category (

    Id BIGINT IDENTITY(1,1) NOT NULL,
    NameIt NVARCHAR(100) NOT NULL,
    NameEn NVARCHAR(100) NOT NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE()

    CONSTRAINT [PK_housing_Category] PRIMARY KEY CLUSTERED (Id)
);

-- Tabella Annunci
CREATE TABLE Listing (

    Id BIGINT IDENTITY(1,1) NOT NULL,
    UserId BIGINT NOT NULL,
    CategoryId BIGINT NOT NULL,
    Title NVARCHAR(200) NOT NULL,
    Description NVARCHAR(MAX) NOT NULL,
    Address NVARCHAR(500) NOT NULL,
    PostalCode NVARCHAR(10) NOT NULL,
    City NVARCHAR(100) NOT NULL,
    Country NVARCHAR(100) NOT NULL,
    Latitude DECIMAL(10,8) NULL,
    Longitude DECIMAL(11,8) NULL,
    SurfaceArea INT NOT NULL, 
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
    HasPool BIT DEFAULT 0,
    PetsAllowed BIT DEFAULT 0,
    AvailabilityDate DATE NOT NULL,
    IsAvailableImmediately BIT DEFAULT 0,
    MinContractDuration INT NULL,
    Rules NVARCHAR(MAX) NULL,
    HasElevator BIT DEFAULT 0,
    HasRampAccess BIT DEFAULT 0,
    SecurityDeposit DECIMAL(10,2) NULL,
    AcceptsSwissCaution BIT DEFAULT 0,
    Status INT DEFAULT 0, -- 0=Draft, 1=Active, 2=Expired, 3=Archived
    VerifiedAt DATETIME2 DEFAULT GETDATE(),
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    DeletedAt DATETIME2 DEFAULT GETDATE(),

    CONSTRAINT [PK_housing_Listing] PRIMARY KEY CLUSTERED (Id)
);

-- Tabella Immagini Annunci
CREATE TABLE ListingImage (

    Id BIGINT IDENTITY(1,1) NOT NULL,
    ListingId BIGINT NOT NULL,
    ImageUrl NVARCHAR(500) NOT NULL,
    IsPrimary BIT DEFAULT 0,
    OrderIndex INT DEFAULT 0,
    CreatedAt DATETIME2 DEFAULT GETDATE(),

    CONSTRAINT [PK_housing_ListingImage] PRIMARY KEY CLUSTERED (Id)
);

-- Tabella Preferiti
CREATE TABLE Favorite (

    Id BIGINT IDENTITY(1,1) NOT NULL,
    UserId BIGINT NOT NULL,
    ListingId BIGINT NOT NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE(),

    CONSTRAINT [PK_housing_Favorite] PRIMARY KEY CLUSTERED (Id)
);

-- Tabella Messaggi
CREATE TABLE [Message] (

    Id BIGINT IDENTITY(1,1) NOT NULL,
    SenderUserId BIGINT NOT NULL,
    ReceiverUserId BIGINT NOT NULL,
    ListingId BIGINT NOT NULL,
    Content NVARCHAR(MAX) NOT NULL,
    IsRead BIT DEFAULT 0,
    CreatedAt DATETIME2 DEFAULT GETDATE(),

    CONSTRAINT [PK_housing_Message] PRIMARY KEY CLUSTERED (Id)
);

-- Tabella Ricerche Salvate
CREATE TABLE SavedSearch (

    Id BIGINT IDENTITY(1,1) NOT NULL,
    UserId BIGINT NOT NULL,
    SearchName NVARCHAR(100) NOT NULL,
    SearchCriteria NVARCHAR(MAX) NOT NULL, -- JSON con i filtri
    NotificationsEnabled BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETDATE(),

    CONSTRAINT [PK_housing_SavedSearch] PRIMARY KEY CLUSTERED (Id)
);


-- Indici per performance
CREATE INDEX IX_Listings_Status ON Listings(Status);
CREATE INDEX IX_Listings_CategoryId ON Listings(CategoryId);
CREATE INDEX IX_Listings_City ON Listings(City);
CREATE INDEX IX_Listings_MonthlyRent ON Listings(MonthlyRent);
CREATE INDEX IX_Listings_AvailabilityDate ON Listings(AvailabilityDate);
CREATE INDEX IX_Messages_ReceiverId ON Messages(ReceiverId);
CREATE INDEX IX_Messages_IsRead ON Messages(IsRead);

GO
