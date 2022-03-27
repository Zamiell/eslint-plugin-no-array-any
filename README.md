# eslint-plugin-no-array-any

## What is this?

This is a rule that disallows declaring arrays and objects that do not have a type. For example:

```ts
// Bad
const myArray = [];

// Good
const myArray: string[] = [];

// Bad
const myMap = new Map();

// Good
const myMap = new Map<string, string>();
```

This is useful because the `noImplicitAny` TypeScript compiler flag does not catch this pattern. Declaring objects without the type can make code harder to read, especially if the array/object is instantiated far away from where it is mutated.

<br>

## How do I use it?

* `npm install --save-dev eslint-plugin-no-array-any`
* Add  `"plugin:no-array-any/recommended"` to the `extends` section of your `.eslintrc.js` file.

<br>

## What rules does this plugin provide?

It only provides one rule: `"no-array-any/no-array-any"`

<br>
