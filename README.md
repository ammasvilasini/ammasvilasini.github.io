## Objectives of the Project

There are 2 main objectives of this project:

1. To achieve the PageSpeed score of 90 for index.html (both mobile and laptop scores should be at least 90).

2. To achieve the frame rate of 60fps for the pizza page (views/pizza.html). This is done by optimizing the code in main.js. 

### Viewing the Website
You can view the website here: 

http://ammasvilasini.github.io/

1. For objective 1, view this page: http://ammasvilasini.github.io/
2. For objective 2, view this page: http://ammasvilasini.github.io/views/pizza.html

### Objective 1 Optimizations
1. Optimized the images using adobe photoshop cs6
2. Inlined the critical javascript and CSS
3. Scripts that are not critical are loaded asynchronously
4. Moved non-critical scripts to the bottom of the html page
5. Minified the javascript and CSS
6. Created a "production version" of the site with un-minified code

### Objective 2 Optimizations
1. To make the website move more smoothly i reduced the amount of pizzas that need to be generated from 200 to 20, since not all 200 were seen anyway.
2. Assigned var scrollNumber outside of for loop, it is now a global variable
3. Removed the variables from the for loop in the changePizzaSize function
4. Minified the main.js file and kept a production version for reference
5. Now the time to resize pizzas is 1.2 ms


### Resources Used
1. Adobe Photoshop cs6
2. Coda 2 code editor
3. JS Hint
4. For minifying javascript: http://jscompress.com/
5. For unminifying javascript: http://unminify.com/
