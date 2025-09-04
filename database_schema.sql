-- =====================================================
-- SCRIPT CREAZIONE DATABASE - PIATTAFORMA ALLOGGI STUDENTI
-- =====================================================
-- Compatibile con SQL Server / PostgreSQL
-- Creato per integrazione con backend .NET
-- =====================================================

-- Tabella Utenti
-- Gestisce gli utenti registrati tramite Switch Edu-ID
CREATE TABLE Utenti (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    SwitchEduId NVARCHAR(255) NOT NULL UNIQUE, -- ID proveniente da Switch Edu-ID
    Nome NVARCHAR(100) NOT NULL,
    Cognome NVARCHAR(100) NOT NULL,
    Email NVARCHAR(255) NOT NULL UNIQUE,
    Telefono NVARCHAR(20),
    NomeAzienda NVARCHAR(200), -- Facoltativo per agenzie
    Indirizzo NVARCHAR(500),
    CAP NVARCHAR(10),
    Citta NVARCHAR(100),
    Nazione NVARCHAR(100) DEFAULT 'Svizzera',
    
    -- Badge/Classificazione utente
    TipoUtente NVARCHAR(50) NOT NULL DEFAULT 'Studente', -- Studente, StudenteVerificato, PersonaConosciuta, AziendaConosciuta
    
    -- Metadati
    DataRegistrazione DATETIME2 NOT NULL DEFAULT GETDATE(),
    UltimoAccesso DATETIME2,
    Attivo BIT NOT NULL DEFAULT 1,
    
    -- Indici
    INDEX IX_Utenti_Email (Email),
    INDEX IX_Utenti_SwitchEduId (SwitchEduId),
    INDEX IX_Utenti_TipoUtente (TipoUtente)
);

-- Tabella Annunci
-- Gestisce tutti gli annunci di alloggi
CREATE TABLE Annunci (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UtenteId UNIQUEIDENTIFIER NOT NULL,
    
    -- Informazioni base
    Titolo NVARCHAR(200) NOT NULL,
    Descrizione NTEXT,
    Categoria NVARCHAR(50) NOT NULL, -- Camera, Appartamento, Parcheggio
    
    -- Localizzazione
    Indirizzo NVARCHAR(500) NOT NULL,
    CAP NVARCHAR(10) NOT NULL,
    Citta NVARCHAR(100) NOT NULL,
    Nazione NVARCHAR(100) NOT NULL DEFAULT 'Svizzera',
    Latitudine DECIMAL(10, 8),
    Longitudine DECIMAL(11, 8),
    
    -- Caratteristiche immobile
    Superficie DECIMAL(8, 2), -- m²
    NumeroLocali INT, -- Per appartamenti
    Piano NVARCHAR(20), -- Piano (es: "2", "PT", "Mansarda")
    NumeroBagni INT,
    StatoArredamento NVARCHAR(50), -- Arredato, ParzialmenteArredato, NonArredato
    
    -- Caratteristiche aggiuntive (flags)
    HasTerrazza BIT NOT NULL DEFAULT 0,
    HasGiardino BIT NOT NULL DEFAULT 0,
    AnimaliAmmessi BIT NOT NULL DEFAULT 0,
    HasAscensore BIT NOT NULL DEFAULT 0,
    AccessoDisabili BIT NOT NULL DEFAULT 0,
    
    -- Informazioni economiche
    PigioneMensile DECIMAL(10, 2) NOT NULL,
    SpeseIncluse BIT NOT NULL DEFAULT 0,
    ImportoSpeseMensili DECIMAL(10, 2), -- Se spese escluse
    ConguaglioAnnuale BIT NOT NULL DEFAULT 0,
    DepositoCauzionale DECIMAL(10, 2),
    AccettaSwissCaution BIT NOT NULL DEFAULT 0,
    
    -- Condizioni contratto
    DataDisponibilita DATE,
    DisponibilitaImmediata BIT NOT NULL DEFAULT 1,
    DurataMinimaContratto INT, -- Mesi
    Regole NTEXT, -- Regole specifiche (no fumatori, etc.)
    
    -- Stato annuncio
    Stato NVARCHAR(50) NOT NULL DEFAULT 'Bozza', -- Bozza, InVerifica, Attivo, Scaduto, Archiviato
    DataCreazione DATETIME2 NOT NULL DEFAULT GETDATE(),
    DataModifica DATETIME2 NOT NULL DEFAULT GETDATE(),
    DataPubblicazione DATETIME2,
    DataScadenza DATETIME2,
    
    -- Metadati
    VisualizzazioniTotali INT NOT NULL DEFAULT 0,
    Attivo BIT NOT NULL DEFAULT 1,
    
    -- Chiavi esterne
    FOREIGN KEY (UtenteId) REFERENCES Utenti(Id) ON DELETE CASCADE,
    
    -- Indici
    INDEX IX_Annunci_UtenteId (UtenteId),
    INDEX IX_Annunci_Categoria (Categoria),
    INDEX IX_Annunci_Stato (Stato),
    INDEX IX_Annunci_Citta (Citta),
    INDEX IX_Annunci_PigioneMensile (PigioneMensile),
    INDEX IX_Annunci_DataPubblicazione (DataPubblicazione),
    INDEX IX_Annunci_Location (Latitudine, Longitudine)
);

-- Tabella Immagini
-- Gestisce le immagini associate agli annunci
CREATE TABLE Immagini (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    AnnuncioId UNIQUEIDENTIFIER NOT NULL,
    
    -- Informazioni immagine
    NomeFile NVARCHAR(255) NOT NULL,
    PercorsoFile NVARCHAR(500) NOT NULL, -- Path relativo o URL
    UrlImmagine NVARCHAR(1000), -- URL completo per accesso diretto
    
    -- Metadati
    Ordine INT NOT NULL DEFAULT 0, -- Ordine di visualizzazione
    IsPrincipale BIT NOT NULL DEFAULT 0, -- Immagine principale dell'annuncio
    DimensioneFile BIGINT, -- Dimensione in bytes
    TipoMime NVARCHAR(100),
    
    -- Timestamp
    DataCaricamento DATETIME2 NOT NULL DEFAULT GETDATE(),
    
    -- Chiavi esterne
    FOREIGN KEY (AnnuncioId) REFERENCES Annunci(Id) ON DELETE CASCADE,
    
    -- Indici
    INDEX IX_Immagini_AnnuncioId (AnnuncioId),
    INDEX IX_Immagini_Ordine (AnnuncioId, Ordine)
);

-- Tabella Preferiti
-- Gestisce gli annunci salvati come preferiti dagli utenti
CREATE TABLE Preferiti (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UtenteId UNIQUEIDENTIFIER NOT NULL,
    AnnuncioId UNIQUEIDENTIFIER NOT NULL,
    
    -- Metadati
    DataAggiunta DATETIME2 NOT NULL DEFAULT GETDATE(),
    Note NVARCHAR(500), -- Note personali dell'utente
    
    -- Chiavi esterne
    FOREIGN KEY (UtenteId) REFERENCES Utenti(Id) ON DELETE CASCADE,
    FOREIGN KEY (AnnuncioId) REFERENCES Annunci(Id) ON DELETE CASCADE,
    
    -- Vincoli
    UNIQUE (UtenteId, AnnuncioId), -- Un utente può salvare un annuncio solo una volta
    
    -- Indici
    INDEX IX_Preferiti_UtenteId (UtenteId),
    INDEX IX_Preferiti_AnnuncioId (AnnuncioId)
);

-- Tabella Messaggi
-- Sistema di messaggistica tra utenti
CREATE TABLE Messaggi (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    
    -- Partecipanti conversazione
    MittenteId UNIQUEIDENTIFIER NOT NULL,
    DestinatarioId UNIQUEIDENTIFIER NOT NULL,
    AnnuncioId UNIQUEIDENTIFIER, -- Annuncio di riferimento (opzionale)
    
    -- Contenuto messaggio
    Oggetto NVARCHAR(200),
    Contenuto NTEXT NOT NULL,
    
    -- Stato messaggio
    Letto BIT NOT NULL DEFAULT 0,
    DataInvio DATETIME2 NOT NULL DEFAULT GETDATE(),
    DataLettura DATETIME2,
    
    -- Metadati conversazione
    ConversazioneId UNIQUEIDENTIFIER, -- Raggruppa messaggi della stessa conversazione
    IsRisposta BIT NOT NULL DEFAULT 0,
    MessaggioOriginaleId UNIQUEIDENTIFIER, -- Riferimento al messaggio originale
    
    -- Chiavi esterne
    FOREIGN KEY (MittenteId) REFERENCES Utenti(Id),
    FOREIGN KEY (DestinatarioId) REFERENCES Utenti(Id),
    FOREIGN KEY (AnnuncioId) REFERENCES Annunci(Id) ON DELETE SET NULL,
    FOREIGN KEY (MessaggioOriginaleId) REFERENCES Messaggi(Id),
    
    -- Indici
    INDEX IX_Messaggi_MittenteId (MittenteId),
    INDEX IX_Messaggi_DestinatarioId (DestinatarioId),
    INDEX IX_Messaggi_AnnuncioId (AnnuncioId),
    INDEX IX_Messaggi_ConversazioneId (ConversazioneId),
    INDEX IX_Messaggi_DataInvio (DataInvio)
);

-- Tabella RicercheSalvate
-- Gestisce le ricerche salvate dagli utenti per notifiche automatiche
CREATE TABLE RicercheSalvate (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UtenteId UNIQUEIDENTIFIER NOT NULL,
    
    -- Informazioni ricerca
    NomeRicerca NVARCHAR(200) NOT NULL,
    Descrizione NVARCHAR(500),
    
    -- Criteri di ricerca (JSON o campi separati)
    CriteriRicerca NTEXT NOT NULL, -- JSON con tutti i filtri applicati
    
    -- Filtri principali (per query ottimizzate)
    Categoria NVARCHAR(50),
    CittaRicerca NVARCHAR(100),
    BudgetMinimo DECIMAL(10, 2),
    BudgetMassimo DECIMAL(10, 2),
    SuperficieMinima DECIMAL(8, 2),
    NumeroLocaliMinimo INT,
    
    -- Notifiche
    NotificheAttive BIT NOT NULL DEFAULT 1,
    FrequenzaNotifiche NVARCHAR(50) DEFAULT 'Giornaliera', -- Immediata, Giornaliera, Settimanale
    UltimaNotifica DATETIME2,
    
    -- Metadati
    DataCreazione DATETIME2 NOT NULL DEFAULT GETDATE(),
    DataUltimaModifica DATETIME2 NOT NULL DEFAULT GETDATE(),
    NumeroRisultatiUltimaEsecuzione INT DEFAULT 0,
    Attiva BIT NOT NULL DEFAULT 1,
    
    -- Chiavi esterne
    FOREIGN KEY (UtenteId) REFERENCES Utenti(Id) ON DELETE CASCADE,
    
    -- Indici
    INDEX IX_RicercheSalvate_UtenteId (UtenteId),
    INDEX IX_RicercheSalvate_NotificheAttive (NotificheAttive),
    INDEX IX_RicercheSalvate_Categoria (Categoria),
    INDEX IX_RicercheSalvate_CittaRicerca (CittaRicerca)
);

-- Tabella NotificheInviate
-- Log delle notifiche inviate per evitare duplicati
CREATE TABLE NotificheInviate (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UtenteId UNIQUEIDENTIFIER NOT NULL,
    RicercaSalvataId UNIQUEIDENTIFIER,
    AnnuncioId UNIQUEIDENTIFIER,
    
    -- Dettagli notifica
    TipoNotifica NVARCHAR(100) NOT NULL, -- NuovoAnnuncio, ModificaAnnuncio, MessaggioRicevuto, etc.
    Titolo NVARCHAR(200),
    Contenuto NTEXT,
    
    -- Stato
    DataInvio DATETIME2 NOT NULL DEFAULT GETDATE(),
    Inviata BIT NOT NULL DEFAULT 0,
    DataConsegna DATETIME2,
    
    -- Chiavi esterne
    FOREIGN KEY (UtenteId) REFERENCES Utenti(Id) ON DELETE CASCADE,
    FOREIGN KEY (RicercaSalvataId) REFERENCES RicercheSalvate(Id) ON DELETE SET NULL,
    FOREIGN KEY (AnnuncioId) REFERENCES Annunci(Id) ON DELETE SET NULL,
    
    -- Indici
    INDEX IX_NotificheInviate_UtenteId (UtenteId),
    INDEX IX_NotificheInviate_DataInvio (DataInvio),
    INDEX IX_NotificheInviate_TipoNotifica (TipoNotifica)
);

-- =====================================================
-- VISTE UTILI PER L'APPLICAZIONE
-- =====================================================

-- Vista per annunci attivi con informazioni utente
CREATE VIEW vw_AnnunciAttivi AS
SELECT 
    a.*,
    u.Nome + ' ' + u.Cognome AS NomeProprietario,
    u.Email AS EmailProprietario,
    u.Telefono AS TelefonoProprietario,
    u.TipoUtente,
    (SELECT COUNT(*) FROM Immagini i WHERE i.AnnuncioId = a.Id) AS NumeroImmagini,
    (SELECT TOP 1 UrlImmagine FROM Immagini i WHERE i.AnnuncioId = a.Id AND i.IsPrincipale = 1) AS ImmaginePrincipale
FROM Annunci a
INNER JOIN Utenti u ON a.UtenteId = u.Id
WHERE a.Stato = 'Attivo' AND a.Attivo = 1 AND u.Attivo = 1;

-- Vista per statistiche utente
CREATE VIEW vw_StatisticheUtente AS
SELECT 
    u.Id,
    u.Nome,
    u.Cognome,
    u.Email,
    u.TipoUtente,
    COUNT(a.Id) AS NumeroAnnunci,
    COUNT(CASE WHEN a.Stato = 'Attivo' THEN 1 END) AS AnnunciAttivi,
    SUM(a.VisualizzazioniTotali) AS VisualizzazioniTotali,
    COUNT(p.Id) AS NumeroPreferiti
FROM Utenti u
LEFT JOIN Annunci a ON u.Id = a.UtenteId
LEFT JOIN Preferiti p ON u.Id = p.UtenteId
GROUP BY u.Id, u.Nome, u.Cognome, u.Email, u.TipoUtente;

-- =====================================================
-- STORED PROCEDURES UTILI
-- =====================================================

-- Procedura per aggiornare il contatore visualizzazioni
CREATE PROCEDURE sp_IncrementaVisualizzazioni
    @AnnuncioId UNIQUEIDENTIFIER
AS
BEGIN
    UPDATE Annunci 
    SET VisualizzazioniTotali = VisualizzazioniTotali + 1
    WHERE Id = @AnnuncioId;
END;

-- Procedura per archiviare annunci scaduti
CREATE PROCEDURE sp_ArchiviaAnnunciScaduti
AS
BEGIN
    UPDATE Annunci 
    SET Stato = 'Scaduto'
    WHERE Stato = 'Attivo' 
    AND DataScadenza IS NOT NULL 
    AND DataScadenza < GETDATE();
END;

-- =====================================================
-- TRIGGER PER AUTOMAZIONI
-- =====================================================

-- Trigger per aggiornare DataModifica negli annunci
CREATE TRIGGER tr_Annunci_UpdateDataModifica
ON Annunci
AFTER UPDATE
AS
BEGIN
    UPDATE Annunci 
    SET DataModifica = GETDATE()
    WHERE Id IN (SELECT Id FROM inserted);
END;

-- Trigger per generare ConversazioneId nei messaggi
CREATE TRIGGER tr_Messaggi_GeneraConversazioneId
ON Messaggi
AFTER INSERT
AS
BEGIN
    UPDATE m
    SET ConversazioneId = CASE 
        WHEN i.ConversazioneId IS NULL THEN i.Id
        ELSE i.ConversazioneId
    END
    FROM Messaggi m
    INNER JOIN inserted i ON m.Id = i.Id
    WHERE m.ConversazioneId IS NULL;
END;

-- =====================================================
-- DATI DI ESEMPIO (OPZIONALE)
-- =====================================================

-- Inserimento utenti di esempio
INSERT INTO Utenti (SwitchEduId, Nome, Cognome, Email, TipoUtente) VALUES
('edu-001', 'Mario', 'Rossi', 'mario.rossi@usi.ch', 'StudenteVerificato'),
('edu-002', 'Anna', 'Bianchi', 'anna.bianchi@usi.ch', 'Studente'),
('edu-003', 'Immobiliare', 'Ticino SA', 'info@immobiliareticino.ch', 'AziendaConosciuta');

-- =====================================================
-- FINE SCRIPT
-- =====================================================

PRINT 'Database schema creato con successo!';
PRINT 'Tabelle create: Utenti, Annunci, Immagini, Preferiti, Messaggi, RicercheSalvate, NotificheInviate';
PRINT 'Viste create: vw_AnnunciAttivi, vw_StatisticheUtente';
PRINT 'Stored Procedures create: sp_IncrementaVisualizzazioni, sp_ArchiviaAnnunciScaduti';