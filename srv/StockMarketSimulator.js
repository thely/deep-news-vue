class StockMarket {
  constructor() {
    this.emojis = {
      smileys: 0,     // literal market speed
      nature: 0,      // user share adjustment speed
      places: 0,      // buyers
      objects: 0,     // sellers
      symbols: 0      // volatility
    };

    this.stocks = {};
    this.marketActive = false;
    this.intervalRunning = false;
    this.marketSpeed = 2000;
  }

  summarizeMarketState() {
    return {
      speed: 2 / ("smileys" in this.emojis && this.emojis.smileys > 0 ? this.emojis.smileys * 0.5 : 1) * 1000,
      sentiment: this.emojis.places - this.emojis.objects,
      volatility: this.emojis.symbols,
    }
  }

  reset() {
    this.emojis = {
      smileys: 0,
      nature: 0,
      places: 0,
      objects: 0,
      symbols: 0
    };
    this.stocks = {};
    this.marketSpeed = 2000;
  }

  emojiTotals(data, state, message) {
    let cat = data.category;

    for (let key of Object.keys(this.stocks)) {
      let total = 0;
      let msg = message;
      let pos = message.indexOf(key);

      while (pos > -1) {
        msg = msg.slice(pos + 1);
        pos = msg.indexOf(key);
        total++;
      }

      if (!(cat in this.stocks[key].emojis)) {
        this.stocks[key].emojis[cat] = 0;
      }

      this.stocks[key].emojis[cat] += state ? total : total * -1;

    }
    this.emojis[cat] += state ? 1 : -1;
  }

  changeUserShares(stock, amt) {
    this.stocks[stock].userShares.final += parseInt(amt);
  }

  addStock(name) {
    const points = this.stockBaseData();

    this.stocks[name] = {
      name: name,
      points: points,
      userShares: {
        current: 0,
        final: 0,
        rate: 0.5
      },
      emojis: {

      }
    };

    return name;
  }

  stockFlux(oldPrice = 10, volatility = 0.1, userShares = 0, influence = {}) {
    let buyers = Math.random() + ("places" in influence ? influence.places : 0);
    let sellers = Math.random() + ("objects" in influence ? influence.objects : 0);

    let difference = buyers - sellers; // degree of unmet need
    let average = Math.floor(((sellers + buyers) / 2) * 100); // general amount of traffic

    let highest = -1, lowest = 99999, sellPrice = parseFloat(oldPrice);
    let priceList = [];

    for (let i = 0; i < average; i++) {
      let newVol = volatility * Math.random() * 1.1;
      let diff = newVol * difference * ("symbols" in influence ? influence.symbols : 1);
      let newPrice = sellPrice + (sellPrice * diff) + userShares;

      priceList.push(newPrice);

      highest = newPrice > highest ? newPrice : highest;
      lowest = newPrice < lowest ? newPrice : lowest;
    }

    let averagePrice = priceList.reduce((a, b) => a + b, 0 ) / priceList.length;

    return {
      lowest: lowest.toFixed(4),
      highest: highest.toFixed(4),
      average: averagePrice.toFixed(4),
      close: parseFloat(priceList[priceList.length - 1]).toFixed(4)
    }
  }

  // generates the first 20 points of data for the chart
  stockBaseData() {
      let price = (Math.random() * 50) + 20;
      let points = [];
      for (let i = 0; i < 20; i++) {
        let priceObj = this.stockFlux(price, Math.random() * 0.2, 0);
        price = priceObj.close;
        points.push(priceObj);
      }

      return points;
  }

  // loop through all stocks for the next day
  addNextDay() {
    for (let key of Object.keys(this.stocks)) {
      const influence = this.stocks[key].emojis;
      let curr = this.stocks[key].userShares.current;
      let final = this.stocks[key].userShares.final;
      let rate = Math.abs(curr - final) / (10 - ("nature" in influence ? influence.nature : 0));
      // console.log(rate);

      this.stocks[key].userShares.current += (final - curr) * rate;

      let price = this.stocks[key].points.slice(-1);
      let priceObj = this.stockFlux(price.close, Math.random() * 0.2, this.stocks[key].userShares.current);

      this.stocks[key].points.shift();
      this.stocks[key].points.push(priceObj);
    }
  }

  // run the loop
  stockDayLoop(socketCallback) {
    if (this.intervalRunning) {
      console.log("interval already in progress");
      return;
    }

    let f = this;
    (function loop() {
      setTimeout(() => {
        f.intervalRunning = true;
        f.addNextDay();
        
        socketCallback(f.stocks, f.summarizeMarketState(), f.emojis);
  
        if (!f.marketActive) {
          f.intervalRunning = false;
          console.log("closed for trading");
          f.reset();
        } else {
          const time = 2 / ("smileys" in f.emojis && f.emojis.smileys > 0 ? f.emojis.smileys * 0.5 : 1);
          f.marketSpeed = time * 1000;
          loop();
        }
      }, f.marketSpeed);
    })();
  }

  // analyse messages from the chat for potential stock words
  analyseForStocks(msg) {
    const sLength = Object.keys(this.stocks).length;
    if (sLength > 7) return;
    
    msg = msg.replace(/[\p{P}$+<=>^`|~]/gu, '').replace(/\s+/g, " ");
    msg = msg.split(" ");
    
    const avgLen = Math.round(msg.map(m => m.length).reduce((a, b) => a + b) / msg.length);
    

    // for (let m of msg) {
    let iterations = 0;
    while (iterations < 50) {
      iterations++;
      const m = msg[Math.floor(Math.random() * msg.length)];
      if (m in this.stocks) {
        continue;
      }

      if (sLength == 0) {
        if (m.length >= avgLen) {
          return m;
        }
      } else {
        if (m.length >= avgLen && Math.random() > 0.2) {
          return m;
        } else if (m.length < avgLen && Math.random() > 0.8) {
          return m;
        }
      }
    }

    console.log("no new stocks to speak of");

    return false;
  }
}

export default StockMarket;