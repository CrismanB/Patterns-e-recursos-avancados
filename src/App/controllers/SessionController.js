const User = require("./../models/User");
const jwt = require("jsonwebtoken");
const auth = require("./../../config/auth");
const File = require("./../models/File");
class SessionController {
    async store(req, res) {
        const { email, password } = req.body;

        const user = await User.findOne({
            where: { email },
            include: [
                {
                    model: File,
                    as: "avatar",
                    attributes: ["id", "path", "url"]
                }
            ]
        });

        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        if (!(await user.checkPassword(password))) {
            return res.status(401).json({ error: "Password does not match" });
        }

        const { id, name, avatar, provider } = user;

        return res.json({
            user: { id, name, email, provider, avatar },
            token: jwt.sign({ id }, auth.secret, { expiresIn: auth.expireIn })
        });
    }
}

module.exports = new SessionController();
