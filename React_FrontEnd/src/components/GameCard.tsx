import React, {Context, useContext} from 'react';
import { Game } from '../types/Game';
import './GameCard.css';
import {UserContext} from "../context/UserContext";

interface GameCardProps {
    game: Game;
    addToCart: (game: Game) => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, addToCart }) => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('UserContext must be used within a UserContextProvider');
    }
    const { user } = context;
    return (
        <div className="games-card">
            <img src={`/images/${game.image}`} alt={`Game: ${game.name}`}/>
            <h3>{game.name}</h3>
            <p>{game.description}</p>
            <p>Publisher: {game.publisher}</p>
            <p>Price: {game.price} $</p>
            {user && <button onClick={() => addToCart(game)}>Add to Cart</button>}
        </div>

    );
};

export default GameCard;
