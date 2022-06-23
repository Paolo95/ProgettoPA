DROP DATABASE IF EXISTS progettopa;
CREATE DATABASE progettopa;

\c progettopa

DROP TABLE IF EXISTS prodotto;

CREATE TABLE prodotto (
  id_prodotto SERIAL PRIMARY KEY NOT NULL,
  nome_prodotto VARCHAR(100) NOT NULL,
  tipologia VARCHAR(255) NOT NULL,
  anno INT NOT NULL,  
  disponibile BOOLEAN NOT NULL
);

DROP TABLE IF EXISTS utente;

CREATE TABLE utente (
  id_utente SERIAL PRIMARY KEY NOT NULL,
  cognome VARCHAR(255) NOT NULL,
  nome VARCHAR(255) NOT NULL,
  mail VARCHAR(255),
  ruolo VARCHAR(50) NOT NULL,
  indirizzo VARCHAR(100),
  credito INT, 
  id_prodotto INT, 
  CONSTRAINT prodotto
    FOREIGN KEY(id_prodotto) 
      REFERENCES prodotto(id_prodotto)
);

INSERT INTO prodotto (nome_prodotto, tipologia, anno, disponibile)
VALUES 
    ('U2 - One', 'Audio', 1992, true),
    ('U2 - One (Official videoclip)', 'Video', 1992, false),
    ('Blanco, Mahmood - Brividi','Audio', 2022, false),
    ('PTN - Irene','Audio', 2018, true);

INSERT INTO utente (cognome, nome, mail, ruolo, indirizzo, credito, id_prodotto)
VALUES 
    ('Compagnoni', 'Paolo', 'compagnonipaolo95@gmail.com', 'admin', 'Viale Piane San Donato 33 - Corropoli (TE)', 7, 1),
    ('Onori', 'Simone', 'simoenonori@gmail.com', 'user', 'Via Napoli 2/A - Ascoli Piceno (AP)', 7, 2),
    ('Faini', 'Aurora', 'aurorafaini@gmail.com', 'user', 'Via Giuseppe Mazzini 22 - Monteprandone (AP)', 7, 1),
    ('Schiavi', 'Elise', 'eliseschiavi@gmail.com', 'admin', 'Via dell Olmo 7 - San Benedetto del Tronto (AP)', 7, 3);