//type some code here....
import {
    Component,
    html,
    Tag,
  } from "https://cdn.jsdelivr.net/npm/componentforge@1.1.33";
  
  export default class Cart2 extends Component {
    constructor() {
      const _props = {
        cartItems: [],
        currentItem: null,
      };
      super(true, _props);
      this.state = {
        items: this.props.cartItems,
        grpItems: [],
      };
    }
  
    ComponentDidReceiedProps(propName, oldValue, newValue) {
      if (propName === "currentItem" && oldValue?._id !== newValue._id) {
        this.setState({ items: [...this.state.items, newValue] });
        setTimeout(() => {
          const result = Object.groupBy(this.state.items, ({ name }) => name);
          this.Log(result);
          this.setState({ grpItems: result });
        }, 100);
      }
    }
    
    removeItemByIndex(arr, index) {
      if (index >= 0 && index < arr.length) {
          arr.splice(index, 1);
      }
      return arr;
  }
  
    RemoveItem(id) {
      const index = this.state.items.findIndex((x) => x.id === id);
      const sliced = this.removeItemByIndex(this.state.items , index)
      const result = Object.groupBy(sliced, ({ name }) => name);
      this.setState({ items: sliced ,grpItems: result });
    }
  
    GetBill() {
      return Object.keys(this.state.grpItems).map((k) => {
        return html`<tr>
          <td>
          <img class="product-image" src="${this.state.grpItems[k][0].image_link}" />
          ${k}
          </td>
          <td>Qty ${this.state.grpItems[k].length}</td>
  
          <td text-align="left">
            Price $ ${this.state.grpItems[k][0].price}
            <button
              @click=${(e) => {
                e.preventDefault();
                this.RemoveItem(this.state.grpItems[k][0].id);
              }}
            >
              -
            </button>
          </td>
        </tr>`;
      });
    }
  
    GetTotal() {
      if (this.state.items.length === 0) return html``;
      const total = this.state.items.reduce((x, y) => x + parseFloat(y.price), 0);
  
      return html`<tr>
        <td>&nbsp;</td>
        <td>Total :</td>
        <td>$ ${total.toFixed(2)}</td>
      </tr>`;
    }
  
    Template() {
      return html`
        <div style="width:100%;text-align:center">
 <h1>Shopping cart with micro frontends </h1>
        </div>
        <h2>Items ${this.state.items.length}</h2>
        <hr />
        <table style="width:100%">
          ${this.GetBill()} ${this.GetTotal()}
        </table>
      `;
    }
  
    Style() {
      return html`
        <style>
          h2 {
            color: red;
          }
          td {
            border-bottom: 1px solid black;
            width: auto;
          }

          .product-image {
  width: 80px;
  height: 80px;
  max-height:80px;
  object-fit: cover;
  border-radius: 8px;
  margin-left: 15px; /* Adjusted margin for spacing */
  margin:3px;
}

        </style>
      `;
    }
  }
  
  Tag("cf-cart2", Cart2);
  