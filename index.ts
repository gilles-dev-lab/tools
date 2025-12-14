import { checkAgeEnfant } as Validators from '../validators/age';


/* ------------- */
/*
ui :
- plier/déplier
- carousel
- carte
- widgets
index/directeur :
- quand charger quoi
intersection observer :
- load image circuit si visible
- innerHtml si visible (filtre+tri+paginated)
observer :
- filtred, sorted, paginated
> Method(type X, data) > class dispatcheur + spécificité task

flowchart TD
  %% --- UI ----------------------------------------------------------
  UI[**UI Layer**] --> Fold[« Plier / Déplier »]
  UI --> Car[« Carousel »]
  UI --> Card[« Carte »]
  UI --> Widget[« Widgets »]

  %% --- Découverte et chargement ------------------------------------
  UI --> Dir[**Index / Directeur**]
  Dir -->|« Détermine ce qui doit être chargé »| Loader[« Chargeur »]
  Loader -->|fetch‑prod‑list| Store[« Store / état global »]

  %% --- Observateurs -----------------------------------------------
  Store --> IntObs{IntersectionObserver}
  IntObs -->|visible| ImgLoad[« Charge image »]
  IntObs -->|visible| InnerHtml[« Mettre innerHTML (filtre+tri+page) »]

  %% --- Observateur de l’état (tri, filtre, pagination) ----------
  Store --> Obs{Observateur d’état}
  Obs -->|événement : filtrés, triés, paginés| Disp[« Dispatcher »]
  Disp -->|Method(type,X,data) : tâches spécifiques| Task[« Tâche »]

  %% --- Flow de données --------------------------------------------
  subgraph Backend
    fetchProducts[fetch("/api/products")] -->|JSON| Store
  end


scss : card / contain layout
*/


// eventBus.js
class EventBus {
  private listeners: {}// EventListener{}
  constructor() {
    this.listeners = {}; // { eventName: Set<callback> }
  }

  on(event: Event, callback: FunctionStringCallback) {
    if (!this.listeners[event]) this.listeners[event] = new Set();
    this.listeners[event].add(callback);
  }

  off(event, callback) {
    if (!this.listeners[event]) return;
    this.listeners[event].delete(callback);
    if (this.listeners[event].size === 0) delete this.listeners[event];
  }

  emit(event, payload) {
    if (!this.listeners[event]) return;
    // clones the set to avoid mutation during iteration
    for (const cb of [...this.listeners[event]]) cb(payload);
  }
}

/*
ui :
- plier/déplier
- carousel
- carte
- widgets
index/directeur :
- quand charger quoi
intersection observer :
- load image circuit si visible
- innerHtml si visible (filtre+tri+paginated)
observer :
- filtred, sorted, paginated
> Method(type X, data) > class dispatcheur + spécificité task
 */

// index.ts
//import { UiComponents } from './ui-components';
//import { Observer } from './observer';
//import { AppMediator } from './app-mediator';

export class Index {
  private uiComponents: UiComponents;
  private observer: Observer;
  private mediator: AppMediator;

  constructor() {
    this.uiComponents = new UiComponents();
    this.observer = new Observer();
    this.mediator = new AppMediator(this.uiComponents, this.observer);
  }
}
/* ===== */
interface Mediator {
    notify(sender: object, event: string): void;
}

class AppMediator implements Mediator {
    private uiComponents: UiComponents;
    private observer: Observer;
    private intersectionObserver: IntersectionObserver;

    constructor(uiComponents: UiComponents, observer: Observer) {
        this.uiComponents = uiComponents;
        this.observer = observer;
        this.uiComponents.setMediator(this);
        this.observer.setMediator(this);
        this.intersectionObserver = new IntersectionObserver(this.handleIntersection.bind(this));
    }

    public notify(sender: object, event: string): void {

        const cases = [
            "toggleText"
        ]
        if (event === 'toggleText') {
            console.log('Mediator reacts on A and triggers following operations:');
            this.uiComponents.ToggleText();
        }

        if (event === 'D') {
            console.log('Mediator reacts on D and triggers following operations:');
            this.component1.doB();
            this.observer.doC();
        }
    }
}

class BaseComponent {
    protected mediator: Mediator;

    constructor(mediator?: Mediator) {
        this.mediator = mediator!;
    }

    public setMediator(mediator: Mediator): void {
        this.mediator = mediator;
    }
}

class UiComponents extends BaseComponent {
    public ToggleText(): void {
        console.log('Component 1 does A.');
        this.mediator.notify(this, 'toggleText');
    }

    public Carousel(): void {
        console.log('Component 1 does B.');
        this.mediator.notify(this, 'B');
    }
    public async CarteComponent(): Promise<void> {
        const cartesManager = await import('../ui/CartesUi');
        new cartesManager();
    }
}

class Observer extends BaseComponent {
    public doC(): void {
        console.log('Component 2 does C.');
        this.mediator.notify(this, 'C');
    }

    public doD(): void {
        console.log('Component 2 does D.');
        this.mediator.notify(this, 'D');
    }
}
/* ------------- */

function processChildData(age: number) {
    Validators.checkAgeEnfant(age); 
    console.log(`Traitement pour un enfant de ${age} ans.`);
}

function canDisplayDiscount(age: number): boolean {
    if (Validators.isAgeEnfant(age)) {
        return true;
    }
    return false;
}

// Intl format
const items1 = ["Pencils", "Pens"];
const items2 = ["Apples", "Bananas", "Oranges"];

// Type: Disjunction (The 'or' behavior)
const disjunctionFormatter = new Intl.ListFormat("fr", { type: "disjunction" });

console.log(disjunctionFormatter.format(items1));
// Output: "Pencils ou Pens"

const formatterFr = new Intl.ListFormat("fr");
console.log(formatterFr.format(items2));
// Output: "Apples, Bananas et Oranges"


// Symbol testing
const price = {
  amount: 99.99,
  currency: "USD",
  [Symbol.toPrimitive](hint: string) {
    if (hint === "string") return `${this.currency} ${this.amount}`;
    if (hint === "number") return this.amount;
    return null;
  },
};

console.log(String(price));
console.log(Number(price));
console.log(Number(price) + 10);

const customReplacer = {
  [Symbol.replace](string: string, replacement: string) {
    return string.replace("apple", replacement); 
  }
};

console.log("I like apple too much".replace(customReplacer, "banana")); 
