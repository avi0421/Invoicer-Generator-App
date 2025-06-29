"use client";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import FormPreview from "@/components/FormPreview";
import { useReactToPrint } from "react-to-print";
import { AiOutlinePrinter, AiOutlineEdit } from "react-icons/ai";
import { CiMail } from "react-icons/ci";
import Link from "next/link";

export default function ViewInvoice() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const invoiceRef = useRef();

  useEffect(() => { id && load(); }, [id]);
  const load = async () => {
    setLoading(true);
    try {
      const r = await fetch(`/api/invoices/${id}`);
      if (!r.ok) throw new Error("fetch fail");
      setInvoice(await r.json());
    } catch (e) { setErr(e.message); } finally { setLoading(false); }
  };

  const handlePrint = useReactToPrint({ contentRef: invoiceRef });
  const handleSend = async () => {
    try {
      const r = await fetch(`/api/invoices/${id}/send`, { method: "POST" });
      if (!r.ok) throw new Error((await r.json()).error);
      alert("Sent!");
    } catch (e) { alert(e.message); }
  };

  if (loading) return <div>Loading…</div>;
  if (err) return <div>Error: {err}</div>;
  if (!invoice) return <div>Not found</div>;

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button onClick={handlePrint}><AiOutlinePrinter /> Print</button>
        <Link href={`/invoices/${id}/edit`}><AiOutlineEdit /> Edit</Link>
        <button onClick={handleSend}><CiMail /> Send</button>
      </div>
      <div ref={invoiceRef}><FormPreview data={invoice} /></div>
    </div>
  );
}