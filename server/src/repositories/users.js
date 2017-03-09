
import UserModelFactory from '../models/users';

export default ({ db }) => {

    let UserModel = UserModelFactory({ db });

    return {
        findOrCreate: (payload) => new Promise(resolve => {
            UserModel
                .findOrCreate({
                    where: { username: payload.username },
                    defaults: payload
                })
                .spread((user, created) => {
                    resolve({ user, created })
                })
        }),
        findById: username => UserModel.findById(username)
    }
}