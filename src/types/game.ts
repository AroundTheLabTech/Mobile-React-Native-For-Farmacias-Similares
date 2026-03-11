export type TGameSession = {
  uid: string
  numberGame: number
  score: number
}

export type TGameCatalogItem = {
  id: string;
  title: string;
  description: string;
  gameUrl: string;
  imageUrl: string;
  scorePerGame: number;
  order: number;
  isActive: boolean;
};

export type TGameCatalogResponse = {
  games: TGameCatalogItem[];
};
