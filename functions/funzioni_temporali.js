// funzioni per manipolare la data 

// ritorna una stringa con la data corrente
function getDataCorrente(){

    const oggi = new Date();
    const data = oggi.getFullYear() + "-" + (oggi.getMonth()+1) + "-" + oggi.getDate();
    
    return data;

}

// esportazione delle funzioni
module.exports = getDataCorrente;
