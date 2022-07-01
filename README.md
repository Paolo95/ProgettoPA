# Progetto programmazione avanzata
---
## Introduzione

La relazione ha l'obiettivo di illustrare gli aspetti principali della realizzazione di un back-end in grado di gestire l'acquisto di un prodotto digitale sotto forma di audio o video.

## Dati rilevanti per il progetto

- URL del repository pubblico: [https://github.com/Paolo95/ProgettoPA.git](https://github.com/Paolo95/ProgettoPA.git)
- Commit ID: 
- Data svolgimento esame: 13 luglio 2022

---

## Obiettivo del progetto

L'obiettivo del progetto è quello di produrre un back-end per la gestione degli acquisti di prodotti digitali, sotto forma di video e audio. Ognuno di questi beni ha associato un costo in termini di token (credito). In particolare, il back-end prevede la possibilità per un utente di ottenere la lista dei beni disponibili filtrandoli in base alla tipologia del prodotto (audio/video) e all'anno di pubblicazione per poi acquistarli specificando l'id del prodotto selezionato. 
In questo caso non è stata introdotta alcuna validazione per l'id del prodotto selezionato poichè si presuppone che il front-end ritorni un valore corretto dell'id del prodotto dando all'utente la possibilità di selezionare i prodotti tramite una checkbox e non di inserire manualmente l'id all'interno di una textbox.
Se l'acquisto sia andato a buon fine, il prodotto è disponibile e il credito è sufficiente per l'acquisto, viene data la possibilità all'utente di scaricare il file contenente il prodotto desiderato. Per ogni bene acquistato viene avviato un solo download e richieste successive di acquisto dello stesso bene vengono rifiutate (viene effettuato un controllo per vedere se è già stato acquistato un prodotto "originale").
Se l'utente desidera scaricare nuovamente lo stesso prodotto deve utilizzare un'apposita funzionalià che gli consentirà di richiedere un ulteriore download al prezzo di 1 token, andando a registrare tale acquisto come aggiuntivo (non originale).
L'utente, inoltre, può visualizzare l’elenco degli acquisti effettuati, filtrandoli in base alla tipologia di acquisto (download originale o aggiuntivo) e visualizzare il proprio credito residuo.
Il back-end prevede la possibilità di effettuare acquisti multipli ricevendo dal front-end gli id dei prodotti acquistati e fornendo in output il download di un file .zip contenente i file scelti dall’utente.
In aggiunta, è possibile effettuare un regalo ad un amico. Per questa operazione l'utente deve fornire un indirizzo email (opportunamente validato dal back-end) e con un costo aggiuntivo di 0.5 token, verrà effettuato il download del prodotto scelto dall'utente. L'amico, successivamente, fornendo la propria email (senza necessità di essere un utente registrato) potrà effettuare un secondo download del file regalato (viene effettuata una verifica sull'acquisto in maniera tale da evitare download aggiuntivi dei regali).
Infine, un utente con ruolo admin può effettuare la ricarica ad un utente semplicemente fornendo la email (relativa all'account dell'utente da ricare) e l'importo (numero di token) della ricarica. Entrambi i campi di questa richiesta essendo scritti dall'utente all'interno di due textbox nel nostro frontend e quindi sono opportunamente validati.
Tutte le rotte che necessitano di un autenticazione da parte dell'utente sono autenticate mediante l'utilizzo di un token JWT.

---

## Strumenti utilizzati

Di seguito, sono riportati i principali strumenti software utilizzati per sviluppare il back-end e per organizzare il lavoro in maniera collaborativa.

### Trello

:::image type="content" source="Immagini README/Trello-logo.png" alt-text="Trello logo":::

Trello è un software gestionale in stile Kanban che è stato uilizzato per organizzare i task nelle seguenti categorie in modo tale da avere in ogni momento un quadro generale dell'avanzamento del progetto:

- da fare
- da chiedere al professore
- da testare
- idee
- in esecuzione
- fatto

### Gitkraken

:::image type="content" source="Immagini README/gitkraken.png" alt-text="gitkaken-logo":::

Per la gesitone del repository Github, si è utilizzato **Gitkraken** che permette una visualizzazione grafica dei vari commit del repository.

Il repository pubblico è disponibile all'indirizzo: [https://github.com/Paolo95/ProgettoPA.git](https://github.com/Paolo95/ProgettoPA.git)

### Postman

:::image type="content" source="Immagini README/postman.png" alt-text="postman-logo":::

Per effettuare i test delle richieste al back-end, è stato impiegato Postman organizzando la collection in sotto-cartelle suddivise in:
- richieste standard: sono le richieste formulate in modo corretto e che non ritornano uno status diverso da 200;
- testing: sono le richieste che portano a degli errori dovuti o ad una formulazione non valida delle richieste o ad un tentativo di accesso a rotte protette da parte di utenti diversi dall'admin.

Nel caso di richieste che mandano in download dei file video in formato .mp4, si è utilizzata la curl in quanto Postman non è in grado di gestire il ritorno di un file di quel formato.

### Live Share Visual Studio Code

Infine, uno strumento che è stato fondamentale nello sviluppo del codice in modo collaborativo è l'estensione **Live Share** fornita da Microsoft che ha permesso la l'editing in tempo reale del codice condividendo tutto il workspace del progetto disponendo di un canale vocale per discutere sugli aspetti fondamentali del lavoro in corso d'opera.

---

## Progettazione del software
### Diagrammi UML
#### Class Diagram
#### Sequence Diagram
### Schema E-R

---

## Descrizione dei design pattern utilizzati

---

## Avvio del progetto tramite Docker e Docker-compose

---

## Test del progetto con Postman e curl