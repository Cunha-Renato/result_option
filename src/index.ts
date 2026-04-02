/**
 * Represents a value that may or may not exist.
*/
export class Option<T> {
  #val: T | null;
  
  private constructor(value: T | null) {
    this.#val = value;
  }

  /**
   *
   * @param value - The value to be `Some`.
   * @returns Option<T> with `Some` = `value`.
   * @example
   * const option = Option.Some(10);
   */
  static Some<T>(value: T): Option<T> {
    return new Option(value);
  }
  
  /**
   * 
   * @returns Option<T> with `None`.
   * @example
   * const option = Option.None();
   */
  static None(): Option<never> {
    return new Option(null) as Option<never>;
  }
  
  /**
   * 
   * @returns true if the `Option` is a `Some` value.
   * @example
   * const x = Option.Some(10);
   * x.is_some(); // -> true
   */
  is_some(): boolean {
    return this.#val ? true : false;
  }

  /**
   * 
   * @returns true if the `Option` is `None`.
   * @example
   * const x = Option.None();
   * x.is_none(); // -> true
   */
  is_none(): boolean {
    return !this.is_some();
  }
  
  /**
   * @returns `true` if the `Option` is a `Some` and the value inside of it maches the predicate.
   * @example
   * const x = Option.Some(2);
   * x.is_some_and((x) => x > 1); // -> true
   */
  is_some_and(f: (value: T) => boolean): boolean {
    return this.match({
      Some: f,
      None: () => false
    });
  }
  
  /**
   *
   * @returns `true` if the `Option` is `None` or the value inside of it matches the predicate.
   * @example
   * const x = Option.Some(2);
   * x.is_none_or((x) => x > 1); // -> true
   * 
   * const y = Option.None();
   * y.is_none_or((x) => x > 1); // -> true
   */
  is_none_or(f: (value: T) => boolean): boolean {
    return this.match({
      Some: f,
      None: () => true,
    });
  }
  
  /**
   * 
   * @returns the contained `Some` value.
   * @throws {Error} if `None`.
   * @example
   * const x = Option.Some("hello");
   * const y = x.unwrap(); // y = "hello"
   * 
   * const x = Option.None();
   * const y = x.unwrap(); // throws Error
   */
  unwrap(): T {
    return this.match({
      Some: (val) => val,
      None: () => {
        throw new Error("called Option.unwrap() on a none value");
      }
    });
  }
  
  /**
   * @param dft default value.
   * @returns the contained `Some` value or `dft`.
   * @example
   * const x = Option.Some("car");
   * const y = x.unwrap_or("bus"); // -> y = "car"
   * 
   * const x = Option.None();
   * const y = x.unwrap_or("bus"); // -> y = "bus"
  */
  unwrap_or(dft: T): T {
    return this.match({
      Some: (val) => val,
      None: () => dft
    });
  }
  
  /**
   * @param f lambda.
   * @returns the contained `Some` value or calls `f` and returns its result.
   * @example
   * const x = Option.Some("car");
   * const y = x.unwrap_or_else(() => "bus"); // -> y = "car"
   * 
   * const x = Option.None();
   * const y = x.unwrap_or(() => "bus"); // -> y = "bus"
  */
  unwrap_or_else(f: () => T): T {
    return this.match({
      Some: (val) => val,
      None: f
    });
  }
  
  /**
   * 
   * @param msg message in case of a fail.
   * @returns the contained `Some` value.
   * @throws {Error} if the `Option` is `None` with the message `msg`.
   * @example
   * const x = Option.Some("value");
   * const y = x.expect("I want it now!"); // -> y = "value"
   * 
   * const x = Option.None();
   * const y = x.expect("I want it now!"); // -> throws Error("I want it now!")
   */
  expect(msg: string): T {
    return this.match({
      Some: (val) => val,
      None: () => {
        throw new Error(msg)
      }
    });
  }
  
  /**
   * @param f lambda.
   * @returns `Option<U>` from `Option<T>` by applying `f` to the value if `Some` and `None` otherwise.
   * @example
   * const x = Option.Some(10);
   * const y = x.map((val) => val * 2); // -> y = Option.Some(20)
   * 
   * const x = Option.None();
   * const y = x.map((val) => val * 2); // -> y = Option.None
   */
  map<U>(f: (val: T) => U): Option<U> {
    return this.match({
      Some: (val) => Option.Some(f(val)),
      None: () => Option.None()
    });
  }
  
  /**
   * 
   * @param dft default value.
   * @param f lambda.
   * @returns `dft` if `None` or applies `f` to the value if `Some`.
   * @example
   * const x = Option.Some(10);
   * const y = x.map_or(37, (val) => val*2); // -> y = 20
   * 
   * const x = Option.None();
   * const y = x.map_or(37, (val) => val*2); // -> y = 37
   */
  map_or<U>(dft: U, f: (val: T) => U): U {
    return this.match({
      Some: f,
      None: () => dft
    });
  }

  /**
   * 
   * @param dft default lambda.
   * @param f lambda.
   * @returns calls `dft` if `None` or applies `f` to the value if `Some`.
   * @example
   * const x = Option.Some(10);
   * const y = x.map_or_else(() => 37, (val) => val*2); // -> y = 20
   * 
   * const x = Option.None();
   * const y = x.map_or_else(() => 37, (val) => val*2); // -> y = 37
   */
  map_or_else<U>(dft: () => U, f: (val: T) => U): U {
    return this.match({
      Some: f,
      None: dft
    });
  }
  
  /**
   * 
   * @param err error value.
   * @returns `Result<T, E>`, mapping `Option.Some(v)` to `Result.Ok(v)` and `Option.None` to `Result.Err(err)`.
   * @example
   * const x = Option.Some("foo");
   * const y = x.ok_or(0); // -> y = Result.Ok("foo")
   * 
   * const x = Option.None();
   * const y = x.ok_or(0); // -> y = Result.Err(0)
   */
  ok_or<E>(err: E): Result<T, E> {
    return this.match({
      Some: (val) => Result.Ok(val),
      None: () => Result.Err(err)
    });
  }
  
  /**
   * 
   * @param err error lambda.
   * @returns `Result<T, E>`, mapping `Option.Some(v)` to `Result.Ok(v)` and `Option.None` to `Result.Err(err)`.
   * @example
   * const x = Option.Some("foo");
   * const y = x.ok_or_else(() => 0); // -> y = Result.Ok("foo")
   * 
   * const x = Option.None();
   * const y = x.ok_or(() => 0); // -> y = Result.Err(0)
   */
  ok_or_else<E>(err: () => E): Result<T, E> {
    return this.match({
      Some: (val) => Result.Ok(val),
      None: () => Result.Err(err())
    });
  }
 
  /**
   * 
   * @param optb value.
   * @returns `None` if the `Option` is `None`, otherwise returns `optb`.
   * @example
   * const x = Option.Some("Hello");
   * const y = Option.None();
   * const z = x.and(y); // -> z = Option.None()
   * 
   * const x = Option.Some("Hello");
   * const y = Option.Some(3);
   * const z = x.and(y); // -> z = Option.Some(3)
   */
  and<U>(optb: Option<U>): Option<U> {
    return this.match({
      Some: (_) => optb,
      None: () => Option.None()
    });
  }
  
  /**
   * 
   * @param optb lambda.
   * @returns `None` if the `Option` is `None`, otherwise calls `optb` with the value and returns the result.
   * @example
   * const x = Option.Some(500);
   * const y = (val: Option<number>) => val / 5;
   * const z = x.and_then(y); // -> z = Option.Some(100)
   * 
   * const x = Option.None();
   * const y = (val: Option<number>) => val / 5;
   * const z = x.and_then(y); // -> z = Option.None()
   */
  and_then<U>(f: (val: T) => Option<U>): Option<U> {
    return this.match({
      Some: f,
      None: () => Option.None(),
    });
  }
  
  /**
   * 
   * @param optb value.
   * @returns `this` if `Some`, otherwise `optb`.
   * @example
   * const x = Option.Some(2);
   * const y = Option.None();
   * const z = x.or(y); // -> z = Option.Some(2)
   * 
   * const x = Option.None();
   * const y = Option.Some(100);
   * const z = x.or(y); // -> z = Option.Some(100)
   */
  or(optb: Option<T>): Option<T> {
    return this.match({
      Some: (_) => this,
      None: () => optb
    });
  }
  
  /**
   * 
   * @param optb lambda value.
   * @returns `this` if `Some`, otherwise calls `optb` and returns the result.
   * @example
   * const x = Option.Some(2);
   * const y = () => Option.None();
   * const z = x.or_else(y); // -> z = Option.Some(2)
   * 
   * const x = Option.None();
   * const y = () => Option.Some(100);
   * const z = x.or_else(y); // -> z = Option.Some(100)
   */
  or_else(f: () => Option<T>): Option<T> {
    return this.match({
      Some: (_) => this,
      None: f
    });
  }
  
  /**
   * @param cases - An object containing the match arms
   * @param cases.Some - Called with the value if Option is Some
   * @param cases.None - Called if Option is None
   * @returns The result of the matched arm
   * @example
   * const some = Option.some(42);
   * some.match({
   *   Some: (value) => `got ${value}`, // -> "got 42"
   *   None: () => "got nothing"
   * });
   *
   * const none = Option.none();
   * none.match({
   *   Some: (value) => `got ${value}`,
   *   None: () => "got nothing" // -> "got nothing"
   * });
   */
  match<R>(cases: { Some: (value: T) => R, None: () => R }): R {
    if (this.#val) return cases.Some(this.#val);
    return cases.None();
  }
}

export class Result<T, E> {
  #val: T | null;
  #err: E | null;

  private constructor(value: T | null, error: E | null) {
    this.#val = value;
    this.#err = error;
  }

  /**
   * @param value - The value to be `Ok`.
   * @returns `Result<T, E>` with `Ok` = `value`.
   * @example
   * const result = Result.Ok(10);
   */
  static Ok<T, E>(value: T): Result<T, E> {
    return new Result(value, null) as Result<T, E>;
  }

  /**
   * @param error - The error to be `Err`.
   * @returns `Result<T, E>` with `Err` = `error`.
   * @example
   * const result = Result.Err("something went wrong");
   */
  static Err<T, E>(error: E): Result<T, E> {
    return new Result(null, error) as Result<T, E>;
  }

  /**
   * @returns `true` if the `Result` is `Ok`.
   * @example
   * const x = Result.Ok(10);
   * x.is_ok(); // -> true
   *
   * const x = Result.Err("error");
   * x.is_ok(); // -> false
   */
  is_ok(): boolean {
    return this.#val ? true : false;
  }

  /**
   * @returns `true` if the `Result` is `Err`.
   * @example
   * const x = Result.Ok(10);
   * x.is_err(); // -> false
   *
   * const x = Result.Err("error");
   * x.is_err(); // -> true
   */
  is_err(): boolean {
    return !this.is_ok();
  }

  /**
   * @returns `true` if the `Result` is `Ok` and the value matches the predicate.
   * @example
   * const x = Result.Ok(10);
   * x.is_ok_and((x) => x > 5); // -> true
   *
   * const x = Result.Err("error");
   * x.is_ok_and((x) => x > 5); // -> false
   */
  is_ok_and(f: (value: T) => boolean): boolean {
    return this.match({
      Ok: f,
      Err: (_) => false
    });
  }

  /**
   * @returns `true` if the `Result` is `Err` and the error matches the predicate.
   * @example
   * const x = Result.Err("error");
   * x.is_err_and((e) => e === "error"); // -> true
   *
   * const x = Result.Ok(10);
   * x.is_err_and((e) => e === "error"); // -> false
   */
  is_err_and(f: (error: E) => boolean): boolean {
    return this.match({
      Ok: (_) => false,
      Err: f
    });
  }

  /**
   * @returns `Option.Some(v)` if `Ok(v)`, otherwise `Option.None()`.
   * @example
   * const x = Result.Ok("hello");
   * x.ok(); // -> Option.Some("hello")
   *
   * const x = Result.Err("error");
   * x.ok(); // -> Option.None()
   */
  ok(): Option<T> {
    return this.match({
      Ok: (x) => Option.Some(x),
      Err: (_) => Option.None()
    });
  }

  /**
   * @returns `Option.Some(e)` if `Err(e)`, otherwise `Option.None()`.
   * @example
   * const x = Result.Err("error");
   * x.err(); // -> Option.Some("error")
   *
   * const x = Result.Ok(10);
   * x.err(); // -> Option.None()
   */
  err(): Option<E> {
    return this.match({
      Ok: (_) => Option.None(),
      Err: (x) => Option.Some(x)
    });
  }

  /**
   * @param f - lambda.
   * @returns `Result<U, E>` by applying `f` to the `Ok` value, leaving `Err` untouched.
   * @example
   * const x = Result.Ok(10);
   * const y = x.map((val) => val * 2); // -> y = Result.Ok(20)
   *
   * const x = Result.Err("error");
   * const y = x.map((val) => val * 2); // -> y = Result.Err("error")
   */
  map<U>(f: (val: T) => U): Result<U, E> {
    return this.match({
      Ok: (t) => Result.Ok(f(t)),
      Err: (e) => Result.Err(e)
    });
  }

  /**
   * @param dft - default value.
   * @param f - lambda.
   * @returns `dft` if `Err`, or applies `f` to the `Ok` value.
   * @example
   * const x = Result.Ok(10);
   * const y = x.map_or(37, (val) => val * 2); // -> y = 20
   *
   * const x = Result.Err("error");
   * const y = x.map_or(37, (val) => val * 2); // -> y = 37
   */
  map_or<U>(dft: U, f: (val: T) => U): U {
    return this.match({
      Ok: f,
      Err: (_) => dft
    });
  }

  /**
   * @param dft - default lambda, receives the error value.
   * @param f - lambda.
   * @returns calls `dft` with the error if `Err`, or applies `f` to the `Ok` value.
   * @example
   * const x = Result.Ok(10);
   * const y = x.map_or_else((e) => 37, (val) => val * 2); // -> y = 20
   *
   * const x = Result.Err("error");
   * const y = x.map_or_else((e) => 37, (val) => val * 2); // -> y = 37
   */
  map_or_else<U>(dft: (err: E) => U, f: (val: T) => U): U {
    return this.match({
      Ok: f,
      Err: dft
    });
  }

  /**
   * @param op - lambda.
   * @returns `Result<T, F>` by applying `op` to the `Err` value, leaving `Ok` untouched.
   * @example
   * const x = Result.Err("error");
   * const y = x.map_err((e) => e.length); // -> y = Result.Err(5)
   *
   * const x = Result.Ok(10);
   * const y = x.map_err((e) => e.length); // -> y = Result.Ok(10)
   */
  map_err<F>(op: (err: E) => F): Result<T, F> {
    return this.match({
      Ok: (val) => Result.Ok(val),
      Err: (e) => Result.Err(op(e))
    });
  }

  /**
   * @returns the contained `Ok` value.
   * @throws {Error} if the `Result` is `Err`.
   * @example
   * const x = Result.Ok(10);
   * x.unwrap(); // -> 10
   *
   * const x = Result.Err("error");
   * x.unwrap(); // throws Error: "called Result.unwrap() on an Err value: error"
   */
  unwrap(): T {
    return this.match({
      Ok: (t) => t,
      Err: (e) => {
        throw new Error(`called Result.unwrap() on an Err value: ${e}`)
      }
    });
  }

  /**
   * @param dft - default value.
   * @returns the contained `Ok` value or `dft` if `Err`.
   * @example
   * const x = Result.Ok(10);
   * x.unwrap_or(0); // -> 10
   *
   * const x = Result.Err("error");
   * x.unwrap_or(0); // -> 0
   */
  unwrap_or(dft: T): T {
    return this.match({
      Ok: (t) => t,
      Err: (_) => dft,
    });
  }

  /**
   * @param op - lambda.
   * @returns the contained `Ok` value or calls `op` with the error and returns the result.
   * @example
   * const x = Result.Ok(10);
   * x.unwrap_or_else((e) => 0); // -> 10
   *
   * const x = Result.Err("error");
   * x.unwrap_or_else((e) => 0); // -> 0
   */
  unwrap_or_else(op: (err: E) => T): T {
    return this.match({
      Ok: (t) => t,
      Err: op
    });
  }

  /**
   * @returns the contained `Err` value.
   * @throws {Error} if the `Result` is `Ok`.
   * @example
   * const x = Result.Err("error");
   * x.unwrap_err(); // -> "error"
   *
   * const x = Result.Ok(10);
   * x.unwrap_err(); // throws Error: "called Result.unwrap_err() on an Ok value: 10"
   */
  unwrap_err(): E {
    return this.match({
      Ok: (t) => {
        throw new Error(`called Result.unwrap_err() on an Ok value: ${t}`)
      },
      Err: (e) => e,
    });
  }

  /**
   * @param msg - message in case of failure.
   * @returns the contained `Ok` value.
   * @throws {Error} if the `Result` is `Err`, with the message `msg: err`.
   * @example
   * const x = Result.Ok(10);
   * x.expect("should have a value"); // -> 10
   *
   * const x = Result.Err("error");
   * x.expect("should have a value"); // throws Error: "should have a value: error"
   */
  expect(msg: string): T {
    return this.match({
      Ok: (t) => t,
      Err: (e) => {
        throw new Error(`${msg}: ${e}`)
      }
    });
  }

  /**
   * @param msg - message in case of failure.
   * @returns the contained `Err` value.
   * @throws {Error} if the `Result` is `Ok`, with the message `msg: value`.
   * @example
   * const x = Result.Err("error");
   * x.expect_err("should have failed"); // -> "error"
   *
   * const x = Result.Ok(10);
   * x.expect_err("should have failed"); // throws Error: "should have failed: 10"
   */
  expect_err(msg: string): E {
    return this.match({
      Ok: (t) => {
        throw new Error(`${msg}: ${t}`)
      },
      Err: (e) => e,
    });
  }

  /**
   * @param res - value.
   * @returns `Err` if the `Result` is `Err`, otherwise returns `res`.
   * @example
   * const x = Result.Ok(10);
   * const y = Result.Err("late error");
   * const z = x.and(y); // -> z = Result.Err("late error")
   *
   * const x = Result.Ok(10);
   * const y = Result.Ok(20);
   * const z = x.and(y); // -> z = Result.Ok(20)
   */
  and<U>(res: Result<U, E>): Result<U, E> {
    return this.match({
      Ok: (_) => res,
      Err: (e) => Result.Err(e)
    });
  }

  /**
   * @param op - lambda.
   * @returns `Err` if the `Result` is `Err`, otherwise calls `op` with the value and returns the result.
   * @example
   * const x = Result.Ok(10);
   * const y = x.and_then((val) => Result.Ok(val * 2)); // -> y = Result.Ok(20)
   *
   * const x = Result.Err("error");
   * const y = x.and_then((val) => Result.Ok(val * 2)); // -> y = Result.Err("error")
   */
  and_then<U>(op: (val: T) => Result<U, E>): Result<U, E> {
    return this.match({
      Ok: op,
      Err: (e) => Result.Err(e)
    });
  }

  /**
   * @param res - value.
   * @returns `this` if `Ok`, otherwise returns `res`.
   * @example
   * const x = Result.Err("error");
   * const y = Result.Ok(10);
   * const z = x.or(y); // -> z = Result.Ok(10)
   *
   * const x = Result.Ok(10);
   * const y = Result.Err("late error");
   * const z = x.or(y); // -> z = Result.Ok(10)
   */
  or<F>(res: Result<T, F>): Result<T, F> {
    return this.match({
      Ok: (v) => Result.Ok(v),
      Err: (_) => res
    });
  }

  /**
   * @param op - lambda.
   * @returns `this` if `Ok`, otherwise calls `op` with the error and returns the result.
   * @example
   * const x = Result.Err("error");
   * const y = x.or_else((e) => Result.Ok(0)); // -> y = Result.Ok(0)
   *
   * const x = Result.Ok(10);
   * const y = x.or_else((e) => Result.Ok(0)); // -> y = Result.Ok(10)
   */
  or_else<F>(op: (err: E) => Result<T, F>): Result<T, F> {
    return this.match({
      Ok: (t) => Result.Ok(t),
      Err: op
    });
  }

  /**
   * @param cases - An object containing the match arms.
   * @param cases.Ok - Called with the value if `Result` is `Ok`.
   * @param cases.Err - Called with the error if `Result` is `Err`.
   * @returns The result of the matched arm.
   * @example
   * const ok = Result.Ok(42);
   * ok.match({
   *   Ok: (value) => `got ${value}`, // -> "got 42"
   *   Err: (error) => `error: ${error}`
   * });
   *
   * const err = Result.Err("oops");
   * err.match({
   *   Ok: (value) => `got ${value}`,
   *   Err: (error) => `error: ${error}` // -> "error: oops"
   * });
   */
  match<R>(cases: { Ok: (value: T) => R; Err: (Err: E) => R }): R {
    if (this.#val) return cases.Ok(this.#val);
    return cases.Err(this.#err!);
  }
}