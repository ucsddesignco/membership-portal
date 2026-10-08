import { describe, expect, it } from "vitest";
import { bonusFor, computeStreak, multiplierFor, type StreakEvent } from "./streak";

const ev = (id: string, day: number, counts = true): StreakEvent => ({
  id,
  active_start: new Date(Date.UTC(2026, 0, day)).toISOString(),
  counts_toward_streak: counts,
});

describe("multiplierFor", () => {
  it.each([
    [1, 1],
    [2, 1.2],
    [3, 1.4],
    [4, 1.6],
    [5, 1.8],
    [6, 2],
  ])("streak %i -> %fx", (streak, expected) => {
    expect(multiplierFor(streak)).toBe(expected);
  });

  it("caps at 2x for streak 6+", () => {
    expect(multiplierFor(7)).toBe(2);
    expect(multiplierFor(20)).toBe(2);
  });
});

describe("computeStreak", () => {
  const events = [ev("a", 1), ev("b", 2), ev("c", 3), ev("d", 4)];
  const current = ev("now", 5);

  it("returns 1 with no prior events", () => {
    expect(computeStreak(current, [], [])).toBe(1);
  });

  it("counts consecutive attended events plus the current one", () => {
    expect(computeStreak(current, events, ["a", "b", "c", "d"])).toBe(5);
  });

  it("resets after a miss", () => {
    // missed "b": only c and d count
    expect(computeStreak(current, events, ["a", "c", "d"])).toBe(3);
    // missed the most recent: back to 1
    expect(computeStreak(current, events, ["a", "b", "c"])).toBe(1);
  });

  it("ignores events at or after the current event", () => {
    const later = [...events, ev("e", 6), current];
    expect(computeStreak(current, later, ["d"])).toBe(2);
  });

  it("is order-independent for input events", () => {
    const shuffled = [events[2], events[0], events[3], events[1]];
    expect(computeStreak(current, shuffled, ["c", "d"])).toBe(3);
  });

  it("returns 0 when the current event does not count toward streaks", () => {
    expect(computeStreak(ev("x", 5, false), events, ["a", "b", "c", "d"])).toBe(0);
  });
});

describe("bonusFor", () => {
  it("is 0 at streak 1", () => {
    expect(bonusFor(10, 1)).toBe(0);
  });

  it("rounds to the nearest integer", () => {
    expect(bonusFor(10, 2)).toBe(2); // 10 * 0.2
    expect(bonusFor(7, 2)).toBe(1); // 1.4 -> 1
    expect(bonusFor(8, 2)).toBe(2); // 1.6 -> 2
    expect(bonusFor(5, 4)).toBe(3); // 3.0 (no float drift)
    expect(bonusFor(15, 3)).toBe(6); // 6.0
  });

  it("doubles at the cap", () => {
    expect(bonusFor(10, 6)).toBe(10);
    expect(bonusFor(10, 99)).toBe(10);
  });
});
