import React, {useContext, useEffect, useState} from 'react';
import { Game } from '../types/Game';
import GameCard from '../components/GameCard';
import './Games.css';
import {UserContext} from "../context/UserContext";

const Games: React.FC = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('UserContext must be used within a UserContextProvider');
    }
    const {user} = context;

    const [games, setGames] = React.useState<Game[]>([]);

    useEffect(() => {
        fetch('http://localhost:3001/api/games', {
            method: 'GET',
                credentials: 'include',
        })
            .then((response) => response.json())
            .then((data) => setGames(data))
            .catch((err) => console.error(err));
    }, []);


    const addToCart = (game: Game) => {
        if (!user) {
            alert('You need to log in to add a game to the cart!');
            return;
        }

        fetch(`http://localhost:3001/api/cart/${user.id}/game/${game.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then((error) => {
                        throw new Error(error.error || 'Failed to add game to cart');
                    });
                }
                return response.json();
            })
            .then(() => {
                alert(`${game.name} added to cart!`);
            })
            .catch((err) => {
                alert(err.message);
            });
    };

    return (
        <div className="games-grid">
            {games.map((game) => (
                    <GameCard key={game.id} game={game} addToCart={addToCart}/>
            ))}
        </div>
    );
};

export default Games;
