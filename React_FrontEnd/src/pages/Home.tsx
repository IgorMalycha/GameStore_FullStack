import React, {useContext, useEffect} from 'react';
import './Home.css';
import {Game} from "../types/Game";
import {UserContext} from "../context/UserContext";

const Home: React.FC = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('UserContext must be used within a UserContextProvider');
    }
    const {user} = context;

    const [topGames, setTopGames] = React.useState<Game[]>([]);
    const [specialOfferGame, setSpecialOfferGame] = React.useState<Game>();

    useEffect(() => {
        fetch('http://localhost:3001/api/games/topGames')
            .then((response) => response.json())
            .then((data) => {
                setTopGames(data);
            })
            .catch((err) => console.error(err));
    }, []);
    console.log(topGames);
    useEffect(() => {
        fetch('http://localhost:3001/api/games/specialOfferGame',{
            method: 'GET',
            credentials: 'include',
        })
            .then((response) => response.json())
            .then((data) => setSpecialOfferGame(data))
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
        <div className="home">
            <div className="top-games">
                <h2>Top 3 Best Selling Games</h2>
                <div className="top-games-cards">
                    {topGames.map((game) => (
                        <div key={game.id} className="top-game-card">
                            <img src={`/images/${game.image}`} alt={`TopGamesGame: ${game.name}`}/>
                            <h3>{game.name}</h3>
                            <p>{game.description}</p>
                            <p>Sold: {game.sold}</p>
                            <p>Price: {game.price} $</p>
                            {user && (
                                <button onClick={() => addToCart(game)}>Add to Cart</button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {specialOfferGame && (
                <div className="special-offer">
                    <h2>Special Offer</h2>
                    <div className="special-game-card">
                        <div className="special-game-info">
                            <h3>{specialOfferGame.name}</h3>
                            <p>{specialOfferGame.description}</p>
                            <p>Sold: {specialOfferGame.sold}</p>
                            <p>Price: {specialOfferGame.price} $</p>
                            {user && (
                                <button onClick={() => addToCart(specialOfferGame)}>Add to Cart</button>
                            )}
                        </div>
                        <div className="special-game-img">
                            <img src={`/images/${specialOfferGame.image}`}
                                 alt={`SpecialOfferGame: ${specialOfferGame.name}`}/>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
