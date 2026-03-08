## Answers to Questions

### 1. What is the different between var, let, and const?

var, let, and const are all used to declare variables in JavaScript, but they behave differently.

var

- var used in older versions of javascript.

- It is function-scoped, which means it is accessible throughout the entire function where it is declared.

- It can be redeclared and updated.

- Because of these behaviors, it can sometimes cause unexpected bugs.

let

- let was introduced in ES6 (ECMAScript 2015).

- It is block-scoped, meaning it only works inside the block {} where it is declared.

- It can be updated, but cannot be redeclared in the same scope.

const

- const is also block-scoped like let.

- It cannot be updated or redeclared after being assigned.

- It must be initialized when declared.

### 2. What is the spread operator (...)?

The spread operator (...) is used to expand or unpack elements from an array or object. It allows us to copy or combine arrays and objects easily.

### 3. What is the difference between map(), filter(), and forEach()?

These are array methods used to work with array elements.

map()

- Creates a new array by applying a function to each element.

- The number of elements in the new array stays the same.

filter()

- Creates a new array with elements that pass a condition.

forEach()

- Executes a function for each array element.

- It does not return a new array.

### 4. What is an arrow function?

An arrow function is a shorter way to write functions in JavaScript. It was introduced in ES6 and makes the code more concise.

### 5. What are template literals?

Template literals are a way to create strings in JavaScript using backticks ( ) instead of quotes.

- Embedding variables

- Writing multi-line strings