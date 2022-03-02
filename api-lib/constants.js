export const ValidateProps = {
  user: {
    username: { type: 'string', minLength: 4, maxLength: 20 },
    name: { type: 'string', minLength: 1, maxLength: 50 },
    password: { type: 'string', minLength: 4 },
    email: { type: 'string', minLength: 1 },
    bio: { type: 'string', minLength: 0, maxLength: 160 },
    company: { type: 'string', minLength: 0, maxLength: 50 }
  },
  post: {
    content: { type: 'string', minLength: 1, maxLength: 280 },
  },
  comment: {
    content: { type: 'string', minLength: 1, maxLength: 280 },
  },
};

export const ValidateDeviceProps = {
  device: {
    name: { type: 'string', minLength: 2, maxLength: 20 },
    energy: { type: 'string', minLength: 0, maxLength: 3 },
    deviceId: { type: 'string', minLength: 0, maxLength: 1000 },
  }
}


// MongoDB Collections
export const DEVICES = "devices"
export const POSTS = "posts"
