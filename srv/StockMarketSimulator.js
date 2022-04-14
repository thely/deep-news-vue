class StockMarket {
  constructor() {
    this.emojis = {
      smileys: 0,     // # of buyers
      nature: 0,      // # of sellers
      places: 0,      // degree of volatility
      activities: 0,  // user share adjustment speed
      objects: 0,     // literal market speed
      symbols: 0
    };

    this.stocks = {};
    this.marketActive = false;
    this.intervalRunning = false;
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
    let buyers = Math.random() + "smileys" in influence ? influence.smileys : 0;
    let sellers = Math.random() + "nature" in influence ? influence.nature : 0;

    let difference = buyers - sellers; // degree of unmet need
    let average = Math.floor(((sellers + buyers) / 2) * 100); // general amount of traffic

    let highest = -1, lowest = 99999, sellPrice = parseFloat(oldPrice);
    let priceList = [];

    for (let i = 0; i < average; i++) {
      let newVol = volatility * Math.random() * 1.1;
      let diff = 2 * newVol * difference;
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
      let rate = Math.abs(curr - final) / (20 - "places" in influence ? influence.places : 0);

      this.stocks[key].userShares.current += (final - curr) * rate;

      let price = this.stocks[key].points.slice(-1);
      let priceObj = this.stockFlux(price.close, Math.random() * 0.2, this.stocks[key].userShares.current, influence);

      this.stocks[key].points.shift();
      this.stocks[key].points.push(priceObj);
    }
  }

  // run the loop
  stockDayLoop(socketCallback) {
    // let intCount = 0;
    if (this.intervalRunning) {
      console.log("interval already in progress");
      console.log(this.interval);
      return;
    }

    const interval = setInterval(() => {
      this.intervalRunning = true;
      this.addNextDay();
      
      socketCallback(this.stocks);

      if (!this.marketActive) {
        this.intervalRunning = false;
        clearInterval(interval);
        console.log("closed for trading");
      }
    }, 2000);
  }

  // analyse messages from the chat for potential stock words
  analyseForStocks(msg) {
    msg = msg.replace(/[\p{P}$+<=>^`|~]/gu, '').replace(/\s+/g, " ");
    msg = msg.split(" ");
    
    const avgLen = Math.round(msg.map(m => m.length).reduce((a, b) => a + b) / msg.length);
    const sLength = Object.keys(this.stocks).length;

    // for (let m of msg) {
    let iterations = 0;
    while (iterations < 50) {
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

      iterations++;
    }

    return false;
  }
}

export default StockMarket;

// degree of volatility
// trend: up or down

// start with 1000 shares per stock
// each stock starts at $10, for a market cap of $10k
// each message can present one new word as a potential stock
// buy or sell stocks through the little popup
// trading will continue in the background based on emoji counts

// "points" are indicated by the current price vs
// the average of the last ten pips of data

// on every "tick," generate x number of sell orders at y fuzzy price
// generate x number of buy orders

// how many sellers, how many buyers, degree of volatility
// how many total shares, current trend


// stock words can go bankrupt, meaning they can no longer be used: enter the censor!