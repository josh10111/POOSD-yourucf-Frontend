export function storeToken(tok: any): void {
  try {
    // Use tok.accessToken if your API returns that, or change to tok.jwtToken if needed.
    localStorage.setItem('token_data', tok.accessToken);
  } catch (e: any) {
    console.log(e.message);
  }
}

export function retrieveToken(): string | null {
  try {
    return localStorage.getItem('token_data');
  } catch (e: any) {
    console.log(e.message);
    return null;
  }
}
