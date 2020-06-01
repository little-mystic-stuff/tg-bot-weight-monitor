const Base = require('../lib/base.js');
const should = require('chai').should();
const fs = require('fs');

const baseName = 'test-base.json';
const basePath = `${__dirname}/${baseName}`

describe('Base tests.', () => {
  afterEach(() => {
    fs.unlinkSync(basePath);
  });

  it('Initialization', () => {
    const target = {users:{}};

    const base = new Base(basePath);
    let baseFile = fs.readFileSync(basePath, 'utf8');
    JSON.stringify(JSON.parse(baseFile)).should.equal(JSON.stringify(target));
  });

  it('Add new user', () => {
    const user = {
      lastMessage: 23,
      id: 77777777,
      is_bot: false,
      first_name: 'Maks',
      username: 'Username',
      language_code: 'ru'
    }

    const target = {users:{}};
    target.users[user.id] = {
      units: '',
      weights: [],
      lastMessage: 23,
      status: 'idle',
      id: 77777777,
      is_bot: false,
      first_name: 'Maks',
      username: 'Username',
      language_code: 'ru'
    }

    const base = new Base(basePath);
    base.addUser(Object.assign({}, user, {status: 'idle'}));
    let baseFile = fs.readFileSync(basePath, 'utf8');
    JSON.stringify(JSON.parse(baseFile)).should.equal(JSON.stringify(target));
  });

  it('Get user status', () => {
    const base = new Base(basePath);
    base.addUser(Object.assign({}, {id: 77777777, status: 'idle'}));
    base.getUserStatus(77777777).should.equal('idle');
  });

  it('Get user last weight', () => {
    const base = new Base(basePath);
    base.addUser({id: 666, status: 'idle'});
    base.updateUser({id: 666, weight: {date: 626226262, weight: 66}});
    base.updateUser({id: 666, weight: {date: 626226288, weight: 55}});
    base.getUserLastWeight(666).weight.should.equal(55);
  });

  it('Checking existing user', () => {
    const base = new Base(basePath);
    base.addUser(Object.assign({}, {id: 555, status: 'idle'}));
    base.isUserExists(555).should.equal(true);
  });

  it('Checking nonexistent user', () => {
    const base = new Base(basePath);
    base.addUser(Object.assign({}, {id: 77777777, status: 'test'}));
    base.isUserExists(88888888).should.equal(false);
  });

  describe('Statistics.', () => {
    describe('Last 7 weights.', () => {
      it('No weights', () => {
        const base = new Base(basePath);
        base.addUser({id: 77777777, status: 'test'});
        base.getLastEightWeights(77777777).should.be.an('array');
        base.getLastEightWeights(77777777).length.should.equal(0);
      });

      it('1 weight', () => {
        const base = new Base(basePath);
        base.addUser({id: 77777777, status: 'test'});
        base.updateUser({id: 77777777, weight: {date: 626226262, weight: 11}});
        const data = base.getLastEightWeights(77777777);
        data.should.be.an('array');
        data.length.should.equal(1);
        data.map((e) => e.weight)[0].should.equal(11);
      });

      it('3 weights', () => {
        const base = new Base(basePath);
        base.addUser({id: 77777777, status: 'test'});
        base.updateUser({id: 77777777, weight: {date: 626226262, weight: 11}});
        base.updateUser({id: 77777777, weight: {date: 626226263, weight: 22}});
        base.updateUser({id: 77777777, weight: {date: 626226264, weight: 33}});
        const data = base.getLastEightWeights(77777777);
        data.should.be.an('array');
        data.length.should.equal(3);
        data.map((e) => e.weight).join().should.equal('11,22,33');
      });

      it('8 weights', () => {
        const base = new Base(basePath);
        base.addUser({id: 77777777, status: 'test'});
        base.updateUser({id: 77777777, weight: {date: 626226262, weight: 11}});
        base.updateUser({id: 77777777, weight: {date: 626226263, weight: 22}});
        base.updateUser({id: 77777777, weight: {date: 626226264, weight: 33}});
        base.updateUser({id: 77777777, weight: {date: 626226265, weight: 44}});
        base.updateUser({id: 77777777, weight: {date: 626226266, weight: 55}});
        base.updateUser({id: 77777777, weight: {date: 626226267, weight: 66}});
        base.updateUser({id: 77777777, weight: {date: 626226268, weight: 77}});
        base.updateUser({id: 77777777, weight: {date: 626226269, weight: 88}});
        const data = base.getLastEightWeights(77777777);
        data.should.be.an('array');
        data.length.should.equal(8);
        data.map((e) => e.weight).join().should.equal('11,22,33,44,55,66,77,88');
      });

      it('9 weights', () => {
        const base = new Base(basePath);
        base.addUser({id: 77777777, status: 'test'});
        base.updateUser({id: 77777777, weight: {date: 626226262, weight: 11}});
        base.updateUser({id: 77777777, weight: {date: 626226263, weight: 22}});
        base.updateUser({id: 77777777, weight: {date: 626226264, weight: 33}});
        base.updateUser({id: 77777777, weight: {date: 626226265, weight: 44}});
        base.updateUser({id: 77777777, weight: {date: 626226266, weight: 55}});
        base.updateUser({id: 77777777, weight: {date: 626226267, weight: 66}});
        base.updateUser({id: 77777777, weight: {date: 626226268, weight: 77}});
        base.updateUser({id: 77777777, weight: {date: 626226269, weight: 88}});
        base.updateUser({id: 77777777, weight: {date: 626226269, weight: 99}});
        const data = base.getLastEightWeights(77777777);
        data.should.be.an('array');
        data.length.should.equal(8);
        data.map((e) => e.weight).join().should.equal('22,33,44,55,66,77,88,99');
      });
    });
  });
});
