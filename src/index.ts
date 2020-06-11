import { fromEvent, merge, interval, concat, of, Observable } from "rxjs";
import { map, mergeMap, take, delay, takeUntil, filter } from "rxjs/operators";

const app = document.getElementById("app");

if (!app) {
  throw new Error("No app element");
}

app.innerHTML = `
<button type="button" id="a">A</button>
<button type="button" id="b">B</button>
<button type="button" id="c">C</button>
`;

const aButton = document.getElementById("a");
const bButton = document.getElementById("b");
const cButton = document.getElementById("c");

if (!aButton || !bButton || !cButton) {
  throw new Error("No buttons");
}

const stream: Observable<string> = merge(
  fromEvent<MouseEvent>(aButton, "click"),
  fromEvent<MouseEvent>(bButton, "click"),
  fromEvent<MouseEvent>(cButton, "click")
).pipe(
  map(event => {
    const target = event.target as HTMLButtonElement;
    return target.id;
  }),
  mergeMap(id => {
    return concat(
      of(""),
      interval(1000).pipe(
        delay(1),
        take(3),
        takeUntil(stream.pipe(filter(x => x === ""))),
        map(number => `${id}${number}`)
      )
    );
  })
);

stream.subscribe(value => console.log(`${value.toUpperCase()} clicked!`));
