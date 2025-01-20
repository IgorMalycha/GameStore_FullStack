import React from 'react';
import { Game } from '../types/Game';
import './GameCardEdit.css';

interface GameCardEditProps {
    game: Game;
    onEdit: (game: Game) => void;
    onDelete: (gameId: number) => void;
}

const GameCardEdit: React.FC<GameCardEditProps> = ({ game, onEdit, onDelete }) => {
    return (
        <div className="game-item">
            <h4>{game.name}</h4>
            <p>Publisher: {game.publisher}</p>
            <p>Price: ${game.price}</p>
            <div className="game-actions">
                <button onClick={() => onEdit(game)} className="edit-button">Edit</button>
                <button onClick={() => onDelete(game.id)} className="delete-button">Delete</button>
            </div>
        </div>
    );
};

export default GameCardEdit;
