import { describe, expect, it } from 'vitest';
import { client } from '../../../mocks/client';
import certs from '../../../../src/commands/certs';

describe('certs add', () => {
  it('exit code 1 for missing options', async () => {
    client.setArgv('certs', 'add');
    const exitCodePromise = certs(client);
    await expect(client.stderr).toOutput(
      'Invalid number of arguments to create a custom certificate entry. Usage:'
    );
    await expect(exitCodePromise).resolves.toEqual(1);
  });

  it('should track subcommand usage', async () => {
    client.setArgv('certs', 'add');
    const exitCodePromise = certs(client);
    await expect(exitCodePromise).resolves.toEqual(1);
    expect(client.telemetryEventStore).toHaveTelemetryEvents([
      {
        key: 'subcommand:add',
        value: 'add',
      },
    ]);
  });

  describe('--overwrite', () => {
    it('exit code 1 for deprecated `--overwrite` flag', async () => {
      client.setArgv('certs', 'add', '--overwrite');
      const exitCodePromise = certs(client);
      await expect(client.stderr).toOutput('Overwrite option is deprecated');
      await expect(exitCodePromise).resolves.toEqual(1);
    });

    it('should track usage of deprecated `--overwrite` flag', async () => {
      client.setArgv('certs', 'add', '--overwrite');
      const exitCodePromise = certs(client);
      await expect(exitCodePromise).resolves.toEqual(1);
      expect(client.telemetryEventStore).toHaveTelemetryEvents([
        {
          key: 'subcommand:add',
          value: 'add',
        },
        {
          key: 'flag:overwrite',
          value: 'TRUE',
        },
      ]);
    });
  });

  describe('--crt', () => {
    it('should track usage of `--crt` flag', async () => {
      client.setArgv('certs', 'add', '--crt', 'path/to/crt');
      const exitCodePromise = certs(client);
      await expect(exitCodePromise).resolves.toEqual(1);
      expect(client.telemetryEventStore).toHaveTelemetryEvents([
        {
          key: 'subcommand:add',
          value: 'add',
        },
        {
          key: 'option:crt',
          value: '[REDACTED]',
        },
      ]);
    });
  });

  describe('--key', () => {
    it('should track usage of `--key` flag', async () => {
      client.setArgv('certs', 'add', '--key', 'path/to/key');
      const exitCodePromise = certs(client);
      await expect(exitCodePromise).resolves.toEqual(1);
      expect(client.telemetryEventStore).toHaveTelemetryEvents([
        {
          key: 'subcommand:add',
          value: 'add',
        },
        {
          key: 'option:key',
          value: '[REDACTED]',
        },
      ]);
    });
  });

  describe('--ca', () => {
    it('should track usage of `--ca` flag', async () => {
      client.setArgv('certs', 'add', '--ca', 'path/to/ca');
      const exitCodePromise = certs(client);
      await expect(exitCodePromise).resolves.toEqual(1);
      expect(client.telemetryEventStore).toHaveTelemetryEvents([
        {
          key: 'subcommand:add',
          value: 'add',
        },
        {
          key: 'option:ca',
          value: '[REDACTED]',
        },
      ]);
    });
  });
});
