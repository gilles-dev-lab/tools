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

async function* dataStream() {
  let count = 0;
  while (true) {
    yield count++;
    await new Promise(r => setTimeout(r, 1000));
  }
}

(async () => {
  for await (const value of dataStream()) {
    state.count = value;
    render();
  }
})();
