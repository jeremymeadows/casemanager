type Ok<T> = { ok: true; value: T };
type Err<E> = { ok: false; error: E };

export class Result<T, E = Error> {
  private result: Ok<T> | Err<E>;

  constructor(ok: boolean, data: T | E) {
    if (ok) {
      this.result = { ok: true, value: data as T };
    } else {
      this.result = { ok: false, error: data as E };
    }
  }

  static Ok<T>(value: T): Result<T, any> {
    return new Result(true, value);
  }

  static Err<E>(error: E): Result<any, E> {
    return new Result(false, error);
  }

  static from<T, E>(value: T | null | undefined, err?: E): Result<T, E | Error> {
    if (value === null || value === undefined || value instanceof Error) {
      return Result.Err(err ?? new Error());
    } else {
      return Result.Ok(value);
    }
  }

  get ok(): boolean {
    return this.result.ok;
  }

  get value(): T {
    if (!this.result.ok) {
      throw new Error("Tried to read value of an error result", {
        cause: this.error
      });
    }
    return this.result.value;
  }

  get error(): E {
    if (this.result.ok) {
      throw new Error("Tried to read error of a success result", {
        cause: this.value
      });
    }
    return (this.result as Err<E>).error;
  }

  expect(exception?: E): T {
    if (!this.result.ok) {
      throw exception ?? new Error("Expected a successful result, but got an error", {
        cause: this.error
      });
    }

    return this.value;
  }

  value_or(val: T): T {
    return this.result.ok ? this.result.value : val;
  }

  match<R>({ ok, err }: { ok: (value: T) => R; err: (error: E) => R }): R {
	  return this.result.ok ? ok(this.value) : err(this.error);
  }
}
