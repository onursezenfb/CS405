let data = [];

Papa.parse('data.csv', {
    download: true,
    header: true, // Set to false if your CSV doesn't have a header row
    dynamicTyping: true, // Convert numeric and boolean strings to their types
    skipEmptyLines: true,
    complete: function(results) {
        data = results.data;
        const svg = document.getElementById('chart');

        // Define the scales for the bars and the line
        const yMax = Math.max(...data.map(d => d.no_of_suicides));
        const yScale = 600 / yMax;
        const yMaxEcon = Math.max(...data.map(d => parseFloat(d.percent_economical)));
        const yScaleEcon = 6 / yMaxEcon;
        const barWidth = 40;


        console.log(data);
        data.forEach((entry, idx) => {

            // Create a bar for each entry
            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('x', idx * (barWidth + 10) + 10); // 10 for spacing
            rect.setAttribute('y', 800 - entry.no_of_suicides * yScale); // SVG (0,0) is top-left
            rect.setAttribute('width', barWidth);
            rect.setAttribute('height', entry.no_of_suicides * yScale);
            rect.setAttribute('fill', 'blue');
            svg.appendChild(rect);

            // Create a circle for each data point for the line graph
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', idx * (barWidth + 10) + 10 + barWidth / 2);
            circle.setAttribute('cy', 400 - parseFloat(entry.percent_economical) * yScaleEcon * 60); // Adjust scale as needed
            circle.setAttribute('r', 3);
            circle.setAttribute('fill', 'red');
            svg.appendChild(circle);
        });

        console.log(data);
        let pathData = "M" + (10 + barWidth / 2) + " " + (400 - parseFloat(data[0].percent_economical) * yScaleEcon * 60); // Start point
        // Create the path for the line graph (this is a bit trickier)
        console.log(data);
        data.forEach((entry, idx) => {
            console.log('here');
            if (idx > 0) {
                pathData += " L " + (idx * (barWidth + 10) + 10 + barWidth / 2) + " " + (400 - parseFloat(entry.percent_economical) * yScaleEcon * 60);
            }
        });
        console.log(pathData)
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pathData);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', 'red');
        path.setAttribute('stroke-width', 2);
        svg.appendChild(path);

    },
    
    error: function(err, file, inputElem, reason) {
        console.error("Error:", err, reason);
    }
});