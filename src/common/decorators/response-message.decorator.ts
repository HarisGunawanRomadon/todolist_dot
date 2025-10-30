import { SetMetadata } from '@nestjs/common';

export const RES_MESSAGE = 'res_message';
export const ResponseMessage = (message: string) =>
  SetMetadata(RES_MESSAGE, message);
