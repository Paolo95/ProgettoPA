# Progetto programmazione avanzata

## Introduzione

La relazione ha l'obiettivo di illustrare gli aspetti principali della realizzazione di un back-end in grado di gestire l'acquisto di un prodotto digitale sotto forma di audio o video.

## Dati rilevanti per il progetto

- URL del repository pubblico: [https://github.com/Paolo95/ProgettoPA.git](https://github.com/Paolo95/ProgettoPA.git)
- Data svolgimento esame: 13 luglio 2022

## Obiettivo del progetto

L'obiettivo del progetto è quello di produrre un back-end per la gestione degli acquisti di prodotti digitali, sotto forma di video e audio. Ognuno di questi beni ha associato un costo in termini di token (credito). In particolare, il back-end prevede la possibilità per un utente di ottenere la lista dei beni disponibili filtrandoli in base alla tipologia del prodotto (audio/video) e all'anno di pubblicazione per poi acquistarli specificando l'id del prodotto selezionato. 
In questo caso non è stata introdotta alcuna validazione per l'id del prodotto selezionato poichè si presuppone che il front-end ritorni un valore corretto dell'id del prodotto, dando all'utente la possibilità di selezionare i prodotti tramite una checkbox e non di inserire manualmente l'id all'interno di una textbox.
Se l'acquisto è andato a buon fine, il prodotto è disponibile e il credito è sufficiente per l'acquisto, viene data la possibilità all'utente di scaricare il file contenente il prodotto desiderato. Per ogni bene acquistato viene avviato un solo download e richieste successive di acquisto dello stesso bene vengono rifiutate (viene effettuato un controllo per vedere se è già stato acquistato un prodotto "originale").
Se l'utente desidera scaricare nuovamente lo stesso prodotto deve utilizzare un'apposita rotta che gli consentirà di richiedere un ulteriore download al prezzo di 1 token, andando a registrare tale acquisto come aggiuntivo (non originale).
L'utente, inoltre, può visualizzare l’elenco degli acquisti effettuati, filtrandoli in base alla tipologia di acquisto (download originale o aggiuntivo) e visualizzare il proprio credito residuo.
Il back-end prevede la possibilità di effettuare acquisti multipli ricevendo dal front-end gli id dei prodotti acquistati e fornendo in output il download di un file (.zip) contenente i file scelti dall’utente.
In aggiunta, è possibile effettuare un regalo ad un amico. Per questa operazione l'utente deve fornire un indirizzo email (opportunamente validato dal back-end) e, con un costo aggiuntivo di 0.5 token, verrà effettuato il download del prodotto scelto dall'utente. L'amico, successivamente, fornendo la propria email (senza necessità di essere un utente registrato) potrà effettuare un secondo download del file regalato (viene effettuata una verifica sull'acquisto in maniera tale da evitare download aggiuntivi dei regali).
Infine, un utente con ruolo admin può effettuare la ricarica ad un utente semplicemente fornendo l'email (relativa all'account dell'utente da ricare) e l'importo (numero di token) della ricarica. Entrambi i campi di questa richiesta, essendo scritti dall'utente all'interno di due textbox nel nostro front-end, sono opportunamente validati.
Tutte le rotte che necessitano di un autenticazione da parte dell'utente sono autenticate mediante l'utilizzo di un token JWT.

## Strumenti utilizzati

Di seguito, sono riportati i principali strumenti software utilizzati per sviluppare il back-end e per organizzare il lavoro in maniera collaborativa.

### Trello

<p align="center">
    <img src="./Immagini/trello-logo.png?raw=true" width="30%" height="auto">
</p>

Trello è un software gestionale in stile Kanban che è stato uilizzato per organizzare i task nelle seguenti categorie in modo tale da avere in ogni momento un quadro generale dell'avanzamento del progetto:

- da fare
- da chiedere al professore
- da testare
- idee
- in esecuzione
- fatto

### Gitkraken

<p align="center">
    <img src="./Immagini/gitkraken-logo.png?raw=true" width="20%" height="auto">
</p>


Per la gesitone del repository Github, si è utilizzato **Gitkraken** che permette una visualizzazione grafica dei vari commit del repository.

Il repository pubblico è disponibile all'indirizzo: [https://github.com/Paolo95/ProgettoPA.git](https://github.com/Paolo95/ProgettoPA.git)

### Postman

<p align="center">
    <img src="./Immagini/postman-logo.png?raw=true" width="15%" height="auto">
</p>

Per effettuare i test delle richieste al back-end, è stato impiegato Postman organizzando la collection in sotto-cartelle suddivise in:
- richieste standard: sono le richieste formulate in modo corretto e che non ritornano uno status diverso da 200;
- testing: sono le richieste che portano a degli errori dovuti o ad una formulazione non valida delle richieste o ad un tentativo di accesso a rotte protette da parte di utenti diversi dall'admin.

Nel caso di richieste che mandano in download dei file video Postman non è in grado di visualizzare al suo interno i file in formato mp4 restituendo un errore. Per ovviare al problema, basta cliccare il bottone "send and download" per ottenere il file video.

### Live Share Visual Studio Code

Infine, uno strumento che è stato fondamentale nello sviluppo del codice in modo collaborativo è l'estensione **Live Share** fornita da Microsoft che ha permesso l'editing in tempo reale del codice condividendo tutto il workspace del progetto e mettendo a disposizione un canale vocale per discutere sugli aspetti fondamentali del lavoro in corso d'opera.

## Progettazione del software

### Scelte implementative

#### Token

I token nell'applicazione hanno le seguenti informazioni al loro interno:

- id_utente
- username
- email
- ruolo

La signature dei token nell'intero progetto è "secret".

#### Login utente

Nella nostra applicazione è stata introdotta una rotta di login che ottiene dal front-end l'username e la password per simulare l'operazione di login da parte di un utente. Durante l'operazione di login l'apposito controller (controller_accesso) verifica che nel database siano presenti sia l'username e la password inseriti nel front-end e successivamente in caso di riscontro positivo genera un token JWT contenente le informazioni pricipali dell'utente. In basi agli utilizzi futuri del token sono stati scelti come campi principali da includere all'interno del token: l'username, la password, la mail e il ruolo dell'utente.

#### Gestione degli errori

Per gestire gli errori nell'applicazione, si è scelto di utilizzare la factoryErrori descritta nel paragrafo dedicato successivamente.
Di seguito, è riportato un esempio di gestione degli errori:

```
const utente = await Database.utente.findOne({where: {username: loginData.username}});
        if( ! utente) return factory.creaErrore({
            tipoErrore: 'Bad Request',
            messaggio: 'ERRORE: username errato!'});
```

In questo caso, viene fatta una SELECT per controllare se l'utente con un determinato username è presente del database. Se il record non è presente, è necessario sollevare un errore con un messaggio e status code adeguati.

#### Validazione degli input

Per quanto riguarda la validazione dei dati in input sono stati introdotti due validator (all'interno del file validazioneRichieste) necessari per assicurare che i dati ricevuti dal front-end siano nel formato richiesto dalla nostra applicazione. Proprio per questo motivo sono stati individuati i due casi in cui si richiedeva all'utente di inserire manualmente un dato lato front-end, ovvero nel caso in cui un amministratore eseguisse una ricarica del credito e nel caso in cui un utente facesse un regalo ad un amico.
Nel primo caso l'utente amministratore (lato front-end) deve inserire in due apposite textbox la mail dell'account da ricaricare e l'importo della ricarica, mentre nel secondo caso, l'utente che desidera effettuare un regalo ad un amico deve inserire (sempre lato front-end) in una apposita textbox, la mail dell'amico a cui effettuare il regalo.
Il validator che esegue il controllo della mail verifica che il tipo di dato della mail sia effettivamente una stringa (come ci normalmente ci si aspetterrebbe) e che rispetti il formato classico dell'email (una sequenza di caratteri alfanumerici, una chiocciola, una sequenza di caratteri alfabetici e il punto seguito da due o tre caratteri alfabetici) eseugito tramite una Regex.
Il validator che esegue il controllo dell'importo verifica che il carattere inserito sia un numero (tramite Regex) e che l'importo non sia minore dell'importo minimo consentito per una ricarica (1 token).

#### JSZip

Si è utilizzata la libreria **JSZip** per realizzare i file zip nel caso di acquisto multiplo ovvero di un ordine formato da più prodotti che vengono resi disponibili al download mediante un unico file (.zip).

#### Creazione dei link

Il back-end deve fornire all'utente un link per il download del prodotto audio o video.
L'applicazione ha una directory locale (*./files*) che contiene al suo interno i prodotti audio e video con i watermark. L'utente richiede uno o più prodotti e ciò che otterrà in output sarà un link che consiste nel path locale del file *out.zip* (nel caso di acquisto multiplo) o del file audio/video. L'applicazione poi, tramite il comando *res.download*, avvierà lato front-end il download dei prodotti tramite il browser.

#### Acquisti

Nelle specifiche di progetto è richiesto che il download dei prodotti originali deve essere effettuato una sola volta. Questa specifica è stata implementata utilizzando un campo nella tabella *acquisto* nel database chiamato *originale* che se è *true*, indica che il prodotto acquistato è originale e se si prova a rieseguire l'acquisto dello stesso prodotto nella rotta per gli acquisti originali, si ottiene un'eccezione in quanto bisogna utilizzare la rotta apposita dedicata agli acquisti aggiuntivi.
Se il campo originale è *false*, vuol dire che è già stato effettuato un download del prodotto e quindi è possibile riscaricarlo solo utilizzando la rotta dedicata agli acquisti aggiuntivi.

#### Regalo ad un amico

La procedura per effetturare un regalo ad un amico consiste in due fasi. Nella prima fase, l'utente che desidera effettuare il regalo acquista il bene per se stesso e per l'amico. Nel caso in cui l'utente abbia già acquistato il prodotto (download aggiuntivo), viene scalato solo un token per l'acquisto mentre se è il primo download (download originale), l'utente paga il prezzo pieno in token relativo al prodotto originale. Successivamente, l'utente spende ulteriori 0.5 token per effettuare il regalo all'amico, fornendo lato front-end la mail del destinatario del regalo tramite la rotta *api/regali/ottieniRegalo/prova@prova.com/id_utente/id_prodotto*.
Successivamente, il destinatario del regalo riceverà via mail (non è stata implementata la funzionalità di invio della mail in quanto non richiesto nelle specifiche) un link alla rotta che gestisce il download del regalo. 
Il regalo può essere scaricato una sola volta perché all'interno della tabella *acquisto* del database è presente un campo chiamato *download_amico* che è impostato a *false* se il regalo non è stato ancora scaricato, mentre è impostato a *true* in caso contrario. Se il campo è true, il back-end blocca la procedura di download del file in quanto risulta già scaricato una volta.

### Diagrammi UML

#### Class Diagram

In questo paragrafo sono riportati i class diagram principali dell'applicazione.
Di seguito è riportato il class diagram che mostra le associazioni tra le classi principali.

<p align="center">
    <img src="./Immagini/Class Diagram/Class Diagram PA-Class diagram - Singleton.png?raw=true" width="95%" height="auto">
</p>

Il secondo class diagram proposto mostra le relazioni tra i vari controller e la factory di generazione degli errory (*FactoryErrore*).

<p align="center">
    <img src="./Immagini/Class Diagram/Class Diagram PA-Controller-Factory.png?raw=true" width="95%" height="auto">
</p>

Infine, si è riportato il class diagram della factory errore.

<p align="center">
    <img src="./Immagini/Class Diagram/Class Diagram PA-Factory.png?raw=true" width="95%" height="auto">
</p>

#### Sequence Diagram

In questo paragrafo sono riportati i sequence diagram principali dell'applicazione.
Di seguito è riportato il sequence diagram che mostra lo scenario relativo alla richiesta da parte di un utente generico di visualizzare la lista completa dei propri acquisti.

<p align="center">
    <img src="./Immagini/Sequence Diagram/Sequence Diagram PA-Acquisti Utente.png?raw=true" width="95%" height="auto">
</p>

Il secondo sequence diagram rappresenta lo scenario in cui un utente generico acquista un prodotto.

<p align="center">
    <img src="./Immagini/Sequence Diagram/Sequence Diagram PA-AcquistoID.png?raw=true" width="95%" height="auto">
</p>

Il terzo sequence diagram proposto mostra lo scenario riguardante un acquisto aggiuntivo di un prodotto richiesta di download di un file precedentemente acquistato) da parte di un utente generico.

<p align="center">
    <img src="./Immagini/Sequence Diagram/Sequence Diagram PA-Acquisto Aggiuntivo.png?raw=true" width="95%" height="auto">
</p>

Il sequence diagram successivo, invece, mostra lo scenario relativo all'acquisto di più prodotti (acquisto multiplo) da parte di un utente generico.

<p align="center">
    <img src="./Immagini/Sequence Diagram/Sequence Diagram PA-Acquisto Multiplo.png?raw=true" width="95%" height="auto">
</p>

In questo sequence diagram, per terminare i diagrammi riguardanti gli acquisti, viene rappresentato lo scenario in cui un utente qualsiasi effettua un regalo ad un amico.

<p align="center">
    <img src="./Immagini/Sequence Diagram/Sequence Diagram PA-Creazione regalo amico.png?raw=true" width="95%" height="auto">
</p>

Il penultimo sequence diagram rappresenta infatti lo scenario in cui un qualsiasi utente richiede di visualizzare il proprio credito residuo.

<p align="center">
    <img src="./Immagini/Sequence Diagram/Sequence Diagram PA-Credito.png?raw=true" width="95%" height="auto">
</p>

Infine, l'ultimo sequence diagram riportato illustra lo scenario in cui un utente amministratore effettui una ricarica del credito di un utente generico (specificandone la sua email e l'importo della ricarica).

<p align="center">
    <img src="./Immagini/Sequence Diagram/Sequence Diagram PA-Ricarica utente.png?raw=true" width="95%" height="auto">
</p>

### Schema E-R

Di seguito, è riportato lo schema E-R del database che ne descrive le entità e relazioni presenti con i loro attributi.

<p align="center">
    <img src="./Immagini/Diagramma ER.jpeg?raw=true" width="95%" height="auto">
</p>

## Descrizione dei design pattern utilizzati

### Singleton

Di seguito, è riportata l'implementazione del pattern Singleton nell'applicazione. In particolare, si è utilizzato questo pattern per garantire che ci sia una sola instanza attiva dell'oggetto Sequelize che gestisce la connessione al database Postgres.

```
class Singleton{
    
    static creaSingleton = (function () {
        let instance;

        function createInstance() {
            const sequelize = new Sequelize(process.env.PG_DATABASE, process.env.PG_USER, process.env.PG_PASSWORD, {
                host: process.env.PG_HOST,
                port: process.env.PG_PORT,
                dialect: 'postgres',
                logging: false
            });
            return sequelize;
        }

        return {
            getInstance: function () {
                if (!instance) {
                    instance = createInstance();
                }
                return instance;
            }
        };
    })();


}

```

Nel momento in cui è richiesta la connessione al database, viene chiamato il *getInstance()* che restituisce una nuova istanza della classe Sequelize solo se non è mai stata istanziata fino a quel momento, altrimenti viene ritornata quella già presente.

### Factory

Si è utilizzato il design pattern Factory per gestire le diverse tipologie di errori presenti nell'applicazione, restituendo quando necessario, il corretto status code e il messaggio di errore in output.

```
class ErroreBadRequest{
    constructor({tipo_errore, messaggio}) {
        this.tipoErrore = tipo_errore;
        return [400, messaggio];
    }
}

class ErroreUnauthorized{
    constructor({tipo_errore, messaggio}) {
        this.tipoErrore = tipo_errore;
        return [401, messaggio];    
    }
}

class ErroreNotFound{
    constructor({tipo_errore, messaggio}) {
        this.tipoErrore = tipo_errore;
        return [404, messaggio];
    }
}

class ErroreInternalServerError{
    constructor({tipo_errore, messaggio}) {
        this.tipoErrore = tipo_errore;
        return [500, messaggio];
    }
}

class FactoryErrore{
    creaErrore(data) {
        if(data.tipoErrore == 'Bad Request') return new ErroreBadRequest(data);
        if(data.tipoErrore == 'Unauthorized') return new ErroreUnauthorized(data);
        if(data.tipoErrore == 'Not Found') return new ErroreNotFound(data);
        if(data.tipoErrore == 'Internal Server Error') return ErroreInternalServerError(data);
    }
}

module.exports = FactoryErrore;

```

Il pattern consente di creare un messagio di errore custom con il corretto status code semplicemente richiamando il metodo *creaErrore* in questo modo:

```
errore = factory.creaErrore({
                tipoErrore: 'Internal Server Error',
                messaggio: 'ERRORE SERVER: Impossibile scaricare il file'});
            return res.status(errore[0]).send(errore[1]);
```

Gli status code gestiti sono:
- Bad Request (400)
- Unauthorized (401)
- Not Found (404)
- Internal Server Error (500)

### Chain of responsability

Il pattern *chain of responsability* è utilizzato per gestire la verifica del token e/o l'autenticazione con ruolo admin nelle rotte dove ciò è necessario.
Nella rotta */ricaricaUtente*, ad esempio, è necessario controllare per prima cosa se il token è ben formato e se ciò accade, bisogna estrarre le informazioni contenute al suo interno (id_utente, username, email e ruolo).
L'intera catena è gestita mediante l'utilizzo di middleware che si interpongono tra la request e la response.
Se la verifica del token va a buon fine, l'applicazione passa al controllo del ruolo dell'utente. Se l'utente è admin, l'applicazione effettua le operazioni necessarie ad effettuare la ricarica, altrimenti restituisce un'eccezione e non esegue la richiesta di ricarica.


```
router.post('/ricaricaUtente', verificaToken, isAdmin, async (req, res) => {

    let error = await validazioneRichieste.controlloMail(req.body.mailUtente);
    if(error) return res.status(error[0]).send(error[1]);

    error = await validazioneRichieste.controlloImportoRicarica(req.body);
    if(error) return res.status(error[0]).send(error[1]);

    const result = await controller_utente.ricaricaUtente(req.body);
    res.status(result[0]).send(result[1]);
});

```
Si è scelto questo pattern per garantire un catena di controlli da effettuare obbligatoriamente prima di accedere alle funzionalità della rotta specifica.

## Avvio del progetto tramite Docker e Docker-compose

Il progetto utilizza *Postgres* come DBMS per la persistenza dei dati, diversi package installati tramite npm e ovviamente *Node.js* per eseguire il codice Javascript. Tutte le dipendenze necessarie sono indicate nel file *package.json*. 
I package impiegati sono:

- **bcryptjs**: permette di memorizzare le password cifrate utilizzando una funzione hash di cifratura invece di utilizzare un testo in chiaro 
- **dotenv**: permette di caricare le variabili d'ambiente da un file (.env) nel *process.env*
- **express**: permette di utilizzare il framework express in Node.js
- **jsonwebtoken**: permette di trasmettere in maniera sicura le informazioni inviate tramite oggetti JSON
- **jszip**: package impiegato per la creazione dei file zip
- **pg**: package per il client Postgres
- **pg-hstore**: package per serializzare e deserializzare dati JSON in formato hstore
- **sequelize**: package per integrare l'ORM Sequelize
- **sequelize-cli**: package per utilizzare Sequelize da riga di comando

Per poter avviare l'applicazione è necessario installare correttamente i pacchetti indicati sopra e il DBMS Postgres adeguatamente configurato e inizializzato con uno script di seeding del database. 
Il tutto può essere automatizzato e reso più agevole grazie all'utilizzo di Docker e Docker-compose.

Il Dockerfile è il seguente:

```
FROM node:latest
WORKDIR /usr/app
COPY package.json .
RUN npm install
COPY . .
EXPOSE 8080
CMD ["node", "index.js"]
```

Il Dockerfile crea un'immagine con Node.js al suo interno in cui viene impostata come cartella di lavoro */usr/app* dove al suo interno viene copiato il file *package.json*. Successivamente viene eseguito il comando *npm install* per installare tutti pacchetti necessari all'applicazione indicati nel file *package.json*.
Tramite l'istruzione *COPY . .* viene copiata interamente la cartella del progetto all'interno della working directory dell'immagine.
Con *EXPOSE 8080* si imposta la porta 8080 utilizzata da docker.
Infine si esegue il comando *node index.js* tramite CMD. 
In questo modo si è creata un'immagine Docker con Node.js installato, con al suo interno tutte le dipendenze e il codice dell'applicazione.

Ciò che rimane da fare è integrare il DBMS Postgres all'applicazione. Riassumendo, vengono creati allo scopo due container docker: uno con l'applicazione e uno con il DBMS Postgres.
Per creare, configurare e avviare i container si utilizza Docker-container.

Il file *docker.compose.yml* è il seguente:

```
version: "2.2.3"
services:
  postgres:
    image: postgres
    container_name: postgres
    environment:
      POSTGRES_DB: progettopa
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: pa
    ports: 
      - '5432:5432'
    volumes:
      - ./database/database_seeding.sql:/docker-entrypoint-initdb.d/database_seeding.sql

  progettopa:
    build: .
    container_name: progettopa
    image: progettopa
    volumes:
      - .:/usr/app/
      - /usr/app/node_modules
    ports:
      - "8080:8080"
    depends_on:
      - postgres
    restart: always
```

Tramite Docker-compose vengono creati due container: 
- *progettopa* che contiene l'immagine con Node.js e il codice dell'applicazione
- *postgres* che contiene l'immagine con il DBMS Postgres inizializzato e configurato

Il container *progettopa* integra l'immagine omonima, imposta la porta 8080 dove risiederà l'applicazione e viene avviato dopo che il servizio *postgres* è stato avviato tramite il comando *depends_on*.

Il container *postgres* configura un database Postgres con un database chiamato *progettopa* con username *postgres* e passoword *pa*. Il database viene popolato tramite lo script *database_seeding.sql* montato tramite il comando *volumes*.

Per avviare l'applicazione, è necessario posizionarsi all'interno della cartella root del progetto inserendo il seguente comando sul terminale:

```
docker-compose up
```

## Test del progetto con Postman

Per inviare le richieste al back-end si è impiegato **Postman**. La collection con tutte le richieste utilizzate è disponibile cliccando sul bottone qui in basso "Run in Postman":

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/21327654-342b98bf-82cf-43a3-b5f1-7df86a5a1bc8?action=collection%2Ffork&collection-url=entityId%3D21327654-342b98bf-82cf-43a3-b5f1-7df86a5a1bc8%26entityType%3Dcollection%26workspaceId%3D8efb174d-e66c-4699-90e4-329cd2ad25ff)

La collection contiene le richieste organizzate in due macro-categorie:
- **chiamate standard**: contiene le chiamate che rispondono alle specifiche di progetto
- **testing**: contiene le chiamate che sollevano le eccezioni. Esse sono a loro volta suddivise in **testing validazione** e **testing errori**.
    Le prime sono chiamate che sollecitano eccezioni della classe dedicata alla validazione degli input mentre le seconde sollecitano eccezioni dovute ad errori nella formulazione delle richieste stesse.

Per effettuare i test delle eccezioni per quanto riguarda gli utenti, sono stati utilizzati quattro token:

- un token ben formato con ruolo admin 
- un token ben formato con ruolo user
- un token ben formato con un utente non esistente
- un token generato manualmente in modo errato introducendo di volta in volta dei caratteri errati al suo interno

Di seguito, sono riporte le informazioni dei primi tre token riportati sopra:

```
{
  "id_utente": 1,
  "username": "paolo95",
  "email": "compagnonipaolo95@gmail.com",
  "ruolo": "admin"
}

{
  "id_utente": 2,
  "username": "simone95",
  "email": "simoenonori@gmail.com",
  "ruolo": "user"
}

{
  "id_utente": 22,
  "username": "pippo95",
  "email": "pippo@gmail.com",
  "ruolo": "user"
}
```
La collection Postman è organizzata in cartelle e sottocartelle. Ogni cartella verrà descritta nel dettaglio:

- **Chiamate standard**
    - **Acquisti**
        - **Acquisto per ID**: contiene al suo interno due richieste rispettivamente con token JWT (id_utente : 1 e id_utente : 2), body (con id_prodotto : 5) per entrambe le richieste, che restituisce il download di un prodotto video in modo corretto. L'URL della richiesta è *localhost:8080/api/acquisti/acquistoId*;
        - **Acquisto aggiuntivo**: contiene al suo interno una richiesta con token JWT (id_utente : 1), body (con id_prodotto : 5), che restituisce il download di un prodotto video in modo corretto per l'acquisto aggiuntivo. L'URL della richiesta è *localhost:8080/api/acquisti/acquistoAggiuntivo*;
        - **Regalo amico**: contiene al suo interno una richiesta con token JWT (id_utente : 1), body (con id_prodotto : 5), che permette di creare il regalo ad un amico con indirizzo mail *prova@prova.com*. L'URL della richiesta è localhost:8080/api/acquisti/regaloAmico/prova@prova.com*;
        - **Acquisto multiplo**: contiene al suo interno una richiesta con token JWT (id_utente : 1), body (con id_prodotto : 3 e id_prodotto : 5), che restituisce il download di un file (out.zip) contenente i file relativi ai prodotti 3 e 5 per l'acquisto multiplo. L'URL della richiesta è *localhost:8080/api/acquisti/acquistoMultiplo*;
    - **Utenti**
        - **Credito residuo**: contiene al suo interno una richiesta con token JWT (id_utente : 1), che restituisce il credito residuo dell'utente indicato nel token. L'URL della richiesta è *localhost:8080/api/utenti/credito*;
        - **Login**: contiene al suo interno due richieste, una con body (username : paolo95, passwd: pa) e una con (username: simone95, passwd : pa), che restituiscono il token JWT dei rispettivi utenti presenti nel database. L'URL della richiesta è *localhost:8080/api/utenti/login*;
        - **Ricarica utente**: contiene al suo interno una richiesta con token JWT (id_utente : 1), body (con mailUtente : compagnonipaolo95@gmail.com e importo_ricarica : 10), che effettua la ricarica dell'utente con la mail indicata nel body e con l'importo presente nel campo importo_ricarica del body. L'URL della richiesta è *localhost:8080/api/utenti/ricaricaUtente*;
        - **Acquisti utente**: contiene al suo interno una richiesta con token JWT (id_utente : 1), body (con tipologiaAcquisto: true), che restituisce la lista di acquisti originali effettuati dall'utente indicato nel token. L'URL della richiesta è *localhost:8080/api/utenti/acquistiUtente*;
    - **Prodotti**: contiene al suo interno una richiesta (con body tipologia : Video e anno : 1992), che restituisce una lista di tutti i prodotti video disponibili risalenti all'anno 1992. L'URL della richiesta è *localhost:8080/api/prodotti/lista*;
    - **Regali**: contiene al suo interno una richiesta che permette all'utente che ha ricevuto un regalo, di poter scaricare il prodotto ricevuto in dono. L'URL della richiesta è *localhost:8080/api/regali/ottieniRegalo/prova@prova.com/1/3*. In questo caso l'utente che ha effettuato il regalo è l'utente con ID 1 e il prodotto regalato ha ID 3.
- **Testing**
    - **Testing validazione**
        - **Acquisti**: contiene al suo interno una richiesta con token JWT (id_utente : 1), body (con id_prodotto : 5), che solleva l'eccezione nella validazione della mail (per un regalo ad un amico) in quanto essa è errata. L'URL della richiesta è *localhost:8080/api/acquisti/regaloAmico/provaprovacom*.
        La seconda richiesta contenuta nella cartella invece prova ad effettuare un acquisto per ID utilizzando un token non valido;
        - **Utenti**: la prima richiesta contenuta nella cartella prova ad effettuare una ricarica utente con una mail errata nel body, sollevando un errore fornito dalla classe di validazione.
        La seconda richiesta è simile alla prima, ma nel body viene indicato un importo della ricarica errato, sollevando un adeguato errore fornito dalla classe di validazione.
        L'ultima richiesta prova ad effettuare una ricarica utilizzando come importo una stringa "test" che solleva un errore fornito dalla classe di validazione;
    - **Testing errori**
        - **Acquisti**
            - **Acquisto per ID**: la prima richiesta prova ad effettuare un acquisto per ID dove però il prodotto fornito nel body non esiste sollevando l'errore opportuno.
            La seconda richiesta prova ad effettuare un acquisto per ID in cui il token utilizzato è relativo ad un utente inestistente nel database (token riportato sopra con ID 22) sollevando l'errore opportuno;
            - **Acquisto agguntivo**: la prima richiesta tenta di effettuare un acquisto aggiuntivo in cui il token utilizzato è relativo ad un utente inestistente nel database (token riportato sopra con ID 22) sollevando l'errore opportuno.
            La seconda richiesta prova ad effettuare un acquisto aggiuntivo con token relativo all'admin (con id_utente 1) ma richiedendo nel body un prodotto inesistente di ID 15 sollevando l'errore opportuno;            
            - **Regalo amico**: la prima richiesta tenta di creare un regalo ad un amico ma utilizzando il token di un utente non esistente nel database (token riportato sopra con id_utente : 22) sollevando l'errore opportuno.
            La seconda richiesta è simile alla prima, ma richiede la creazione di un regalo con un prodotto non esistente sollevando l'errore opportuno;
            - **Acquisto multiplo**: la prima richiesta tenta di creare un acquisto multiplo ma utilizzando il token di un utente non esistente nel database (token riportato sopra con id_utente : 22) sollevando l'errore opportuno.
            La seconda richiesta è simile alla prima, ma richiede la creazione di un acquisto multiplo di prodotti non esistenti nel database sollevando l'errore opportuno;
        - **Utenti**
            - **Credito residuo**: la prima richiesta tenta di estrarre il credito residuo utilizzando un token errato sollevando l'errore opportuno.
            La seconda richiesta prova ad estrarre il credito residuo di un utente non esistente nel database (token riportato sopra con id_utente : 22) sollevando l'errore opportuno;
            - **Ricarica utente**: la prima richiesta tenta di effettuare la ricarica di un utente utilizzando il token di un utente *user* non autorizzato ad effettuare la richiesta, sollevando l'errore opportuno.
            La seconda richiesta prova ad effettuare la ricarica di un utente che ha una mail inesistente nel database sollevando l'errore opportuno;
            La terza richiesta prova ad effettuare la ricarica di un utente utilizzando un token non valido;
            - **Acquisti utente**: la prima richiesta tenta di ottenere la lista degli acquisti effettuati da un utente utilizzando un token non valido sollevando l'errore opportuno.
            La seconda richiesta è simile alla prima ma richiede la lista degli acquisti effettuati da un utente non presente nel database sollevando l'errore opportuno;
        - **Regali**
            - **Ottieni regalo**: la prima richiesta tenta di ottenere il regalo ricevuto da un utente avendo però nell'URL l'id di un utente inesistente nel database e sollevando l'errore opportuno. L'URL è: *localhost:8080/api/regali/ottieniRegalo/prova@prova.com/15/3*.
            La seconda richiesta è simile alla prima, ma nell'URL è presente l'ID di un prodotto inesistente nel database. L'URL è *localhost:8080/api/regali/ottieniRegalo/prova@prova.com/1/30*.
            L'ultima richiesta combina i due casi precedenti utilizzando un ID utente e un ID prodotto non esistenti nel database. 
