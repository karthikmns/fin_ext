// Set worker source for pdf.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.9.359/pdf.worker.min.js';

document.getElementById('pdfInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file.type !== 'application/pdf') {
        console.error('Not a PDF');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const typedarray = new Uint8Array(e.target.result);

        pdfjsLib.getDocument(typedarray).promise.then(function(pdf) {
            pdf.getPage(1).then(function(page) {
                page.getTextContent().then(function(textContent) {
                    const text = textContent.items.map(item => item.str).join(' ');
                    const data = extractData(text);
                    createChart(data);
                });
            });
        });
    };
    reader.readAsArrayBuffer(file);
});

function extractData(text) {
    const regex = /(\w+ \d{4})\s+([\d,]+\.\d{2})/g;
    const matches = [...text.matchAll(regex)];
    return matches.map(match => ({
        date: match[1],
        amount: parseFloat(match[2].replace(',', ''))
    }));
}

function createChart(data) {
    const ctx = document.getElementById('chart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(item => item.date),
            datasets: [{
                label: 'Portfolio Value',
                data: data.map(item => item.amount),
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}