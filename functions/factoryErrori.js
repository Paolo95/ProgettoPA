class Errore {
    speak() {
     return "Hi, I'm a " + this.tipoErrore + " employee";
    }
}

class ErroreBadRequest extends Errore{
    constructor({tipo_errore, messaggio}) {
        super();
        this.tipoErrore = tipo_errore;
        return [400, messaggio];
    }
}

class ErroreUnauthorized extends Errore{
    constructor({tipo_errore, messaggio}) {
        super();
        this.tipoErrore = tipo_errore;
        return [401, messaggio];    
    }
}

class ErroreNotFound extends Errore{
    constructor({tipo_errore, messaggio}) {
        super();
        this.tipoErrore = tipo_errore;
        return [404, messaggio];
    }
}

class ErroreInternalServerError extends Errore{
    constructor({tipo_errore, messaggio}) {
        super();
        this.tipoErrore = tipo_errore;
        return [500, messaggio];
    }
}

class FactoryErrore {
    creaErrore(data) {
        if(data.tipoErrore == 'Bad Request') return new ErroreBadRequest(data); //400
        if(data.tipoErrore == 'Unauthorized') return new ErroreUnauthorized(data); //401
        if(data.tipoErrore == 'Not Found') return new ErroreNotFound(data); // 404
        if(data.tipoErrore == 'Internal Server Error') return ErroreInternalServerError(data); //500
    }
}

module.exports = FactoryErrore;