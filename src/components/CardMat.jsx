import { useEffect, useState } from "react";
import axios from "axios";
import Card from "./Card";
import "./CardMat.css";

const CardMat = () => {
  const [deck, setDeck] = useState(null);
  const [drawn, setDrawn] = useState([]);
  const [isShuffling, setIsShuffling] = useState(false);

  useEffect(function loadDeck() {
    async function fetchDeck() {
      const newDeck = await axios.get(
        "https://deckofcardsapi.com/api/deck/new/shuffle"
      );
      setDeck(newDeck.data);
    }
    fetchDeck();
  }, []);

  const drawCard = async () => {
    try {
      const drawResult = await axios.get(
        `https://deckofcardsapi.com/api/deck/${deck.deck_id}/draw`
      );
      if (drawResult.data.remaining === 0) throw new Error("Deck empty!");

      const card = drawResult.data.cards[0];
      setDrawn((c) => [
        ...c,
        {
          id: card.code,
          name: card.suit + " " + card.value,
          image: card.image,
        },
      ]);
    } catch (e) {
      alert(e);
    }
  };

  const shuffle = async () => {
    setIsShuffling(true);
    try {
      const newDeck = await axios.get(
        `https://deckofcardsapi.com/api/deck/new/shuffle`
      );
      setDeck(newDeck.data);
      setDrawn([]);
    } catch (e) {
      alert(e);
    } finally {
      setIsShuffling(false);
    }
  };

  return (
    <div className="CardMat">
      {deck && (
        <div className="CardMat-btn-div">
          <button onClick={drawCard} disabled={isShuffling}>
            Draw
          </button>

          <button onClick={shuffle} disabled={isShuffling}>
            Shuffle
          </button>
        </div>
      )}

      <div className="CardMat-card-div">
        {drawn.map((c) => (
          <Card key={c.id} name={c.name} image={c.image} />
        ))}
      </div>
    </div>
  );
};

export default CardMat;
