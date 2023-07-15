import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserRepository } from './user.repository';
import { compare } from 'bcrypt';
import { AuthDto } from './dtos/auth.dto';
import { ErrorMessage } from '../utils/enums/error-message.enum';
import { UpdateUserDto } from './dtos/update-user.dto';
import { JwtService } from '@nestjs/jwt';
import { hashPassword } from '../utils/hash-password';

@Injectable()
export class UserService {
  constructor(
    private readonly repository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async create(createDto: CreateUserDto) {
    const { password } = createDto;

    const userWithSameEmail = await this.repository.findByEmailWithPassword(
      createDto.email,
    );

    if (userWithSameEmail) {
      throw new ConflictException('User with same email already exists');
    }

    const hashedPassword = await hashPassword(password);

    return this.repository.create({
      ...createDto,
      password: hashedPassword,
    });
  }

  async auth(authDto: AuthDto) {
    const { email, password } = authDto;

    const user = await this.repository.findByEmailWithPassword(email);

    if (!user) {
      throw new NotFoundException(ErrorMessage.WrongCredentials);
    }

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(ErrorMessage.WrongCredentials);
    }

    const token = this.jwtService.sign({ sub: user._id });

    return { token };
  }

  async update(id: string, updateDto: UpdateUserDto) {
    if (updateDto.password) {
      const hashedPassword = await hashPassword(updateDto.password);
      updateDto.password = hashedPassword;
    }

    const editedUser = await this.repository.update(id, updateDto);

    if (!editedUser) {
      throw new NotFoundException(ErrorMessage.UserNotFound);
    }

    return editedUser;
  }

  async delete(id: string) {
    const deletedUser = await this.repository.delete(id);

    if (!deletedUser) {
      throw new NotFoundException(ErrorMessage.UserNotFound);
    }

    // TODO also delete all tasks

    return deletedUser;
  }

  async findById(id: string) {
    const user = await this.repository.findById(id);

    if (!user) {
      throw new NotFoundException(ErrorMessage.UserNotFound);
    }

    return user;
  }
}
