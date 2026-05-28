import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name field is highly mandatory"],
            trim: true
        },
        email: {
            type: String,
            required: [true, "Email field is highly mandatory"],
            unique: true,
            lowercase: true, // Prevents duplicate email casing issues
            trim: true
        },
        password: {
            type: String,
            required: [true, "Password field is highly mandatory"]
        }
    },
    {
        timestamps: true // Automatically tracks createdAt and updatedAt metadata rows
    }
);

// Conditional assignment ensures nodemon hot-reloads safely without compiling conflicts
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;