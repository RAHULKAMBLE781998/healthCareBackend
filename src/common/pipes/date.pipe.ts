import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseDatePipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata): Date {
    if (!value) {
      throw new BadRequestException('Date is required');
    }

    let parsedDate: Date;

    // Check if the value is a valid ISO 8601 date string
    parsedDate = new Date(value);
    if (!isNaN(parsedDate.getTime())) {
      return parsedDate;
    }

    // Check if the value is a valid epoch timestamp string
    const epochTimestamp = parseInt(value, 10);
    if (!isNaN(epochTimestamp)) {
      parsedDate = new Date(epochTimestamp);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate;
      }
    }

    throw new BadRequestException('Invalid date format');
  }
}
