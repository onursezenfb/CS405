let data = [];

Papa.parse('data.csv', {
    download: true,
    header: true, // Set to false if your CSV doesn't have a header row
    dynamicTyping: true, // Convert numeric and boolean strings to their types
    skipEmptyLines: true,
    complete: function(results) {
        data = results.data;
        console.log(data);
        const svg = document.getElementById('chart');

        // Define the scales for the bars and the line
        const yMax = Math.max(...data.map(d => d.no_of_suicides));
        const yScale = 480 / yMax;
        const yMaxRate = Math.max(...data.map(d => parseFloat(d.crude_suicide_rate)));
        const yScaleRate = 850 / yMaxRate;
        const barWidth = 60;
        const gap = 40;


        console.log(data);
        data.forEach((entry, idx) => {

            // Create a bar for each entry
            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('x', idx * (barWidth + gap) + gap); // 10 for spacing
            rect.setAttribute('y', 950 - entry.no_of_suicides * yScale); // SVG (0,0) is top-left
            rect.setAttribute('width', barWidth);
            rect.setAttribute('height', entry.no_of_suicides * yScale);
            rect.setAttribute('fill', 'blue');
            svg.appendChild(rect);
            
            const height = (entry.no_of_suicides / yMax) * 800; 
            const bar_data_text = document.createElementNS("http://www.w3.org/2000/svg", 'text');
            bar_data_text.setAttribute('x', -((idx * (barWidth + gap)) + 50 + (barWidth / 3)));
            bar_data_text.setAttribute('y', -880); // Adjust "20" to position text inside bar
            bar_data_text.setAttribute('text-anchor', 'middle');
            bar_data_text.setAttribute('font-size', '50px');
            bar_data_text.setAttribute('fill', 'white');
            bar_data_text.setAttribute('writing-mode', 'tb');

            bar_data_text.setAttribute('transform', 'rotate(180)');
            bar_data_text.textContent = entry.no_of_suicides;
            svg.appendChild(bar_data_text);

            const year_text = document.createElementNS("http://www.w3.org/2000/svg", 'text');
            year_text.setAttribute('x', (idx * (barWidth + gap)) + 50 + (barWidth / 3));
            year_text.setAttribute('y', 1000);
            year_text.setAttribute('text-anchor', 'middle');
            year_text.setAttribute('font-size', '30px');
            year_text.setAttribute('margin-left', '15px');
            year_text.setAttribute('fill', 'white');
            year_text.textContent = entry.year;
            svg.appendChild(year_text);

            const left_line = document.createElementNS("http://www.w3.org/2000/svg", 'line');
            left_line.setAttribute('style', "stroke:white;stroke-width:2");
            left_line.setAttribute('x1', "15");
            left_line.setAttribute('x2', "15");
            left_line.setAttribute('y1', "10");
            left_line.setAttribute('y2', "990");
            svg.appendChild(left_line);

            const bottom_line = document.createElementNS("http://www.w3.org/2000/svg", 'line');
            bottom_line.setAttribute('style', "stroke:white;stroke-width:2");
            bottom_line.setAttribute('x1', "0");
            bottom_line.setAttribute('x2', "2340");
            bottom_line.setAttribute('y1', "970");
            bottom_line.setAttribute('y2', "970");
            svg.appendChild(bottom_line);

            const right_line = document.createElementNS("http://www.w3.org/2000/svg", 'line');
            right_line.setAttribute('style', "stroke:white;stroke-width:2");
            right_line.setAttribute('x1', "2325");
            right_line.setAttribute('x2', "2325");
            right_line.setAttribute('y1', "10");
            right_line.setAttribute('y2', "990");
            svg.appendChild(right_line);


            // Create a circle for each data point for the line graph
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', idx * (barWidth + gap) + gap + barWidth / 2);
            console.log(parseFloat(entry.crude_suicide_rate));
            circle.setAttribute('cy', 1000 - parseFloat(entry.crude_suicide_rate) * yScaleRate); // Adjust scale as needed
            circle.setAttribute('r', 7);
            circle.setAttribute('fill', 'red');
            svg.appendChild(circle);

            const circle_data_text = document.createElementNS("http://www.w3.org/2000/svg", 'text');
            circle_data_text.setAttribute('x', (idx * (barWidth + gap)) + 50 + (barWidth / 3));
            circle_data_text.setAttribute('y', 970 - parseFloat(entry.crude_suicide_rate) * yScaleRate);
            circle_data_text.setAttribute('text-anchor', 'middle');
            circle_data_text.setAttribute('font-size', '30px');
            circle_data_text.setAttribute('fill', 'white');
            circle_data_text.setAttribute('margin-left', '15px');
            circle_data_text.textContent = entry.crude_suicide_rate;
            svg.appendChild(circle_data_text);
        });
        
        let pathData = "M" + (gap + barWidth / 2) + " " + (1000 - parseFloat(data[0].crude_suicide_rate) * yScaleRate); // Start point
        // Create the path for the line graph (this is a bit trickier)
        data.forEach((entry, idx) => {
            console.log('here');
            if (idx > 0) {
                pathData += " L " + (idx * (barWidth + gap) + gap + barWidth / 2) + " " + (1000 - parseFloat(entry.crude_suicide_rate) * yScaleRate);
            }
        });
        console.log(pathData)
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pathData);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', 'red');
        path.setAttribute('stroke-width', 2);
        svg.appendChild(path);

        const left_legend = document.createElementNS("http://www.w3.org/2000/svg", 'text');
        left_legend.setAttribute('x', 900);
        left_legend.setAttribute('y', 1100);
        left_legend.setAttribute('fill', 'white');
        left_legend.setAttribute('font-size', '35px');
        left_legend.textContent = 'Number of Suicides';
        svg.appendChild(left_legend);

        const left_legend_bar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        left_legend_bar.setAttribute('x', 850);
        left_legend_bar.setAttribute('y', 1082);
        left_legend_bar.setAttribute('width', 30);
        left_legend_bar.setAttribute('height',15);
        left_legend_bar.setAttribute('fill', 'blue');
        svg.appendChild(left_legend_bar);

        const right_legend = document.createElementNS("http://www.w3.org/2000/svg", 'text');
        right_legend.setAttribute('x', 1250);
        right_legend.setAttribute('y', 1100);
        right_legend.setAttribute('fill', 'white');
        right_legend.setAttribute('font-size', '35px');
        right_legend.textContent = 'Crude suicide rate';
        svg.appendChild(right_legend);

        const right_legend_circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        right_legend_circle.setAttribute('cx', 1220);
        right_legend_circle.setAttribute('cy', 1090); // Adjust scale as needed
        right_legend_circle.setAttribute('r', 7);
        right_legend_circle.setAttribute('fill', 'red');
        svg.appendChild(right_legend_circle);

        const right_legend_line = document.createElementNS("http://www.w3.org/2000/svg", 'line');
        right_legend_line.setAttribute('style', "stroke:red;stroke-width:3");
        right_legend_line.setAttribute('x1', "1200");
        right_legend_line.setAttribute('x2', "1240");
        right_legend_line.setAttribute('y1', "1090");
        right_legend_line.setAttribute('y2', "1090");
        svg.appendChild(right_legend_line);

        const header = document.createElementNS("http://www.w3.org/2000/svg", 'text');
        header.setAttribute('x', 100);
        header.setAttribute('y', -100);
        header.setAttribute('fill', 'white');
        header.setAttribute('font-size', '50px');
        header.setAttribute('font-weight', 'bold');
        header.textContent = 'Number of suicides and crude suicide rate, 2000-2022';
        svg.appendChild(header);

        const left_header = document.createElementNS("http://www.w3.org/2000/svg", 'text');
        left_header.setAttribute('x', 30);
        left_header.setAttribute('y', -30);
        left_header.setAttribute('fill', 'white');
        left_header.setAttribute('text-anchor', 'middle');
        left_header.setAttribute('font-size', '35px');
        left_header.textContent = '(Number of Suicides)';
        svg.appendChild(left_header);

        const right_header = document.createElementNS("http://www.w3.org/2000/svg", 'text');
        right_header.setAttribute('x', 2330);
        right_header.setAttribute('y', -30);
        right_header.setAttribute('fill', 'white');
        right_header.setAttribute('text-anchor', 'middle');
        right_header.setAttribute('font-size', '35px');
        right_header.textContent = '(Per hundred thousand)';
        svg.appendChild(right_header);

        let left_max = 8000;
        let right_max = 6;

        for (let i = 0; i < 9; i++){
            const left_info = document.createElementNS("http://www.w3.org/2000/svg", 'text');
            left_info.setAttribute('x', -5);
            left_info.setAttribute('y', 120 * i + 30);
            left_info.setAttribute('font-size', '35px');
            left_info.setAttribute('fill', 'white');
            left_info.setAttribute('text-anchor', 'end');
            left_info.textContent = left_max;
            svg.appendChild(left_info);

            const right_info = document.createElementNS("http://www.w3.org/2000/svg", 'text');
            right_info.setAttribute('x', 2350);
            right_info.setAttribute('y', 120 * i + 30);
            right_info.setAttribute('font-size', '35px');
            right_info.setAttribute('text-anchor', 'start');
            right_info.setAttribute('fill', 'white');
            right_info.textContent = right_max;
            svg.appendChild(right_info);

            left_max -= 1000;
            right_max -= 0.75;
        }        

    },
    
    error: function(err, file, inputElem, reason) {
        console.error("Error:", err, reason);
    }
});