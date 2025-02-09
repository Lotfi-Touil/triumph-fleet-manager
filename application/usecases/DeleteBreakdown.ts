import { Injectable } from '@nestjs/common';
import { BreakdownRepository } from '../ports/repositories/BreakdownRepository';

@Injectable()
export class DeleteBreakdown {
  constructor(private readonly breakdownRepository: BreakdownRepository) {}

  async execute(id: string): Promise<void> {
    const breakdown = await this.breakdownRepository.findById(id);
    if (!breakdown) {
      throw new Error('Breakdown not found');
    }
    await this.breakdownRepository.delete(id);
  }
} 