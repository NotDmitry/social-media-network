class AccessToken {
  static #instance: AccessToken | null = null;

  #token: string | null;

  private constructor() {
    this.#token = null;
  }

  public static getInstance(): AccessToken {
    AccessToken.#instance ??= new AccessToken();

    return AccessToken.#instance;
  }

  public get() {
    return this.#token;
  }

  public set(token: string) {
    this.#token = token;
  }

  public clear() {
    this.#token = null;
  }
}

export const accessToken = AccessToken.getInstance();
