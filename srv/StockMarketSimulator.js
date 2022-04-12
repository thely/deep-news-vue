class StockMarket {
  constructor() {
    this.emojis = {
      smileys: {
        total: 0,
        trend: 0,
        display: "S",
      },
      nature: {
        total: 0,
        trend: 0,
        display: "N",
      },
      places: {
        total: 0,
        trend: 0,
        display: "P",
      },
      activities: {
        total: 0,
        trend: 0,
        display: "A",
      },
      objects: {
        total: 0,
        trend: 0,
        display: "O",
      },
      symbols: {
        total: 0,
        trend: 0,
        display: "Y",
      }
    };

    this.stocks = {};
  }

  emojiTotals(data, state) {
    this.emojis[data.category].total += state ? 1 : -1;
  }

  addStock(name, points) {
    points = points == null ? [] : points;
    this.stocks[name] = {
      name: name,
      points: points,
    };
  }

  stockFlux(oldPrice = 10, volatility = 0.1) {
    let buyers = Math.random();
    let sellers = Math.random();

    let difference = buyers - sellers; // degree of unmet need
    // console.log("diff: " + difference);
    let average = Math.floor(((sellers + buyers) / 2) * 100); // general amount of traffic

    let highest = -1, lowest = 99999, sellPrice = parseFloat(oldPrice);
    let priceList = [];

    for (let i = 0; i < average; i++) {
      let newVol = volatility * Math.random() * 1.1;
      let diff = 2 * newVol * difference;
      let newPrice = sellPrice + (sellPrice * diff);

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

  stockBaseData() {
    for (let key of Object.keys(this.emojis)) {
      this.addStock(key);

      let price = (Math.random() * 50) + 20;
      let points = [];
      for (let i = 0; i < 20; i++) {
        let priceObj = this.stockFlux(price, Math.random() * 0.2);
        price = priceObj.close;
        points.push(priceObj);
      }

      this.stocks[key].points = points;
      console.log(points);
    }
    return this.stocks;
  }

  addNextDay() {
    for (let key of Object.keys(this.stocks)) {
      // console.log(this.stocks[key]);
      let price = this.stocks[key].points[this.stocks[key].points.length - 1];
      // console.log("price: ");
      // console.log(price);
      let priceObj = this.stockFlux(price.close, Math.random() * 0.2);
      // console.log("priceObj: ");
      // console.log(priceObj);

      this.stocks[key].points.shift();
      this.stocks[key].points.push(priceObj);
    }

    // console.log(this.stocks["smileys"].points);
  }

  stockDayLoop(socketCallback) {
    let intCount = 0;
    const interval = setInterval(() => {
      this.addNextDay();
      
      socketCallback(this.stocks);
      intCount++;

      if (intCount > 1000) {
        clearInterval(interval);
      }
    }, 2000);
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