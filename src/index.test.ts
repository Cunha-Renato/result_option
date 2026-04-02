// src/index.test.ts
import { describe, expect, it } from "vitest";
import { Option, Result } from "./index";

// ==================== Option ====================

describe("Option.Some", () => {
	it("should create a Some value", () => {
		expect(Option.Some(42).is_some()).toBe(true);
	});

	it("should not be None", () => {
		expect(Option.Some(42).is_none()).toBe(false);
	});
});

describe("Option.None", () => {
	it("should create a None value", () => {
		expect(Option.None().is_none()).toBe(true);
	});

	it("should not be Some", () => {
		expect(Option.None().is_some()).toBe(false);
	});
});

describe("Option.is_some_and", () => {
	it("should return true if Some and predicate matches", () => {
		expect(Option.Some(10).is_some_and((x) => x > 5)).toBe(true);
	});

	it("should return false if Some and predicate does not match", () => {
		expect(Option.Some(10).is_some_and((x) => x > 20)).toBe(false);
	});

	it("should return false if None", () => {
		expect(Option.None<number>().is_some_and((x) => x > 5)).toBe(false);
	});
});

describe("Option.is_none_or", () => {
	it("should return true if None", () => {
		expect(Option.None<number>().is_none_or((x) => x > 5)).toBe(true);
	});

	it("should return true if Some and predicate matches", () => {
		expect(Option.Some(10).is_none_or((x) => x > 5)).toBe(true);
	});

	it("should return false if Some and predicate does not match", () => {
		expect(Option.Some(10).is_none_or((x) => x > 20)).toBe(false);
	});
});

describe("Option.unwrap", () => {
	it("should return the value if Some", () => {
		expect(Option.Some(42).unwrap()).toBe(42);
	});

	it("should throw if None", () => {
		expect(() => Option.None().unwrap()).toThrow();
	});
});

describe("Option.unwrap_or", () => {
	it("should return the value if Some", () => {
		expect(Option.Some(42).unwrap_or(0)).toBe(42);
	});

	it("should return the default if None", () => {
		expect(Option.None().unwrap_or(0)).toBe(0);
	});
});

describe("Option.unwrap_or_else", () => {
	it("should return the value if Some", () => {
		expect(Option.Some(42).unwrap_or_else(() => 0)).toBe(42);
	});

	it("should call the lambda and return its result if None", () => {
		expect(Option.None().unwrap_or_else(() => 0)).toBe(0);
	});
});

describe("Option.expect", () => {
	it("should return the value if Some", () => {
		expect(Option.Some(42).expect("error")).toBe(42);
	});

	it("should throw with the message if None", () => {
		expect(() => Option.None().expect("my message")).toThrow("my message");
	});
});

describe("Option.map", () => {
	it("should apply the lambda if Some", () => {
		expect(
			Option.Some(10)
				.map((x) => x * 2)
				.unwrap(),
		).toBe(20);
	});

	it("should return None if None", () => {
		expect(
			Option.None<number>()
				.map((x) => x * 2)
				.is_none(),
		).toBe(true);
	});
});

describe("Option.map_or", () => {
	it("should apply the lambda if Some", () => {
		expect(Option.Some(10).map_or(0, (x) => x * 2)).toBe(20);
	});

	it("should return the default if None", () => {
		expect(Option.None<number>().map_or(0, (x) => x * 2)).toBe(0);
	});
});

describe("Option.map_or_else", () => {
	it("should apply f if Some", () => {
		expect(
			Option.Some(10).map_or_else(
				() => 0,
				(x) => x * 2,
			),
		).toBe(20);
	});

	it("should call dft if None", () => {
		expect(
			Option.None<number>().map_or_else(
				() => 0,
				(x) => x * 2,
			),
		).toBe(0);
	});
});

describe("Option.ok_or", () => {
	it("should return Ok if Some", () => {
		expect(Option.Some("foo").ok_or("error").unwrap()).toBe("foo");
	});

	it("should return Err if None", () => {
		expect(Option.None().ok_or("error").unwrap_err()).toBe("error");
	});
});

describe("Option.ok_or_else", () => {
	it("should return Ok if Some", () => {
		expect(
			Option.Some("foo")
				.ok_or_else(() => "error")
				.unwrap(),
		).toBe("foo");
	});

	it("should return Err if None", () => {
		expect(
			Option.None()
				.ok_or_else(() => "error")
				.unwrap_err(),
		).toBe("error");
	});
});

describe("Option.and", () => {
	it("should return optb if Some", () => {
		expect(Option.Some("hello").and(Option.Some(3)).unwrap()).toBe(3);
	});

	it("should return None if None", () => {
		expect(Option.None().and(Option.Some(3)).is_none()).toBe(true);
	});
});

describe("Option.and_then", () => {
	it("should call f and return the result if Some", () => {
		expect(
			Option.Some(10)
				.and_then((x) => Option.Some(x * 2))
				.unwrap(),
		).toBe(20);
	});

	it("should return None if None", () => {
		expect(
			Option.None<number>()
				.and_then((x) => Option.Some(x * 2))
				.is_none(),
		).toBe(true);
	});
});

describe("Option.or", () => {
	it("should return self if Some", () => {
		expect(Option.Some(2).or(Option.None()).unwrap()).toBe(2);
	});

	it("should return optb if None", () => {
		expect(Option.None().or(Option.Some(100)).unwrap()).toBe(100);
	});
});

describe("Option.or_else", () => {
	it("should return self if Some", () => {
		expect(
			Option.Some(2)
				.or_else(() => Option.Some(100))
				.unwrap(),
		).toBe(2);
	});

	it("should call f and return result if None", () => {
		expect(
			Option.None()
				.or_else(() => Option.Some(100))
				.unwrap(),
		).toBe(100);
	});
});

describe("Option.match", () => {
	it("should call Some arm if Some", () => {
		expect(
			Option.Some(42).match({
				Some: (x) => `got ${x}`,
				None: () => "nothing",
			}),
		).toBe("got 42");
	});

	it("should call None arm if None", () => {
		expect(
			Option.None().match({
				Some: (x) => `got ${x}`,
				None: () => "nothing",
			}),
		).toBe("nothing");
	});
});

// ==================== Result ====================

describe("Result.Ok", () => {
	it("should create an Ok value", () => {
		expect(Result.Ok(42).is_ok()).toBe(true);
	});

	it("should not be Err", () => {
		expect(Result.Ok(42).is_err()).toBe(false);
	});
});

describe("Result.Err", () => {
	it("should create an Err value", () => {
		expect(Result.Err("oops").is_err()).toBe(true);
	});

	it("should not be Ok", () => {
		expect(Result.Err("oops").is_ok()).toBe(false);
	});
});

describe("Result.is_ok_and", () => {
	it("should return true if Ok and predicate matches", () => {
		expect(Result.Ok(10).is_ok_and((x) => x > 5)).toBe(true);
	});

	it("should return false if Ok and predicate does not match", () => {
		expect(Result.Ok(10).is_ok_and((x) => x > 20)).toBe(false);
	});

	it("should return false if Err", () => {
		expect(Result.Err<number, string>("oops").is_ok_and((x) => x > 5)).toBe(
			false,
		);
	});
});

describe("Result.is_err_and", () => {
	it("should return true if Err and predicate matches", () => {
		expect(Result.Err("oops").is_err_and((e) => e === "oops")).toBe(true);
	});

	it("should return false if Err and predicate does not match", () => {
		expect(Result.Err("oops").is_err_and((e) => e === "other")).toBe(false);
	});

	it("should return false if Ok", () => {
		expect(Result.Ok(10).is_err_and((e) => e === "oops")).toBe(false);
	});
});

describe("Result.ok", () => {
	it("should return Some if Ok", () => {
		expect(Result.Ok("hello").ok().unwrap()).toBe("hello");
	});

	it("should return None if Err", () => {
		expect(Result.Err("error").ok().is_none()).toBe(true);
	});
});

describe("Result.err", () => {
	it("should return Some if Err", () => {
		expect(Result.Err("oops").err().unwrap()).toBe("oops");
	});

	it("should return None if Ok", () => {
		expect(Result.Ok(10).err().is_none()).toBe(true);
	});
});

describe("Result.unwrap", () => {
	it("should return the value if Ok", () => {
		expect(Result.Ok(42).unwrap()).toBe(42);
	});

	it("should throw if Err", () => {
		expect(() => Result.Err("oops").unwrap()).toThrow();
	});
});

describe("Result.unwrap_or", () => {
	it("should return the value if Ok", () => {
		expect(Result.Ok(42).unwrap_or(0)).toBe(42);
	});

	it("should return the default if Err", () => {
		expect(Result.Err("oops").unwrap_or(0)).toBe(0);
	});
});

describe("Result.unwrap_or_else", () => {
	it("should return the value if Ok", () => {
		expect(Result.Ok(42).unwrap_or_else(() => 0)).toBe(42);
	});

	it("should call op and return its result if Err", () => {
		expect(Result.Err("oops").unwrap_or_else(() => 0)).toBe(0);
	});
});

describe("Result.unwrap_err", () => {
	it("should return the error if Err", () => {
		expect(Result.Err("oops").unwrap_err()).toBe("oops");
	});

	it("should throw if Ok", () => {
		expect(() => Result.Ok(42).unwrap_err()).toThrow();
	});
});

describe("Result.expect", () => {
	it("should return the value if Ok", () => {
		expect(Result.Ok(42).expect("error")).toBe(42);
	});

	it("should throw with the message if Err", () => {
		expect(() => Result.Err("oops").expect("my message")).toThrow("my message");
	});
});

describe("Result.expect_err", () => {
	it("should return the error if Err", () => {
		expect(Result.Err("oops").expect_err("error")).toBe("oops");
	});

	it("should throw with the message if Ok", () => {
		expect(() => Result.Ok(42).expect_err("my message")).toThrow("my message");
	});
});

describe("Result.map", () => {
	it("should apply f if Ok", () => {
		expect(
			Result.Ok(10)
				.map((x) => x * 2)
				.unwrap(),
		).toBe(20);
	});

	it("should return Err untouched if Err", () => {
		expect(
			Result.Err<number, string>("oops")
				.map((x) => x * 2)
				.unwrap_err(),
		).toBe("oops");
	});
});

describe("Result.map_or", () => {
	it("should apply f if Ok", () => {
		expect(Result.Ok(10).map_or(0, (x) => x * 2)).toBe(20);
	});

	it("should return the default if Err", () => {
		expect(Result.Err<number, string>("oops").map_or(0, (x) => x * 2)).toBe(0);
	});
});

describe("Result.map_or_else", () => {
	it("should apply f if Ok", () => {
		expect(
			Result.Ok(10).map_or_else(
				() => 0,
				(x) => x * 2,
			),
		).toBe(20);
	});

	it("should call dft if Err", () => {
		expect(
			Result.Err<number, string>("oops").map_or_else(
				() => 0,
				(x) => x * 2,
			),
		).toBe(0);
	});
});

describe("Result.map_err", () => {
	it("should apply op to the error if Err", () => {
		expect(
			Result.Err("oops")
				.map_err((e) => e.length)
				.unwrap_err(),
		).toBe(4);
	});

	it("should return Ok untouched if Ok", () => {
		expect(
			Result.Ok<number, string>(10)
				.map_err((e) => e.length)
				.unwrap(),
		).toBe(10);
	});
});

describe("Result.and", () => {
	it("should return res if Ok", () => {
		expect(Result.Ok(10).and(Result.Ok(20)).unwrap()).toBe(20);
	});

	it("should return Err if Err", () => {
		expect(Result.Err("oops").and(Result.Ok(20)).unwrap_err()).toBe("oops");
	});
});

describe("Result.and_then", () => {
	it("should call op and return its result if Ok", () => {
		expect(
			Result.Ok(10)
				.and_then((x) => Result.Ok(x * 2))
				.unwrap(),
		).toBe(20);
	});

	it("should return Err if Err", () => {
		expect(
			Result.Err<number, string>("oops")
				.and_then((x) => Result.Ok(x * 2))
				.unwrap_err(),
		).toBe("oops");
	});
});

describe("Result.or", () => {
	it("should return self if Ok", () => {
		expect(Result.Ok(10).or(Result.Err("late")).unwrap()).toBe(10);
	});

	it("should return res if Err", () => {
		expect(Result.Err("oops").or(Result.Ok(0)).unwrap()).toBe(0);
	});
});

describe("Result.or_else", () => {
	it("should return self if Ok", () => {
		expect(
			Result.Ok(10)
				.or_else(() => Result.Ok(0))
				.unwrap(),
		).toBe(10);
	});

	it("should call op and return its result if Err", () => {
		expect(
			Result.Err("oops")
				.or_else(() => Result.Ok(0))
				.unwrap(),
		).toBe(0);
	});
});

describe("Result.match", () => {
	it("should call Ok arm if Ok", () => {
		expect(
			Result.Ok(42).match({
				Ok: (x) => `got ${x}`,
				Err: (e) => `error: ${e}`,
			}),
		).toBe("got 42");
	});

	it("should call Err arm if Err", () => {
		expect(
			Result.Err("oops").match({
				Ok: (x) => `got ${x}`,
				Err: (e) => `error: ${e}`,
			}),
		).toBe("error: oops");
	});
});
