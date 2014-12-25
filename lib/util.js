"use strict"

var orderMatching = exports.orderMatching = function(books){
    var mapCopy = function(v){return v}
    var sortDesc = function(a,b){
        if(a.bestAsk() > b.bestAsk()){
            return 1;
        }
        else if(a.bestAsk() < b.bestAsk()){
            return -1;
        }
        else return 0;
    }
    var sortAsc = function(a,b){
        if(a.bestBid() > b.bestBid()){
            return -1;
        }
        else if(a.bestBid() < b.bestBid()){
            return 1;
        }
        else return 0;
    }
    var ask = books.map(mapCopy).sort(sortDesc)[0]
    var bid = books.map(mapCopy).sort(sortAsc)[0]

    var bestAsk = ask.bestAsk();
    var bestBid = bid.bestBid();

    var amount = Math.min(ask.countAskAmount(bestAsk), bid.countBidAmount(bestBid))
    var deal = {
        buy : {
            name : ask.name,
            price : bestAsk,
            amount : amount,
            isReverse : ask.isReverse,
            pair : ask.pair,
        },
        sell : {
            name : bid.name,
            price : bestBid,
            amount : amount,
            isReverse : bid.isReverse,
            pair : bid.pair,
        },
    }
    if(ask.name !== bid.name && bestAsk < bestBid){
        return {
            result : true,
            deal : deal,
        }
    }else{
        return {
            result : false,
            deal : deal,
        }
    }
}

