// saveData.js or similar
import drive from "drive-db";
import xlsx from "xlsx";

const download = async (id, filename) => {
  if (!id || !filename) {
    throw new Error(`The "id" and "filename" are required fields`);
  }

  const data = await drive(id);
  const workbook = xlsx.utils.book_new();
  const worksheet = xlsx.utils.json_to_sheet(data);
  xlsx.utils.book_append_sheet(workbook, worksheet, "Demo Data");
  xlsx.writeFile(workbook, filename);
};

download("1fvz34wY6phWDJsuIneqvOoZRPfo6CfJyPg1BYgHt59k", "test3.xlsx");
