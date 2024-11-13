import Bar from "@/components/Bar";
import MenuItem from "@/components/MenuItem";

export default function Home() {
  return (
    <div>
      hello worls
      <Bar/>
      ...........................e
      <MenuItem 
        image="/menu/des-002.jpg"
        name="BSK Sundae"
        description="Chocolate, raspberry, lime Chantilly"
        price={12.00}
      />
    </div>
  );
}
