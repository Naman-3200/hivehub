import { getStoreBlocks } from "./storeTemplateBlocks.jsx";

export const generateWebsiteContent = (store, publishedProducts) => {
  const { heroSection, productsGrid, footerSection } = getStoreBlocks(store, publishedProducts);

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${store.name} - Online Store</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      .hero-gradient { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    </style>
  </head>
  <body class="bg-gray-50">
    ${heroSection}
    ${productsGrid}
    ${footerSection}
  </body>
  </html>`;
};
