/* eslint-disable @typescript-eslint/ban-ts-comment */
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
import { Form as FormEntity } from './form.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectId } from 'mongodb';

@Controller('form')
export class FormController {
  constructor(
    @InjectRepository(FormEntity)
    private readonly formRepository: MongoRepository<FormEntity>,
  ) {}
  @Post()
  create(@Body() form: Partial<FormEntity>) {
    form.createdAt = new Date();
    return this.formRepository.save(form);
  }
  @Get('/getAll')
  findAll(): Promise<FormEntity[]> {
    return this.formRepository.find();
  }
  @Get(':id')
  public async getPost(@Param('id') id: string): Promise<FormEntity> {
    // @ts-expect-error
    const post = await this.formRepository.findOne({ _id: new ObjectId(id) });
    if (!post) {
      throw new NotFoundException();
    }
    return post;
  }
  @Put(':id')
  async update(@Param('id') id: string, @Body() form: Partial<FormEntity>) {
    let existingForm = await this.formRepository.findOne({
      // @ts-expect-error
      _id: new ObjectId(id),
    });
    if (!existingForm) {
      existingForm = this.formRepository.create(form);
      existingForm.createdAt = new Date();
    } else {
      this.formRepository.merge(existingForm, form);
    }
    return this.formRepository.save(existingForm);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.formRepository.delete(id);
  }
}
