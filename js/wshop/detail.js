import {Component , html , Tag} from 'https://cdn.jsdelivr.net/npm/componentforge@1.1.33';


export default class Detail extends Component{


constructor(){
    const  _props ={
        watch: null,
        url: ""
    };
    super(true , _props);
    this.state = {
        watch: this.props.watch
    };

    
}

async ComponentDidMount() {
    if(!this.props.watch){
    const watch = await this.get(this.props.url)
    console.log(watch)
    this.setState({ watch })
    }
}

ComponentDidReceiedProps(propName, oldValue, newValue){
    if(propName === 'watch'){
        this.setState({watch : newValue})
    }
}

    Template(){
if (!this.state.watch) {
    return html`<div<Loading.... </div>`
}
        return html`
             <div class="product-card">
    <div class="product-image">
      <img src="${this.state.watch.image_link}" alt="${this.state.watch.name}">
    </div>
    <div class="product-details">
      <h2 class="product-name">${this.state.watch.name}</h2>
      <h3 class="product-brand">${this.state.watch.brand}</h3>
      <p class="product-description">This is a brief description of the product. It highlights the key features and benefits of the product.</p>
      <p class="product-price">$${this.state.watch.price}</p>
      <button class="add-to-cart" @click=${() => {
                        this.fireEvent('add-to-cart', 'watch', this.state.watch)
                    }}>Add to Cart</button>
    </div>
  </div>
            `
    }

    Style(){
        return html`
        <style>
           

.product-card {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 100%;
  text-align: center;
}

.product-image img {
  width: 80%;
  height: auto;
}

.product-details {
  padding: 20px;
}

.product-name {
  font-size: 1.5em;
  margin: 10px 0;
  color: #333;
}

.product-description {
  font-size: 1em;
  color: #777;
  margin: 10px 0;
}

.product-price {
  font-size: 1.3em;
  color: #e67e22;
  margin: 10px 0;
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


        </style>
        `
    }

}

Tag("cf-detail" , Detail)

    