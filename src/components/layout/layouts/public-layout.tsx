import { AppShell, AppShellProps } from '@saas-ui/pro'

/**
 * The default public layout used for unauthenticated pages, like landingspages.
 */
export const PublicLayout: React.FC<AppShellProps> = ({
  children,
  ...rest
}) => {
  return <AppShell {...rest}>{children}</AppShell>
}
