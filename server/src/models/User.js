const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address'
      ]
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false
    },
    nativeLanguage: {
      type: String,
      default: 'English',
      trim: true
    },
    targetLanguage: {
      type: String,
      default: 'Spanish',
      trim: true
    },
    proficiencyLevel: {
      type: String,
      enum: ['Beginner', 'Elementary', 'Intermediate', 'Upper Intermediate', 'Advanced', 'A1', 'A2', 'B1', 'B2', 'C1'],
      default: 'Beginner'
    },
    learningGoal: {
      type: String,
      default: 'Daily conversation',
      trim: true
    },
    dailyTargetMinutes: {
      type: Number,
      default: 15,
      min: 5,
      max: 180
    },
    role: {
      type: String,
      enum: ['learner', 'admin'],
      default: 'learner'
    },
    currentStreak: {
      type: Number,
      default: 1
    },
    lastLogin: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Hash password before save
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
