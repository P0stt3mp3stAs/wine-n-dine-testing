import ChampagneCard from '@/components/ChampagneCard';
import { query } from '@/lib/db';

export default async function menu() {
  const champagnes = await query('SELECT * FROM champagnes');

  return (
    <main>
      <div className="bg-gray-800 text-white p-4 text-center my-5">
        <h1 className="text-3xl font-black">MENU</h1>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {champagnes.map((champagne) => (
          <ChampagneCard
            key={champagne.id} // Use unique database ID instead of index
            name={champagne.name}
            description={champagne.description}
            price={champagne.price}
          />
        ))}
      </div>
    </main>
  );
}