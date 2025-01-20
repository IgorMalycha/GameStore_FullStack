import React, {FormEvent, useContext, useEffect, useState} from 'react';
import { Game } from '../types/Game';
import GameCardEdit from '../components/GameCardEdit';
import './EditGames.css';
import axios from 'axios';
import {UserContext} from "../context/UserContext";

const EditGames: React.FC = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('UserContext must be used within a UserContextProvider');
    }
    const { user } = context;

    const [games, setGames] = useState<Game[]>([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [popupMode, setPopupMode] = useState<'add' | 'edit'>('add');
    const [editingGame, setEditingGame] = useState<Game | null>(null);

    const [name, setName] = useState('');
    const [publisher, setPublisher] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [isSpecialOffer, setIsSpecialOffer] = useState(false);

    const [nameError, setNameError] = useState('');
    const [publisherError, setPublisherError] = useState('');
    const [priceError, setPriceError] = useState('');
    const [descriptionError, setDescriptionError] = useState('');
    const [imageError, setImageError] = useState('');

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) {
            setError('You must be logged in to view your cart.');
            return;
        }
        axios
            .get('http://localhost:3001/api/games', { withCredentials: true })
            .then((response) => setGames(response.data))
            .catch((err) => console.error(err));
    }, [games]);

    const validateForm = (): boolean => {

        let isError = false;
        if (name.length < 3 || name.length > 100) {
            setNameError('Name must be between 3-100 characters long');
            isError = true;
        }
        if (publisher.length < 3 || publisher.length > 100) {
            setPublisherError('Publisher must be between 3-100 characters long');
            isError = true;
        }
        if (!price || isNaN(Number(price)) || Number(price) <= 0) {
            setPriceError('Price must be a valid positive number');
            isError = true;
        }
        if (description.length < 3 || description.length > 100) {
            setDescriptionError('Description must be between 3-100 characters long');
            isError = true;
        }
        if (image.length < 3 || image.length > 100) {
            setImageError('Image url must be between 3-100 characters long');
            isError = true;
        }

        return !isError;
    };

    const handleFormSubmit = (e: FormEvent) => {
        if (!user) {
            setError('You must be logged in to view your cart.');
            return;
        }
        e.preventDefault();
        setNameError('');
        setPublisherError('');
        setPriceError('');
        setDescriptionError('');
        setImageError('');

        if (!validateForm()) return;

        const gameData = { name, publisher, price: parseFloat(price), description, image, isSpecialOffer: isSpecialOffer ? 1 : 0 };

        if (popupMode === 'edit' && editingGame) {
            axios
                .put(`http://localhost:3001/api/games/${editingGame.id}`, gameData, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true
                })
                .then((response) => {
                    setGames((prev) =>
                        prev.map((game) => (game.id === editingGame.id ? response.data : game))
                    );
                    closePopup();
                })
                .catch((err) => console.error(err));
        } else {
            axios
                .post('http://localhost:3001/api/games', gameData, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true
                })
                .then((response) => {
                    setGames((prev) => [...prev, response.data]);
                    closePopup();
                })
                .catch((err) => console.error(err));
        }
    };

    const resetForm = () => {
        setName('');
        setPublisher('');
        setPrice('');
        setDescription('');
        setImage('');
        setIsSpecialOffer(false);
        setEditingGame(null);
        setNameError('');
        setPublisherError('');
        setPriceError('');
        setDescriptionError('');
        setImageError('');

    };

    const closePopup = () => {
        resetForm();
        setIsPopupOpen(false);
    };

    const openAddPopup = () => {
        resetForm();
        setPopupMode('add');
        setIsPopupOpen(true);
    };

    const openEditPopup = (game: Game) => {
        setEditingGame(game);
        setName(game.name);
        setPublisher(game.publisher);
        setPrice(game.price.toString());
        setDescription(game.description);
        setImage(game.image);
        setIsSpecialOffer(game.is_special_offer);
        setPopupMode('edit');
        setIsPopupOpen(true);
    };

    const handleDelete = (gameId: number) => {
        if (!user) {
            setError('You must be logged in to view your cart.');
            return;
        }
        console.log(gameId);
        axios
            .delete(`http://localhost:3001/api/games/${gameId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            })
            .then(() => setGames((prev) => prev.filter((game) => game.id !== gameId)))
            .catch((err) => console.error(err));
    };

    if (error) {
        return <p className="error">{error}</p>;
    }

    return (
        <div className="edit-games-container">
            <h2>Manage Games</h2>
            <button onClick={openAddPopup} className="add-game-button">Add Game</button>
            <div className="games-list">
                <h3>Games List</h3>
                {games.map((game) => (
                    <GameCardEdit
                        key={game.id}
                        game={game}
                        onEdit={openEditPopup}
                        onDelete={handleDelete}
                    />
                ))}
            </div>

            {isPopupOpen && (
                <div className="popup">
                    <div className="popup-content">
                        <h3>{popupMode === 'edit' ? 'Edit Game' : 'Add Game'}</h3>
                        <form onSubmit={handleFormSubmit}>
                            <label>Name:</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <p className="error">{nameError}</p>

                            <label>Publisher:</label>
                            <input
                                type="text"
                                value={publisher}
                                onChange={(e) => setPublisher(e.target.value)}
                            />
                            <p className="error">{publisherError}</p>

                            <label>Price:</label>
                            <input
                                type="text"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                            <p className="error">{priceError}</p>

                            <label>Description:</label>
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            ></input>
                            <p className="error">{descriptionError}</p>

                            <label>Image file name:</label>
                            <input
                                type="text"
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                            />
                            <p className="error">{imageError}</p>

                            <label>Is special offer:</label>
                            <input
                                type="checkbox"
                                checked={isSpecialOffer}
                                onChange={(e) => setIsSpecialOffer(e.target.checked)}
                            />

                            <button type="submit">{popupMode === 'edit' ? 'Save Changes' : 'Add Game'}</button>
                            <button type="button" onClick={closePopup}>Cancel</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditGames;
