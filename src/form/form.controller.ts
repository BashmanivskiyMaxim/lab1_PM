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
  Res,
} from '@nestjs/common';
import { MongoRepository } from 'typeorm';
import { Form as FormEntity } from './form.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectId } from 'mongodb';
import { generatePDF } from './generatePDF';
import { Response } from 'express';

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
  @Get(':id/pdf')
  public async generatePDF(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const form = await this.formRepository.findOne({
        // @ts-expect-error
        _id: new ObjectId(id),
      });
      if (!form) {
        throw new NotFoundException();
      }
      const pdfBuffer = await generatePDF(form);
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=form_${id}.pdf`,
        'Content-Length': pdfBuffer.length,
      });

      res.end(pdfBuffer);
    } catch (error) {
      console.error('Error generating PDF:', error);
      res.status(500).send('Error generating PDF');
    }
  }
}
