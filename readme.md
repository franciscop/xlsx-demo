Reading the docs

Target: I want to read from drive-db into an arbitrary array of objects format, and be able to save that as a XLSX file with `xlsx`.

Step 1: Find in the docs how to save the file. Found it by searching "save" in the docs:

```js
if (typeof require !== "undefined") XLSX = require("xlsx");
/* output format determined by filename */
XLSX.writeFile(workbook, "out.xlsb");
/* at this point, out.xlsb is a file that you can distribute */
```

Step 2: oops, what is the format of `workbook`? Found from "Creating a new workbook from scratch":

```js
/* create a new blank workbook */
var wb = XLSX.utils.book_new();
```

However that seems to create an empty one without data.

Question: does `book_new()` accept anything? I couldn't find any information for the `book_new()` util.

Step 3: Let's see how to create it in the previous step "Adding a new worksheet to a workbook":

```js
var ws_name = "SheetJS";

/* make worksheet */
var ws_data = [["S", "h", "e", "e", "t", "J", "S"], [1, 2, 3, 4, 5]];
var ws = XLSX.utils.aoa_to_sheet(ws_data);

/* Add the worksheet to the workbook */
XLSX.utils.book_append_sheet(wb, ws, ws_name);
```

As a new user I don't know what `aoa_to_sheet` is and don't care at this point as long as it works. So let's test it out!

Step 4: putting it all together:

```js
import drive from "drive-db";
import xlsx from "xlsx";

drive("1fvz34wY6phWDJsuIneqvOoZRPfo6CfJyPg1BYgHt59k").then(data => {
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
```

## Questions so far

Note: I purposefully tried avoiding reading much of the docs so far and be "a user in a hurry copy/pasting bits".

- Q: Is the "name" field in the "book_append_sheet" even needed? What is it for?
- A: Looking around a bit it seems to be the name of the sheet itself. I thought by writing the code above that it'd be the name of the document.

- Q: Followup, what's the difference of creating a workbook and a worksheet? Why are they two different entities?
- A: I'm sure those familiar with Excel will know this quite well, but for those not too familiar that just want a single-sheet this distinction is a bit confusing. I don't recommend changing anything here though.

Note: I definitely expected the "Creating a new workbook from scratch" to be more detailed

Q: What is even `aoa_to_sheet`?
A1: Read the docs
A2: But I'm a user who just skims and copy/pastes, could we have some brief comments near the example at least spelling what it stands for?
Recommendation: add some comments, or maybe check if the name `arrays_to_sheet` is more clear for the users than `aoa_to_sheet`. You could do the parallel of `arrays_to_sheet()` and `objects_to_sheet()`.

Note: I did end up reading the docs, and found that besides `aoa_to_sheet` there was a very interesting-looking doc for this use-case called `json_to_sheet`. In a real-world scenario, this seems closer to what I wanted so I'll refactor the code now to use that method.

Step 5: refactor to use `json_to_sheet` instead of `aoa_to_sheet` and it seems to work fine. So the code now looks like this:

```js
import drive from "drive-db";
import xlsx from "xlsx";

drive("1fvz34wY6phWDJsuIneqvOoZRPfo6CfJyPg1BYgHt59k").then(data => {
  const workbook = xlsx.utils.book_new();

  /* make worksheet */
  const worksheet = xlsx.utils.json_to_sheet(data);

  /* Add the worksheet to the workbook */
  xlsx.utils.book_append_sheet(workbook, worksheet, "Demo Data");

  xlsx.writeFile(workbook, "test2.xlsx");
});
```

Step 6 [optional]: if my codebase used these heavily, I'd indeed refactor this code to use a function instead:

```js
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
  // await?
  xlsx.writeFile(workbook, filename);
};

download("1fvz34wY6phWDJsuIneqvOoZRPfo6CfJyPg1BYgHt59k", "test3.xlsx");
```

Question: is `writeFile` async? is `writeFileAsync` using promises? what's the difference?
Answer: Node.js convention is that it _should_ be async, but I see there's also `write` and `writeFileAsync`. The latter also accepts a callback and in the whole docs there's 1 mention of "promise" (which is unrelated), 0 mentions of "await", and 1 mention of "async" on the `writeFileAsync` method name so I'd need to do some manual testing to actually find out what flavour of async these use.
Recommendation: spell out what are promises and what is async. Default should be async, and if a method is sync it should say `writeFileSync` following Node.js convention.

## Closing notes

It seems like a very capable "lower-level" library, a workhorse that can handle many different tasks. It is also in the right place to do a consulting business around it IMHO.

As a casual user I did miss some higher-level utils to be able to do specific tasks in one-step. This library might not be the best place for those though, and the combinatory complexity of this seems like it might just be too high. But I'm sure that there are some use-cases that could benefit from a more direct/high-level approach.
