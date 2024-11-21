// import Bar from "@/components/Bar";
// import ChampagneCard from '@/components/ChampagneCard';
// import { query } from '@/lib/db';

export default async function Home() {
  // const champagnes = await query('SELECT name, description, price FROM champagnes');

  return (
    <main>
      hello worls
      {/* <Bar/> */}
      ...........................e
      {/* <div className="grid gap-4">
        {champagnes.map((champagne: { name: string; description: string; price: string }, index: number) => (
          <ChampagneCard
            key={index}
            name={champagne.name}
            description={champagne.description}
            price={champagne.price}
          />
        ))}
      </div> */}
      <div className="bg-gray-800 text-white p-4 text-center">
      <h1 className="text-3xl font-black">Wine and Dine</h1>
      </div>
      <div className="max-w-4xl mx-auto p-4 text-red-500 text-xl bg-yellow-400 font-black">
        <p>
          Nestled in a quiet corner of the city was "Wine and Dine," a restaurant unlike any other. It wasn't the shimmering chandeliers or the muted tones of its minimalist design that made it stand out—it was the philosophy behind it. Here, introverts found their haven, a space designed with their needs and preferences at heart.
        </p>
        <p>
          At "Wine and Dine," there were no bustling crowds or loud exchanges between staff and patrons. Instead, the experience was orchestrated to perfection. Upon entering, guests were greeted not by a human host but by a sleek touch screen embedded in the wall. This digital maître d' allowed diners to select their table from a live map of the restaurant, ensuring they could choose a spot that felt just right—whether tucked away in a cozy corner or by a serene window overlooking the cityscape.
        </p>
        <p>
          Once a table was selected, guests would be directed via subtle floor lights to their destination. Waiting in line? Not here. The founders of "Wine and Dine" knew that one of the biggest hurdles for introverts was the anxiety-inducing queue. Instead, the restaurant offered staggered reservations and table allocations that ensured no one ever had to stand around awkwardly.
        </p>
        <p>
          Each table was set to perfection before guests arrived, eliminating the need to wait for someone to come over with a clatter of plates or menus. Speaking of menus, they were entirely digital and interactive. A tablet at each table allowed guests to browse the curated selection of dishes, complete with pictures, descriptions, and even pairing recommendations for wine and cocktails. Customizations could be made with the swipe of a finger, and orders were sent directly to the kitchen without the need for small talk or explanations.
        </p>
        <p>
          The dining experience itself was a marvel. Food arrived via a discreet robotic trolley system that glided silently across the restaurant floor. Each dish was carefully covered to maintain temperature and unveiled upon arrival. There was no need for awkward exchanges with a waiter about how the food looked or tasted—it was just you, the plate, and the ambiance.
        </p>
        <p>
          The atmosphere was carefully curated to be as calming as possible. Soft ambient music played in the background, interspersed with the occasional sound of trickling water from the indoor fountain. Tables were spaced generously apart to ensure privacy, and partitions could be adjusted to create an even more secluded environment for those who wished to be entirely in their own world.
        </p>
        <p>
          Even the checkout process was seamless. When the meal was over, guests could pay directly from the tablet at their table. A single tap completed the transaction, and a printed receipt was delivered to the table by the same robotic trolley that brought the food.
        </p>
        <p>
          "Wine and Dine" wasn’t just a restaurant—it was a sanctuary. It celebrated the joy of solitude and the art of quiet indulgence. For the introverts who frequented it, it wasn’t just about the food; it was about finally finding a place where they felt understood. In a world that often demanded constant interaction, "Wine and Dine" was a breath of fresh air—a reminder that sometimes, the best company is your own.
        </p>
      </div>
    </main>
  );
}
