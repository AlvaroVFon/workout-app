module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'subject-case': [2, 'always', ['sentence-case', 'lower-case']],
    'type-enum': [2, 'always', ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore', 'perf', 'ci', 'wip']],
    'header-max-length': [0, 'always', 0],
    'body-max-length': [0, 'always', 0],
    'body-max-line-length': [0, 'always', 0],
    'footer-max-length': [0, 'always', 0],
  },
}
