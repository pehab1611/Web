async function displayData(categoryId) {
    try {
        let response1 = await fetch(`/getProducts/${categoryId}`);
        d = await response1.json();
        data = d.data;

        let response2 = await fetch('../cart/getAll');
        c = await response2.json();
        cart = c.cart;
        console.log(cart);

        const products = document.getElementById('proizvodi');

        products.innerHTML = '';

        const zaglavlje = document.getElementById('zaglavlje');
        zaglavlje.innerHTML = '';
        const hZaglavlje = document.createElement('h1');
        hZaglavlje.innerHTML = data.name;
        zaglavlje.appendChild(hZaglavlje);
        
        let i = 0; 
        data.products.forEach(product => {
            let prodId = categoryId * 5 + i;
            // console.log(prodId);
            const productElement = document.createElement('div');
            productElement.classList.add('proizvod');

            const proizvodSlika = document.createElement('div');

            const kosarica = document.createElement('div');
            kosarica.classList.add('kosarica');
            kosarica.style.backgroundImage = `url('/images/kosarica_border.png')`;
            kosarica.addEventListener("click", function() {
                addItem(product.name, prodId);
            })
            proizvodSlika.appendChild(kosarica);

            proizvodSlika.classList.add('slika');
            proizvodSlika.style.backgroundImage = `url(${product.image})`;
            productElement.appendChild(proizvodSlika);
            
            //productNum 
            var productNum = -1;
            cart.forEach(prod => {
                if(prod.id == prodId) {
                    productNum = prod.productNum;
                }
            })

            const kruzic = document.createElement('div');
            kruzic.style.backgroundImage = `url('/images/splotch1.png')`;
            kruzic.id = product.name;
            kruzic.classList.add('numOfItems');
            if(productNum > 0) {
                kruzic.innerHTML = productNum.toString();
            } else {
                kruzic.style.opacity = 0;
            }
            proizvodSlika.appendChild(kruzic);
        
            const proizvodTekst = document.createElement('div');
            proizvodTekst.classList.add('tekst');
            proizvodTekst.textContent = product.name;
            productElement.appendChild(proizvodTekst);

            products.appendChild(productElement);

            i = i + 1;
        });

        const kosara = document.getElementById('kos');

        countAll(cart);
    } catch (err) {
        console.log(err);
    }
}

async function addItem(prodName, productId) {
    
    try {
        const response = await fetch(`../cart/add/${productId}`, {
            method: "POST"
        });
        if (response.ok) {
            console.log("Uspješno dodan u košaricu");
            console.log(productId);
            const num = document.getElementById(prodName);
            if(num.innerHTML == '') {
                num.innerHTML = 1;
                num.style.opacity = 1;
            } else {
                num.innerHTML = 1 + parseInt(num.innerHTML);
            }
            const kosarica = document.getElementById('kolicina');
            if(kosarica.innerHTML == '') {
                kosarica.innerHTML = 1;
                kosarica.style.opacity = 1;
            } else {
                kosarica.innerHTML = parseInt(kosarica.innerHTML) + 1;
            }
        } else {
            console.log("Došlo je do greške prilikom dodavanja u košaricu.")
        }
    } catch (err) {
        console.log(err);
    }
}

async function removeItem(prodName, productId) {
    try {
        const response = await fetch(`../cart/remove/${productId}`, {
            method: "POST"
        });
        if (response.ok) {
            console.log(productId);
            const num = document.getElementById(prodName);
            if(num.innerHTML == '1') {
                const delItem = document.getElementById(productId);
                delItem.remove();
            } else {
                num.innerHTML = parseInt(num.innerHTML) - 1;
            }
            const kosarica = document.getElementById('kolicina');
            if(kosarica.innerHTML == '1') {
                kosarica.innerHTML = '';
                kosarica.style.opacity = 0;
            } else {
                kosarica.innerHTML = parseInt(kosarica.innerHTML) - 1;
            }
        } else {
            console.log("Došlo je do greške prilikom brisanja iz košarice.")
        }
    } catch (err) {
        console.log(err);
    }
}

function countAll(cart) {
    var numOfProducts = 0;
    cart.forEach(prod => {
        numOfProducts = numOfProducts + prod.productNum;
        console.log(prod);
        console.log(prod.productNum);
    })
    console.log(numOfProducts);

    const kosarica = document.getElementById('kolicina');
    if(numOfProducts == 0) {
        kosarica.style.opacity = 0;
        kosarica.innerHTML = '';
        return;
    }
    kosarica.style.opacity = 1;
    kosarica.innerHTML = numOfProducts.toString();
}

async function openCart() {
    try {
        let response = await fetch('../cart/getAll');
        c = await response.json();
        cart = c.cart;

        const kosaricaElement = document.getElementById("kosarica");
        kosaricaElement.innerHTML = '';
    
        const header = document.createElement('div');
        header.classList.add('headerKosarica');
    
        const headerNaz = document.createElement('div');
        headerNaz.innerHTML = 'NAZIV PROIZVODA';
        header.appendChild(headerNaz);
    
        const headerKol = document.createElement('div');
        headerKol.innerHTML = 'KOLIČINA';
        header.appendChild(headerKol);
    
        kosaricaElement.appendChild(header);
    
        cart.forEach(prod => {
            const product = document.createElement('div');
            product.classList.add('item');
            product.setAttribute('id', prod.id);
    
            const productName = document.createElement('div');
            productName.innerHTML = prod.name;
            productName.classList.add('prodName');
            product.appendChild(productName);
            
            const minus = document.createElement('div');
            minus.style.backgroundImage = `url('images/minus.png')`;
            minus.classList.add('pm');
            minus.addEventListener('click', function() {
                removeItem(prod.name, prod.id);
            })
            product.appendChild(minus);
    
            const productValue = document.createElement('div');
            productValue.innerHTML = prod.productNum;
            productValue.classList.add('prodVal');
            productValue.setAttribute('id', prod.name);
            product.appendChild(productValue);
    
            const plus = document.createElement('div');
            plus.style.backgroundImage = `url('images/plus.png')`;
            plus.classList.add('pm');
            plus.addEventListener('click', function() {
                addItem(prod.name, prod.id);
            })
            product.appendChild(plus);
    
            kosaricaElement.appendChild(product);
        });
    
        countAll(cart);
    } catch (err) {
        console.log(err);
    }

}

function openCartPage() {
    window.location = 'http://localhost:3000/cart';
}

function navigateCategory(index) {
    window.location = 'home?category=' + index;
}

function displayInitialCategory() {
    let searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('category')) {
        displayData(searchParams.get('category'));
    } else {
        displayData(0);
    }
    countAll();
}