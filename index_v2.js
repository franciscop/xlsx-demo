import drive from "drive-db";
import xlsx from "xlsx";

const id = "1fvz34wY6phWDJsuIneqvOoZRPfo6CfJyPg1BYgHt59k";

drive(id).then(data => {
  const workbook = xlsx.utils.book_new();

  /* make worksheet */
  const worksheet = xlsx.utils.json_to_sheet(data);

  /* Add the worksheet to the workbook */
  xlsx.utils.book_append_sheet(workbook, worksheet, "Demo Data");

  xlsx.writeFile(workbook, "test2.xlsx");
});
