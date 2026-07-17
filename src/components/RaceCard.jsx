import { ScrollText } from 'lucide-react';

const RACE_IMAGES = {
  Human: 'https://media.base44.com/images/public/6a4af4087166276674b33cf8/60b567b66_generated_image.png',
  Elf: 'https://media.base44.com/images/public/6a4af4087166276674b33cf8/e17d3e614_generated_image.png',
  Dwarf: 'https://media.base44.com/images/public/6a4af4087166276674b33cf8/3ff1195df_generated_image.png',
  Halfling: 'https://media.base44.com/images/public/6a4af4087166276674b33cf8/7052f1e8d_generated_image.png',
  'Half-Elf': 'https://media.base44.com/images/public/6a4af4087166276674b33cf8/b1dd09698_generated_image.png',
  Gnome: 'https://media.base44.com/images/public/6a4af4087166276674b33cf8/df3aed205_generated_image.png',
  'Half-Orc': 'https://media.base44.com/images/public/6a4af4087166276674b33cf8/708be4cfe_generated_image.png',
};

export default function RaceCard({ race, data, selected, onClick }) {
  const image = RACE_IMAGES[race];
  return (
    <button
      onClick={onClick}
      className={`group relative overflow-hidden rounded-lg border-2 text-left transition-all flex flex-col ${
        selected
          ? 'border-amber-400 shadow-[0_0_18px_hsl(38_70%_50%_/_0.45)]'
          : 'border-amber-800/35 hover:border-amber-600/55'
      }`}
    >
      {/* Portrait */}
      <div className="relative h-28 sm:h-32 overflow-hidden bg-gradient-to-br from-stone-800 to-stone-950">
        {image ? (
          <img
            src={image}
            alt={race}
            className="w-full h-full object-cover object-top opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ScrollText className="w-7 h-7 text-amber-600/30" strokeWidth={1} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent" />
        {selected && (
          <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
            <svg className="w-3 h-3 text-amber-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>
      {/* Info */}
      <div className="p-2 bg-gradient-to-b from-stone-900/85 to-stone-950/95 flex-1">
        <p className="font-heading font-700 text-xs sm:text-sm text-amber-50 mb-0.5">{race}</p>
        <p className="text-[9px] sm:text-[10px] text-amber-100/45 font-body leading-relaxed line-clamp-2 mb-1.5">{data.description}</p>
        {Object.keys(data.abilityAdjustments).length > 0 && (
          <div className="flex gap-1 flex-wrap">
            {Object.entries(data.abilityAdjustments).map(([ab, mod]) => (
              <span
                key={ab}
                className={`text-[8px] font-heading tracking-wide px-1.5 py-0.5 rounded-full border ${
                  mod > 0
                    ? 'bg-emerald-900/40 text-emerald-400 border-emerald-700/30'
                    : 'bg-red-950/50 text-red-400 border-red-700/30'
                }`}
              >
                {ab.toUpperCase()} {mod > 0 ? '+' : ''}{mod}
              </span>
            ))}
          </div>
        )}
      </div>
    </button>
  );
}