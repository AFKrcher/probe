export const downloadFile = (data, fileType) => {
  let downloadLink = document.createElement("a");
  downloadLink.setAttribute("download", `${new Date().toISOString()}_PROBE_SatTable.${fileType}`); // File name

  if (fileType === "json") {
    downloadLink.setAttribute("href", data);
  } else {
    let csvFile = new Blob([data], { type: "text/csv" });
    downloadLink.href = window.URL.createObjectURL(csvFile);
  }
  downloadLink.style.display = "none";
  downloadLink.click();
  downloadLink.remove();
};

export const jsonDownload = (content) => {
  let str = JSON.stringify(content);
  let uri = "data:application/json;charset=utf-8," + encodeURIComponent(str);

  downloadFile(uri, "json");
};
