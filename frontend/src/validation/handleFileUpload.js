import Papa from "papaparse";  // make sure it's imported

const handleFileUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: (results) => {
      const parsed = results.data.map((row) => ({
        name: row.name || "Unnamed",
        description: row.description || "",
        price: parseFloat(row.price) || 0,
        image: row.image || "https://via.placeholder.com/300x300?text=Product",
        category: row.category || "General",
      }));
      setBulkProducts(parsed);
    },
  });
};
