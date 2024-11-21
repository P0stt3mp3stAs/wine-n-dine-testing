import Bar from "@/components/Bar";
import ChampagneCard from '@/components/ChampagneCard';
import { query } from '@/lib/db';

export default async function Home() {
  const champagnes = await query('SELECT name, description, price FROM champagnes');

  return (
    <main>
      hello worls
      {/* <Bar/> */}
      ...........................e
      <div className="grid gap-4">
        {champagnes.map((champagne: { name: string; description: string; price: string }, index: number) => (
          <ChampagneCard
            key={index}
            name={champagne.name}
            description={champagne.description}
            price={champagne.price}
          />
        ))}
      </div>
    </main>
  );
}
