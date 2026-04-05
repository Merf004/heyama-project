import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectEntity, ObjectDocument } from './object.schema';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import type { Multer } from 'multer';
import { ObjectsGateway } from './objects.gateway';

@Injectable()
export class ObjectsService {
  private s3: S3Client;

  constructor(
    @InjectModel(ObjectEntity.name)
    private objectModel: Model<ObjectDocument>,
    private gateway: ObjectsGateway,
  ) {
    this.s3 = new S3Client({
      endpoint: process.env.S3_ENDPOINT,
      region: process.env.S3_REGION,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY as string,
        secretAccessKey: process.env.S3_SECRET_KEY as string,
      },
      forcePathStyle: true,
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    const key = `${Date.now()}-${file.originalname}`;

    const upload = new Upload({
      client: this.s3,
      params: {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      },
    });

    await upload.done();

    const projectRef = process.env.S3_ENDPOINT!.split('.')[0].replace('https://', '');
    return `https://${projectRef}.supabase.co/storage/v1/object/public/${process.env.S3_BUCKET_NAME}/${key}`;
  }

  async create(title: string, description: string, file: Express.Multer.File) {
    const imageUrl = await this.uploadImage(file);
    const object = new this.objectModel({ title, description, imageUrl });
    const saved = await object.save();
    this.gateway.notifyNewObject(saved);
    return saved;
  }

  async findAll() {
    return this.objectModel.find().sort({ createdAt: -1 });
  }

  async findOne(id: string) {
    return this.objectModel.findById(id);
  }

  async delete(id: string) {
    const object = await this.objectModel.findById(id);
    if (!object) return null;

    const key = object.imageUrl.split('/').pop();
    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
      }),
    );

    const deleted = await this.objectModel.findByIdAndDelete(id);
    this.gateway.notifyDeletedObject(id);
    return deleted;
  }
}