const User = require("../../models/user");
const { registerUser, authUser } = require("../../controllers/authController");
jest.mock('../../models/user.js');

process.env.JWT_SECRET = 'test_secret_key';

const req = {
  body: {
    fullName: 'John Doe',
    email: 'johndoe@example.com',
    password: 'password123'
  }
};

const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn() 
};


describe('registerUser', () => {
  it('should create a new user when valid fullName, email, and password are provided', async () => {
    User.findOne.mockResolvedValueOnce(null); 
    User.create.mockResolvedValueOnce({
      _id: 1,
      full_name: 'John Doe',
      email: 'johndoe@example.com',
      role: 'user'
    });

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      _id: expect.any(Number),
      fullName: 'John Doe',
      email: 'johndoe@example.com',
      role: 'user',
      token: expect.any(String)
    });

    const reqWithMissingFields = {
      body: {
        email: 'johndoe@example.com',
        password: 'password123'
      }
    };
  });

  it('should return an error when required fields are missing', async () => {
    const reqWithMissingFields = {
      body: {
        email: 'johndoe@example.com',
        password: 'password123'
      }
    };

    await expect(registerUser(reqWithMissingFields, res)).rejects.toThrow("Please enter all required fields");;
    expect(res.status).toHaveBeenCalledWith(400);
  }
  );

  it('should return an error when user already exists', async () => {
    User.findOne.mockResolvedValueOnce({
      _id: 1,
      full_name: 'John Doe',
      email: 'johndoe@example.com',
      role: 'user'
    });

    await expect(registerUser(req, res)).rejects.toThrow("User already exists");
    expect(res.status).toHaveBeenCalledWith(400);
  });
})

describe('authUser', () => {
  it('should successfully authenticate a user with correct email and password', async () => {
    const mockUser = {
      _id: 1,
      first_name: 'John',
      email: 'johndoe@example.com',
      role: 'user',
      matchPassword: jest.fn().mockResolvedValueOnce(true)
    };

    User.findOne.mockResolvedValueOnce(mockUser);

    req.body = {
      email: 'johndoe@example.com',
      password: 'correctPassword'
    };

    await authUser(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      _id: 1,
      fullName: 'John',
      email: 'johndoe@example.com',
      role: 'user',
      token: expect.any(String)
    });
  });

  it('should return an error if user with provided email exists but password does not match', async () => {
    const mockUser = {
      _id: 1,
      first_name: 'John',
      email: 'johndoe@example.com',
      role: 'user',
      matchPassword: jest.fn().mockResolvedValueOnce(false)
    };

    User.findOne.mockResolvedValueOnce(mockUser);

    req.body = {
      email: 'johndoe@example.com',
      password: 'incorrectPassword'
    };

    await authUser(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid email or password" });
  });

  it('should return an error if user with provided email does not exist', async () => {
    User.findOne.mockResolvedValueOnce(null);

    req.body = {
      email: 'nonexistent@example.com',
      password: 'anyPassword'
    };

    await authUser(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid email or password" });
  });
});
