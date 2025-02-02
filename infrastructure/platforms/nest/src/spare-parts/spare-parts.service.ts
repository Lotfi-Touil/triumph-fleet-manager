import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

interface SparePart {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
}

@Injectable()
export class SparePartsService {
  private readonly baseUrl: string;

  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {
    this.baseUrl =
      this.configService.get<string>('SPARE_PARTS_SERVICE_URL') ||
      'http://express:3001/api';
    console.log('SparePartsService initialized with baseUrl:', this.baseUrl);
  }

  async getSparePartById(id: string): Promise<SparePart> {
    try {
      console.log('Fetching spare part with ID:', id);
      const url = `${this.baseUrl}/spare-parts/${id}`;
      console.log('Full request URL:', url);

      console.log('Making HTTP request...');
      const response = await firstValueFrom(this.httpService.get(url));
      console.log('Response received:', response.data);
      return response.data;
    } catch (error) {
      console.error(
        'Error fetching spare part:',
        error.response?.data || error.message,
        '\nFull error:',
        error,
        '\nStack trace:',
        error.stack,
      );
      if (error.response?.status === 404) {
        throw new HttpException('Spare part not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Error fetching spare part',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateSparePartQuantity(id: string, quantity: number): Promise<void> {
    try {
      console.log('Updating spare part quantity:', { id, quantity });
      const sparePart = await this.getSparePartById(id);
      const newQuantity = sparePart.quantity - quantity;

      if (newQuantity < 0) {
        throw new HttpException('Insufficient stock', HttpStatus.BAD_REQUEST);
      }

      console.log('Sending update request:', {
        url: `${this.baseUrl}/spare-parts/${id}`,
        data: { ...sparePart, quantity: newQuantity },
      });

      await firstValueFrom(
        this.httpService.put(`${this.baseUrl}/spare-parts/${id}`, {
          ...sparePart,
          quantity: newQuantity,
        }),
      );
      console.log('Spare part quantity updated successfully');
    } catch (error) {
      console.error(
        'Error updating spare part quantity:',
        error.response?.data || error.message,
      );
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error updating spare part quantity',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getSparePartsByIds(ids: string[]): Promise<SparePart[]> {
    try {
      const promises = ids.map((id) => this.getSparePartById(id));
      return await Promise.all(promises);
    } catch {
      throw new HttpException(
        'Error fetching spare parts',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
