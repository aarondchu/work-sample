const db = require("../../dbController");
var crypto = require("crypto");
const _authenticationService = require("../jwtAuthorization/authorizationService");

// this file will handle all business 
// logic with the database server


const login = (model) => {
    return getLoginInfo(model.email)
        .then(res => {
            if (res[0] && res[0].salt != "" && res[0].salt != null) {
                let salt = res[0].salt;
                let role = res[1].roleName;
                let hash = hashPassword(model.password, salt);
                if (hash === res[0].passwordHash) {
                    return getAllInfo(res[0].id)
                        .then(res => {
                            let allInfo = res[0];
                            if (allInfo.isAccountLocked)
                                return {
                                    Success: false,
                                    Item: {
                                        Message: "Account Locked"
                                    }
                                };
                            if (!allInfo.isEmailConfirmed)
                                return {
                                    Success: false,
                                    Item: {
                                        Message: "Email is not confirmed"
                                    }
                                };
                            let item = {
                                Id: allInfo.id,
                                FirstName: allInfo.firstName,
                                LastName: allInfo.lastName,
                                Email: model.email,
                                Roles: role,
                                AvatarUrl: allInfo.avatarUrl,
                                ProfileId: allInfo.profileId
                            };
                            //login function here to save token
                            let token = _authenticationService.encodeData(item);
                            //UsingTempPassword
                            if (allInfo.usingTempPassword) //based off sql, that usingtemppassword is at 1
                            {
                                item.Message = "Using temporary password";
                            };

                            return {
                                Success: true,
                                Item: item,
                                Token: token
                            };
                        })
                        .catch(err => {
                            throw new Error("Error in Getting all info", err)
                        })
                }
            }
            return {
                Success: false,
                Item: {
                    Message: "Invalid username / password combo"
                }
            }
        })
        .catch(err => {
            return {
                Success: false,
                Item: {
                    Message: "Unable to login at this time"
                }
            }
        })
}
const getAllInfo = (id) => {
    let params = [];
    db.buildParams(params, "id", db.TYPES.Int, id)
    return db.executeQuery("dbo.UserBase_SelectById", params)
        .then(res => res)
        .catch(err => { throw new ("Error getting all info", err) })
}
const getLoginInfo = (email) => {
    let params = [];
    db.buildParams(params, "email", db.TYPES.NVarChar, email)
    return db.executeQuery("dbo.GetLoginInfoByEmail", params)
        .then(res => res)
        .catch(err => { throw new ("Error getting Login Info:", err) })

}
const hashPassword = (pass, salt) => {
    return crypto.pbkdf2Sync(new Buffer(pass), new Buffer(salt, "base64"), 1, 20, 'sha1').toString("base64");
}

const getUserInfo = (email, id) => {
    return getLoginInfo(email)
        .then(resp => {
            let role = resp[1].roleName;
            return getAllInfo(id)
                .then(resp => {
                    let allInfo = resp[0];
                    let item = {
                        Id: allInfo.id,
                        FirstName: allInfo.firstName,
                        LastName: allInfo.lastName,
                        Email: email,
                        Roles: role,
                        AvatarUrl: allInfo.avatarUrl,
                        ProfileId: allInfo.profileId
                    };
                    return item;
                })
                .catch(err => { throw new Error("Error in retreiving user info", err) });
        })
        .catch(err => console.log("ERROR IN GETTING LOGIN INFO"))
}

module.exports = {
    login,
    hashPassword,
    getUserInfo
};
