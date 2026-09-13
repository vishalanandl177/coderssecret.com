const assert = require('node:assert/strict');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');
const { loadTsModule, loadPublishedCourses } = require('./lib/content-models');

const { ANALYTICS_WORKED_EXAMPLES: examples } = loadTsModule(path.join(
  __dirname, '..', 'src', 'app', 'models', 'courses', 'analytics-worked-examples.ts'
));
const course = loadPublishedCourses().find(course => course.slug === 'production-analytics-engineering-dbt');
assert.deepEqual(Object.keys(examples).sort(), course.modules.map(module => module.slug).sort());
assert.equal(new Set(Object.values(examples).map(example => example.html)).size, course.modules.length);

const fixtures = {
  'tables-grain-dashboard-lies': [{ unsafe_total: 250, order_total: 150 }],
  'staging-models': [
    { order_id: 101, amount: 12.5, status: 'paid' },
    { order_id: 102, amount: 0, status: 'cancelled' },
  ],
  'intermediate-models': [{ order_id: 101, net_amount: 75 }, { order_id: 102, net_amount: 50 }],
  'semantic-layer-fundamentals': [{ country: 'DE', net_revenue: 50 }, { country: 'FR', net_revenue: 80 }],
};
const database = new DatabaseSync(':memory:');
try {
  for (const [slug, expected] of Object.entries(fixtures)) {
    const sql = examples[slug].html.match(/<pre><code>([\s\S]*?)<\/code><\/pre>/)?.[1];
    assert.ok(sql, `Missing executable SQL in ${slug}`);
    const actual = database.prepare(sql).all().map(row => ({ ...row }));
    assert.deepEqual(actual, expected, `Worked SQL result changed in ${slug}`);
  }
} finally {
  database.close();
}
console.log(`Analytics examples passed: ${course.modules.length} distinct lessons, ${Object.keys(fixtures).length} executable SQL results verified.`);
