import { join } from 'path'
import { check } from 'next-test-utils'
import {
  createNextApp,
  projectFilesShouldExist,
  projectFilesShouldNotExist,
  useTempDir,
} from './utils'

let testVersion
beforeAll(async () => {
  // TODO: investigate moving this post publish or create deployed GH#57025
  // tarballs to avoid these failing while a publish is in progress
  testVersion = 'canary'
  // const span = new Span({ name: 'parent' })
  // testVersion = (
  //   await createNextInstall({ onlyPackages: true, parentSpan: span })
  // ).get('next')
})

describe('create-next-app prompts', () => {
  it('should prompt user for choice if directory name is absent', async () => {
    await useTempDir(async (cwd) => {
      const projectName = 'no-dir-name'
      const childProcess = createNextApp(
        [
          '--ts',
          '--app',
          '--eslint',
          '--no-src-dir',
          '--no-tailwind',
          '--no-import-alias',
        ],
        {
          cwd,
        }
      )

      await new Promise<void>((resolve) => {
        childProcess.on('exit', async (exitCode) => {
          expect(exitCode).toBe(0)
          projectFilesShouldExist({
            cwd,
            projectName,
            files: ['package.json'],
          })
          resolve()
        })

        // enter project name
        childProcess.stdin.write(`${projectName}\n`)
      })

      const pkg = require(join(cwd, projectName, 'package.json'))
      expect(pkg.name).toBe(projectName)
    })
  })

  it('should prompt user for choice if --js or --ts flag is absent', async () => {
    await useTempDir(async (cwd) => {
      const projectName = 'ts-js'
      const childProcess = createNextApp(
        [
          projectName,
          '--app',
          '--eslint',
          '--no-tailwind',
          '--no-src-dir',
          '--no-import-alias',
        ],
        {
          cwd,
        },
        testVersion
      )

      await new Promise<void>((resolve) => {
        childProcess.on('exit', async (exitCode) => {
          expect(exitCode).toBe(0)
          projectFilesShouldExist({
            cwd,
            projectName,
            files: ['tsconfig.json'],
          })
          resolve()
        })

        // select default choice: typescript
        childProcess.stdin.write('\n')
      })
    })
  })

  it('should prompt user for choice if --tailwind is absent', async () => {
    await useTempDir(async (cwd) => {
      const projectName = 'tw'
      const childProcess = createNextApp(
        [
          projectName,
          '--ts',
          '--app',
          '--eslint',
          '--no-src-dir',
          '--no-import-alias',
        ],
        {
          cwd,
        },
        testVersion
      )

      await new Promise<void>((resolve) => {
        childProcess.on('exit', async (exitCode) => {
          expect(exitCode).toBe(0)
          projectFilesShouldExist({
            cwd,
            projectName,
            files: ['tailwind.config.ts'],
          })
          resolve()
        })

        // select default choice: tailwind
        childProcess.stdin.write('\n')
      })
    })
  })

  it('should prompt user for choice if --import-alias is absent', async () => {
    await useTempDir(async (cwd) => {
      const projectName = 'import-alias'
      const childProcess = createNextApp(
        [
          projectName,
          '--ts',
          '--app',
          '--eslint',
          '--no-tailwind',
          '--no-src-dir',
        ],
        {
          cwd,
        },
        testVersion
      )

      await new Promise<void>(async (resolve) => {
        childProcess.on('exit', async (exitCode) => {
          expect(exitCode).toBe(0)
          resolve()
        })
        let output = ''
        childProcess.stdout.on('data', (data) => {
          output += data
          process.stdout.write(data)
        })
        // cursor forward, choose 'Yes' for custom import alias
        childProcess.stdin.write('\u001b[C\n')
        // used check here since it needs to wait for the prompt
        await check(
          () => output,
          /How would you like to configure the import alias/
        )
        childProcess.stdin.write('@/something/*\n')
      })

      const tsConfig = require(join(cwd, projectName, 'tsconfig.json'))
      expect(tsConfig.compilerOptions.paths).toMatchInlineSnapshot(`
        {
          "@/something/*": [
            "./*",
          ],
        }
      `)
    })
  })

  it('should warn if asterisk is present in import alias', async () => {
    await useTempDir(async (cwd) => {
      const projectName = 'invalid-import-alias-asterisk-double-quote'
      const childProcess = createNextApp(
        [
          projectName,
          '--ts',
          '--app',
          '--no-eslint',
          '--no-tailwind',
          '--no-src-dir',
          '--import-alias=asterisk*/*',
          '--dry-run',
        ],
        {
          cwd,
        },
        testVersion
      )

      await new Promise<void>(async (resolve) => {
        let output = ''
        childProcess.stderr.on('data', (data) => {
          output += data
          process.stderr.write(data)
        })
        await check(() => output, /import alias cannot include asterisk/)
        // show current
        await check(() => output, /Current: asterisk/)
        // force exit
        childProcess.kill()
        resolve()
      })
    })
  })

  it('should warn if double quote is present in import alias', async () => {
    await useTempDir(async (cwd) => {
      const projectName = 'invalid-import-alias-asterisk-double-quote'
      const childProcess = createNextApp(
        [
          projectName,
          '--ts',
          '--app',
          '--no-eslint',
          '--no-tailwind',
          '--no-src-dir',
          '--import-alias=double"quote/*',
          '--dry-run',
        ],
        {
          cwd,
        },
        testVersion
      )

      await new Promise<void>(async (resolve) => {
        let output = ''
        childProcess.stderr.on('data', (data) => {
          output += data
          process.stderr.write(data)
        })
        await check(() => output, /or double quote/)
        // show current
        await check(() => output, /Current: double"quote/)
        // force exit
        childProcess.kill()
        resolve()
      })
    })
  })

  it('should warn if invalid pattern in import alias', async () => {
    await useTempDir(async (cwd) => {
      const projectName = 'invalid-import-alias'
      const childProcess = createNextApp(
        [
          projectName,
          '--ts',
          '--app',
          '--no-eslint',
          '--no-tailwind',
          '--no-src-dir',
          '--import-alias=invalid',
          '--dry-run',
        ],
        {
          cwd,
        },
        testVersion
      )

      await new Promise<void>(async (resolve) => {
        let output = ''
        childProcess.stderr.on('data', (data) => {
          output += data
          process.stderr.write(data)
        })
        await check(() => output, /import alias must follow the pattern/)
        // show current
        await check(() => output, /Current: invalid/)
        // force exit
        childProcess.kill()
        resolve()
      })
    })
  })

  it('should prompt user to confirm reset preferences', async () => {
    await useTempDir(async (cwd) => {
      const childProcess = createNextApp(
        ['--reset'],
        {
          cwd,
        },
        testVersion
      )

      await new Promise<void>(async (resolve) => {
        childProcess.on('exit', async (exitCode) => {
          expect(exitCode).toBe(0)
          resolve()
        })
        let output = ''
        childProcess.stdout.on('data', (data) => {
          output += data
          process.stdout.write(data)
        })
        await check(
          () => output,
          /Would you like to reset the saved preferences/
        )
        // cursor forward, choose 'Yes' for reset preferences
        childProcess.stdin.write('\u001b[C\n')
        await check(
          () => output,
          /The preferences have been reset successfully/
        )
      })
    })
  })

  it('should not create app if --dry-run', async () => {
    const projectName = 'dry-run'
    await useTempDir(async (cwd) => {
      const childProcess = createNextApp(
        [
          '--ts',
          '--app',
          '--eslint',
          '--no-src-dir',
          '--no-tailwind',
          '--no-import-alias',
          '--dry-run',
        ],
        {
          cwd,
        },
        testVersion
      )
      await new Promise<void>(async (resolve) => {
        childProcess.on('exit', async (exitCode) => {
          expect(exitCode).toBe(0)
          projectFilesShouldNotExist({
            cwd,
            projectName,
            files: ['package.json'],
          })
          resolve()
        })
        let output = ''
        childProcess.stdout.on('data', (data) => {
          output += data
          process.stdout.write(data)
        })
        await check(() => output, /Running a dry run, skipping installation/)

        // enter project name
        childProcess.stdin.write(`${projectName}\n`)
      })
    })
  })
})
