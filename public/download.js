
function csv(dataTableArr) {
  if (dataTableArr.length < 1) {
    return;
  }
  const dataToExport = [
    "Brand ID,",
    "Brand Name,",
    "Brand URL,",
    "Status Code,",
    "Status Message,",
    "Landing URL,",
    "Note\n",
  ];

  dataTableArr.forEach((row) => {
    dataToExport.push(
      (/[,]/.test(row.brandId) ? `"${row.brandId}"` : row.brandId) + ","
    );
    dataToExport.push(
      (/[,]/.test(row.brand) ? `"${row.brand}"` : row.brand) + ","
    );
    dataToExport.push(
      (/[",\n]/.test(row.brandUrl) ? `"${row.brandUrl}"` : row.brandUrl) + ","
    );
    dataToExport.push(row.code + ",");
    dataToExport.push(
      (/[,]/.test(row.message) ? `"${row.message}"` : row.message) + ","
    );
    dataToExport.push(
      (/[",\n]/.test(row.landingUrl) ? `"${row.landingUrl}"` : row.landingUrl) +
        ","
    );
    dataToExport.push(
      (/[,]/.test(row.note) ? `"${row.note}"` : row.note) + "\n"
    );
  });

  const csvBlob = new Blob(dataToExport, { type: "text/csv" });
  const blobUrl = URL.createObjectURL(csvBlob);
  const anchorElement = document.createElement("a");

  anchorElement.href = blobUrl;
  anchorElement.download = `URL-Status-Verified.csv`;
  anchorElement.click();

  setTimeout(() => {
    URL.revokeObjectURL(blobUrl);
  }, 500);
}

export default {
  csv,
};
