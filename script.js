let count = 0;

function generateBill() {

    // DOM access
    let name = document.getElementById("name").value;
    let consumption = parseFloat(document.getElementById("consumption").value);
    let type = document.getElementById("type").value;

    // INPUT VALIDATION
    if (name === "" || isNaN(consumption) || type === "") {
        alert("Please fill all fields!");
        return;
    }

    let rate;

    // CONDITIONAL STRUCTURE (if-else)
    if (consumption <= 20) rate = 25;
    else if (consumption <= 40) rate = 35;
    else if (consumption <= 60) rate = 45;
    else rate = 60;

    let total = consumption * rate;

    let discount = 0;

    if (type === "senior") discount = total * 0.25;
    else if (type === "solo") discount = total * 0.15;

    let finalBill = total - discount;
    let date = new Date().toLocaleString();

    // LOOP (requirement)
    let details = [
        "Date: " + date,
        "Name: " + name,
        "Consumption: " + consumption + " m³",
        "Rate: ₱" + rate,
        "Total: ₱" + total.toFixed(2),
        "Discount: ₱" + discount.toFixed(2)
    ];

    let output = "<h3>🧾 Billing Statement</h3>";

    for (let i = 0; i < details.length; i++) {
        output += "<p>" + details[i] + "</p>";
    }

    output += "<hr><h3>Final Bill: ₱" + finalBill.toFixed(2) + "</h3>";

    document.getElementById("output").innerHTML = output;

    // TRANSACTION COUNTER
    count++;
    document.getElementById("count").textContent = count;

    // SEND TO GOOGLE SHEETS
    sendToGoogleSheets(name, consumption, type, finalBill);
}

// PRINT
function printReceipt() {
    let content = document.getElementById("output").innerHTML;

    if (content === "") {
        alert("Generate bill first!");
        return;
    }

    let win = window.open('', '', 'width=600,height=600');

    win.document.open();
    win.document.write(`
        <html>
        <head>
            <title>Receipt</title>
        </head>
        <body>
            <h2>Water Billing Receipt</h2>
            ${content}
        </body>
        </html>
    `);
    win.document.close();
    win.print();
}

// GOOGLE SHEETS
function sendToGoogleSheets(name, consumption, type, bill) {
    const url = "https://script.google.com/macros/s/AKfycbzh-Ns9Bwet9GTFuG5_V40BUOgXh--D9HmyPazDoUCnzWbMLd7_MgOMCxK721wNkhCs7w/exec";

    fetch(url, {
        method: "POST",
        body: JSON.stringify({
            name: name,
            consumption: consumption,
            type: type,
            bill: bill
        }),
        headers: {
            "Content-Type": "application/json"
        }
    });
}
