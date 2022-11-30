interface LotteryItem {
  item: string;
  minPeople: number;
  price: number;
  finishDate: number;
}

export const lotteryItem: LotteryItem = {
  item: "https://sample.item.pl",
  minPeople: 100,
  price: 200,
  finishDate: 123,
};
