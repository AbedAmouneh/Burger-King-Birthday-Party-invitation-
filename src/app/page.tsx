import { AdminPanel } from "@/components/AdminPanel";
import { Court } from "@/components/Court";
import { Decree } from "@/components/Decree";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { MuteToggle } from "@/components/MuteToggle";

export default function Home() {
  return (
    <main>
      <Hero />
      <Decree />
      <Court />
      <Footer />
      <MuteToggle />
      <AdminPanel />
    </main>
  );
}
