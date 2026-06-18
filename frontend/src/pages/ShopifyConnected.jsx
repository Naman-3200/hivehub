import { useSearchParams } from "react-router-dom";

export default function ShopifyConnected() {
  const [params] = useSearchParams();
  const shop = params.get("shop");
  const adminUrl = `https://${shop}/admin`;

  return (
    <div className="p-8 max-w-lg mx-auto bg-white rounded-xl shadow mt-20">
      <h1 className="text-2xl font-bold mb-4">🎉 Shopify Connected Successfully!</h1>
      <p className="mb-4">Your store is now linked and initial setup is complete.</p>

      <a
        href={adminUrl}
        target="_blank"
        rel="noreferrer"
        className="bg-black text-white px-5 py-3 rounded-lg inline-block"
      >
        Open Shopify Admin
      </a>
    </div>
  );
}
