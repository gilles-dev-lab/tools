function createState(initialState, onChange) {
  return new Proxy(initialState, {
    set(target, key, value) {
      target[key] = value;
      onChange(target);
      return true;
    }
  });
};
const state = createState({ count: 0 }, newState => {
  document.getElementById('f288').innerText = newState.count;
});document.body.addEventListener('click', () => {
  state.count++;
console.log(state)
});

//
let state = { count: 0 };

function setState(updater) {
  const nextState = structuredClone(state);
  updater(nextState);
  state = nextState;
  render();
}setState(s => { s.count += 1; });

export const store = {
  state: { count: 0 },
  listeners: [],
  setState(updater) {
    updater(this.state);
    this.listeners.forEach(l => l(this.state));
  },
  subscribe(listener) {
    this.listeners.push(listener);
  }
};

// État global
const state = {
  count: 0,
  items: []
};

// Fonction de rendu
function render() {
  console.log(`Rendering: Item ${state.count}`);
}

// 
async function* dataStream(limit = Infinity) {
  let count = 0;
  while (count < limit) { 
    await new Promise(r => setTimeout(r, 100)); 
    yield count++;
  }
}

// 
let streamIterator = null; // Sera stocké ici quand on démarre le flux
const TARGET_ITEMS = 30;
let itemsProcessed = 0;

// 
async function startStreaming() {
  if (streamIterator) {
    console.log("Le flux est déjà en cours.");
    return;
  }
  
  console.log("--- Démarrage du flux ---");
  itemsProcessed = 0;
  
  // Crée l'itérateur
  streamIterator = dataStream(TARGET_ITEMS);

  // Lance la boucle de consommation
  await consumeStream();
}

// flux pas à pas
async function consumeStream() {
    while (streamIterator && itemsProcessed < TARGET_ITEMS) {
        try {
            const { value, done } = await streamIterator.next();

            if (done) {
                console.log("Flux terminé (limite atteinte).");
                streamIterator = null; // Réinitialiser
                break;
            }

            state.count = value;
            state.items.push(value);
            render(); 
            
            itemsProcessed++;


        } catch (error) {
            console.error("Erreur dans le stream :", error);
            streamIterator = null;
            break;
        }
    }
    
    if (itemsProcessed >= TARGET_ITEMS) {
        console.log(`Succès : ${TARGET_ITEMS} items traités.`);
        streamIterator = null; // Terminer proprement
    }
}

document.getElementById('show').addEventListener('click', startStreaming);
