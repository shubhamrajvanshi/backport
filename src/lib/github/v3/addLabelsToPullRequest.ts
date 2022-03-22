import { Octokit } from '@octokit/rest';
import { ora } from '../../../lib/ora';
import { ValidConfigOptions } from '../../../options/options';
import { logger } from '../../logger';

export async function addLabelsToPullRequest(
  {
    githubApiBaseUrlV3,
    repoName,
    repoOwner,
    accessToken,
    interactive,
  }: ValidConfigOptions,
  pullNumber: number,
  labels: string[]
): Promise<void> {
  const text = `Adding labels: ${labels.join(', ')}`;
  logger.info(text);
  const spinner = ora(interactive, text).start();

  try {
    const octokit = new Octokit({
      auth: accessToken,
      baseUrl: githubApiBaseUrlV3,
      log: logger,
    });

    await octokit.issues.addLabels({
      owner: repoOwner,
      repo: repoName,
      issue_number: pullNumber,
      labels,
    });

    spinner.succeed();
  } catch (e) {
    spinner.fail();
    logger.error(`Could not add labels to PR ${pullNumber}`, e);
  }
}
