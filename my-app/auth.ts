import { randomBytes } from 'crypto';
import { createAuth } from '@keystone-6/auth';

// see https://keystonejs.com/docs/apis/session for the session docs
import { statelessSessions } from '@keystone-6/core/session';

// for a stateless session, a SESSION_SECRET should always be provided
//   especially in production (statelessSessions will throw if SESSION_SECRET is undefined)
let sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret && process.env.NODE_ENV !== 'production') {
  sessionSecret = randomBytes(32).toString('hex');
}

// withAuth is a function we can use to wrap our base configuration
const { withAuth } = createAuth({
  listKey: 'User',
  identityField: 'email',

  sessionData: 'name createdAt',
  secretField: 'password',

  initFirstItem: { 

    fields: ['name', 'email', 'password'],

  },
});

// statelessSessions uses cookies for session tracking
//   these cookies have an expiry, in seconds
//   we use an expiry of 30 days for this starter
const sessionMaxAge = 60 * 60 * 24 * 30;

// you can find out more at https://keystonejs.com/docs/apis/session#session-api
const session = statelessSessions({
  maxAge: sessionMaxAge,
  secret: sessionSecret!,
});


export { withAuth, session };
