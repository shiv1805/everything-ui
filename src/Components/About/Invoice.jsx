import React, { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
import axios from "axios";

import "react-pdf/dist/esm/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default function GetInvoice() {
  // const params = useParams();
  // const refId = params?.ref_id;
  // console.log("Ref ID from useParams:", refId);

  const [numPages, setNumPages] = useState();
  const [pageNumber, setPageNumber] = useState(1);
  const [invoiceUrl, setInvoiceUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getInvoiceFromRef();
  }, []);

  const getInvoiceFromRef = async () => {
    const BaseUrl = "https://api.givadiva.co/";

    try {
      setLoading(true);
      const token = "5jLhjjP15n1AQH0oDiFCgwK70MEG4y";
      const params = {
        ref_id: "88ULQDNSwVe1ji8Le8DXUw"
      };
      const resp = await axios.get(
        `${BaseUrl}v2/features/orders/invoiceByRef`,
        {
          params,
          headers: {
            xaccesstoken: token
          }
        }
      );
      console.log("Invoice Response:", resp);
      const { data, success, message } = resp.data;
      console.log("Response Data:", data);

      if (success) {
        setInvoiceUrl(data);
        // window.open(invoiceUrl, "_blank").focus();
        console.log("Invoice URL:", data);
      } else {
        console.error("Failed to fetch invoice:", message);
        setInvoiceUrl(null);
      }
    } catch (error) {
      setInvoiceUrl(null);
      console.error("Error fetching invoice:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!invoiceUrl && loading) {
    return <div>pending invoice...</div>;
  }

  if (!invoiceUrl) {
    return <div>No invoice found for this reference ID.</div>;
  }

  const pdfUrl4 =
    "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf";

  function onDocumentLoadSuccess({ numPages }) {
    console.log(`Document loaded with ${numPages} pages`);

    setNumPages(numPages);
  }
  return (
    <div className="bg-white text-center pb-4">
      <div className="w-1/2 mx-auto">
        <Document file={invoiceUrl} onLoadSuccess={onDocumentLoadSuccess}>
          {Array.from({ length: 3 }, (_, index) => (
            <div
              key={index}
              className="bg-white text-black text-center text-sm"
            >
              <div className="py-1">
                Page {index + 1} of {numPages}
              </div>
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                scale={3}
              />
            </div>
          ))}
        </Document>
      </div>
      {!false && (
        <button
          className="bg-blue-500 hover:bg-blue-700 my-2 text-white text-center font-bold py-2 px-4 rounded"
          onClick={() => window.open(invoiceUrl, "_blank")}
        >
          View Invoice in Browser
        </button>
      )}
    </div>
  );
}
