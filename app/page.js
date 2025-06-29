import InvoiceCTA from "../components/InvoiceCTA";
import Hero from "../components/Hero";
import Steps from "../components/Steps";
import Features from "../components/Features";
import FAQ from "../components/FAQ";

export default function Home() {
  return (
    <main>
      <Hero />
      <Steps />
      <InvoiceCTA />
      <Features />
      <FAQ />
    </main>
  );
}