import User from "../models/User.js"
import jwt from 'jsonwebtoken'

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

export const signup = async (req, res) => {
    const { name, email, password, age, gender, genderPreference } = req.body
    try {
        if (!name || !email || !password || !age || !gender || !genderPreference) {
            return res.status(400).json({
                msg: "all fields are required",
                success: false
            })
        }
        if (age < 18) {
            return res.status(400).json({
                msg: "you must be 18 years old",
                success: false
            })
        }
        if (password.length < 6) {
            return res.status(400).json({
                msg: "password must be atleast 6 characters",
                success: false
            })
        }

        const newUser = await User.create({
            name, email, password, age, gender, genderPreference
        })
        const token = signToken(newUser._id)

        res.cookie('jwt', token, {
            maxAge: 604800000,// 7 days in milliseconds
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
        })
        res.status(201).json({
            success: true,
            user: newUser
        })

    } catch (error) {
        console.log('error in signup controller:', error)
        res.status(500).json({ success: false, msg: 'server error' })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body
    try {
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                msg: "all fields are required"
            })
        }
        const user = await User.findOne({ email }).select('+password')
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({
                msg: "Invalid email or password",
                success: false
            })
        }
        const token = signToken(user._id);

        res.cookie('jwt', token, {
            maxAge: 604800000,
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV = "production" 
        })

        res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        console.log("error in login controller: ", error);
        res.status(500).json({
            success: false,
            message: "server error"
        })
    }
}
export const logout = async (req, res) => { 
    res.clearCookie("jwt")
    res.status(200).json({
        success: true,
        message: "logged out successfully"
    })
}