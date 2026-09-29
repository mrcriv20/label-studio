import dns from 'node:dns'

const defaultServers = dns.getServers()

/** Per-machine override for Electron runtimes that discover only loopback DNS. */
export function configureDatabaseDns(value?: string): void {
  if (!value?.trim()) {
    dns.setServers(defaultServers)
    return
  }
  const servers = value.split(',').map(server => server.trim()).filter(Boolean)
  if (!servers.length) throw new Error('Database DNS must contain DNS server IP addresses.')
  try {
    dns.setServers(servers)
  } catch {
    throw new Error('Database DNS must contain comma-separated DNS server IP addresses.')
  }
}
