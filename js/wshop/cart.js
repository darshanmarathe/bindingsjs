import { Component, html, Tag } from 'https://cdn.jsdelivr.net/npm/componentforge@1.1.33';


export default class Cart extends Component {


    constructor() {
        const _props = {
           newWatch : null
        };
        super(true, _props);
        this.state = {
            items: [],
            total : 0.00
        };
    }

    ComponentDidReceiedProps(propName, oldValue, newValue){

        if (propName == 'newWatch' && oldValue?._id !== newValue._id) {
            const tempItems = [...this.state.items , newValue];
            const price = tempItems.reduce((acc ,obj) => acc + +obj.price , 0)
            console.log(tempItems, price)
            this.setState({items : tempItems , total: price})
        }
    }

    Template() {

        return html`
  <div class="cart">
    <h2>Shopping Cart</h2>
    ${this.state.items.map((i) => {
        return html`
        <div class="cart-item">
      <p class="item-name">${i.name}</p>
      <p class="item-name">${i.brand}</p>
      <p class="item-price">$${i.price}</p>
    </div>
        
        `
    })}
    <div class="total">
      <p>Total: $${+this.state.total.toFixed(2)}</p>
    </div>
    <button class="checkout-btn" @click=${() => alert('opps you cant buy this watches yet')}>Checkout</button>
  </div>
            `
    }

    Style() {
        return html`
        <style>
          
.cart {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 95%;
  text-align: center;
}

h2 {
  font-size: 1.5em;
  margin-bottom: 20px;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  border-bottom:1px solid black;
}

.item-name {
  font-size: 1.1em;
}

.item-price {
  color: #888;
}

.total {
  font-size: 1.2em;
  margin-top: 20px;
}

.checkout-btn {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
  transition: background-color 0.3s;
}

.checkout-btn:hover {
  background-color: #45a049;
}

        </style>
        `
    }

}

Tag("cf-cart", Cart)

