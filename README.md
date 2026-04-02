# result_option

A TypeScript library inspired by Rust's `Option<T>` and `Result<T, E>` types, bringing explicit, type-safe error and null handling to your TypeScript projects.

## Overview

- **`Option<T>`** — represents a value that may or may not exist. Either `Some(value)` or `None`.
- **`Result<T, E>`** — represents a value that is either a success or a failure. Either `Ok(value)` or `Err(error)`.

---

## Option\<T\>

### Creating an Option

```typescript
import { Option } from "result_option";

const some = Option.Some(42);      // Some(42)
const none = Option.None();        // None
```

### Checking the variant

```typescript
some.is_some();                    // true
some.is_none();                    // false

some.is_some_and((x) => x > 10);  // true
none.is_none_or((x) => x > 10);   // true
```

### Extracting the value

```typescript
some.unwrap();                     // 42
none.unwrap();                     // throws Error

some.unwrap_or(0);                 // 42
none.unwrap_or(0);                 // 0

some.unwrap_or_else(() => 0);      // 42
none.unwrap_or_else(() => 0);      // 0

some.expect("must have value");    // 42
none.expect("must have value");    // throws Error: "must have value"
```

### Transforming

```typescript
Option.Some(10).map((x) => x * 2);              // Some(20)
Option.None().map((x) => x * 2);                // None

Option.Some(10).map_or(0, (x) => x * 2);        // 20
Option.None().map_or(0, (x) => x * 2);          // 0

Option.Some(10).map_or_else(() => 0, (x) => x * 2); // 20
```

### Combining

```typescript
Option.Some("hello").and(Option.Some(3));        // Some(3)
Option.None().and(Option.Some(3));               // None

Option.Some(10).and_then((x) => Option.Some(x * 2)); // Some(20)

Option.Some(2).or(Option.None());               // Some(2)
Option.None().or(Option.Some(100));             // Some(100)

Option.None().or_else(() => Option.Some(100));  // Some(100)
```

### Converting to Result

```typescript
Option.Some("foo").ok_or("error");              // Result.Ok("foo")
Option.None().ok_or("error");                   // Result.Err("error")

Option.None().ok_or_else(() => "error");        // Result.Err("error")
```

### Pattern matching

```typescript
const msg = Option.Some(42).match({
  Some: (value) => `got ${value}`,   // -> "got 42"
  None: () => "got nothing"
});
```

---

## Result\<T, E\>

### Creating a Result

```typescript
import { Result } from "result_option";

const ok  = Result.Ok(42);              // Ok(42)
const err = Result.Err("oops");        // Err("oops")
```

### Checking the variant

```typescript
ok.is_ok();                            // true
ok.is_err();                           // false

ok.is_ok_and((x) => x > 10);          // true
err.is_err_and((e) => e === "oops");   // true
```

### Extracting the value

```typescript
ok.unwrap();                           // 42
err.unwrap();                          // throws Error

ok.unwrap_or(0);                       // 42
err.unwrap_or(0);                      // 0

ok.unwrap_or_else((e) => 0);           // 42
err.unwrap_or_else((e) => 0);          // 0

err.unwrap_err();                      // "oops"
ok.unwrap_err();                       // throws Error

ok.expect("must succeed");             // 42
err.expect("must succeed");            // throws Error: "must succeed: oops"

err.expect_err("must fail");           // "oops"
ok.expect_err("must fail");            // throws Error: "must fail: 42"
```

### Transforming

```typescript
Result.Ok(10).map((x) => x * 2);                      // Ok(20)
Result.Err("err").map((x) => x * 2);                  // Err("err")

Result.Ok(10).map_or(0, (x) => x * 2);                // 20
Result.Err("err").map_or(0, (x) => x * 2);            // 0

Result.Err("err").map_err((e) => e.length);            // Err(3)
Result.Ok(10).map_err((e) => e.length);                // Ok(10)
```

### Combining

```typescript
Result.Ok(10).and(Result.Ok(20));                      // Ok(20)
Result.Err("err").and(Result.Ok(20));                  // Err("err")

Result.Ok(10).and_then((x) => Result.Ok(x * 2));      // Ok(20)

Result.Err("err").or(Result.Ok(0));                    // Ok(0)
Result.Ok(10).or(Result.Err("late"));                  // Ok(10)

Result.Err("err").or_else((e) => Result.Ok(0));        // Ok(0)
```

### Converting to Option

```typescript
Result.Ok("hello").ok();    // Option.Some("hello")
Result.Err("err").ok();     // Option.None()

Result.Err("err").err();    // Option.Some("err")
Result.Ok(10).err();        // Option.None()
```

### Pattern matching

```typescript
const msg = Result.Ok(42).match({
  Ok:  (value) => `success: ${value}`,  // -> "success: 42"
  Err: (error) => `error: ${error}`
});
```