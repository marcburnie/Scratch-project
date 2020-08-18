const { Pool } = require('pg');

const PG_URI = 'postgres://qhmwxatz:ybXHqCQGylKRB0K-2LgKbCAj1dL2LRDO@raja.db.elephantsql.com:5432/qhmwxatz';

const pool = new Pool({
  connectionString: PG_URI,
});

module.exports = {
  query: (text, params, callback) => {
    console.log('executed query', text);
    return pool.query(text, params, callback);
  },
};
