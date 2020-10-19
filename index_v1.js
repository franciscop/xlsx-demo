import drive from "drive-db";
import xlsx from "xlsx";

const id = "1fvz34wY6phWDJsuIneqvOoZRPfo6CfJyPg1BYgHt59k";

drive(id).then(data => {
  const workbook = xlsx.utils.book_new();

  /* make worksheet */
  const headers = Object.keys(data[0]);
  const values = data.map(obj => Object.values(obj));
  const ws_data = [headers, ...values];
  const worksheet = xlsx.utils.aoa_to_sheet(ws_data);

  /* Add the worksheet to the workbook */
  xlsx.utils.book_append_sheet(workbook, worksheet, "Demo Data");

  xlsx.writeFile(workbook, "test1.xlsx");
});
