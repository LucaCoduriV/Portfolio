import { Component, OnInit, AfterViewInit, HostBinding } from "@angular/core";
import { fromEvent } from "rxjs";
import {
  throttleTime,
  map,
  pairwise,
  distinctUntilChanged,
} from "rxjs/operators";
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from "@angular/animations";

enum VisibilityState {
  Visible = "visible",
  Hidden = "hidden",
}

enum Direction {
  Up = "Up",
  Down = "Down",
}

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
  animations: [
    trigger("toggle", [
      state(
        VisibilityState.Hidden,
        style({ opacity: 0, transform: "translateY(-100%)" })
      ),
      state(
        VisibilityState.Visible,
        style({ opacity: 1, transform: "translateY(0)" })
      ),
      transition("* => *", animate("200ms ease-in")),
    ]),
  ],
})
export class NavbarComponent implements OnInit, AfterViewInit {
  private isVisible = true;

  @HostBinding("@toggle")
  get toggle(): VisibilityState {
    return this.isVisible ? VisibilityState.Visible : VisibilityState.Hidden;
  }

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    const scroll$ = fromEvent(window, "scroll")
      .pipe(
        throttleTime(10),
        map(() => window.pageYOffset),
        pairwise(),
        map(([y1, y2]): Direction => (y2 < y1 ? Direction.Up : Direction.Down)),
        distinctUntilChanged()
      )
      .subscribe((direction) => {
        if (direction == Direction.Down) {
          this.isVisible = false;
          console.log(this.isVisible);
        } else {
          this.isVisible = true;
          console.log(this.isVisible);
        }
      });
  }
}
