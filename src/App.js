import React, { Component } from 'react';

let source = 'USD';
let target = 'ARS';
let initialPrice = 0;
let result = "";
let intialPrice = "";
let inputValue = "";

const nav = [
  {
    children: "USD",
    key: 1,
  },
  {
    children: "EUR",
    class: "middle-a",
    key: 2,
  },
  {
    children: "GBP",
    key: 3,
  }
];


const Nav = (props) => (
  <nav className="flex w-40">
    {nav.map(item =>
      <p key={item.key} className={item.class} datacurrency={item.children}
        onClick={props.newCurrency}>
        {item.children}
      </p>
    )}
  </nav>
)

const Header = (props) => (
  <p className="convert" onClick={props.convertToPeso}>Convertir Pesos</p>
)


const Legend = (props) => (
  <p className={props.typeColor}>{props.convertPeso ? `${source} per ${target}` : `${target} per ${source}`}</p>
)

const Footer = () => (
  <p className="convert marco-polo">Hecho por <span><a href="/" target="_blank">Marco Polo</a></span>
  </p>
)

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      convertPeso: false,
      isLoaded: false,
      data: [],
      priceTag: "",
      isSmall: false,
      typeColor: "#000",
    }

    this.calculateCurrency = this.calculateCurrency.bind(this);
    this.checkPrice = this.checkPrice.bind(this);
    this.convertToPeso = this.convertToPeso.bind(this);
    this.newCurrency = this.newCurrency.bind(this);
  }

  render() {
    const { convertPeso, priceTag, isSmall, isLoading } = this.state
    return (
      <div className="page">
        <section className={convertPeso ? "convert-peso" : ""}>
          <Header convertToPeso={this.convertToPeso} />
          <Nav {...this.props} {...this.state} newCurrency={this.newCurrency} />

          <h1 className={isSmall ? "small-text" : undefined}>
            {isLoading ? '--.-' : priceTag}
          </h1>

          <Legend {...this.state} {...this.props} convertPeso={this.state.convertPeso} />

          <div className="calculator">
            <input type="number" id="dolar" pattern="[0-9]*" placeholder="USD a convertir.." onChange={this.calculateCurrency} />
          </div>

          <Footer />

        </section>

      </div>
    );
  }

  // Start Functions

  checkPrice = (source, target) => {
    fetch(`https://api.sandbox.transferwise.tech/v1/rates?source=${source}&target=${target}`, {
      headers: { Authorization: 'Bearer 610846c2-5ed3-41df-90da-77f6ef29e6d5' },
      data: {
        id: 86
      }
    },
      this.setState({
        isLoading: true,
      })
    )
      .then(response => response.json())
      .then(data => {
        initialPrice = data[0].rate;
        initialPrice = initialPrice.toFixed(2)

        this.setState((prevState, props) => ({
          ...prevState,
          priceTag: initialPrice,
          isLoading: false,
          isSmall: false,
        })
        );
      },
        (error) => { })
  }

  convertToPeso = () => {
    this.setState((prevState) => {
      return {
        convertPeso: !prevState.convertPeso,
        priceTag: initialPrice,
      }
    });
    result = inputValue / initialPrice
  }


  newCurrency = (event) => {
    console.log(event.target.getAttribute('datacurrency'));
    event.target.classList.add('selected');
    var newSource = event.target.getAttribute('datacurrency');
    source = newSource
    this.setState({
      priceTag: initialPrice,
    })
    this.checkPrice(source, target)
  }


  componentDidMount() {
    this.checkPrice(source, target);
  }

  calculateCurrency = (event) => {
    const convertPeso = this.convertPeso;

    const userInput = event.target
    let inputValue = userInput.value;

    if (convertPeso) {
      result = inputValue / initialPrice
      console.log("dividing")
    } else {
      result = inputValue * initialPrice
      console.log("multipliying")
    }

    if (result.toFixed(2).toString().length < 6) {
      result = result.toFixed(2);
      this.setState({
        isSmall: false,
      });

    } else {
      result = parseFloat(result.toFixed(0)).toLocaleString();
      this.setState({
        isSmall: true,
      });
    }

    this.setState((props) => ({
      priceTag: result,
    }));
  }

}

export default App;
