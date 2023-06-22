
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CreateUserUseCase } from './create-user-usecase';

describe('CreateUserUseCase', () => {
  const userPostgresRepository = {
    save: vi.fn(),
    findByEmail: vi.fn(),
    delete: vi.fn(),
    upload: vi.fn(),
    download: vi.fn(),
  };

  const encrypter = {
    encrypt: vi.fn(),
    decrypt: vi.fn(),
  };

  const createUserUseCase = new CreateUserUseCase(userPostgresRepository, encrypter);

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should throw an error if user is already registered', async () => {
    const existingUser: any = {
      id: 'uuid',
      login: 'john',
      name: 'John Doe',
      email: 'johndoe@example.com',
    };

    userPostgresRepository.findByEmail.mockReturnValue(existingUser);

    const newUser: any = {
      name: 'Jane Doe',
      login: 'john',
      email: 'johndoe@example.com',
      emailConfirmation: 'johndoe@example.com',
      password: 'abcdefgh',
      passwordConfirmation: 'abcdefgh',
    };

    await expect(createUserUseCase.execute(newUser)).rejects.toThrowError('User already registered');
  });

  it('should create a new user if all data is valid and user is not already registered', async () => {
    const newUser: any = {
      name: 'Jane Doe',
      email: 'johndoe@example.com',
      emailConfirmation: 'johndoe@example.com',
      password: 'abcdefgh',
      passwordConfirmation: 'abcdefgh',
    };

    userPostgresRepository.findByEmail.mockReturnValue(null);
    userPostgresRepository.save.mockReturnValue(newUser);

    const result = await createUserUseCase.execute(newUser);

    expect(userPostgresRepository.findByEmail).toHaveBeenCalledWith(newUser.email);
    expect(userPostgresRepository.save).toHaveBeenCalledWith(newUser);
    expect(result).toEqual(newUser);
  });
});
