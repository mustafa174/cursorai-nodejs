import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  isEmailVerified: boolean;
  displayPicture?: {
    data: Buffer;
    contentType: string;
  };
  phone?: string;
  address?: string;
  country?: string;
  otp?: string;
  otpExpires?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name must not exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't include password in queries by default
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    displayPicture: {
      data: Buffer,
      contentType: String,
    },
    phone: {
      type: String,
      required: false,
      minlength: [6, 'Phone must be at least 6 characters'],
      maxlength: [20, 'Phone must not exceed 20 characters'],
    },
    address: {
      type: String,
      required: false,
      maxlength: [200, 'Address must not exceed 200 characters'],
    },
    country: {
      type: String,
      required: false,
      maxlength: [100, 'Country must not exceed 100 characters'],
    },
    otp: {
      type: String,
      select: false,
    },
    otpExpires: {
      type: Date,
      select: false,
    },
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpires: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};

// Remove sensitive data from JSON responses
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.otp;
  delete obj.otpExpires;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpires;

  // Replace displayPicture buffer with URL
  if (obj.displayPicture?.data) {
    obj.displayPicture = {
      url: `${process.env.BASE_URL || 'http://localhost:5000'}/api/auth/display-picture/${obj._id}`,
      contentType: obj.displayPicture.contentType,
    };
  }

  return obj;
};

const User = mongoose.model<IUser>('User', userSchema);

export default User;
