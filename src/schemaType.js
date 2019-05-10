import TableInput from './component';

export default {
  title: 'AdapTable',
  name: 'adaptable',
  type: 'object',
  inputComponent: TableInput,
  fields: [
    {
      title: 'Heading',
      name: 'heading',
      type: 'string',
    },
    {
      name: 'rows',
      type: 'array',
      of: [
        {
          name: 'row',
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
        },
      ],
    },
  ],
  preview: {
    select: {
      heading: 'heading',
    },
    prepare({ heading }) {
      return {
        title: heading,
      };
    },
  },
};
