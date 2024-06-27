const dbRetriever = require('./dbretriever');
const encrypt = require("./encrypt");
const jwt = require("jsonwebtoken");

module.exports.handleLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
    
        // Check if email and password are provided
        if (!email || !password) {
          return res.status(400).json({ error: "Email and password are required" });
        }
    
        // Fetch user from database
        const user = await dbRetriever.fetchOneDocument("users", { email: email });
    
        // If user not found, return error
        if (!user) {
          return res.status(401).json({ error: "Invalid email or password" });
        }
    
        // If user doesn't have a hashed password, create one(this is for first time for admin creation )
        if (!user.hashedValue) {
          user.hashedValue = await encrypt.encryption(password);
          await dbRetriever.updateOne(
            "users",
            { email: email },
            { $set: { hashedValue: user.hashedValue } }
          );
        }
    
        // Compare provided password with stored hash
        const isPasswordValid = await encrypt.compareHashes(
          password,
          user.hashedValue
        );
    
        // If password is invalid, return error
        if (!isPasswordValid) {
          return res.status(401).json({ error: "Invalid email or password" });
        }
    
        // Create JWT token----not useful now*******************************
        let authData = {
            name: user.name,
            email: user.email,
            role: user.role,
        }

        const token = jwt.sign({authData}, process.env.JWT_SECRET, {
          expiresIn: "24h",
        });

        authData.token = token;
    
        // Send successful response with token
        res.status(200).json(authData);
      } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: "An error occurred during login" });
      }
}

module.exports.resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        // Check if email and new password are provided
        if (!email || !newPassword) {
            return res
            .status(400)
            .json({ error: "Email and new password are required" });
        }

        // Find user by email
        const user = await dbRetriever.fetchOneDocument("users", { email });

        // If user not found, return error
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Hash the new password
        const hashedNewPassword = await encrypt.encryption(newPassword);

        // Update user's password in the database
        await dbRetriever.updateOne(
            "users",
            { email },
            { $set: { hashedValue: hashedNewPassword } }
        );

        // Send success response
        res.json({ message: "Password reset successfully" });
    } catch (err) {
        console.error("Reset password error:", err);
        res.status(500).json({ error: "Error resetting password" });
    }
}

module.exports.jwtParser = (req, res, next) => {
    const claimToken = req.headers.authorization
    let verifiedAuthData;

    console.log('claim token')
    console.log(claimToken);

    try {
      if (claimToken && claimToken != "none") {
        verifiedAuthData = jwt.verify(claimToken, process.env.JWT_SECRET).authData;
      } else {
        verifiedAuthData = null;
      } 
    } catch (e) {
      console.error("Error verifying auth data: " + e);
      verifiedAuthData = null;
    } 

    console.log("Verified auth data");
    console.log(verifiedAuthData);

    req.authData = verifiedAuthData;

    next();
}

module.exports.verifyAdmin = (req, res, next) => {
  if (req.authData?.role ?? undefined === "admin") {
    console.log("User " + req.authData.email + " authenticated as admin")
    return next();
  }

  return res.status(401).json({error: "Unauthorized"})
}