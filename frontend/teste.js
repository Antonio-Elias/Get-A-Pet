function sum(a,b){
    return console.log(a + b);
}

function subtract(a , b){
    return a - b;
}

function calculator(fn){
    return function( a, b){
        fn( a, b );
        return function(b,c){
            return subtract(b,c)
        }
    }
}

console.log( calculator(sum)( 5, 2)(2,2));