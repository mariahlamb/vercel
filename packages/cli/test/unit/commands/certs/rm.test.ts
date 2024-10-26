import { describe, expect, it } from 'vitest';
import { client } from '../../../mocks/client';
import { useUser } from '../../../mocks/user';
import { useCert } from '../../../mocks/certs';
import certs from '../../../../src/commands/certs';

describe('certs rm', () => {
  it('should print error with exit code 1 if no arguments are provided', async () => {
    client.setArgv('certs', 'rm');
    const exitCodePromise = certs(client);
    await expect(client.stderr).toOutput(
      'Invalid number of arguments. Usage: `vercel certs rm <id or cn>`'
    );
    await expect(exitCodePromise).resolves.toEqual(1);
  });

  it('should track subcommand invocation', async () => {
    client.setArgv('certs', 'rm');
    const exitCodePromise = certs(client);
    await expect(exitCodePromise).resolves.toEqual(1);
    expect(client.telemetryEventStore).toHaveTelemetryEvents([
      {
        key: 'subcommand:remove',
        value: 'rm',
      },
    ]);
  });

  describe('[id]', () => {
    it('should prompt for confirmation', async () => {
      useUser();
      useCert();

      client.setArgv('certs', 'rm', 'cert-id');
      const exitCodePromise = certs(client);

      await expect(client.stderr).toOutput('Are you sure?');
      client.stdin.write('y');

      await expect(client.stderr).toOutput('Success! 1 Certificate removed');
      await expect(exitCodePromise).resolves.toEqual(0);
    });

    it('should track domain / cert id positional argument', async () => {
      useUser();
      useCert();

      client.setArgv('certs', 'rm', 'cert-id');
      const exitCodePromise = certs(client);

      await expect(client.stderr).toOutput('Are you sure?');
      client.stdin.write('y');

      await expect(exitCodePromise).resolves.toEqual(0);
      expect(client.telemetryEventStore).toHaveTelemetryEvents([
        {
          key: 'subcommand:remove',
          value: 'rm',
        },
        {
          key: 'argument:id',
          value: '[REDACTED]',
        },
      ]);
    });
  });
});
