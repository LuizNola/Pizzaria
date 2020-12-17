let modalQt = 1
let cart = []
let modalKey = 0

const q = el => document.querySelector(el)
const qa = el => document.querySelectorAll(el)


//listagem das pizzas
pizzaJson.map((item, index) => {
    let pizza = q('.models .pizza-item').cloneNode(true)
    pizza.setAttribute('data-key', index)

    pizza.querySelector('.pizza-item--img img').src = item.img
    pizza.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`
    pizza.querySelector('.pizza-item--name').innerHTML = item.name
    pizza.querySelector('.pizza-item--desc').innerHTML = item.description

    pizza.querySelector('a').addEventListener('click', (e) => {
        modalQt = 1

        e.preventDefault()
        let key = e.target.closest('.pizza-item').getAttribute('data-key')
        modalKey = key

        q('.pizzaWindowArea').style.opacity = 0
        q('.pizzaWindowArea').style.display = 'flex'


        q('.pizzaBig img').src = pizzaJson[key].img
        q('.pizzaInfo--desc').innerHTML = pizzaJson[key].description
        q('.pizzaInfo h1').innerHTML = pizzaJson[key].name
        q('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`
        q('.pizzaInfo--size.selected').classList.remove('selected')


        qa(".pizzaInfo--size").forEach((size, sizeIndex) => {
            if (sizeIndex == 2) {
                size.classList.add('selected')
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex]
        })

        q('.pizzaInfo--qt').innerHTML = modalQt

        setTimeout(() => { q('.pizzaWindowArea').style.opacity = 1 }, 200)
    })

    q('.pizza-area').append(pizza)
})


//modal

function exitModal() {

    q('.pizzaWindowArea').style.opacity = 0
    setTimeout(() => { q('.pizzaWindowArea').style.display = 'none' }, 200)
}

function addQt() {
    modalQt += 1
    q('.pizzaInfo--qt').innerHTML = modalQt
}

function removeQt() {
    if (modalQt > 1) {
        modalQt -= 1
    }
    q('.pizzaInfo--qt').innerHTML = modalQt
}

qa('.pizzaInfo--size').forEach((size, index) => {
    size.addEventListener('click', (e) => {
        q('.pizzaInfo--size.selected').classList.remove('selected')

        size.classList.add('selected')
    })
})



//cart
q('.pizzaInfo--addButton').addEventListener('click', () => {
    let size = q('.pizzaInfo--size.selected').getAttribute('data-key')

    let identity = pizzaJson[modalKey].id + '@' + size

    let key = cart.findIndex(item => item.identity == identity)

    if (key > -1) {
        cart[key].qtd += modalQt
    } else {
        cart.push({
            identity,
            id: pizzaJson[modalKey].id,
            name: pizzaJson[modalKey].name,
            qtd: modalQt,
            size,
            price: (pizzaJson[modalKey].price * modalQt).toFixed(2)
        })
    }

    console.log(cart)
    updateCart()
    exitModal()
})

q('.menu-openner').addEventListener('click', () => {
    if(cart.length > 0){
        q('aside').style.left = '0';
    }
})
q('.menu-closer').addEventListener('click', () => {
    
        q('aside').style.left = '100vw';
    
})


function updateCart() {
    q('.menu-openner span').innerHTML = cart.length

    if (cart.length > 0) {
        q('aside').classList.add('show')
        q('.cart').innerHTML = ''

        let subtotal = 0
        let desconto = 0
        let total = 0;

        for (let i in cart) {
            let pizzaItem = pizzaJson.find(item => item.id == cart[i].id)

            subtotal += pizzaItem.price * cart[i].qtd

            let cartItem = q('.models .cart--item').cloneNode(true)

            let pizzaSizeItem;

            switch (cart[i].size) {
                case '0':
                    pizzaSizeItem = 'P'
                    break;

                case '1':
                    pizzaSizeItem = 'M'
                    break;

                case '2':
                    pizzaSizeItem = 'G'
                    break;

                default:
                    break;
            }

            let pizzaName = `${pizzaItem.name} (${pizzaSizeItem})`
            cartItem.querySelector('img').src = pizzaItem.img
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qtd
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click',( )=>{
                
                if( cart[i].qtd > 1){
                    cart[i].qtd--
                }else{
                    cart.splice(i,1)
                }
                updateCart()
            })
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click',( )=>{
                cart[i].qtd++
                updateCart()
            })

            q('.cart').append(cartItem)

            console.log(pizzaItem)
        }

        desconto = subtotal * 0.1
        total = subtotal - desconto

        q('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`
        q('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`
        q('.total.big span:last-child').innerHTML = `R$ ${total.toFixed(2)}`
    } else {
        q('aside').classList.remove('show')
        q('aside').style.left = '100vw';
    }
}