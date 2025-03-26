import { SetMetadata, applyDecorators } from '@nestjs/common';

export const IS_PUBLIC = "isPublic";

const PublicAuthMiddleware = SetMetadata(IS_PUBLIC, true);
const PublicAuthSwagger = SetMetadata('swagger/apiSecurity', [{ public: [] }]);

export const Public = () => applyDecorators(
  PublicAuthMiddleware,
  PublicAuthSwagger,
);
