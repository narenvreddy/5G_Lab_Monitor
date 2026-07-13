import { r as reactExports, j as jsxRuntimeExports } from "./index-zTtK-yRg.js";
function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}
const ALL_PAIRS = [
  ["1/2", "2/4"],
  ["1/3", "2/6"],
  ["2/3", "4/6"],
  ["3/4", "6/8"],
  ["1/4", "2/8"],
  ["1/5", "2/10"],
  ["3/5", "6/10"],
  ["2/5", "4/10"]
];
function buildCards(difficulty) {
  const numPairs = difficulty === 0 ? 4 : difficulty === 1 ? 6 : 8;
  const rawCards = ALL_PAIRS.slice(0, numPairs).flatMap(
    (pair, pairId) => pair.map(
      (label) => ({
        id: 0,
        label,
        pairId,
        flipped: false,
        matched: false
      })
    )
  );
  return shuffle(rawCards).map((c, i) => ({ ...c, id: i }));
}
function FractionMatch({ difficulty, onGameOver }) {
  const [cards, setCards] = reactExports.useState(() => buildCards(difficulty));
  const [selected, setSelected] = reactExports.useState([]);
  const [flips, setFlips] = reactExports.useState(0);
  const [locked, setLocked] = reactExports.useState(false);
  const [score, setScore] = reactExports.useState(0);
  const numPairs = difficulty === 0 ? 4 : difficulty === 1 ? 6 : 8;
  const found = cards.filter((c) => c.matched).length / 2;
  const cols = 4;
  reactExports.useEffect(() => {
    if (found === numPairs && found > 0) {
      const finalScore = Math.max(10, 200 - (flips - numPairs * 2) * 5);
      setScore(finalScore);
      setTimeout(() => onGameOver(finalScore), 600);
    }
  }, [found, numPairs, flips, onGameOver]);
  const handleFlip = (id) => {
    if (locked) return;
    const card = cards.find((c) => c.id === id);
    if (!card || card.flipped || card.matched || selected.length >= 2) return;
    const newCards = cards.map(
      (c) => c.id === id ? { ...c, flipped: true } : c
    );
    const newSelected = [...selected, id];
    setCards(newCards);
    setFlips((f) => f + 1);
    if (newSelected.length === 2) {
      setLocked(true);
      const [cardA, cardB] = newSelected.map(
        (sid) => newCards.find((c) => c.id === sid)
      );
      if (cardA.pairId === cardB.pairId) {
        setTimeout(() => {
          setCards(
            (prev) => prev.map(
              (c) => newSelected.includes(c.id) ? { ...c, matched: true } : c
            )
          );
          setSelected([]);
          setLocked(false);
        }, 500);
      } else {
        setTimeout(() => {
          setCards(
            (prev) => prev.map(
              (c) => newSelected.includes(c.id) ? { ...c, flipped: false } : c
            )
          );
          setSelected([]);
          setLocked(false);
        }, 1e3);
      }
    } else {
      setSelected(newSelected);
    }
  };
  const PAIR_COLORS = [
    "#5B4FCF",
    "#FF6B35",
    "#00C9A7",
    "#EF476F",
    "#FFD166",
    "#6B6B8A",
    "#1A1A2E",
    "#a78bfa"
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center p-4 gap-4 pt-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between w-full max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-black text-xl text-[#5B4FCF]", children: [
        "Found: ",
        found,
        "/",
        numPairs
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-black text-xl text-[#FF6B35]", children: [
        "Flips: ",
        flips
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-[#6B6B8A]", children: "Match equivalent fractions!" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "grid gap-2 w-full max-w-sm",
        style: { gridTemplateColumns: `repeat(${cols}, 1fr)` },
        children: cards.map((card, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            "data-ocid": `game.answer.item.${i + 1}`,
            className: `aspect-square rounded-2xl font-black text-lg shadow-md transition-all active:scale-95 flex items-center justify-center ${card.matched ? "opacity-50 cursor-default" : card.flipped ? "scale-105 shadow-lg" : "hover:scale-105"}`,
            style: {
              backgroundColor: card.flipped || card.matched ? PAIR_COLORS[card.pairId % PAIR_COLORS.length] : "#1A1A2E",
              color: "white",
              minHeight: 72
            },
            onClick: () => handleFlip(card.id),
            disabled: card.matched || locked,
            children: card.flipped || card.matched ? card.label : "❓"
          },
          card.id
        ))
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-[#6B6B8A]", children: score > 0 ? `Score: ${score}` : "Flip cards to find matching fractions" })
  ] });
}
export {
  FractionMatch
};
