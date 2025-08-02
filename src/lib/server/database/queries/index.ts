import * as auth from './auth';
import * as cases from './cases'
import * as users from './users';
import * as settings from './settings';

export default { ...auth, ...cases, ...users, ...settings };