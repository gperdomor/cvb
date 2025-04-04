import { utils } from '@commitlint/config-nx-scopes';
import type { UserConfig } from '@commitlint/types';
import { RuleConfigSeverity } from '@commitlint/types';

const Configuration: UserConfig = {
  extends: ['@commitlint/config-conventional', '@commitlint/config-nx-scopes'],
  rules: {
    'scope-enum': (async (ctx) => {
      const projects = await utils.getProjects(ctx);
      return [RuleConfigSeverity.Error, 'always', ['repo', 'deps', 'release', ...projects]];
    }) as any,
  },
};

export default Configuration;
