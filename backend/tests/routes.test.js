const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index'); // Adjust this path to your app file
const Rule = require('../schemas/Rule');

beforeAll(async () => {
  // Connect to the test database
  await mongoose.connect(process.env.TEST_MONGO_URI || 'mongodb://localhost:27017/ruleEngineTest', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  // Close the database connection
  await mongoose.connection.close();
});

afterEach(async () => {
  // Clear the database after each test
  await Rule.deleteMany({});
});

describe('Rule API Tests', () => {
  test('should create a new rule', async () => {
    const newRule = {
      name: 'AgeRule',
      ruleString: 'age >= 30',
      ast: {}, // Include a mock AST if needed
    };

    const res = await request(app)
      .post('/api/create-rule')
      .send(newRule)
      .expect(201);

    expect(res.body.message).toBe("Rule 'AgeRule' created successfully!");
  });

  test('should check eligibility based on rules', async () => {
    const rule = {
      name: 'AgeRule',
      ruleString: 'age > 30',
      ast: {
        type: 'operand',
        value:'AGE >= 30',
        left: null,
        right: null,
    }
    };

    await Rule.create(rule);

    const eligibilityData = {
      age: 31,
      department: 'IT',
      salary: 34567889,
      experience: 4,
    };

    const res = await request(app)
      .post('/api/check-eligibility')
      .send(eligibilityData)
      .expect(200);

    expect(res.body.eligible).toBe(true);
  });

  test('should combine rules', async () => {
    const rule1 = {
      name: 'AgeRule',
      ruleString: 'age >= 30',
      ast: {}, // Include a mock AST if needed
    };

    const rule2 = {
      name: 'SalaryRule',
      ruleString: 'salary >= 3000000',
      ast: {}, // Include a mock AST if needed
    };

    await Rule.create(rule1);
    await Rule.create(rule2);

    const res = await request(app)
      .post('/api/combine-rules')
      .send({
        ruleNames: ['AgeRule', 'SalaryRule'],
        operator: 'AND',
      })
      .expect(201);

    expect(res.body.message).toBe('Combined rule created successfully!');
  });

  test('should update an existing rule', async () => {
    const rule = {
      name: 'AgeRule',
      ruleString: 'age >= 30',
      ast: {}, // Include a mock AST if needed
    };

    const createdRule = await Rule.create(rule);

    const updatedRule = {
      name: 'UpdatedAgeRule',
      ruleString: 'age > 25',
      ast: {}, // Include a mock AST if needed
    };

    const res = await request(app)
      .put(`/api/rules/${createdRule._id}`)
      .send(updatedRule)
      .expect(200);

    expect(res.body.name).toBe('UpdatedAgeRule');
    expect(res.body.ruleString).toBe('age > 25');
  });

  test('should delete a rule', async () => {
    const rule = {
      name: 'AgeRule',
      ruleString: 'age >= 30',
      ast: {}, // Include a mock AST if needed
    };

    const createdRule = await Rule.create(rule);

    const res = await request(app)
      .delete(`/api/rules/${createdRule._id}`)
      .expect(200);

    expect(res.body.message).toBe('Rule deleted successfully');
  });

  test('should retrieve all rules', async () => {
    const rule1 = {
      name: 'AgeRule',
      ruleString: 'age >= 30',
      ast: {}, // Include a mock AST if needed
    };

    const rule2 = {
      name: 'SalaryRule',
      ruleString: 'salary >= 3000000',
      ast: {}, // Include a mock AST if needed
    };

    await Rule.create(rule1);
    await Rule.create(rule2);

    const res = await request(app)
      .get('/api/rules')
      .expect(200);

    expect(res.body.length).toBe(2);
  });
});
