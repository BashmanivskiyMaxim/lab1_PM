import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { MongoRepository } from 'typeorm';
import { FormEntity } from './form.entity';

@Controller('form')
export class FormController {
  constructor(private readonly formRepository: MongoRepository<FormEntity>) {}
  @Post()
  create(@Body() form: Partial<FormEntity>) {
    return this.formRepository.create(form);
  }
  @Get()
  findAll() {
    return this.formRepository.find();
  }
  @Get(':id')
  public async getPost(@Param('id') id: string): Promise<FormEntity> {
    const post = await this.formRepository.findOne({ where: { id } });
    if (!post) {
      throw new NotFoundException();
    }
    return post;
  }
  @Put(':id')
  update(@Param('id') id: string, @Body() form: Partial<FormEntity>) {
    return this.formRepository.update(id, form);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.formRepository.delete(id);
  }
}
