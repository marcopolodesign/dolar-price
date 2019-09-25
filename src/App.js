import React, { Component } from 'react';
import NavLinks from './data/menu'

let source = 'USD';
let target = 'ARS';
let initialPrice;
let result;
let intialPrice;
let inputValue;


const Nav = (props) => (
  <nav className="flex w-40">
    {NavLinks.map(item =>
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
      priceTag: "",
      isSmall: false,
      typeColor: "#000",
      userValue: 0,
      background: "",
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

          <Legend {...this.state} {...this.props}
            convertPeso={this.state.convertPeso}
          />

          <div className="calculator">
            <input type="number" id="dolar" pattern="[0-9]*" placeholder={`${source} por a convertir..`} onChange={this.calculateCurrency} />
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
    // event.target.classList.add('selected');
    var newSource = event.target.getAttribute('datacurrency');
    source = newSource
    this.setState({
      priceTag: initialPrice,
      background: newSource,
    })
    this.checkPrice(source, target)
  }




  calculateCurrency = (event) => {
    const isPeso = this.state.convertPeso
    console.log(isPeso)

    const userInput = event.target
    let inputValue = userInput.value;

    if (isPeso) {
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
        userValue: inputValue,
      });

    } else {
      result = parseFloat(result.toFixed(0)).toLocaleString();
      this.setState({
        isSmall: true,
        userValue: inputValue,
      });
    }

    this.setState(() => ({
      priceTag: result,
    }));
  }

  componentDidMount() {
    this.checkPrice(source, target);
  }

}

export default App;
