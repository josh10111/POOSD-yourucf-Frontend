const app_name = 'yourucf'

export function buildPath(route: string): string {
    if (import.meta.env.MODE === 'production') {
      return `http://${app_name}.com/${route}`;
    } else {
      return `http://167.99.59.149:5000/${route}`;
    }
  }