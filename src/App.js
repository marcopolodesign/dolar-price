import React, {Component} from 'react';
import NavLinks from './data/menu';

let source = 'USD';
let target = 'ARS';
let initialPrice;
let result;
let intialPrice;
let inputValue;

const Nav = props => (
  <nav className="flex w-40">
    {NavLinks.map(item => (
      <p
        key={item.key}
        className={item.class}
        symbol={item.symbol}
        datacurrency={item.children}
        onClick={props.newCurrency}
      >
        {item.children}
      </p>
    ))}
  </nav>
);

const Header = props => (
  <p className="convert" onClick={props.convertToPeso}>
    Convertir {props.currency}
  </p>
);

const Calculator = props => (
  <div className="calculator">
    <input
      type="number"
      id="dolar"
      pattern="[0-9]*"
      placeholder={`${source} a convertir..`}
      onChange={props.calculateCurrency}
    />
  </div>
);

const Legend = props => (
  <p className={props.typeColor}>
    {props.convertPeso
      ? `${source} per ${props.userValue}  ${target}`
      : `${target} per ${props.userValue}  ${source}`}
  </p>
);

const BackgroundImage = props => <h1 className="symbol">{props.currencySymbol}</h1>;

const Footer = () => (
  <p className="convert marco-polo">
    Hecho por{' '}
    <span>
      <a href="http://marcopolo.agency" target="_blank">
        Marco Polo
      </a>
    </span>
  </p>
);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      convertPeso: false,
      priceTag: '',
      isSmall: false,
      typeColor: '#000',
      userValue: 1,
      background: 'USD',
      currency: 'Pesos',
      currencySymbol: '$'
    };
    this.calculateCurrency = this.calculateCurrency.bind(this);
    this.checkPrice = this.checkPrice.bind(this);
    this.convertToPeso = this.convertToPeso.bind(this);
    this.newCurrency = this.newCurrency.bind(this);
  }

  render() {
    const {convertPeso, priceTag, isSmall, isLoading, background} = this.state;
    return (
      <div className="page">
        <section
          className={convertPeso ? `convert-peso${'-' + background}` : `convert-${background}`}
        >
          <Header
            convertToPeso={this.convertToPeso}
            {...this.props}
            {...this.state}
            currency={this.state.currency}
          />
          <Nav {...this.props} {...this.state} newCurrency={this.newCurrency} />

          <h1 className={isSmall ? 'small-text' : undefined}>{isLoading ? '--.-' : priceTag}</h1>

          <Legend {...this.state} {...this.props} convertPeso={this.state.convertPeso} />

          <Calculator calculateCurrency={this.calculateCurrency} />
          <Footer />
          <BackgroundImage {...this.state} />
        </section>
      </div>
    );
  }

  // Start Functions

  checkPrice = (source, target) => {
    fetch(
      `https://api.sandbox.transferwise.tech/v1/rates?source=${source}&target=${target}`,
      {
        headers: {Authorization: 'Bearer 610846c2-5ed3-41df-90da-77f6ef29e6d5'},
        data: {
          id: 86
        }
      },
      this.setState({
        isLoading: true
      })
    )
      .then(response => response.json())
      .then(
        data => {
          initialPrice = data[0].rate;
          initialPrice = initialPrice.toFixed(2);

          this.setState((prevState, props) => ({
            ...prevState,
            priceTag: initialPrice,
            isLoading: false,
            isSmall: false
          }));
        },
        error => {}
      );
  };

  convertToPeso = () => {
    this.setState(prevState => {
      return {
        convertPeso: !prevState.convertPeso,
        priceTag: initialPrice,
        currency: 'Pesos',
        userValue: 1
      };
    });
    result = inputValue / initialPrice;
  };

  newCurrency = event => {
    var newSource = event.target.getAttribute('datacurrency');
    source = newSource;

    var newSymbol = event.target.getAttribute('symbol');

    this.setState(prevState => {
      if (prevState.convertPeso) {
        return {
          currency: newSource,
          background: newSource,
          userValue: 1,
          currencySymbol: newSymbol
        };
      }
      return {
        priceTag: 1 / initialPrice,
        background: newSource,
        userValue: 1,
        currencySymbol: newSymbol
      };
    });

    this.checkPrice(source, target);
  };

  calculateCurrency = event => {
    const isPeso = this.state.convertPeso;
    const userInput = event.target;
    let inputValue = userInput.value;

    if (isPeso) {
      result = inputValue / initialPrice;
    } else {
      result = inputValue * initialPrice;
    }

    if (result.toFixed(2).toString().length < 6) {
      result = result.toFixed(2);
      this.setState({
        isSmall: false,
        userValue: inputValue
      });
    } else {
      result = parseFloat(result.toFixed(0)).toLocaleString();
      this.setState({
        isSmall: true,
        userValue: inputValue
      });
    }

    this.setState(() => ({
      priceTag: result
    }));
  };

  componentDidMount() {
    this.checkPrice(source, target);

    // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
    let vh = window.innerHeight * 0.01;
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
}

export default App;
