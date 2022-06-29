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
        if(data.tipoErrore == 'Bad Request') return new ErroreBadRequest(data); //400
        if(data.tipoErrore == 'Unauthorized') return new ErroreUnauthorized(data); //401
        if(data.tipoErrore == 'Not Found') return new ErroreNotFound(data); // 404
        if(data.tipoErrore == 'Internal Server Error') return ErroreInternalServerError(data); //500
    }
}

module.exports = FactoryErrore;