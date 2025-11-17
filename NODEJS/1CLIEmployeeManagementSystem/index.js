// index.js
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
});

function question(prompt) {
  return new Promise((res) => {
    rl.question(prompt, (ans) => res(ans));
  });
}

const employees = [
  { id: "E101", name: "Alice" },
  { id: "E102", name: "Bob" },
  { id: "E103", name: "Charlie" },
];

function printMenu() {
  console.log("\nEmployee Management System");
  console.log("1. Add Employee");
  console.log("2. List Employees");
  console.log("3. Remove Employee");
  console.log("4. Exit\n");
}

function listEmployees() {
  if (employees.length === 0) {
    console.log("\nEmployee List is empty.\n");
    return;
  }
  console.log("\nEmployee List:");
  employees.forEach((e, idx) => {
    console.log(`${idx + 1}. Name: ${e.name}, ID: ${e.id}`);
  });
  console.log("");
}

async function addEmployee() {
  const name = (await question("Enter employee name: ")).trim();
  if (!name) {
    console.log("Name cannot be empty. Aborting add.\n");
    return;
  }
  const id = (await question("Enter employee ID: ")).trim();
  if (!id) {
    console.log("ID cannot be empty. Aborting add.\n");
    return;
  }
  const exists = employees.some((e) => e.id.toLowerCase() === id.toLowerCase());
  if (exists) {
    console.log(`Employee with ID ${id} already exists. Aborting add.\n`);
    return;
  }
  employees.push({ id, name });
  console.log(`Employee ${name} (ID: ${id}) added successfully.\n`);
}

async function removeEmployee() {
  const id = (await question("Enter employee ID to remove: ")).trim();
  if (!id) {
    console.log("ID cannot be empty. Aborting remove.\n");
    return;
  }
  const idx = employees.findIndex((e) => e.id.toLowerCase() === id.toLowerCase());
  if (idx === -1) {
    console.log(`Employee with ID ${id} not found.\n`);
    return;
  }
  const removed = employees.splice(idx, 1)[0];
  console.log(`Employee ${removed.name} (ID: ${removed.id}) removed successfully.\n`);
}

async function main() {
  while (true) {
    printMenu();
    const choiceRaw = (await question("Enter your choice: ")).trim();
    const choice = parseInt(choiceRaw, 10);
    switch (choice) {
      case 1:
        await addEmployee();
        break;
      case 2:
        listEmployees();
        break;
      case 3:
        await removeEmployee();
        break;
      case 4:
        console.log("Exiting... Goodbye!");
        rl.close();
        process.exit(0);
        break;
      default:
        console.log("Invalid choice. Please enter 1, 2, 3 or 4.\n");
    }
  }
}

main().catch((err) => {
  console.error("Error:", err);
  rl.close();
});
