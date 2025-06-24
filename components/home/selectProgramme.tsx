import { CalendarDays, ChevronDown } from "lucide-react";

const data = [
  {
    heure: " 06:00 - 07:30",
    messe: "Messe du matin",
  },
  {
    heure: " 06:00 - 07:30",
    messe: "Confession",
  },
  {
    heure: " 06:00 - 07:30",
    messe: "Messe du matin",
  },
  {
    heure: " 06:00 - 07:30",
    messe: "Messe du matin",
  },
];

export default function SelectProgramme() {
  return (
    <section className="relative bg-white  w-full px-4 max-w-7xl mx-auto">
      <div>
        {/* calandar group */}
        <div className="w-fit mx-auto bg-blue-900 text-white p-5 rounded-xl flex gap-4">
          <div className="flex items-center">
            <CalendarDays className="w-10 h-10  sm:w-16 sm:h-16" />
          </div>
          {/* millieu */}
          <div>
            <h3 className="mb-6 text-xl md:text-2xl">Selectionner une date</h3>
            <h4 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl">22 avril 2025</h4>
          </div>

          <div className="bg-red-900 px-4 sm:px-8 rounded-xl flex justify-center items-center">
            <ChevronDown />
          </div>
        </div>
        {/* footer */}
        <div>
          <h3 className="text-2xl md:text-3xl lg:text-4xl py-10 text-blue-900 text-center">{`Mardi dans l'octave de Pâques`}</h3>
          <div className="grid justify-center grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {data.map((item, index) => {
              return (
                <div
                  key={index}
                  className="px-4 border-red-800 bg-blue-50 w-fit border-t-8"
                >
                  <div className="py-8 sm:py-14">
                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-blue-900">
                      {item.heure}
                    </h3>
                    <div className="bg-blue-950 mx-auto my-6 h-[1px]" />
                    <h4 className="text-xl sm:text-2xl">{item.messe}</h4>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
