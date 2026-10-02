import { useState } from 'react';
import axios from 'axios';
import './App.css';

const products = [
    {
        id: 1,
        name: 'Play Station 5',
        price: 5000000,
        icon: '🎮'
    },
    {
        id: 2,
        name: 'Televisor Smart TV FULL HD 4K',
        price: 1300000,
        icon: '📺'
    },
    {
        id: 3,
        name: 'GTA VI',
        price: 480000,
        icon: '🎮'
    },
    {
        id: 4,
        name: 'iPhone 17 Promax',
        price: 4200000,
        icon: '📱'
    },
    {
        id: 5,
        name: 'MacBook Air',
        price: 5200000,
        icon: '💻'
    },
    {
        id: 6,
        name: 'Audífonos inalámbricos',
        price: 350000,
        icon: '🎧'
    },
    {
        id: 7,
        name: 'Apple Watch',
        price: 1800000,
        icon: '⌚'
    },
    {
        id: 8,
        name: 'Control inalámbrico',
        price: 280000,
        icon: '🕹️'
    }
];

function App() {
    const [cart, setCart] = useState([]);
    const [showCheckout, setShowCheckout] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [payer, setPayer] = useState({
        name: '',
        surname: '',
        documentType: 'CC',
        document: '',
        email: '',
        mobile: ''
    });

    const addToCart = (product) => {
        const existingProduct = cart.find(
            (item) => item.id === product.id
        );

        if (existingProduct) {
            setCart(
                cart.map((item) =>
                    item.id === product.id
                        ? {
                            ...item,
                            quantity: item.quantity + 1
                        }
                        : item
                )
            );
        } else {
            setCart([
                ...cart,
                {
                    ...product,
                    quantity: 1
                }
            ]);
        }
    };

    const increaseQuantity = (productId) => {
        setCart(
            cart.map((item) =>
                item.id === productId
                    ? {
                        ...item,
                        quantity: item.quantity + 1
                    }
                    : item
            )
        );
    };

    const decreaseQuantity = (productId) => {
        setCart(
            cart.map((item) =>
                item.id === productId && item.quantity > 1
                    ? {
                        ...item,
                        quantity: item.quantity - 1
                    }
                    : item
            )
        );
    };

    const removeFromCart = (productId) => {
        setCart(
            cart.filter((item) => item.id !== productId)
        );
    };

    const handlePayerChange = (event) => {
        const { name, value } = event.target;

        setPayer({
            ...payer,
            [name]: value
        });
    };

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const continueToCheckout = () => {
        if (cart.length === 0) {
            return;
        }

        setError('');
        setShowCheckout(true);
    };

    const backToCart = () => {
        setShowCheckout(false);
        setError('');
    };

    const handlePayment = async () => {
        setError('');

        if (
            !payer.name ||
            !payer.surname ||
            !payer.document ||
            !payer.email ||
            !payer.mobile
        ) {
            setError('Por favor completa todos los campos.');
            return;
        }

        if (cart.length === 0) {
            setError('El carrito está vacío.');
            return;
        }

        try {
            setLoading(true);

            console.log('Datos enviados al backend:', {
                payer,
                items: cart
            });

            const response = await axios.post(
                'http://localhost:3000/api/payment',
                {
                    payer,
                    items: cart
                }
            );

            console.log('Respuesta del backend:', response.data);

            window.location.href = response.data.processUrl;

        } catch (error) {
            console.error('Error al crear la sesión de pago:', error);

            console.error(
                'Respuesta del backend:',
                error.response?.data
            );

            setError(
                error.response?.data?.error ||
                'No fue posible crear la sesión de pago.'
            );

            setLoading(false);
        }
    };

    return (
        <div className="app">

            <header className="header">

                <div>
                    <h1>Tienda De Miguel</h1>

                    <p>
                        Para conseguir un buen empleo!
                    </p>
                </div>

                <div className="cart-counter">
                    🛒{' '}
                    {cart.reduce(
                        (sum, item) => sum + item.quantity,
                        0
                    )}
                </div>

            </header>

            {!showCheckout ? (

                <main className="main">

                    <section className="products-section">

                        <h2>Productos</h2>

                        <div className="products-grid">

                            {products.map((product) => (

                                <div
                                    className="product-card"
                                    key={product.id}
                                >

                                    <div className="product-image">
                                        {product.icon}
                                    </div>

                                    <h3>
                                        {product.name}
                                    </h3>

                                    <p className="price">
                                        $
                                        {product.price.toLocaleString(
                                            'es-CO'
                                        )}{' '}
                                        COP
                                    </p>

                                    <button
                                        className="primary-button"
                                        onClick={() =>
                                            addToCart(product)
                                        }
                                    >
                                        Agregar al carrito
                                    </button>

                                </div>

                            ))}

                        </div>

                    </section>

                    <aside className="cart-section">

                        <h2>Tu carrito</h2>

                        {cart.length === 0 ? (

                            <div className="empty-cart">

                                <div className="empty-icon">
                                    🛒
                                </div>

                                <p>
                                    Tu carrito está vacío
                                </p>

                                <span>
                                    Agrega productos para continuar
                                </span>

                            </div>

                        ) : (

                            <>

                                <div className="cart-items">

                                    {cart.map((item) => (

                                        <div
                                            className="cart-item"
                                            key={item.id}
                                        >

                                            <div className="cart-item-info">

                                                <h3>
                                                    {item.name}
                                                </h3>

                                                <p>
                                                    $
                                                    {item.price.toLocaleString(
                                                        'es-CO'
                                                    )}{' '}
                                                    COP
                                                </p>

                                            </div>

                                            <div className="quantity-controls">

                                                <button
                                                    onClick={() =>
                                                        decreaseQuantity(
                                                            item.id
                                                        )
                                                    }
                                                >
                                                    -
                                                </button>

                                                <span>
                                                    {item.quantity}
                                                </span>

                                                <button
                                                    onClick={() =>
                                                        increaseQuantity(
                                                            item.id
                                                        )
                                                    }
                                                >
                                                    +
                                                </button>

                                            </div>

                                            <div className="item-subtotal">

                                                $
                                                {(
                                                    item.price *
                                                    item.quantity
                                                ).toLocaleString(
                                                    'es-CO'
                                                )}{' '}
                                                COP

                                            </div>

                                            <button
                                                className="remove-button"
                                                onClick={() =>
                                                    removeFromCart(
                                                        item.id
                                                    )
                                                }
                                            >
                                                Eliminar
                                            </button>

                                        </div>

                                    ))}

                                </div>

                                <div className="cart-total">

                                    <span>
                                        Total
                                    </span>

                                    <strong>
                                        $
                                        {total.toLocaleString(
                                            'es-CO'
                                        )}{' '}
                                        COP
                                    </strong>

                                </div>

                                <button
                                    className="checkout-button"
                                    onClick={
                                        continueToCheckout
                                    }
                                >
                                    Continuar con la compra
                                </button>

                            </>

                        )}

                    </aside>

                </main>

            ) : (

                <main className="checkout-container">

                    <section className="checkout-card">

                        <button
                            className="back-button"
                            onClick={backToCart}
                        >
                            ← Volver al carrito
                        </button>

                        <h2>
                            Datos del comprador
                        </h2>

                        <p className="checkout-description">
                            Ingresa tus datos para continuar
                            con el pago.
                        </p>

                        <form>

                            <div className="form-row">

                                <div className="form-group">

                                    <label>
                                        Nombre
                                    </label>

                                    <input
                                        type="text"
                                        name="name"
                                        value={payer.name}
                                        onChange={
                                            handlePayerChange
                                        }
                                        placeholder="Tu nombre"
                                    />

                                </div>

                                <div className="form-group">

                                    <label>
                                        Apellido
                                    </label>

                                    <input
                                        type="text"
                                        name="surname"
                                        value={payer.surname}
                                        onChange={
                                            handlePayerChange
                                        }
                                        placeholder="Tu apellido"
                                    />

                                </div>

                            </div>

                            <div className="form-row">

                                <div className="form-group">

                                    <label>
                                        Tipo de documento
                                    </label>

                                    <select
                                        name="documentType"
                                        value={
                                            payer.documentType
                                        }
                                        onChange={
                                            handlePayerChange
                                        }
                                    >

                                        <option value="CC">
                                            Cédula de ciudadanía
                                        </option>

                                        <option value="CE">
                                            Cédula de extranjería
                                        </option>

                                        <option value="NIT">
                                            NIT
                                        </option>

                                        <option value="PP">
                                            Pasaporte
                                        </option>

                                    </select>

                                </div>

                                <div className="form-group">

                                    <label>
                                        Documento
                                    </label>

                                    <input
                                        type="text"
                                        name="document"
                                        value={
                                            payer.document
                                        }
                                        onChange={
                                            handlePayerChange
                                        }
                                        placeholder="Número de documento"
                                    />

                                </div>

                            </div>

                            <div className="form-group">

                                <label>
                                    Correo electrónico
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={payer.email}
                                    onChange={
                                        handlePayerChange
                                    }
                                    placeholder="correo@ejemplo.com"
                                />

                            </div>

                            <div className="form-group">

                                <label>
                                    Teléfono
                                </label>

                                <input
                                    type="tel"
                                    name="mobile"
                                    value={payer.mobile}
                                    onChange={
                                        handlePayerChange
                                    }
                                    placeholder="+573000000000"
                                />

                            </div>

                            {error && (
                                <p className="error-message">
                                    {error}
                                </p>
                            )}

                            <div className="checkout-summary">

                                <span>
                                    Total a pagar
                                </span>

                                <strong>
                                    $
                                    {total.toLocaleString(
                                        'es-CO'
                                    )}{' '}
                                    COP
                                </strong>

                            </div>

                            <button
                                type="button"
                                className="checkout-button"
                                onClick={handlePayment}
                                disabled={loading}
                            >
                                {loading
                                    ? 'Creando sesión...'
                                    : 'Continuar al pago'}
                            </button>

                        </form>

                    </section>

                </main>

            )}

        </div>
    );
}

export default App;