import { Decree } from "@/components/Decree";
import { MuteToggle } from "@/components/MuteToggle";
import { Hero } from "@/components/Hero";

export default function Home() {
  return (
    <main>
      <Hero />
      <Decree />
      <MuteToggle />
    </main>
  );
}
