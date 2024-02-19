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

@Controller('form')
export class FormController {
  constructor(
    @InjectRepository(FormEntity)
    private readonly formRepository: MongoRepository<FormEntity>,
  ) {}
  @Post()
  create(@Body() form: Partial<FormEntity>) {
    return this.formRepository.save(form);
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
  // @Get(':id/pdf')
  // public async generatePDF(
  //   @Param('id') id: string,
  //   @Res() res: Response,
  // ): Promise<void> {
  //   const form = await this.formRepository.findOne({ where: { id } });
  //   if (!form) {
  //     throw new NotFoundException();
  //   }
  //   const pdfStream = generatePDF(form);
  //   res.setHeader('Content-Type', 'application/pdf');
  //   pdfStream.pipe(res);
  // }
}
