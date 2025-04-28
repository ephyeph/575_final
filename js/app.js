// Array of city objects with name and population
var cityPop = [
    { 
        city: 'Madison',
        population: 233209
    },
    {
        city: 'Milwaukee',
        population: 594833
    },
    {
        city: 'Green Bay',
        population: 104057
    },
    {
        city: 'Superior',
        population: 27244
    }
];

// Function to add a new "City Size" column to the table
function addColumns(cityPop) {
    // Loop through all rows in the table
    document.querySelectorAll("tr").forEach(function(row, i) {
        if (i == 0) {
            // Add a new column header to the first row
            row.insertAdjacentHTML('beforeend', '<th>City Size</th>');
        } else {
            // Determine the city size based on population
            var citySize;

            if (cityPop[i - 1].population < 100000) {
                citySize = 'Small';
            } else if (cityPop[i - 1].population < 500000) {
                citySize = 'Medium';
            } else {
                citySize = 'Large';
            }

            // Add the city size to the corresponding row
            row.insertAdjacentHTML('beforeend', '<td>' + citySize + '</td>');
        }
    });
}

// Function to add event listeners for hover and click interactions
function addEvents() {
    // Add a mouseover event to change the table's background color
    document.querySelector("table").addEventListener("mouseover", function() {
        var color = "rgb(";

        for (var i = 0; i < 3; i++) {
            // Generate a random RGB value
            var random = Math.round(Math.random() * 255);

            // Add the random value to the color string
            color += random;

            // Add a comma between values, except for the last one
            if (i < 2) {
                color += ",";
            } else {
                color += ")";
            }
        }

        // Apply the new background color to the table
        this.style.backgroundColor = color;
    });

    // Function to handle table click events
    function clickme() {
        alert('Hey, you clicked me!');
    }

    // Add the click event listener to the table
    document.querySelector("table").addEventListener("click", clickme);
}

// Call the functions to add columns and event listeners
addColumns(cityPop);
addEvents();
