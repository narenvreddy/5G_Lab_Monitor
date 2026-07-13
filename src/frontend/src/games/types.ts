export interface GameProps {
  difficulty: number; // 0=easy, 1=medium, 2=hard
  onGameOver: (score: number) => void;
}
