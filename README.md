# sanity-plugin-table

[Sanity](https://www.sanity.io/) plugin that implements a `table` schema type and input component.

This fork addresses issues listed on the original repository as well as:

- cell content editor separate from the preview
- row and column spans
- headers
- cell colours
- current cell marker

A title text field is also included

## Installing

Install using the [Sanity CLI](https://www.sanity.io/docs/cli).

```
sanity install table
```

## Usage

Simply specify `table` as a field type in your schema.

```js
export default {
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    {
      name: 'sizeChart',
      title: 'Size Chart',
      type: 'table', // Specify table type
    },
  ],
};
```

## Similar Packages

- [sanity-datatable](https://github.com/fredjens/sanity-datatable/) by [fredjens](https://github.com/fredjens/)

## License

[MIT](http://opensource.org/licenses/MIT)
