import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserRole } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email ja cadastrado');
    }

    const user = this.userRepository.create({
      ...createUserDto,
      role: createUserDto.role ?? UserRole.ADMIN,
      isActive: createUserDto.isActive ?? true,
    });

    return this.userRepository.save(user);
  }

  async findAll() {
    return this.userRepository.find({
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('Usuario nao encontrado');
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('Usuario nao encontrado');
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      });

      if (existingUser) {
        throw new ConflictException('Email ja cadastrado');
      }
    }

    const updated = this.userRepository.merge(user, {
      ...updateUserDto,
      role: updateUserDto.role ?? user.role,
      isActive: updateUserDto.isActive ?? user.isActive,
    });

    return this.userRepository.save(updated);
  }

  async remove(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('Usuario nao encontrado');
    }

    await this.userRepository.softDelete(id);

    return { message: 'Usuario removido com sucesso' };
  }
}
