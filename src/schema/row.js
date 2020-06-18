export default {
  title: 'Table Row',
  name: 'tableRow',
  type: 'object',
  fields: [
    {
      name: 'cells',
      type: 'array',
      of: [
        {
          name: 'cell',
          type: 'object',
          fields: [
            {
              name: 'colspan',
              type: 'number',
            },
            {
              name: 'rowspan',
              type: 'number',
            },
            {
              name: 'data',
              type: 'string',
            },
            {
              name: 'color',
              type: 'string',
            },
            {
              name: 'header',
              type: 'string',
            },
          ],
        },
      ],
    },
  ],
};
