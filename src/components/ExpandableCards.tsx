import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export interface ICards {
  description: string;
  id: string;
  title: string;
  src: string;
  ctaText: string;
  ctaLink: string;
  content: () => JSX.Element;
}

export function ExpandableCards({ cards }: { cards: ICards[] }) {
  return (
    <ul className="mx-auto w-full gap-4">
      {cards.map((card) => (
        <div
          key={`card-${card.id}`}
          className="p-4 flex flex-row justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer"
        >
          <div className="flex gap-4 flex-row ">
            <div>
              <img
                width={70}
                height={100}
                // src={card.src}
                src="image-thumb.svg"
                alt=""
                className="h-16 w-12 md:h-20 md:w-16 rounded-lg object-cover object-top"
              />
            </div>
            <div>
              <p className="font-light text-xs md:text-lg text-neutral-800 dark:text-neutral-200 text-left">
                {card.title}
              </p>

              <p className="font-light text-xs md:text-lg text-neutral-600 dark:text-neutral-400 text-left">
                {card.description}
              </p>
              <span>
                <Badge variant="outline">Invoice</Badge>
                <Badge variant="outline">Tax</Badge>
                <Badge variant="outline">2024</Badge>
              </span>
            </div>
          </div>
          <Button variant={"outline"}>{card.ctaText}</Button>
        </div>
      ))}
    </ul>
  );
}
