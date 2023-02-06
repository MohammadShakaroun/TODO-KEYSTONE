import { list } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';

// see https://keystonejs.com/docs/fields/overview for the full list of fields
//   this is a few common fields for an example
import {
  text,
  relationship,
  password,
  timestamp,
  select,
} from '@keystone-6/core/fields';
import { document } from '@keystone-6/fields-document';
import type { Lists } from '.keystone/types';

export const lists: Lists = {
  User: list({
     access: allowAll,

    // this is the fields for our User list
    fields: {
      // by adding isRequired, we enforce that every User should have a name
      //   if no name is provided, an error will be displayed
      name: text({ validation: { isRequired: true } }),

      email: text({
        validation: { isRequired: true },
        // by adding isIndexed: 'unique', we're saying that no user can have the same
        // email as another user - this may or may not be a good idea for your project
        isIndexed: 'unique',
      }),

      password: password({ validation: { isRequired: true } }),

      // we can use this field to see what Posts this User has authored
      //   more on that in the Post list below


      createdAt: timestamp({
        // this sets the timestamp to Date.now() when the user is first created
        defaultValue: { kind: 'now' },
      }),
      todos: relationship({ 
        ref: 'Todo.author', 
        many: true 
      }),
    },
  }),
  Todo: list({
    access: allowAll,

    fields: {
      title: text({ validation: { isRequired: true } }),

      description: document({
        formatting: true,
        links: true,
        dividers: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
          [2, 1],
          [1, 2],
          [1, 2, 1],
        ],
      }),
      priority: select({
        type: "integer",
        options: [
          { label: 'Low', value: 1 },
          { label: 'Normal', value: 2 },
          { label: 'High', value: 3 },
          /* ... */
        ],
        defaultValue: 1,
        validation: { isRequired: true, },
        ui: { displayMode: 'radio' },
      }),
      author: relationship({ 
        ref: 'User.todos', 
        many: false,
        hooks: ({
        }),
      }),

    },
  }),

};
