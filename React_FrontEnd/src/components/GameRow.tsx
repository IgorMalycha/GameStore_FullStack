import React, { useState } from 'react';
import './GameRow.css';

interface Game {
    id: number;
    name: string;
    publisher: string;
    price: number;
    description: string;
    added_at: string;
    image: string;
}

interface GameRowProps {
    game: Game;
    onDelete: (id: number) => void;
}

const GameRow: React.FC<GameRowProps> = ({ game, onDelete }) => {
    const formattedDate = new Date(game.added_at).toLocaleString('pl-PL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });

    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const togglePopup = () => {
        setIsPopupOpen(!isPopupOpen);
    };

    return (
        <div className="game-row-container">
            <div className="game-row">
                <h3>{game.name}</h3>
                <p>Publisher: {game.publisher}</p>
                <p>Price: {game.price} $</p>
                <div className="game-row-buttons">
                    <button onClick={togglePopup} className="details-button">Details</button>
                    <button onClick={() => onDelete(game.id)} className="delete-button">Delete</button>
                </div>
                {isPopupOpen && (
                    <div className="popup">
                        <div className="popup-content">
                            <h3>{game.name}</h3>
                            <img className='information-img' src={`/images/${game.image}`}
                                 alt={`TopGamesGame: ${game.name}`}/>
                            <p className='information-text'>{game.description}</p>
                            <p className='information-text'>Added on: {formattedDate}</p>
                            <button onClick={togglePopup} className="close-button">Close</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GameRow;
