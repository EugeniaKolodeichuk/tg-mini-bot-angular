import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CheckItem {
  id: string;
  label: string;
  done: ReturnType<typeof signal<boolean>>;
}

interface CodeExample {
  id: string;
  title: string;
  when: string;
  pitfall?: string;
  code: string;
  open: ReturnType<typeof signal<boolean>>;
}

interface CodeSection {
  title: string;
  examples: CodeExample[];
}

function checkItem(id: string, label: string): CheckItem {
  return { id, label, done: signal(false) };
}

function ex(id: string, title: string, when: string, code: string, pitfall?: string): CodeExample {
  return { id, title, when, pitfall, code, open: signal(false) };
}

@Component({
  selector: 'app-interview-prep',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './interview-prep.component.html',
  styleUrl: './interview-prep.component.css',
})
export class InterviewPrepComponent {

  readonly format = [
    { step: 1, title: 'Intro', desc: 'Elevator pitch — focus on hardest technical challenges and their business impact' },
    { step: 2, title: 'Technical Experience & Skills', desc: 'Deep dive into your tech stack and engineering decisions' },
    { step: 3, title: 'Code Review', desc: 'Angular code analysis on StackBlitz — find bugs, memory leaks, architecture issues' },
    { step: 4, title: 'High-Level Architecture', desc: 'Design the frontend part of a standalone module from scratch' },
    { step: 5, title: 'Q&A', desc: 'Your questions to the team and management' },
  ];

  readonly values = [
    { icon: '🎯', title: 'Product Mindset', desc: 'Understand business context, assess UX impact of technical decisions' },
    { icon: '🧪', title: 'Testing Strategy', desc: 'Unit, Integration, E2E — know which parts are critical to cover' },
    { icon: '♿', title: 'A11y & Security', desc: 'Accessibility standards (ARIA) and frontend security fundamentals' },
  ];

  readonly tips = [
    'Think aloud — verbalize doubts and alternatives, not just the final answer',
    'Uklon context: geo-data, real-time updates, high load — factor this into architecture decisions',
    'Check StackBlitz access before the meeting',
  ];

  // ─── Code Reference ─────────────────────────────────────────────────────────

  readonly codeSections: CodeSection[] = [
    {
      title: 'Signals',
      examples: [
        ex('sig-basic', 'signal() — basic state',
          'Replaces simple component properties. Use when the value needs to drive the template reactively.',
          `import { signal } from '@angular/core';

// create
const count = signal(0);

// read (always call as function)
count()         // → 0

// write
count.set(5);
count.update(v => v + 1);

// for objects/arrays — update immutably
const items = signal<string[]>([]);
items.update(list => [...list, 'new item']);`,
          'Do NOT mutate arrays/objects directly — signals track by reference.'
        ),

        ex('sig-computed', 'computed() — derived state',
          'Use instead of getters when multiple signals feed one derived value. Memoized: recalculates only when dependencies change.',
          `import { signal, computed } from '@angular/core';

const price = signal(100);
const qty   = signal(3);

const total = computed(() => price() * qty());

total()  // → 300
price.set(200);
total()  // → 600  (recalculated automatically)`,
          'computed() is read-only — never expose it as writable.'
        ),

        ex('sig-effect', 'effect() — side effects',
          'Use for logging, syncing to localStorage, or integrating with non-Angular APIs. Runs after every change to read signals.',
          `import { effect, signal } from '@angular/core';

const theme = signal<'light' | 'dark'>('light');

// must be called inside injection context (constructor / field)
effect(() => {
  document.body.setAttribute('data-theme', theme());
});

// cleanup
effect((onCleanup) => {
  const id = setInterval(() => console.log(theme()), 1000);
  onCleanup(() => clearInterval(id));
});`,
          'Avoid setting other signals inside effect() — causes circular updates.'
        ),

        ex('sig-input', 'input() / output() — signal-based I/O',
          'Angular 17.1+ replacement for @Input / @Output. Type-safe and reactive out of the box.',
          `import { input, output, Component } from '@angular/core';

@Component({ selector: 'app-card', standalone: true, template: '' })
export class CardComponent {
  // replaces @Input()
  title = input.required<string>();
  size  = input<number>(16);          // with default

  // replaces @Output() + EventEmitter
  closed = output<void>();

  close() {
    this.closed.emit();
  }
}

// parent template:
// <app-card [title]="'Hello'" (closed)="onClose()" />`,
        ),
      ],
    },

    {
      title: 'Change Detection',
      examples: [
        ex('cd-onpush', 'OnPush strategy',
          'Use on every component by default. Re-renders only when @Input reference changes, an event fires inside, or a signal/async pipe emits.',
          `import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`{{ data().title }}\`,
})
export class CardComponent {
  data = input.required<{ title: string }>();
}

// ✅ triggers re-render: pass new object reference
// ❌ does NOT re-render: mutate existing object`,
          'With OnPush, mutating an object without replacing the reference = no update.'
        ),

        ex('cd-zoneless', 'Zoneless (provideExperimentalZonelessChangeDetection)',
          'Used when you want full control: no Zone.js, only signals/async pipe drive updates. Uklon likely evaluates this for performance.',
          `// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

bootstrapApplication(AppComponent, {
  providers: [provideExperimentalZonelessChangeDetection()]
});

// Component must use signals or markForCheck — nothing automatic
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`{{ count() }}\`,
})
export class AppComponent {
  count = signal(0);
  increment() { this.count.update(v => v + 1); }
}`,
        ),
      ],
    },

    {
      title: 'Memory Leaks',
      examples: [
        ex('ml-destroy', 'takeUntilDestroyed — preferred pattern',
          'Automatically completes an observable when the component is destroyed. No manual unsubscribe needed.',
          `import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { inject, DestroyRef } from '@angular/core';

@Component({ standalone: true, template: '' })
export class SearchComponent {
  private destroyRef = inject(DestroyRef);

  constructor(private api: ApiService) {
    this.api.search$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => console.log(result));
  }
}`,
          'Without takeUntilDestroyed (or takeUntil + Subject), subscriptions keep living after component destroy.'
        ),

        ex('ml-tosignal', 'toSignal() — RxJS → Signal bridge',
          'Converts an Observable to a signal. Automatically unsubscribes on destroy. Best for HTTP calls and store selectors.',
          `import { toSignal } from '@angular/core/rxjs-interop';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({ standalone: true, template: \`
  @if (users(); as list) {
    @for (u of list; track u.id) { <p>{{ u.name }}</p> }
  }
\` })
export class UsersComponent {
  private http = inject(HttpClient);

  users = toSignal(
    this.http.get<User[]>('/api/users'),
    { initialValue: [] }
  );
}`,
        ),
      ],
    },

    {
      title: 'Control Flow & Defer',
      examples: [
        ex('cf-for', '@for with track',
          'Always provide track to avoid destroying and recreating DOM nodes on array changes. Track by unique ID, not index.',
          `@Component({
  template: \`
    @for (item of items(); track item.id) {
      <app-card [data]="item" />
    } @empty {
      <p>No items found</p>
    }
  \`
})
export class ListComponent {
  items = signal<Item[]>([]);
}`,
          'track $index is a fallback — always prefer track item.id when items can be reordered/removed.'
        ),

        ex('cf-defer', '@defer — lazy rendering',
          'Defer heavy components until needed. Uklon (high-load app) would use this for below-the-fold content.',
          `@Component({
  template: \`
    <!-- loads when element enters viewport -->
    @defer (on viewport) {
      <app-heavy-map [coords]="coords()" />
    } @placeholder {
      <div class="skeleton" style="height:300px"></div>
    } @loading (minimum 200ms) {
      <app-spinner />
    } @error {
      <p>Failed to load map</p>
    }

    <!-- load after 2s idle -->
    @defer (on idle; prefetch on hover) {
      <app-recommendations />
    }
  \`
})`,
        ),
      ],
    },

    {
      title: 'RxJS Patterns',
      examples: [
        ex('rx-switch', 'switchMap — cancel previous, take latest',
          'Use for search/autocomplete: when a new search starts, cancel the previous HTTP call.',
          `import { switchMap, debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({ standalone: true, template: \`
  <input [value]="query()" (input)="query.set($event.target.value)" />
  @for (r of results(); track r.id) { <p>{{ r.name }}</p> }
\` })
export class SearchComponent {
  query   = signal('');
  results = toSignal(
    toObservable(this.query).pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(q => this.api.search(q))
    ),
    { initialValue: [] }
  );
}`,
          'Do NOT use mergeMap for search — all calls complete, responses can arrive out of order.'
        ),

        ex('rx-combine', 'combineLatest — merge multiple streams',
          'Use when a component depends on multiple independent observables simultaneously.',
          `import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

readonly vm = toSignal(
  combineLatest([
    this.store.select(selectUser),
    this.store.select(selectSettings),
    this.route.params,
  ]).pipe(
    map(([user, settings, params]) => ({ user, settings, id: params['id'] }))
  ),
  { initialValue: null }
);`,
        ),

        ex('rx-share', 'shareReplay — multicast & cache',
          'Use when multiple subscribers need the same HTTP response without triggering multiple requests.',
          `import { shareReplay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  readonly config$ = this.http.get<Config>('/api/config').pipe(
    shareReplay(1)   // cache last value, share among all subscribers
  );
}`,
          'shareReplay(1) without { refCount: true } keeps the HTTP call alive even after all subscribers unsubscribe — potential leak in rare cases.'
        ),
      ],
    },

    {
      title: 'Architecture Patterns',
      examples: [
        ex('arch-smart', 'Smart / Dumb (Presentational) components',
          'Use to separate data-fetching from rendering. Dumb components are pure, reusable, and easy to test.',
          `// ✅ SMART — knows about services, owns state
@Component({
  standalone: true,
  template: \`<app-driver-list [drivers]="drivers()" (selected)="onSelect($event)" />\`
})
export class DriversPageComponent {
  private api = inject(DriverService);
  drivers = toSignal(this.api.getAll(), { initialValue: [] });
  onSelect(id: string) { /* navigate */ }
}

// ✅ DUMB — only @Input/@Output, no service injection
@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`@for (d of drivers; track d.id) {
    <div (click)="selected.emit(d.id)">{{ d.name }}</div>
  }\`
})
export class DriverListComponent {
  drivers = input.required<Driver[]>();
  selected = output<string>();
}`,
        ),

        ex('arch-solid', 'SOLID in Angular',
          'Code review will check for SRP violations (components doing too much) and OCP (easy to extend without modifying).',
          `// ❌ SRP violation — one component fetches, transforms, renders, handles errors
@Component({ template: '' })
export class BadComponent {
  data: any;
  constructor(private http: HttpClient) {
    this.http.get('/api').pipe(
      map(r => r['items'].filter(Boolean).sort(...)
    ).subscribe(d => this.data = d);
  }
}

// ✅ SRP — each piece has one responsibility
// Service: fetches + transforms
@Injectable({ providedIn: 'root' })
export class ItemService {
  getItems() {
    return this.http.get<Item[]>('/api').pipe(map(r => r.sort(...)));
  }
}

// Component: only renders + handles user events
@Component({ changeDetection: ChangeDetectionStrategy.OnPush, template: '' })
export class GoodComponent {
  items = toSignal(inject(ItemService).getItems(), { initialValue: [] });
}`,
        ),
      ],
    },

    {
      title: 'Security & A11y',
      examples: [
        ex('sec-xss', 'XSS — Angular auto-escaping & DomSanitizer',
          'Angular escapes interpolation by default. Only bypass when you own the HTML source.',
          `import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({ standalone: true, template: \`
  <!-- ✅ safe: Angular escapes this -->
  <p>{{ userInput }}</p>

  <!-- ❌ dangerous without sanitizing -->
  <div [innerHTML]="userInput"></div>

  <!-- ✅ safe: explicitly sanitized -->
  <div [innerHTML]="safeHtml"></div>
\` })
export class ContentComponent {
  userInput = '<img src=x onerror=alert(1)>';
  safeHtml: SafeHtml;

  constructor(private sanitizer: DomSanitizer) {
    this.safeHtml = sanitizer.sanitize(SecurityContext.HTML, this.userInput);
  }
}`,
          'Never use bypassSecurityTrustHtml() with user-provided content — it disables all sanitization.'
        ),

        ex('a11y-aria', 'ARIA & keyboard navigation',
          'Required for Uklon — drivers use the app under stress. Interactive elements must be keyboard-accessible.',
          `@Component({ standalone: true, template: \`
  <!-- ✅ button, not div, for keyboard support -->
  <button
    type="button"
    [attr.aria-pressed]="isActive()"
    [attr.aria-label]="isActive() ? 'Deactivate' : 'Activate'"
    (click)="toggle()"
  >
    {{ isActive() ? 'Active' : 'Inactive' }}
  </button>

  <!-- ✅ live region for dynamic content (e.g. order status) -->
  <div role="status" aria-live="polite">
    {{ statusMessage() }}
  </div>

  <!-- ✅ form accessibility -->
  <label for="phone">Phone number</label>
  <input id="phone" type="tel" [attr.aria-describedby]="error() ? 'phone-err' : null" />
  @if (error()) {
    <span id="phone-err" role="alert">{{ error() }}</span>
  }
\` })`,
        ),
      ],
    },
  ];

  // ─── Checklist ───────────────────────────────────────────────────────────────

  readonly topicChecklist: CheckItem[] = [
    checkItem('sig', 'Signals — signal(), computed(), effect()'),
    checkItem('inp', 'input() / output() signal-based I/O'),
    checkItem('cd', 'Change Detection — OnPush, zoneless'),
    checkItem('cf', '@for with track, @if, @switch, @defer'),
    checkItem('ml', 'Memory leaks — takeUntilDestroyed, toSignal()'),
    checkItem('rx', 'RxJS — switchMap, combineLatest, shareReplay'),
    checkItem('arch', 'Smart/Dumb components, SRP, service layer'),
    checkItem('test', 'Unit testing — TestBed, mocking services'),
    checkItem('sec', 'XSS — DomSanitizer, Angular escaping'),
    checkItem('a11y', 'A11y — ARIA, keyboard navigation, live regions'),
  ];

  readonly preChecklist: CheckItem[] = [
    checkItem('net', 'Test internet connection, camera and microphone'),
    checkItem('pitch', 'Prepare a 2-min elevator pitch about your experience'),
    checkItem('stack', 'Review recent projects and key technical decisions'),
    checkItem('sb', 'Open StackBlitz and verify it loads correctly'),
    checkItem('notif', 'Turn off notifications, set up screen sharing'),
    checkItem('q', 'Prepare 3–5 questions for the team and management'),
  ];

  readonly topicsProgress = computed(() => {
    const done = this.topicChecklist.filter(i => i.done()).length;
    return { done, total: this.topicChecklist.length, percent: Math.round((done / this.topicChecklist.length) * 100) };
  });

  readonly preProgress = computed(() => {
    const done = this.preChecklist.filter(i => i.done()).length;
    return { done, total: this.preChecklist.length, percent: Math.round((done / this.preChecklist.length) * 100) };
  });

  toggle(item: CheckItem) {
    item.done.set(!item.done());
  }

  toggleExample(example: CodeExample) {
    example.open.set(!example.open());
  }
}
