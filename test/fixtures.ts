interface LotteryItem {
  item: string;
  minPeople: number;
  price: number;
}

const now = Date.now();

export const lotteryItem: LotteryItem = {
  item: "https://sample.item.pl",
  minPeople: 100,
  price: 200,
};
