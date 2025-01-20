import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';
import GameRow from '../components/GameRow';
import './Cart.css';

interface Game {
    id: number;
    name: string;
    publisher: string;
    price: number;
    description: string;
    added_at: string;
    image: string;
}

const Cart: React.FC = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('UserContext must be used within a UserContextProvider');
    }
    const { user, fetchUser, loading } = context;

    const [cartItems, setCartItems] = useState<Game[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) {
            setError('You must be logged in to view your cart.');
            return;
        }
        fetch(`http://localhost:3001/api/cart/${user.id}`,{
            method: 'GET',
            credentials: 'include',
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then((err) => {
                        throw new Error(err.error);
                    });
                }
                return response.json();
            })
            .then((data) => {
                setCartItems(data);
                console.log(data);
                setError(null);
            })
            .catch((err) => {
                console.error('Error fetching cart:', err);
                setError(err.message);
            });
    }, [user]);

    async function handleDelete(gameId: number) {
        if (!user) {
            setError('You must be logged in to view your cart.');
            return;
        }
        await fetch(`http://localhost:3001/api/cart/${user.id}/game/${gameId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        })
            .then((res) => {
                if (res.ok) {
                    setCartItems(cartItems.filter((item) => item.id !== gameId));
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    if (error) {

        if(!user){
            return <p className="error">Musisz być zalogowanym by zoabczyć swój koszyk</p>
        }else {
            return <p className="error">Nie ma na razie żadnych produktów w koszyku</p>
        }

    }

    return (
        <div className="cart-container">
            <h2>Your Cart</h2>
            {cartItems.map((item) => (
                <GameRow key={item.id} game={item} onDelete={handleDelete}/>
            ))}
            <div className="make-order">
                <button>Buy</button>
            </div>
        </div>
    );
};

export default Cart;
