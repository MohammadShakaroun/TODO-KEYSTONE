import { list, config } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';
import { password, text } from '@keystone-6/core/fields';

import dotenv from 'dotenv';
dotenv.config();

// to keep this file tidy, we define our schema in a different file
import { lists } from './schema';   
// authentication is configured separately here too, but you might move this elsewhere
// when you write your list-level access control functions, as they typically rely on session data
import { withAuth, session } from './auth';

export default withAuth(
  config({
    db: {
      
      provider: 'postgresql',
      url: 'postgres://postgres:12345678@localhost:5432/tododb',

    },
    lists,
    session,
  })
);
