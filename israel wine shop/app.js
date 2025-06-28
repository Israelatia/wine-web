let listProductHTML = document.querySelector('.listProduct');
let listCartHTML = document.querySelector('.listcart');
let iconCart = document.querySelector('.icon-cart');
let body = document.querySelector('body');
let closeCart = document.querySelector('.close');
let cartSpan = document.querySelector('.icon-cart span');

let products = [];
let cart = [];

iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
    addCartToHTML();
});

closeCart.addEventListener('click', () => {
    body.classList.remove('showCart');
});

const getProductsFromHTML = () => {
    document.querySelectorAll('.listProduct .item').forEach(itemElement => {
        let name = itemElement.querySelector('h2').innerText;
        let priceElement = itemElement.querySelector('.price'); 
        let price = priceElement ? parseFloat(priceElement.innerText.replace('$', '')) : 0; 
        let image = itemElement.querySelector('img').getAttribute('src');
        let id = name.replace(/\s+/g, '-').toLowerCase(); 

        products.push({
            id: id,
            name: name,
            price: price,
            image: image
        });
    });
};

listProductHTML.addEventListener('click', (event) => {
    if (event.target.classList.contains('addcart')) {
        let parentItem = event.target.closest('.item');
        let productId = parentItem.querySelector('h2').innerText.replace(/\s+/g, '-').toLowerCase(); 
        addToCart(productId);
    }
});

const addToCart = (productId) => {
    let positionThisProductInCart = cart.findIndex((value) => value.productId == productId);

    if (positionThisProductInCart < 0) {
        let productData = products.find(product => product.id === productId);
        if (productData) {
            cart.push({
                productId: productId,
                name: productData.name,
                price: productData.price,
                image: productData.image,
                quantity: 1
            });
        }
    } else {
        cart[positionThisProductInCart].quantity = cart[positionThisProductInCart].quantity + 1;
    }
    addCartToHTML();
    addCartToMemory();
};

const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    let totalPrice = 0;

    if (cart.length > 0) {
        cart.forEach(item => {
            totalQuantity = totalQuantity + item.quantity;
            totalPrice = totalPrice + (item.price * item.quantity);

            let newDiv = document.createElement('div');
            newDiv.classList.add('cart-item');
            newDiv.dataset.id = item.productId;

            newDiv.innerHTML = `
                <div class="image">
                    <img src="${item.image}" alt="${item.name}" />
                </div>
                <div class="details">
                    <div class="name">${item.name}</div>
                    <div class="quantity">
                        <span class="minus">-</span>
                        <span>${item.quantity}</span>
                        <span class="plus">+</span>
                    </div>
                    <div class="totalprice">$${(item.price * item.quantity).toFixed(2)}</div>
                </div>
            `;
            listCartHTML.appendChild(newDiv);
        });
    }

    cartSpan.innerText = totalQuantity;
    document.querySelector('.CartTab .Checkout').innerText = `Checkout ($${totalPrice.toFixed(2)})`;
};

const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
};

listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('minus') || positionClick.classList.contains('plus')) {
        let productId = positionClick.closest('.cart-item').dataset.id;
        let type = 'minus';
        if (positionClick.classList.contains('plus')) {
            type = 'plus';
        }
        changeQuantity(productId, type);
    }
});

const changeQuantity = (productId, type) => {
    let positionItemInCart = cart.findIndex((value) => value.productId == productId);

    if (positionItemInCart >= 0) {
        switch (type) {
            case 'plus':
                cart[positionItemInCart].quantity = cart[positionItemInCart].quantity + 1;
                break;
            default:
                let valueChange = cart[positionItemInCart].quantity - 1;
                if (valueChange > 0) {
                    cart[positionItemInCart].quantity = valueChange;
                } else {
                    cart.splice(positionItemInCart, 1);
                }
                break;
        }
    }
    addCartToHTML();
    addCartToMemory();
};

const initApp = () => {
    getProductsFromHTML(); 
    if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart')); 
        addCartToHTML(); 
    }
};

initApp();

document.querySelector('.Checkout').addEventListener('click', () => {
    let totalPrice = 0;

    cart.forEach(item => {
        totalPrice += item.price * item.quantity;
    });

    alert(`Thank you for your purchase!\nTotal: $${totalPrice.toFixed(2)}`);

    cart = [];
    addCartToHTML();
    addCartToMemory();
    body.classList.remove('showCart'); 
});

const managerBtn = document.getElementById('managerBtn');
const managerPanel = document.getElementById('managerPanel');
const closeManager = document.getElementById('closeManager');
const addWineBtn = document.getElementById('addWineBtn');

managerBtn.addEventListener('click', () => {
  managerPanel.style.display = 'block';
});

closeManager.addEventListener('click', () => {
  managerPanel.style.display = 'none';
});

addWineBtn.addEventListener('click', () => {
  const name = document.getElementById('wineName').value;
  const desc = document.getElementById('wineDesc').value;
  const price = parseFloat(document.getElementById('winePrice').value);
  const image = document.getElementById('wineImage').value;

  if (name && desc && price && image) {
    const id = name.replace(/\s+/g, '-').toLowerCase();

    const newWine = {
      id,
      name,
      price,
      image
    };
    products.push(newWine); 

    const itemHTML = `
      <div class="item">
        <img src="${image}" alt="${name}" />
        <h2>${name}</h2>
        <p>${desc}</p>
        <div class="price">$${price}</div>
        <button class="addcart">Add to Cart</button>
      </div>
    `;
    listProductHTML.insertAdjacentHTML('beforeend', itemHTML);

    document.getElementById('wineName').value = '';
    document.getElementById('wineDesc').value = '';
    document.getElementById('winePrice').value = '';
    document.getElementById('wineImage').value = '';
    managerPanel.style.display = 'none';
  } else {
    alert('Please fill all fields!');
  }
});
