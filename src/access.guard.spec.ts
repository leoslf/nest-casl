import { vi } from 'vitest';
import { Test } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';

import { AccessGuard } from './access.guard';
import { AccessService } from './access.service';
import { CaslConfig } from './casl.config';

describe('AccessGuard', () => {
  const req = new Object();
  let publicMetadata = false;
  let abilityMetadata: unknown = {};
  let accessGuard: AccessGuard;
  let accessService: AccessService;

  beforeEach(async () => {
    CaslConfig.getRootOptions = vi.fn().mockImplementation(() => ({}));

    const moduleRef = await Test.createTestingModule({
      providers: [
        AccessGuard,
        {
          provide: Reflector,
          useValue: {
            get: vi.fn().mockImplementation(() => abilityMetadata),
            getAllAndOverride: vi.fn().mockImplementation(() => publicMetadata),
          },
        },
        { provide: AccessService, useValue: { canActivateAbility: vi.fn() } },
      ],
    }).compile();

    accessService = moduleRef.get<AccessService>(AccessService);
    accessGuard = moduleRef.get<AccessGuard>(AccessGuard);
  });

  it('passes context request and ability to AccessService.canActivateAbility method', async () => {
    const context = new ExecutionContextHost([req, undefined, { req }]);
    await accessGuard.canActivate(context);
    expect(accessService.canActivateAbility).toBeCalledWith(req, abilityMetadata);
  });

  it('passes context request and ability to AccessService.canActivateAbility method', async () => {
    abilityMetadata = undefined;
    const context = new ExecutionContextHost([req, undefined, { req }]);
    await accessGuard.canActivate(context);
    expect(accessService.canActivateAbility).toBeCalledWith(req, abilityMetadata);
  });

  it('should return true if the route is public', async () => {
    publicMetadata = true;
    const context = new ExecutionContextHost([req, undefined,  { req }]);
    await accessGuard.canActivate(context);
    expect(accessService.canActivateAbility).not.toBeCalled();
  });
});
