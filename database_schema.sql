-- ============================================================================
-- SCRIPT DI CREAZIONE DATABASE PER APPLICATIVO ANNUNCI ALLOGGI STUDENTI
-- Versione: 1.0
-- Data: 2025-01-05
-- Descrizione: Schema completo per piattaforma ricerca/pubblicazione alloggi
-- ============================================================================

-- Creazione del database (opzionale, decommentare se necessario)
-- CREATE DATABASE StudentHousingApp;
-- USE StudentHousingApp;

-- ============================================================================
-- TABELLE PRINCIPALI
-- ============================================================================

-- Tabella Categorie
CREATE TABLE Categorie (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Nome NVARCHAR(50) NOT NULL UNIQUE,
    Descrizione NVARCHAR(255),
    Icona NVARCHAR(100), -- Nome dell'icona per l'UI
    Attiva BIT NOT NULL DEFAULT 1,
    DataCreazione DATETIME2 NOT NULL DEFAULT GETDATE(),
    DataModifica DATETIME2 NOT NULL DEFAULT GETDATE()
);

-- Tabella Utenti (senza autenticazione, gestita da Switch Edu-ID)
CREATE TABLE Utenti (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    SwitchEduId NVARCHAR(255) NOT NULL UNIQUE, -- ID univoco da Switch Edu-ID
    Nome NVARCHAR(100) NOT NULL,
    Cognome NVARCHAR(100) NOT NULL,
    Email NVARCHAR(255) NOT NULL UNIQUE,
    Telefono NVARCHAR(20),
    NomeAzienda NVARCHAR(255), -- Facoltativo per agenzie
    
    -- Indirizzo utente
    Via NVARCHAR(255),
    CAP NVARCHAR(10),
    Citta NVARCHAR(100),
    Nazione NVARCHAR(100) DEFAULT 'Svizzera',
    
    -- Classificazione utente
    TipoUtente NVARCHAR(50) NOT NULL DEFAULT 'Studente', -- Studente, StudenteVerificato, PersonaConosciuta, AziendaConosciuta
    Badge NVARCHAR(100), -- Badge assegnato dall'amministrazione
    
    -- Preferenze
    Lingua NVARCHAR(5) DEFAULT 'it', -- it, en
    NotificheEmail BIT DEFAULT 1,
    NotifichePush BIT DEFAULT 1,
    
    -- Metadati
    Attivo BIT NOT NULL DEFAULT 1,
    DataRegistrazione DATETIME2 NOT NULL DEFAULT GETDATE(),
    DataUltimoAccesso DATETIME2,
    DataModifica DATETIME2 NOT NULL DEFAULT GETDATE()
);

-- Tabella Annunci
CREATE TABLE Annunci (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UtenteId INT NOT NULL,
    CategoriaId INT NOT NULL,
    
    -- Informazioni base
    Titolo NVARCHAR(255) NOT NULL,
    Descrizione NTEXT,
    
    -- Indirizzo e posizione
    Via NVARCHAR(255) NOT NULL,
    CAP NVARCHAR(10) NOT NULL,
    Citta NVARCHAR(100) NOT NULL,
    Nazione NVARCHAR(100) NOT NULL DEFAULT 'Svizzera',
    Latitudine DECIMAL(10,8), -- Per mappa
    Longitudine DECIMAL(11,8), -- Per mappa
    
    -- Caratteristiche immobile
    Superficie DECIMAL(8,2), -- m²
    NumeroLocali INT, -- Per appartamenti
    Piano NVARCHAR(20), -- Piano (es: "2", "PT", "Mansarda")
    NumeroBagni INT,
    
    -- Stato arredamento
    StatoArredamento NVARCHAR(50), -- Arredato, ParzialmenteArredato, NonArredato
    
    -- Caratteristiche aggiuntive (flags)
    HasTerrazza BIT DEFAULT 0,
    HasGiardino BIT DEFAULT 0,
    AnimaliAmmessi BIT DEFAULT 0,
    HasAscensore BIT DEFAULT 0,
    AccessoDisabili BIT DEFAULT 0,
    
    -- Informazioni economiche
    PrezzoMensile DECIMAL(10,2) NOT NULL,
    SpeseIncluse BIT DEFAULT 0,
    ImportoSpeseMensili DECIMAL(10,2), -- Se spese escluse
    ConguaglioAnnuale BIT DEFAULT 0,
    DepositoCauzionale DECIMAL(10,2),
    AccettaSwissCaution BIT DEFAULT 0,
    AccettaGaranzieAlternative BIT DEFAULT 0,
    
    -- Disponibilità e contratto
    DataDisponibilita DATE,
    DisponibilitaDaSubito BIT DEFAULT 1,
    DurataMinimaContratto INT, -- Mesi
    
    -- Regole e note
    Regole NTEXT, -- No fumatori, no animali, etc.
    NoteAccessibilita NTEXT,
    
    -- Stato annuncio
    Stato NVARCHAR(50) NOT NULL DEFAULT 'Bozza', -- Bozza, InVerifica, Attivo, Scaduto, Archiviato, Rifiutato
    MotivoRifiuto NTEXT,
    
    -- Metadati
    DataCreazione DATETIME2 NOT NULL DEFAULT GETDATE(),
    DataPubblicazione DATETIME2,
    DataScadenza DATETIME2,
    DataModifica DATETIME2 NOT NULL DEFAULT GETDATE(),
    VerificatoDa INT, -- UtenteId dell'amministratore che ha verificato
    DataVerifica DATETIME2,
    
    -- Statistiche
    Visualizzazioni INT DEFAULT 0,
    ContattiRicevuti INT DEFAULT 0,
    
    CONSTRAINT FK_Annunci_Utenti FOREIGN KEY (UtenteId) REFERENCES Utenti(Id),
    CONSTRAINT FK_Annunci_Categorie FOREIGN KEY (CategoriaId) REFERENCES Categorie(Id),
    CONSTRAINT FK_Annunci_Verificatore FOREIGN KEY (VerificatoDa) REFERENCES Utenti(Id)
);

-- Tabella Immagini
CREATE TABLE Immagini (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    AnnuncioId INT NOT NULL,
    NomeFile NVARCHAR(255) NOT NULL,
    PercorsoFile NVARCHAR(500) NOT NULL,
    UrlImmagine NVARCHAR(500), -- URL pubblico dell'immagine
    AltText NVARCHAR(255), -- Per accessibilità
    Ordine INT NOT NULL DEFAULT 0, -- Ordine di visualizzazione
    IsPrincipale BIT DEFAULT 0, -- Immagine principale dell'annuncio
    DimensioneFile BIGINT, -- Dimensione in bytes
    TipoMime NVARCHAR(100),
    DataCaricamento DATETIME2 NOT NULL DEFAULT GETDATE(),
    
    CONSTRAINT FK_Immagini_Annunci FOREIGN KEY (AnnuncioId) REFERENCES Annunci(Id) ON DELETE CASCADE
);

-- Tabella Preferiti
CREATE TABLE Preferiti (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UtenteId INT NOT NULL,
    AnnuncioId INT NOT NULL,
    DataAggiunta DATETIME2 NOT NULL DEFAULT GETDATE(),
    Note NVARCHAR(500), -- Note personali dell'utente
    
    CONSTRAINT FK_Preferiti_Utenti FOREIGN KEY (UtenteId) REFERENCES Utenti(Id),
    CONSTRAINT FK_Preferiti_Annunci FOREIGN KEY (AnnuncioId) REFERENCES Annunci(Id) ON DELETE CASCADE,
    CONSTRAINT UK_Preferiti_Utente_Annuncio UNIQUE (UtenteId, AnnuncioId)
);

-- Tabella Messaggi
CREATE TABLE Messaggi (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    AnnuncioId INT NOT NULL,
    MittentId INT NOT NULL, -- Chi invia il messaggio
    DestinatarioId INT NOT NULL, -- Proprietario dell'annuncio
    
    -- Contenuto messaggio
    Oggetto NVARCHAR(255),
    Testo NTEXT NOT NULL,
    
    -- Stato messaggio
    Letto BIT DEFAULT 0,
    DataLettura DATETIME2,
    Archiviato BIT DEFAULT 0,
    
    -- Metadati
    DataInvio DATETIME2 NOT NULL DEFAULT GETDATE(),
    InRispostaA INT, -- ID del messaggio a cui si risponde
    
    CONSTRAINT FK_Messaggi_Annunci FOREIGN KEY (AnnuncioId) REFERENCES Annunci(Id),
    CONSTRAINT FK_Messaggi_Mittente FOREIGN KEY (MittentId) REFERENCES Utenti(Id),
    CONSTRAINT FK_Messaggi_Destinatario FOREIGN KEY (DestinatarioId) REFERENCES Utenti(Id),
    CONSTRAINT FK_Messaggi_Risposta FOREIGN KEY (InRispostaA) REFERENCES Messaggi(Id)
);

-- Tabella Ricerche Salvate
CREATE TABLE RicercheSalvate (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UtenteId INT NOT NULL,
    Nome NVARCHAR(255) NOT NULL, -- Nome dato dall'utente alla ricerca
    
    -- Criteri di ricerca (JSON o campi separati)
    CriteriFiltro NTEXT, -- JSON con tutti i filtri applicati
    
    -- Filtri principali (per query più efficienti)
    CategoriaId INT,
    PrezzoMin DECIMAL(10,2),
    PrezzoMax DECIMAL(10,2),
    Citta NVARCHAR(100),
    CAP NVARCHAR(10),
    
    -- Notifiche
    NotificheAttive BIT DEFAULT 1,
    UltimaNotifica DATETIME2,
    
    -- Metadati
    DataCreazione DATETIME2 NOT NULL DEFAULT GETDATE(),
    DataModifica DATETIME2 NOT NULL DEFAULT GETDATE(),
    Attiva BIT DEFAULT 1,
    
    CONSTRAINT FK_RicercheSalvate_Utenti FOREIGN KEY (UtenteId) REFERENCES Utenti(Id),
    CONSTRAINT FK_RicercheSalvate_Categorie FOREIGN KEY (CategoriaId) REFERENCES Categorie(Id)
);

-- ============================================================================
-- TABELLE DI SUPPORTO
-- ============================================================================

-- Tabella per tracking delle visualizzazioni
CREATE TABLE VisualizzazioniAnnunci (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    AnnuncioId INT NOT NULL,
    UtenteId INT, -- NULL per utenti anonimi
    IndirizzoIP NVARCHAR(45),
    UserAgent NVARCHAR(500),
    DataVisualizzazione DATETIME2 NOT NULL DEFAULT GETDATE(),
    
    CONSTRAINT FK_Visualizzazioni_Annunci FOREIGN KEY (AnnuncioId) REFERENCES Annunci(Id) ON DELETE CASCADE,
    CONSTRAINT FK_Visualizzazioni_Utenti FOREIGN KEY (UtenteId) REFERENCES Utenti(Id)
);

-- Tabella per log delle azioni amministrative
CREATE TABLE LogAzioni (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UtenteId INT NOT NULL,
    TipoAzione NVARCHAR(100) NOT NULL, -- VerificaAnnuncio, RifiutoAnnuncio, etc.
    EntitaId INT, -- ID dell'entità su cui è stata fatta l'azione
    TipoEntita NVARCHAR(50), -- Annuncio, Utente, etc.
    Descrizione NVARCHAR(500),
    DatiPrecedenti NTEXT, -- JSON con i dati prima della modifica
    DatiNuovi NTEXT, -- JSON con i dati dopo la modifica
    DataAzione DATETIME2 NOT NULL DEFAULT GETDATE(),
    
    CONSTRAINT FK_LogAzioni_Utenti FOREIGN KEY (UtenteId) REFERENCES Utenti(Id)
);

-- ============================================================================
-- INDICI PER PERFORMANCE
-- ============================================================================

-- Indici per ricerche frequenti
CREATE INDEX IX_Annunci_Stato ON Annunci(Stato);
CREATE INDEX IX_Annunci_Categoria ON Annunci(CategoriaId);
CREATE INDEX IX_Annunci_Citta ON Annunci(Citta);
CREATE INDEX IX_Annunci_Prezzo ON Annunci(PrezzoMensile);
CREATE INDEX IX_Annunci_DataPubblicazione ON Annunci(DataPubblicazione);
CREATE INDEX IX_Annunci_Posizione ON Annunci(Latitudine, Longitudine);

-- Indici per messaggi
CREATE INDEX IX_Messaggi_Destinatario ON Messaggi(DestinatarioId);
CREATE INDEX IX_Messaggi_Mittente ON Messaggi(MittentId);
CREATE INDEX IX_Messaggi_Annuncio ON Messaggi(AnnuncioId);
CREATE INDEX IX_Messaggi_DataInvio ON Messaggi(DataInvio);

-- Indici per preferiti
CREATE INDEX IX_Preferiti_Utente ON Preferiti(UtenteId);

-- Indici per ricerche salvate
CREATE INDEX IX_RicercheSalvate_Utente ON RicercheSalvate(UtenteId);

-- ============================================================================
-- DATI INIZIALI
-- ============================================================================

-- Inserimento categorie base
INSERT INTO Categorie (Nome, Descrizione, Icona) VALUES
('Appartamento', 'Appartamenti completi per studenti', 'home'),
('Camera', 'Camere singole o condivise', 'bed'),
('Parcheggio', 'Posti auto e garage', 'car'),
('Studio', 'Monolocali e bilocali', 'briefcase'),
('Posto Letto', 'Posto letto in camera condivisa', 'users');

-- ============================================================================
-- TRIGGER PER AGGIORNAMENTO AUTOMATICO
-- ============================================================================

-- Trigger per aggiornare DataModifica su Utenti
CREATE TRIGGER TR_Utenti_UpdateModifica
ON Utenti
AFTER UPDATE
AS
BEGIN
    UPDATE Utenti 
    SET DataModifica = GETDATE()
    WHERE Id IN (SELECT Id FROM inserted);
END;

-- Trigger per aggiornare DataModifica su Annunci
CREATE TRIGGER TR_Annunci_UpdateModifica
ON Annunci
AFTER UPDATE
AS
BEGIN
    UPDATE Annunci 
    SET DataModifica = GETDATE()
    WHERE Id IN (SELECT Id FROM inserted);
END;

-- Trigger per aggiornare contatore visualizzazioni
CREATE TRIGGER TR_Visualizzazioni_UpdateCounter
ON VisualizzazioniAnnunci
AFTER INSERT
AS
BEGIN
    UPDATE Annunci 
    SET Visualizzazioni = Visualizzazioni + 1
    WHERE Id IN (SELECT AnnuncioId FROM inserted);
END;

-- ============================================================================
-- VISTE UTILI
-- ============================================================================

-- Vista per annunci attivi con informazioni complete
CREATE VIEW VW_AnnunciAttivi AS
SELECT 
    a.*,
    u.Nome + ' ' + u.Cognome AS NomeProprietario,
    u.Email AS EmailProprietario,
    u.Telefono AS TelefonoProprietario,
    u.TipoUtente,
    c.Nome AS NomeCategoria,
    c.Icona AS IconaCategoria,
    (SELECT COUNT(*) FROM Preferiti p WHERE p.AnnuncioId = a.Id) AS NumeroPreferiti,
    (SELECT COUNT(*) FROM Messaggi m WHERE m.AnnuncioId = a.Id) AS NumeroMessaggi,
    (SELECT TOP 1 UrlImmagine FROM Immagini i WHERE i.AnnuncioId = a.Id AND i.IsPrincipale = 1) AS ImmaginePrincipale
FROM Annunci a
INNER JOIN Utenti u ON a.UtenteId = u.Id
INNER JOIN Categorie c ON a.CategoriaId = c.Id
WHERE a.Stato = 'Attivo' AND u.Attivo = 1;

-- Vista per statistiche utente
CREATE VIEW VW_StatisticheUtente AS
SELECT 
    u.Id,
    u.Nome + ' ' + u.Cognome AS NomeCompleto,
    COUNT(a.Id) AS NumeroAnnunci,
    COUNT(CASE WHEN a.Stato = 'Attivo' THEN 1 END) AS AnnunciAttivi,
    COUNT(CASE WHEN a.Stato = 'Bozza' THEN 1 END) AS AnnunciBozza,
    SUM(a.Visualizzazioni) AS TotaleVisualizzazioni,
    COUNT(p.Id) AS NumeroPreferiti,
    COUNT(m.Id) AS MessaggiRicevuti
FROM Utenti u
LEFT JOIN Annunci a ON u.Id = a.UtenteId
LEFT JOIN Preferiti p ON u.Id = p.UtenteId
LEFT JOIN Messaggi m ON u.Id = m.DestinatarioId
WHERE u.Attivo = 1
GROUP BY u.Id, u.Nome, u.Cognome;

-- ============================================================================
-- STORED PROCEDURES UTILI
-- ============================================================================

-- Procedura per ricerca annunci con filtri
CREATE PROCEDURE SP_RicercaAnnunci
    @CategoriaId INT = NULL,
    @Citta NVARCHAR(100) = NULL,
    @PrezzoMin DECIMAL(10,2) = NULL,
    @PrezzoMax DECIMAL(10,2) = NULL,
    @SuperficieMin DECIMAL(8,2) = NULL,
    @NumeroLocaliMin INT = NULL,
    @AnimaliAmmessi BIT = NULL,
    @HasTerrazza BIT = NULL,
    @HasGiardino BIT = NULL,
    @AccessoDisabili BIT = NULL,
    @Pagina INT = 1,
    @ElementiPerPagina INT = 20
AS
BEGIN
    DECLARE @Offset INT = (@Pagina - 1) * @ElementiPerPagina;
    
    SELECT *
    FROM VW_AnnunciAttivi
    WHERE 
        (@CategoriaId IS NULL OR CategoriaId = @CategoriaId)
        AND (@Citta IS NULL OR Citta LIKE '%' + @Citta + '%')
        AND (@PrezzoMin IS NULL OR PrezzoMensile >= @PrezzoMin)
        AND (@PrezzoMax IS NULL OR PrezzoMensile <= @PrezzoMax)
        AND (@SuperficieMin IS NULL OR Superficie >= @SuperficieMin)
        AND (@NumeroLocaliMin IS NULL OR NumeroLocali >= @NumeroLocaliMin)
        AND (@AnimaliAmmessi IS NULL OR AnimaliAmmessi = @AnimaliAmmessi)
        AND (@HasTerrazza IS NULL OR HasTerrazza = @HasTerrazza)
        AND (@HasGiardino IS NULL OR HasGiardino = @HasGiardino)
        AND (@AccessoDisabili IS NULL OR AccessoDisabili = @AccessoDisabili)
    ORDER BY DataPubblicazione DESC
    OFFSET @Offset ROWS
    FETCH NEXT @ElementiPerPagina ROWS ONLY;
END;

-- ============================================================================
-- FINE SCRIPT
-- ============================================================================

PRINT 'Schema database creato con successo!';
PRINT 'Tabelle create: Categorie, Utenti, Annunci, Immagini, Preferiti, Messaggi, RicercheSalvate';
PRINT 'Tabelle di supporto: VisualizzazioniAnnunci, LogAzioni';
PRINT 'Viste create: VW_AnnunciAttivi, VW_StatisticheUtente';
PRINT 'Stored Procedure: SP_RicercaAnnunci';