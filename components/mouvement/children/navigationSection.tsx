import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface DataLinks {
  name: string;
  nav: string;
}

interface Props {
  dataLinks: DataLinks[];
}

export default function NavigationSection({ dataLinks }: Props) {
  return (
    <div className="pt-4 lg:pt-10 w-full px-4 max-w-7xl mx-auto">
      <ul className="flex gap-4 lg:text-2xl">
        {dataLinks.map((item, index) => {
          return (
            <li key={index} className="flex items-center">
              <Link className="underline" href={item.nav}>
                {item.name}
              </Link>
              <ChevronRight />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
