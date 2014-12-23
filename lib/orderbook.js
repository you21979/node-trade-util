"use strict"

var OrderBook = module.exports = function(pair){
    this.pair = pair;
    // price baseamount counteramount
    this.asks = []
    this.bids = []
}

OrderBook.prototype.addBidPriceAmount = function(price, amount){
    this.bids.push([price, amount, price * amount]);
}

OrderBook.prototype.addAskPriceAmount = function(price, amount){
    this.asks.push([price, amount, price * amount]);
}

OrderBook.prototype.addBidAmount = function(baseamount, counteramount){
    this.bids.push([counteramount/baseamount, baseamount, counteramount]);
}

OrderBook.prototype.addAskAmount = function(baseamount, counteramount){
    this.asks.push([counteramount/baseamount, baseamount, counteramount]);
}

OrderBook.prototype.reverse = function(){
    var ob = new OrderBook(this.pair.split('_').reverse().join('_'));
    this.asks.forEach(function(v){ ob.addBidPriceAmount(1/v[0], v[2], v[1]); });
    this.bids.forEach(function(v){ ob.addAskPriceAmount(1/v[0], v[2], v[1]); });
    return ob;
}

OrderBook.prototype.normalize = function(digit){
    var bidprice = function(v, digit){
        var n = Math.pow(10, digit);
        return Math.floor(v * n) / n;
    }
    var askprice = function(v, digit){
        var n = Math.pow(10, digit);
        return Math.ceil(v * n) / n;
    }
    var sortDesc = function(a,b){
        if(a[0] > b[0]) return -1;
        else if(a[0] < b[0]) return 1;
        else return 0;
    }
    var sortAsc = function(a,b){
        if(a[0] > b[0]) return 1;
        else if(a[0] < b[0]) return -1;
        else return 0;
    }
    var reduceMerge = function(){
        return function(r,v){
            var k = v[0].toString();
            if(!(k in r)) r[k] = [0, 0];
            r[k][0] += v[1]
            r[k][1] += v[2]
            return r
        }
    }
    var toArray = function(o){
        return Object.keys(o).map(function(k){
            return [parseFloat(k), o[k][0], o[k][1]];
        })
    }
    var ob = new OrderBook(this.pair);

    toArray(this.bids.
        map(function(v){ return [bidprice(v[0], digit), v[1], v[0]] }).
        reduce(reduceMerge(), {})
    ).
    sort(sortDesc).
    forEach(function(v){
        ob.addBidPriceAmount(v[0], v[1], v[2]);
    });

    toArray(this.asks.
        map(function(v){ return [askprice(v[0], digit), v[1], v[0]] }).
        reduce(reduceMerge(), {})
    ).sort(sortAsc).
    forEach(function(v){
        ob.addAskPriceAmount(v[0], v[1], v[2]);
    })
    return ob;
}
