export class DomainError extends Error {
  constructor(
    message: string,
    public readonly status = 400,
    public readonly code = "DOMAIN_ERROR",
  ) {
    super(message);
    this.name = "DomainError";
  }
}
