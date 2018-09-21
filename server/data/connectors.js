import Sequelize from "sequelize"
import faker from "faker"
import _ from "lodash"

/**
 * Initialize database
 */

const db = new Sequelize("chatty", null, null, {
  dialect: "sqlite",
  storage: "./chatty.sqlite",
  logging: false, // mark this true if u wanna see logs
})

// define groups
const GroupModel = db.define("group", {
  name: { type: Sequelize.STRING, },
})

// define messages
const MessageModel = db.define("message", {
  text: { type: Sequelize.STRING, },
})

// define users
const UserModel = db.define("user", {
  email: { type: Sequelize.STRING, },
  username: { type: Sequelize.STRING, },
  password: { type: Sequelize.STRING, },
})

// users belong to multiple groups
UserModel.belongsToMany(GroupModel, { through: "GroupUser", })

// user belong to multiple users as friends
UserModel.belongsToMany(UserModel, { through: "Friends", as: "friends", })

// message are sent from users
MessageModel.belongsTo(UserModel)

// message are sent to groups
MessageModel.belongsTo(GroupModel)

// groups have multiple users
GroupModel.belongsToMany(UserModel, { through: "GroupUser", })

/**
 * create fake data
 */
const GROUPS = 4
const USERS_PER_GROUP = 5
const MESSAGE_PER_USER = 5

faker.seed(123) // get consistent data every time we reload app

db.sync({ force: true, }).then(() =>
  _.times(GROUPS, () =>
    GroupModel.create({
      name: faker.lorem.words(3),
    })
      .then(group =>
        _.times(USERS_PER_GROUP, () => {
          const password = faker.internet.password()
          return group
            .createUser({
              email: faker.internet.email(),
              username: faker.internet.userName(),
              password,
            })
            .then(user => {
              console.log(
                "{email, username, password}",
                `{${user.email}, ${user.username}, ${password}}`
              )
              _.times(MESSAGES_PER_USER, () =>
                MessageModel.create({
                  userId: user.id,
                  groupId: group.id,
                  text: faker.lorem.sentences(3),
                })
              )
              return user
            })
        })
      )
      .then(userPromises => {
        // make users friends with all users in the group
        Promise.all(userPromises).then(users => {
          _.each(users, (current, i) => {
            _.each(users, (user, j) => {
              if (i !== j) {
                current.addFriend(user)
              }
            })
          })
        })
      })
  )
)

const Group = db.models.group
const User = db.models.user
const Message = db.models.message

export { Group, User, Message }
