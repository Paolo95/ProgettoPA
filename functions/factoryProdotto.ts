/**
 * The Creator class declares the factory method that is supposed to return an
 * object of a Product class. The Creator's subclasses usually provide the
 * implementation of this method.
 */
 abstract class Creator {
    /**
     * Note that the Creator may also provide some default implementation of the
     * factory method.
     */
    public abstract factoryMethod(): Product;

    /**
     * Also note that, despite its name, the Creator's primary responsibility is
     * not creating products. Usually, it contains some core business logic that
     * relies on Product objects, returned by the factory method. Subclasses can
     * indirectly change that business logic by overriding the factory method
     * and returning a different type of product from it.
     */
    public someOperation(): string {
        // Call the factory method to create a Product object.
        const product = this.factoryMethod();
        // Now, use the product.
        return `Creator: The same creator's code has just worked with ${product.operation()}`;
    }
}

/**
 * Concrete Creators override the factory method in order to change the
 * resulting product's type.
 */
class ConcreteCreator1 extends Creator {
    /**
     * Note that the signature of the method still uses the abstract product
     * type, even though the concrete product is actually returned from the
     * method. This way the Creator can stay independent of concrete product
     * classes.
     */
    public factoryMethod(): Product {
        return new ProdottoAudio();
    }
}

class ConcreteCreator2 extends Creator {
    public factoryMethod(): Product {
        return new ProdottoVideo();
    }
}

/**
 * The Product interface declares the operations that all concrete products must
 * implement.
 */
interface Product {
    creaProdotto(): string;
}

/**
 * Concrete Products provide various implementations of the Product interface.
 */
class ProdottoAudio implements Product {
    public creaProdotto(): string {
        return '{Result of the ConcreteProduct1}';
    }
}

class ProdottoVideo implements Product {
    public creaProdotto(): string {
        return '{Result of the ConcreteProduct2}';
    }
}

/**
 * The client code works with an instance of a concrete creator, albeit through
 * its base interface. As long as the client keeps working with the creator via
 * the base interface, you can pass it any creator's subclass.
 */
function clientCode(creator: Creator) {
    // ...
    console.log('Client: I\'m not aware of the creator\'s class, but it still works.');
    console.log(creator.someOperation());
    // ...
}

/**
 * The Application picks a creator's type depending on the configuration or
 * environment.
 */
console.log('App: Launched with the ConcreteCreator1.');
clientCode(new ConcreteCreator1());
console.log('');

console.log('App: Launched with the ConcreteCreator2.');
clientCode(new ConcreteCreator2());


/*
//FACTORY DESIGN PATTERN
    async getProdotto(){
        var Factory = function () {
            this.elementoCarrello = function (tipoProdotto) {
                var factoryProdotto;
        
                if (tipoProdotto === "acquisto_audio") {
                    factoryProdotto = new prodottoAudio();
                } else if (tipoProdotto === "acquisto_video") {
                    factoryProdotto = new prodottoVideo();
                }
        
                factoryProdotto.tipoProdotto = tipoProdotto;
        
                return factoryProdotto;
            }
        }
        
        var prodottoAudio = function () {
            //businesslogic
        };
        
        var prodottoVideo = function () {
            //businesslogic;
        };
                
        function run() {
        
            var carrelloAcquisto = [];
            var factory = new Factory();
        
            carrelloAcquisto.push(factory.elementoCarrello("acquisto_audio"));
            carrelloAcquisto.push(factory.elementoCarrello("acquisto_video"));
                    
            for (var i = 0, len = employees.length; i < len; i++) {
                employees[i].say();
            }
        }
    }
    
*/