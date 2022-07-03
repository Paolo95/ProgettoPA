// funzioni per manipolare la data 

class FunzioniTemporali{

    constructor(){}

    // ritorna una stringa con la data corrente
    getDataCorrente(){

        const oggi = new Date();
        const data = oggi.getFullYear() + "-" + (oggi.getMonth()+1) + "-" + oggi.getDate();
        
        return data;

    }
}

// esportazione delle funzioni
module.exports = FunzioniTemporali;
