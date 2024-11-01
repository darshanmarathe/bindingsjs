import { Component, html, Tag } from 'https://cdn.jsdelivr.net/npm/componentforge@1.1.33';


export default class List extends Component {

    async ComponentDidMount() {
        const watches = await this.get(this.props.url)
        console.log(watches)
        this.setState({ watches })
     
    }

    Template() {
        if (this.state.watches) {
            return html`
            <ul class="shopping-cart">
              ${this.state.watches.map(t => {
                return html`
                <li class="cart-item">
    <div class="product-details">
      <h3 class="product-name">${t.name}</h3>
      <p class="product-price">${t.brand}</p>
      <p class="product-price">$${t.price}</p>
      <div class="quantity-control">
        <button class="add-to-cart">Add to Cart</button>
      </div>
    </div>
   <img src="${t.image_link}" alt="${t.name}" @click=${() => {
                        this.fireEvent('watch-selected', 'watch', t)
                    }} class="product-image">
  </li>`
            })}
            </ul>
            `
        }
        return html`
        Loading from ${this.props.url}
        `
    }

    Style() {
        return html`<style>
      .shopping-cart {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.cart-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ccc;
}

.product-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  margin-left: 15px; /* Adjusted margin for spacing */
  cursor: pointer;
}

.product-details {
  flex: 1;
}

.product-name {
  margin: 0;
  font-size: 1.2em;
}

.product-price {
  margin: 5px 0;
  color: #666;
}

.quantity-control {
  display: flex;
  align-items: center;
}

.quantity-control button {
  background-color: #ddd;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}

.quantity-control input {
  width: 40px;
  text-align: center;
  border: 1px solid #ccc;
  margin: 0 5px;
}

.add-to-cart {
  background-color: #e67e22;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}


      .add-to-cart:hover {
  background-color: #d35400;
}  
        </style>`
    }
}


Tag('cf-watches', List)




