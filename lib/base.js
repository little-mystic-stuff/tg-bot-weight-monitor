const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const USER_TEMPLATE = {
  units: '',
  weights: [],
  lastMessage: null,
  status: null
};

function makeObj() {
    let result = {};
    for (let i = 0; i < arguments.length; i++) {
        Object.assign(result, JSON.parse(JSON.stringify(arguments[i])));
    }
    return result;
}

class Base {
  constructor(basename = 'base.json') {
    const adapter = new FileSync(basename);
    this.base = lowdb(adapter);
    this.base.defaults({users:{}}).write();
  }

  isUserExists(id) {
    return this.base.get('users').get(id).value() !== undefined;
  }

  addUser(user) {
    let newUser = makeObj({}, USER_TEMPLATE, user);
    this.base.set(`users[${user.id}]`, newUser).write();
  }

  getUserById(id) {
    return this.base.get('users').get(id).value();
  }

  getUserStatus(id) {
    return this.base.get('users').get(id).get('status').value();
  }

  getUserLastMessageId(id) {
    return this.base.get('users').get(id).get('lastMessage').value();
  }

  getUserUnits(id) {
    return this.base.get('users').get(id).get('units').value();
  }

  getUserLastWeight(id) {
    const size = this.base.get('users').get(id).get('weights').size().value();
    return this.base.get('users').get(id).get('weights').value()[size-1];
  }

  updateUser(data) {
    const newUserData = data;
    if(newUserData.weight !== undefined) {
      this.base.get(`users[${newUserData.id}].weights`).push(newUserData.weight).write();
    }
    const metadata = {}
    for (let key in newUserData) {
      if (key !== 'weight') {
        metadata[key] = newUserData[key]
      }
    }
    this.base.get('users').get(newUserData.id).assign(metadata).write();
  }

  getLastEightWeights(id) {
    const size = this.base.get('users').get(id).get('weights').size().value();
    if (size === 0) {
      return [];
    } else if (size <= 8) {
      return this.base.get('users').get(id).get('weights').value();
    } else {
      return this.base.get('users').get(id).get('weights').value().slice(-8);
    }
  }
}

module.exports = Base;
