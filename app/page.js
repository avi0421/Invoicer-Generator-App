import InvoiceCTA from "../components/InvoiceCTA";
import Hero from "../components/Hero";
import Steps from "../components/Steps";
import Features from "../components/Features";
import  Pricing from "../components/Pricing";
import FAQ from "../components/FAQ";
// Remove this import since you won't use it on home page
// import InvoiceManagementDashboard from "./invoice/components/InvoiceManagementDashboard";

export default function Home() {
  return (
    <main>
      <Hero />
      <Steps />
      <InvoiceCTA />
      <Steps />
      <Features />
      {/* Remove this line - dashboard should only show after login */}
      {/* <InvoiceManagementDashboard/> */}
      {/* <Pricing /> */}
      <FAQ />
    </main>
  );
}