import { nextTestSetup } from 'e2e-utils'

describe('allow-development-build', () => {
  describe('with NODE_ENV set to development', () => {
    const { next } = nextTestSetup({
      files: __dirname,
      env: {
        NODE_ENV: 'development',
      },
      nextConfig: {
        experimental: {
          allowDevelopmentBuild: true,
        },
      },
    })

    it('should warn about a non-standard NODE_ENV', () => {
      expect(next.cliOutput).toContain(
        'You are using a non-standard "NODE_ENV" value in your environment'
      )
    })

    it.each(['app-page', 'pages-page'])(
      `should show React development errors in %s`,
      async (page) => {
        const browser = await next.browser(page, {
          pushErrorAsConsoleLog: true,
        })
        const logs = await browser.log()

        const errorLogs = logs.filter((log) => log.source === 'error')

        expect(errorLogs).toEqual(
          expect.arrayContaining([
            {
              message:
                'There was an error while hydrating. Because the error happened outside of a Suspense boundary, the entire root will switch to client rendering.',
              source: 'error',
            },
          ])
        )
      }
    )
  })

  describe('with NODE_ENV not set to development', () => {
    const { next } = nextTestSetup({
      files: __dirname,
      skipStart: true,
      nextConfig: {
        experimental: {
          allowDevelopmentBuild: true,
        },
      },
    })

    it('should fail the build with a message about not setting NODE_ENV', async () => {
      await next.start().catch(() => {})
      expect(next.cliOutput).toContain(
        "The experimental.allowDevelopmentBuild option requires NODE_ENV to be explicitly set to 'development'"
      )
    })
  })
})
