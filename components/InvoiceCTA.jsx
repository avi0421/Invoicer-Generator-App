import ThemeLink from "./ThemeLink";

export default function InvoiceCTA() {
  return (
    <div className="invoice-cta flex items-center justify-center">
        <div className="py-5 px-6 bg-white shadow-2xl rounded-md">
            <ThemeLink className="bg-red-500 hover:bg-red-600 focus:ring-red-300" title="Create your first Invoice" href="/invoice/new" />
        </div>
    </div>
  );
}
