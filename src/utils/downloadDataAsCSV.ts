const downloadCSV =
  (data: (string | number)[][], name = "") =>
  () => {
    const columnsNumber = (data[0] || {}).length || 0;
    const csvContent = `data:text/csv;charset=utf-8,${(data || [])
      .map((e) =>
        (e || [])
          .slice(0, columnsNumber) // don't have more data than the number of columns defined by the header
          .map((v) => `${v}`)
          .map((v) => (v.includes(",") ? `"${v.replace(/"/g, '""')}"` : v)) // escape commas
          .join(",")
      )
      .join("\n")}`;
    const tempLink = document.createElement("a");
    tempLink.setAttribute("href", encodeURI(csvContent));
    tempLink.setAttribute("download", `${name && `${name} `}${new Date().toISOString()}.csv`);
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
  };

export default downloadCSV;
