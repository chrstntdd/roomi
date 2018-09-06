import { default as User, userSchema } from '../../models/user';

type GraphQlErrorType = 'CLIENT' | 'SERVER';

class ApiError extends Error {
  constructor(type: GraphQlErrorType, errors) {
    super(errors);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }

    this.extensions = {
      date: new Date(),
      type,
      ...errors
    };
  }
}

export default {
  signUp: async (_, { email, username, password }) => {
    try {
      const newUser = await new User({
        email,
        username,
        password
      }).save();

      return { token: newUser.createToken(newUser._id) };
    } catch (error) {
      if (error.code === 11000) {
        throw new ApiError('CLIENT', {
          message: 'A user already exists with that username and or email address'
        });
      }
      throw new ApiError('SERVER', {
        message: 'An unknown error occurred. Please try again.'
      });
    }
  },

  signIn: async (_, { email, password }) => {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('There is no user with that email');
    } else if (!(await user.authUser(password))) {
      throw new Error('Incorrect email or password');
    } else {
      return user.createToken(user._id);
    }
  },

  getAllUsers: async () => {
    const allUsers = await User.find();
    if (!allUsers) {
      throw new Error('There are no users');
    } else {
      return allUsers;
    }
  },

  getUser: async (_, { id }) => {
    const user = await User.findById(id);
    if (!user) {
      throw new Error("That user doesn't exist, boi");
    } else {
      return user;
    }
  },

  updateUser: async (_, { id, ...args }) => {
    try {
      return await User.findByIdAndUpdate(id, { $set: args }, { new: true });
    } catch (err) {
      throw new Error(err);
    }
  },

  deleteUser: async (_, { id }) => {
    try {
      return await User.findByIdAndRemove(id);
    } catch (err) {
      throw new Error(err);
    }
  }
};
